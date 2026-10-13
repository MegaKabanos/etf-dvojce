const NBSP = ' ';

/** Czech thousands separator is a regular NBSP; Intl may emit U+202F, so normalise it. */
function normaliseSpaces(s: string): string {
	return s.replace(/[  ]/g, NBSP);
}

const integerFormatter = new Intl.NumberFormat('cs-CZ', { maximumFractionDigits: 0 });

/** 1830700 -> "1 830 700 Kč" (NBSP as thousands separator and before Kč). */
export function formatCzk(amount: number): string {
	return `${normaliseSpaces(integerFormatter.format(Math.round(amount)))}${NBSP}Kč`;
}

/** 0.07 -> "0,07 %" (value is already in percent units). */
export function formatPct(value: number, fractionDigits = 2): string {
	const formatter = new Intl.NumberFormat('cs-CZ', {
		minimumFractionDigits: fractionDigits,
		maximumFractionDigits: fractionDigits,
	});
	return `${normaliseSpaces(formatter.format(value))}${NBSP}%`;
}

/** "2026-10-13" -> "13. 10. 2026". Pure string work, no timezone involved. */
export function formatDateCz(iso: string): string {
	const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(iso);
	if (!match) throw new Error(`formatDateCz: expected YYYY-MM-DD, got "${iso}"`);
	const [, y, m, d] = match;
	return `${Number(d)}. ${Number(m)}. ${y}`;
}
