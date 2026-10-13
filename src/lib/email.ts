import { feeImpact } from './calc';
import { formatCzk } from './format';
import { getTwin } from './twins';

export interface LeadEmailInput {
	/** US ticker chosen by the visitor, or null when they came from the calculator only. */
	fund: string | null;
	monthly: number;
	years: number;
	planUrl: string;
	unsubscribeUrl: string;
}

export interface LeadEmail {
	subject: string;
	html: string;
	text: string;
}

const escapeHtml = (s: string) =>
	s.replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]!);

/** E-mail č. 1 from docs/copy.md section 10. */
export function buildLeadEmail({ fund, monthly, years, planUrl, unsubscribeUrl }: LeadEmailInput): LeadEmail {
	const twin = fund ? getTwin(fund) : null;
	const fees = feeImpact({ monthly, years });
	const feesEtf = formatCzk(fees.lostEtf);
	const monthlyTxt = formatCzk(monthly);

	const subject = twin
		? `Váš ETF plán: ${twin.us.ticker} → ${twin.primary.tickers.xetra}`
		: 'Váš ETF plán z Dvojčete';
	const preheader = 'Kde ho koupit nejlevněji a kolik ušetříte na poplatcích.';

	const summaryText = twin
		? `Ve zkratce: místo ${twin.us.ticker} můžete koupit ${twin.primary.name} (${twin.primary.tickers.xetra}). Při ${monthlyTxt} měsíčně po dobu ${years} let vás poplatky vyjdou zhruba na ${feesEtf}.`
		: `Ve zkratce: při ${monthlyTxt} měsíčně po dobu ${years} let vás poplatky ETF vyjdou zhruba na ${feesEtf}.`;

	const text = [
		'Dobrý den,',
		'tady je plán, který jste si vyžádali na Dvojčeti.',
		'',
		`Otevřít můj plán: ${planUrl}`,
		'',
		summaryText,
		'',
		'Máte dotaz k plánu? Stačí odpovědět na tento e-mail.',
		'',
		'— Dvojče',
		'',
		'Není to investiční doporučení. Odhlásit se můžete zde:',
		unsubscribeUrl,
	].join('\n');

	const html = `<!doctype html>
<html lang="cs">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${escapeHtml(subject)}</title>
</head>
<body style="margin:0;padding:0;background:#FFFFFF;">
<div style="display:none;max-height:0;overflow:hidden;opacity:0;color:transparent;">${escapeHtml(preheader)}</div>
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#FFFFFF;padding:24px 12px;">
<tr><td align="center">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:560px;background:#FFFFFF;border:1px solid #111111;border-radius:0;font-family:Arial,Helvetica,sans-serif;color:#111111;font-size:16px;line-height:1.5;">
<tr><td style="background:#C8102E;padding:14px 28px;color:#FFFFFF;font-family:Arial,Helvetica,sans-serif;font-size:24px;font-weight:bold;line-height:1;">Dvojče</td></tr>
<tr><td style="padding:28px;">
<p style="margin:0 0 16px;">Dobrý den,</p>
<p style="margin:0 0 24px;">tady je plán, který jste si vyžádali na Dvojčeti.</p>
<p style="margin:0 0 28px;"><a href="${escapeHtml(planUrl)}" style="display:inline-block;background:#C8102E;color:#FFFFFF;text-decoration:none;padding:14px 22px;border-radius:0;font-weight:bold;">Otevřít můj plán →</a></p>
<p style="margin:0 0 24px;">${escapeHtml(summaryText)}</p>
<p style="margin:0 0 24px;">Máte dotaz k plánu? Stačí odpovědět na tento e-mail.</p>
<p style="margin:0 0 32px;">— Dvojče</p>
<p style="margin:0;font-size:13px;color:#4A4A4A;border-top:1px solid #111111;padding-top:16px;">Není to investiční doporučení. Odhlásit se můžete <a href="${escapeHtml(unsubscribeUrl)}" style="color:#111111;">zde</a>.</p>
</td></tr>
</table>
</td></tr>
</table>
</body>
</html>`;

	return { subject, html, text };
}
