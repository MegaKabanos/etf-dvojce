import etfs from '../data/etfs.json' with { type: 'json' };

export type MatchQuality = 'same' | 'similar' | 'approximate';

export interface UsFund {
	ticker: string;
	name: string;
	issuer: string;
	primary_exchange: { value: string; source: string; as_of: string };
	expense_ratio_pct: { value: number; source: string; as_of: string };
	index: { value: string; source: string; as_of: string };
	aum_usd_bn: { value: number; approx?: boolean; display?: string; source: string; as_of: string };
	twin: {
		primary_isin: string;
		alt_isin: string | null;
		match: MatchQuality;
		note_cs: string;
	};
}

export interface UcitsFund {
	isin: string;
	name: string;
	issuer: string;
	domicile: string;
	distribution: 'Acc' | 'Dist';
	index: { value: string; source: string; as_of: string };
	ter_pct: { value: number; source: string; as_of: string };
	fund_size_eur_bn: { value: number; source: string; as_of: string };
	tickers: { xetra: string; lse: string };
	source: string;
	as_of: string;
}

export interface TwinResult {
	us: UsFund;
	primary: UcitsFund;
	alt: UcitsFund | null;
	match: MatchQuality;
	note_cs: string;
}

const usFunds: UsFund[] = etfs.us as UsFund[];
const ucitsFunds: UcitsFund[] = etfs.ucits as UcitsFund[];

function ucitsByIsin(isin: string): UcitsFund {
	const found = ucitsFunds.find((f) => f.isin === isin);
	if (!found) throw new Error(`etfs.json: missing UCITS fund ${isin}`);
	return found;
}

export function listUsTickers(): string[] {
	return usFunds.map((f) => f.ticker);
}

/** Returns the US fund joined with its European twin(s), or null for an unknown ticker. */
export function getTwin(usTicker: string): TwinResult | null {
	const us = usFunds.find((f) => f.ticker === usTicker.toUpperCase());
	if (!us) return null;
	return {
		us,
		primary: ucitsByIsin(us.twin.primary_isin),
		alt: us.twin.alt_isin ? ucitsByIsin(us.twin.alt_isin) : null,
		match: us.twin.match,
		note_cs: us.twin.note_cs,
	};
}
