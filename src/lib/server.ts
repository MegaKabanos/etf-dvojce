/**
 * Server-only helpers for the lead endpoints: Supabase REST and Brevo transactional mail.
 * No SDK dependencies; everything goes through fetch.
 */

export interface LeadRow {
	email: string;
	fund: string | null;
	monthly: number;
	years: number;
	variant: string | null;
	utm_source: string | null;
	utm_medium: string | null;
	utm_campaign: string | null;
	utm_content: string | null;
	user_agent: string | null;
}

export function supabaseConfig(): { url: string; key: string } | null {
	const url = import.meta.env.SUPABASE_URL;
	const key = import.meta.env.SUPABASE_SERVICE_ROLE_KEY;
	if (!url || !key) return null;
	return { url: url.replace(/\/$/, ''), key };
}

/** New secret keys (sb_secret_...) are not JWTs, so Bearer auth is sent only for legacy eyJ... keys. */
function supabaseHeaders(key: string, extra: Record<string, string> = {}): Record<string, string> {
	return {
		apikey: key,
		...(key.startsWith('eyJ') ? { Authorization: `Bearer ${key}` } : {}),
		...extra,
	};
}

/** Inserts one lead. Throws on a non-2xx response. */
export async function insertLead(row: LeadRow): Promise<void> {
	const cfg = supabaseConfig();
	if (!cfg) throw new Error('supabase: not configured');
	const res = await fetch(`${cfg.url}/rest/v1/leads`, {
		method: 'POST',
		headers: supabaseHeaders(cfg.key, {
			'Content-Type': 'application/json',
			Prefer: 'return=minimal',
		}),
		body: JSON.stringify(row),
	});
	if (!res.ok) throw new Error(`supabase insert failed: HTTP ${res.status}`);
}

/** Deletes every lead row for the given (already normalised) e-mail address. */
export async function deleteLeadsByEmail(email: string): Promise<void> {
	const cfg = supabaseConfig();
	if (!cfg) throw new Error('supabase: not configured');
	const res = await fetch(`${cfg.url}/rest/v1/leads?email=eq.${encodeURIComponent(email)}`, {
		method: 'DELETE',
		headers: supabaseHeaders(cfg.key, { Prefer: 'return=minimal' }),
	});
	if (!res.ok) throw new Error(`supabase delete failed: HTTP ${res.status}`);
}

export interface OutgoingEmail {
	to: string;
	subject: string;
	html: string;
	text: string;
}

/** Sends one transactional e-mail via Brevo. Returns false when Brevo is not configured or rejects it. */
export async function sendEmail(mail: OutgoingEmail): Promise<boolean> {
	const apiKey = import.meta.env.BREVO_API_KEY;
	const senderEmail = import.meta.env.BREVO_SENDER_EMAIL;
	const senderName = import.meta.env.BREVO_SENDER_NAME || 'Dvojče';
	if (!apiKey || !senderEmail) {
		console.warn('[mail] BREVO_API_KEY / BREVO_SENDER_EMAIL not set, e-mail skipped');
		return false;
	}
	const res = await fetch('https://api.brevo.com/v3/smtp/email', {
		method: 'POST',
		headers: {
			'api-key': apiKey,
			'Content-Type': 'application/json',
			accept: 'application/json',
		},
		body: JSON.stringify({
			sender: { name: senderName, email: senderEmail },
			to: [{ email: mail.to }],
			subject: mail.subject,
			htmlContent: mail.html,
			textContent: mail.text,
		}),
	});
	if (!res.ok) {
		console.error(`[mail] Brevo rejected the message: HTTP ${res.status}`);
		return false;
	}
	return true;
}

export function siteUrl(): string {
	return (import.meta.env.PUBLIC_SITE_URL || 'https://etf-dvojce.vercel.app').replace(/\/$/, '');
}
