import { useRef, useState } from 'preact/hooks';
import { feeImpact } from '../lib/calc';
import { formatCzk, formatPct } from '../lib/format';
import { track } from '../lib/track';
import { setState } from '../lib/store';
import { useStore } from '../lib/use-store';
import { LeadForm } from './LeadForm';
import { Notes } from './Notes';
import { Src } from './Src';
import {
	AS_OF_CZ,
	BANK_FUND_NAME,
	Footnotes,
	KID_DATE_CZ,
	KID_SOURCE,
	MONTHLY_RANGE,
	XTB_SOURCE,
	YEARS_RANGE,
} from '../lib/view';
import costs from '../data/costs.json' with { type: 'json' };

const yearsLabel = (n: number) => (n === 1 ? '1 rok' : n >= 2 && n <= 4 ? `${n} roky` : `${n} let`);

/** Fee calculator: two sliders, a three-row bulletin result, the assumption line, and an inline lead CTA. */
export default function FeeCalculator() {
	const monthly = useStore((s) => s.monthly);
	const years = useStore((s) => s.years);
	const [formOpen, setFormOpen] = useState(false);
	const touched = useRef(false);

	const r = feeImpact({ monthly, years });

	const fn = new Footnotes();
	const kidN = fn.ref({ url: KID_SOURCE, label: `KID ${BANK_FUND_NAME}, ${KID_DATE_CZ}` });
	const xtbN = fn.ref({ url: XTB_SOURCE, label: `XTB, ${AS_OF_CZ}` });

	const bankEntry = formatPct(costs.bank_fund.entry_max_pct, 0);
	const bankOngoing = formatPct(costs.bank_fund.ongoing_pct + costs.bank_fund.transaction_pct, 2);
	const etfTer = formatPct(costs.calc_assumptions.etf_ter_pct, 2);
	const etfFx = formatPct(costs.calc_assumptions.etf_fx_pct, 2);
	const grossReturn = formatPct(costs.calc_assumptions.gross_return_pct, 0);

	function change(patch: { monthly?: number; years?: number }) {
		if (!touched.current) {
			touched.current = true;
			track('calculator_used', { monthly: patch.monthly ?? monthly, years: patch.years ?? years });
		}
		setState(patch);
	}

	return (
		<div class="calc">
			<div class="calc-slider">
				<label class="calc-label" for="calc-monthly">
					<span>Měsíčně investuji</span>
					<output for="calc-monthly" class="mono">
						{formatCzk(monthly)}
					</output>
				</label>
				<input
					id="calc-monthly"
					type="range"
					min={MONTHLY_RANGE.min}
					max={MONTHLY_RANGE.max}
					step={MONTHLY_RANGE.step}
					value={monthly}
					onInput={(e) => change({ monthly: Number(e.currentTarget.value) })}
				/>
			</div>

			<div class="calc-slider">
				<label class="calc-label" for="calc-years">
					<span>Po dobu</span>
					<output for="calc-years" class="mono">
						{yearsLabel(years)}
					</output>
				</label>
				<input
					id="calc-years"
					type="range"
					min={YEARS_RANGE.min}
					max={YEARS_RANGE.max}
					step={YEARS_RANGE.step}
					value={years}
					onInput={(e) => change({ years: Number(e.currentTarget.value) })}
				/>
			</div>

			<div class="calc-result" aria-live="polite">
				<table class="bulletin">
					<tbody>
						<tr>
							<th scope="row">
								Bankovní fond ({BANK_FUND_NAME})
								<span class="sub">
									{bankOngoing} ročně, {bankEntry} vstupní poplatek
								</span>
							</th>
							<td class="mono r">{formatCzk(r.lostBank)}</td>
						</tr>
						<tr>
							<th scope="row">
								ETF dvojče
								<span class="sub">
									{etfTer} ročně + {etfFx} za převod měny
								</span>
							</th>
							<td class="mono r">{formatCzk(r.lostEtf)}</td>
						</tr>
					</tbody>
				</table>
				<div class="calc-diff">
					<p class="calc-diff-label">Rozdíl — tolik vám zůstane navíc</p>
					<p class="calc-diff-value mono">{formatCzk(r.difference)}</p>
				</div>
			</div>

			<p class="assumption">
				Výpočet předpokládá zhodnocení {grossReturn} ročně před poplatky. Je to předpoklad, ne slib — minulé výnosy
				nezaručují budoucí. Poplatky bankovního fondu podle KID fondu {BANK_FUND_NAME} ({KID_DATE_CZ})
				<Src n={kidN} url={KID_SOURCE} label={`KID ${BANK_FUND_NAME}, ${KID_DATE_CZ}`} />. Poplatky ETF podle XTB
				<Src n={xtbN} url={XTB_SOURCE} label={`XTB, ${AS_OF_CZ}`} />.
			</p>
			<Notes items={fn.list()} />

			<div class="calc-cta">
				{!formOpen ? (
					<button
						type="button"
						class="btn-outline"
						onClick={() => {
							track('cta_clicked', { location: 'calculator' });
							setFormOpen(true);
						}}
					>
						Chci rozpis po letech + nejlevnějšího brokera →
					</button>
				) : null}
				{formOpen && <LeadForm location="calculator" />}
			</div>
		</div>
	);
}
