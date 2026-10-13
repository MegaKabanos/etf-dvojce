import etfs from '../data/etfs.json' with { type: 'json' };
import costs from '../data/costs.json' with { type: 'json' };
import { formatDateCz, formatDecimal } from './format';
import { getTwin, listUsTickers, type MatchQuality, type TwinResult } from './twins';

/** Presentation helpers: Czech labels and display formats on top of the tested data layer. */

export const AS_OF_CZ = formatDateCz(etfs.as_of);
export const FUND_TICKERS: string[] = listUsTickers();

export const CALC_DEFAULTS = { monthly: 5000, years: 20 } as const;
export const MONTHLY_RANGE = { min: 500, max: 30000, step: 500 } as const;
export const YEARS_RANGE = { min: 1, max: 40, step: 1 } as const;

export function isFundTicker(value: string | null | undefined): value is string {
	return typeof value === 'string' && FUND_TICKERS.includes(value.toUpperCase());
}

/** Parses an integer query value and clamps it; falls back when missing or not a number. */
export function clampInt(raw: string | null | undefined, min: number, max: number, fallback: number): number {
	if (raw === null || raw === undefined || raw.trim() === '') return fallback;
	const n = Number(raw.replace(/\s/g, ''));
	if (!Number.isFinite(n)) return fallback;
	return Math.min(max, Math.max(min, Math.round(n)));
}

/** 0.0945 -> "0,0945" (no unit). Two to four decimals so small TERs are not rounded away. */
export function formatTer(pct: number): string {
	return formatDecimal(pct, 2, 4);
}

export function matchLabel(match: MatchQuality): string {
	switch (match) {
		case 'same':
			return 'stejný index';
		case 'similar':
			return 'podobný index';
		case 'approximate':
			return 'přibližná náhrada';
	}
}

export function shortMatchLabel(match: MatchQuality): string {
	switch (match) {
		case 'same':
			return 'stejný';
		case 'similar':
			return 'podobný';
		case 'approximate':
			return 'přibližný';
	}
}

export function distributionLabel(distribution: 'Acc' | 'Dist'): string {
	return distribution === 'Acc' ? 'Akumuluje' : 'Vyplácí';
}

/** 141.2 -> "141,2 mld. EUR". */
export function sizeLabel(bnEur: number): string {
	return `${formatDecimal(bnEur, 1, 1)} mld. EUR`;
}

export interface FundRow {
	ticker: string;
	exchange: string;
	terPct: number;
	twin: TwinResult;
}

/** One row per NYSE fund, in the order of etfs.json. */
export function fundRows(): FundRow[] {
	return FUND_TICKERS.map((ticker) => {
		const twin = getTwin(ticker);
		if (!twin) throw new Error(`view: no twin for ${ticker}`);
		return {
			ticker,
			exchange: twin.us.primary_exchange.value,
			terPct: twin.us.expense_ratio_pct.value,
			twin,
		};
	});
}

export const KID_SOURCE = costs.bank_fund.source;
export const KID_DATE_CZ = formatDateCz(costs.bank_fund.kid_date);
export const BANK_FUND_NAME = costs.bank_fund.name;
export const XTB_SOURCE = costs.brokers.xtb.source;
export const PRIIPS_SOURCES: string[] = costs.priips.sources;
export const TAX_TIME_TEST = costs.tax.time_test;
export const TAX_LIMIT_100K = costs.tax.limit_100k;

/**
 * Footnote numbering. Each table or panel owns one instance and asks it for the number of a source;
 * the same URL always gets the same number, numbers follow first appearance.
 */
export interface SourceRef {
	url: string;
	label: string;
}

export class Footnotes {
	private readonly numbers = new Map<string, number>();
	private readonly refs: Array<SourceRef & { n: number }> = [];

	ref(source: SourceRef): number {
		const known = this.numbers.get(source.url);
		if (known !== undefined) return known;
		const n = this.refs.length + 1;
		this.numbers.set(source.url, n);
		this.refs.push({ ...source, n });
		return n;
	}

	list(): Array<SourceRef & { n: number }> {
		return this.refs;
	}
}

/** "iShares Core S&P 500 UCITS ETF USD (Acc)" -> "iShares Core S&P 500 UCITS". */
export function shortUcitsName(name: string): string {
	return name.replace(/\s+ETF\b.*$/, '');
}

/** "https://www.justetf.com/en/..." -> "justetf.com". */
export function hostOf(url: string): string {
	return new URL(url).hostname.replace(/^www\./, '');
}

/** Peek line under the rate table: the first row's twin, built from data. */
export function peekLine(ticker: string): string | null {
	const row = fundRows().find((r) => r.ticker === ticker);
	if (!row) return null;
	const { primary } = row.twin;
	return `${row.ticker} → ${primary.tickers.xetra} · ${shortUcitsName(primary.name)} ·\u00A0TER\u00A0${formatTer(primary.ter_pct.value)}\u00A0%`;
}
