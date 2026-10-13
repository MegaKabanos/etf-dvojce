import type { APIRoute } from 'astro';
import { deleteLeadsByEmail, supabaseConfig } from '../../lib/server';
import { verifyUnsubscribeToken } from '../../lib/unsubscribe';

export const prerender = false;

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const escapeHtml = (s: string) =>
	s.replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]!);

function page(status: number, title: string, message: string): Response {
	const html = `<!doctype html>
<html lang="cs">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<meta name="robots" content="noindex">
<title>${escapeHtml(title)} · Dvojče</title>
<style>
body{margin:0;background:#f4f4f1;color:#1d1d1b;font-family:system-ui,-apple-system,Arial,sans-serif;line-height:1.5}
main{max-width:520px;margin:0 auto;padding:64px 16px}
h1{font-size:28px;margin:0 0 16px}
p{margin:0 0 16px}
a{color:#1d1d1b}
</style>
</head>
<body>
<main>
<h1>${escapeHtml(title)}</h1>
<p>${escapeHtml(message)}</p>
<p><a href="/">Zpět na Dvojče</a></p>
</main>
</body>
</html>`;
	return new Response(html, {
		status,
		headers: { 'Content-Type': 'text/html; charset=utf-8', 'Cache-Control': 'no-store' },
	});
}

export const GET: APIRoute = async ({ url }) => {
	const email = (url.searchParams.get('e') ?? '').trim().toLowerCase();
	const token = url.searchParams.get('t') ?? '';
	const secret = import.meta.env.UNSUBSCRIBE_SECRET;

	if (!secret) {
		console.error('[unsubscribe] UNSUBSCRIBE_SECRET not set, refusing to process');
		return page(500, 'Odhlášení se nepovedlo', 'Zkuste to prosím později nebo nám napište na e-mail z plánu.');
	}

	if (!email || email.length > 254 || !EMAIL_RE.test(email) || !token) {
		return page(400, 'Odkaz není platný', 'Zkopírujte odkaz z e-mailu celý a zkuste to znovu.');
	}

	const valid = await verifyUnsubscribeToken(email, token, secret);
	if (!valid) {
		return page(400, 'Odkaz není platný', 'Tento odkaz se nepodařilo ověřit. Použijte prosím odkaz z posledního e-mailu.');
	}

	if (!supabaseConfig()) {
		console.warn('[unsubscribe] Supabase not configured, nothing deleted');
	} else {
		try {
			await deleteLeadsByEmail(email);
		} catch (err) {
			console.error('[unsubscribe] delete failed', err instanceof Error ? err.message : err);
			return page(500, 'Odhlášení se nepovedlo', 'Zkuste to prosím znovu za chvíli.');
		}
	}

	return page(200, 'Odhlášeno', 'Vaše e-mailová adresa je odstraněna z naší databáze. Další e-maily od nás nedostanete.');
};
