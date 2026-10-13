import type { APIRoute } from 'astro';
import { buildLeadEmail } from '../../lib/email';
import { listUsTickers } from '../../lib/twins';
import { makeUnsubscribeToken } from '../../lib/unsubscribe';
import { insertLead, sendEmail, siteUrl, supabaseConfig } from '../../lib/server';

export const prerender = false;

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const MAX_EMAIL = 254;
const MSG_INVALID = 'Zkontrolujte prosím e-mail.';

const json = (body: unknown, status = 200) =>
	new Response(JSON.stringify(body), {
		status,
		headers: { 'Content-Type': 'application/json; charset=utf-8', 'Cache-Control': 'no-store' },
	});

const str = (v: unknown, max = 200): string | null => {
	if (typeof v !== 'string') return null;
	const t = v.trim();
	return t ? t.slice(0, max) : null;
};

const num = (v: unknown, fallback: number, min: number, max: number): number => {
	const n = typeof v === 'number' ? v : typeof v === 'string' ? Number(v.replace(/\s/g, '')) : NaN;
	if (!Number.isFinite(n)) return fallback;
	return Math.min(max, Math.max(min, Math.round(n)));
};

export const POST: APIRoute = async ({ request }) => {
	let body: Record<string, unknown>;
	try {
		const parsed: unknown = await request.json();
		if (!parsed || typeof parsed !== 'object' || Array.isArray(parsed)) throw new Error('not an object');
		body = parsed as Record<string, unknown>;
	} catch {
		return json({ ok: false, error: MSG_INVALID }, 400);
	}

	// Honeypot: bots fill the hidden "website" field. Pretend success, store nothing.
	if (typeof body.website === 'string' && body.website.trim() !== '') {
		return json({ ok: true });
	}

	const email = typeof body.email === 'string' ? body.email.trim().toLowerCase() : '';
	if (!email || email.length > MAX_EMAIL || !EMAIL_RE.test(email)) {
		return json({ ok: false, error: MSG_INVALID }, 400);
	}

	let fund: string | null = null;
	if (body.fund !== undefined && body.fund !== null && body.fund !== '') {
		const candidate = typeof body.fund === 'string' ? body.fund.trim().toUpperCase() : '';
		if (!listUsTickers().includes(candidate)) {
			return json({ ok: false, error: MSG_INVALID }, 400);
		}
		fund = candidate;
	}

	const monthly = num(body.monthly, 5000, 500, 30000);
	const years = num(body.years, 20, 1, 40);

	const utmIn = (body.utm && typeof body.utm === 'object' ? body.utm : {}) as Record<string, unknown>;
	const variant = str(body.variant, 20);
	const utm = {
		utm_source: str(utmIn.source),
		utm_medium: str(utmIn.medium),
		utm_campaign: str(utmIn.campaign),
		utm_content: str(utmIn.content),
	};

	const site = siteUrl();
	const params = new URLSearchParams();
	if (fund) params.set('f', fund);
	params.set('m', String(monthly));
	params.set('y', String(years));
	const planUrl = `${site}/plan?${params.toString()}`;

	const secret = import.meta.env.UNSUBSCRIBE_SECRET;
	let unsubscribeUrl = `${site}/api/unsubscribe`;
	if (secret) {
		const t = await makeUnsubscribeToken(email, secret);
		unsubscribeUrl = `${site}/api/unsubscribe?e=${encodeURIComponent(email)}&t=${t}`;
	}

	let stored = false;
	let emailed = false;

	if (!supabaseConfig()) {
		console.warn('[lead] SUPABASE_URL / SUPABASE_SERVICE_ROLE_KEY not set, lead not stored');
	} else {
		try {
			await insertLead({
				email,
				fund,
				monthly,
				years,
				variant,
				...utm,
				user_agent: str(request.headers.get('user-agent'), 300),
			});
			stored = true;
		} catch (err) {
			console.error('[lead] insert failed', err instanceof Error ? err.message : err);
			return json({ ok: false, error: 'Něco se pokazilo. Zkuste to prosím znovu.' }, 500);
		}
	}

	try {
		const mail = buildLeadEmail({ fund, monthly, years, planUrl, unsubscribeUrl });
		emailed = await sendEmail({ to: email, ...mail });
	} catch (err) {
		console.error('[lead] e-mail failed', err instanceof Error ? err.message : err);
	}

	return json({ ok: true, planUrl, stored, emailed });
};
