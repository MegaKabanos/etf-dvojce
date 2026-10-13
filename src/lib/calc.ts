import costs from '../data/costs.json' with { type: 'json' };

/**
 * All rates are decimal fractions (0.07 = 7 %), never percentages.
 */
export interface SimulateInput {
	/** Monthly contribution in CZK. */
	monthly: number;
	/** Horizon in whole years (12 months each). */
	years: number;
	/** Gross annual return before costs, e.g. 0.07. */
	grossReturn: number;
	/** One-off entry fee taken from each contribution, e.g. 0.05. */
	entryPct: number;
	/** Annual ongoing cost (TER + transaction costs), e.g. 0.0234. */
	annualCostPct: number;
	/** FX conversion fee taken from each contribution, e.g. 0.005. */
	fxPct: number;
}

export interface SimulateResult {
	/** Portfolio value at the end of the horizon, CZK (unrounded). */
	final: number;
	/** Portfolio value at the end of each year, CZK (unrounded). Length = years. */
	yearly: number[];
}

export function simulate({
	monthly,
	years,
	grossReturn,
	entryPct,
	annualCostPct,
	fxPct,
}: SimulateInput): SimulateResult {
	const rm = (1 + grossReturn) ** (1 / 12) - 1;
	const cm = (1 - annualCostPct) ** (1 / 12);
	const contribution = monthly * (1 - entryPct) * (1 - fxPct);
	const yearly: number[] = [];
	let v = 0;
	for (let m = 1; m <= years * 12; m++) {
		v += contribution;
		v = v * (1 + rm) * cm;
		if (m % 12 === 0) yearly.push(v);
	}
	return { final: v, yearly };
}

export interface FeeImpact {
	/** Value with zero costs, CZK. */
	noFees: number;
	/** Value after bank fund costs, CZK. */
	bank: number;
	/** Value after ETF twin costs, CZK. */
	etf: number;
	/** Money lost to bank fund costs versus zero costs, CZK. */
	lostBank: number;
	/** Money lost to ETF costs versus zero costs, CZK. */
	lostEtf: number;
	/** ETF minus bank fund, CZK (what stays with the investor). */
	difference: number;
	/** Total contributions, CZK. */
	invested: number;
}

const pctToDecimal = (pct: number) => pct / 100;

/** The three scenarios shared by feeImpact and feeSeries (same parameters, no behaviour change). */
function scenarios({ monthly, years }: { monthly: number; years: number }) {
	const grossReturn = pctToDecimal(costs.calc_assumptions.gross_return_pct);
	const base = { monthly, years, grossReturn };
	return {
		noFees: { ...base, entryPct: 0, annualCostPct: 0, fxPct: 0 },
		bank: {
			...base,
			entryPct: pctToDecimal(costs.bank_fund.entry_max_pct),
			annualCostPct: pctToDecimal(costs.bank_fund.ongoing_pct + costs.bank_fund.transaction_pct),
			fxPct: 0,
		},
		etf: {
			...base,
			entryPct: 0,
			annualCostPct: pctToDecimal(costs.calc_assumptions.etf_ter_pct),
			fxPct: pctToDecimal(costs.calc_assumptions.etf_fx_pct),
		},
	};
}

export function feeImpact({ monthly, years }: { monthly: number; years: number }): FeeImpact {
	const s = scenarios({ monthly, years });
	const noFeesRaw = simulate(s.noFees).final;
	const bankRaw = simulate(s.bank).final;
	const etfRaw = simulate(s.etf).final;

	const noFees = Math.round(noFeesRaw);
	const bank = Math.round(bankRaw);
	const etf = Math.round(etfRaw);
	return {
		noFees,
		bank,
		etf,
		lostBank: noFees - bank,
		lostEtf: noFees - etf,
		difference: etf - bank,
		invested: Math.round(monthly * 12 * years),
	};
}

export interface FeeYear {
	/** 1-based year index. */
	year: number;
	/** Money lost to bank fund costs up to this year, CZK (same rounding as feeImpact). */
	lostBank: number;
	/** Money lost to ETF costs up to this year, CZK (same rounding as feeImpact). */
	lostEtf: number;
}

/** Year-by-year fee losses, consistent with feeImpact (the last entry equals its lostBank / lostEtf). */
export function feeSeries({ monthly, years }: { monthly: number; years: number }): FeeYear[] {
	const s = scenarios({ monthly, years });
	const noFees = simulate(s.noFees).yearly;
	const bank = simulate(s.bank).yearly;
	const etf = simulate(s.etf).yearly;
	return noFees.map((n, i) => {
		const noFeesY = Math.round(n);
		return {
			year: i + 1,
			lostBank: noFeesY - Math.round(bank[i]),
			lostEtf: noFeesY - Math.round(etf[i]),
		};
	});
}
