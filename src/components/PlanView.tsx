import { feeImpact, feeSeries } from '../lib/calc';
import { formatCzk, formatDateCz, formatPct } from '../lib/format';
import { getTwin } from '../lib/twins';
import {
	AS_OF_CZ,
	BANK_FUND_NAME,
	distributionLabel,
	Footnotes,
	formatTer,
	isFundTicker,
	KID_DATE_CZ,
	KID_SOURCE,
	matchLabel,
	sizeLabel,
	TAX_LIMIT_100K,
	TAX_TIME_TEST,
	XTB_SOURCE,
} from '../lib/view';
import costs from '../data/costs.json' with { type: 'json' };
import { Icon } from './Icon';
import { Notes } from './Notes';
import { Src } from './Src';

export interface PlanViewProps {
	fund: string | null;
	monthly: number;
	years: number;
}

const BROKERS = Object.values(costs.brokers) as Array<{
	name: string;
	commission: string | null;
	fx_pct: number | null;
	source: string;
	as_of?: string;
}>;

/**
 * The stateless plan: rendered from (fund, monthly, years) only. Used inline after a lead submit and on /plan.
 * The "Uložit jako PDF" button calls window.print(); the print stylesheet strips the chrome.
 */
export function PlanView({ fund, monthly, years }: PlanViewProps) {
	const twin = isFundTicker(fund) ? getTwin(fund) : null;
	const fees = feeImpact({ monthly, years });
	const series = feeSeries({ monthly, years });
	const milestones = series.filter((y) => y.year % 5 === 0 || y.year === years);
	const xetra = twin?.primary.tickers.xetra ?? 'dvojče';

	const fn = new Footnotes();
	const kidN = fn.ref({ url: KID_SOURCE, label: `KID ${BANK_FUND_NAME}, ${KID_DATE_CZ}` });
	const xtbN = fn.ref({ url: XTB_SOURCE, label: `XTB, ${AS_OF_CZ}` });
	const twinN = twin
		? fn.ref({ url: twin.primary.source, label: `justETF, ${formatDateCz(twin.primary.as_of)}` })
		: null;
	const taxN = fn.ref({ url: TAX_TIME_TEST.source, label: 'zakonyprolidi.cz, § 4 ZDP' });

	return (
		<article class="plan" aria-label="Váš ETF plán">
			<section class="plan-part">
				<h2>Vaše dvojče</h2>
				{twin ? (
					<>
						<p class="plan-tickers mono">
							{twin.us.ticker} → {twin.primary.tickers.xetra} (Xetra) · {twin.primary.tickers.lse} (Londýn)
						</p>
						<table class="kv">
							<tbody>
								<tr>
									<th scope="row">Dvojče</th>
									<td>{twin.primary.name}</td>
								</tr>
								<tr>
									<th scope="row">Index</th>
									<td>
										{twin.primary.index.value} — {matchLabel(twin.match)}
										{twinN && <Src n={twinN} url={twin.primary.source} label={`justETF, ${formatDateCz(twin.primary.as_of)}`} />}
									</td>
								</tr>
								<tr>
									<th scope="row">TER</th>
									<td class="mono">
										{formatTer(twin.primary.ter_pct.value)} % <span class="sub">(originál {formatTer(twin.us.expense_ratio_pct.value)} %)</span>
									</td>
								</tr>
								<tr>
									<th scope="row">Dividendy</th>
									<td>{distributionLabel(twin.primary.distribution)}</td>
								</tr>
								<tr>
									<th scope="row">Velikost fondu</th>
									<td class="mono">{sizeLabel(twin.primary.fund_size_eur_bn.value)}</td>
								</tr>
							</tbody>
						</table>
						{twin.match !== 'same' && <p class="plan-note">{twin.note_cs}</p>}
					</>
				) : (
					<p class="plan-note">
						Vybrali jste obecný výpočet bez konkrétního fondu. Dvojče najdete v lístku na hlavní stránce.
					</p>
				)}
			</section>

			<section class="plan-part">
				<h2>Kde koupit</h2>
				<div class="plan-scroll">
					<table class="plan-table">
						<thead>
							<tr>
								<th scope="col">Broker</th>
								<th scope="col">Poplatek za nákup</th>
								<th scope="col" class="r">Převod měny</th>
							</tr>
						</thead>
						<tbody>
							{BROKERS.map((b) => (
								<tr key={b.name}>
									<td>
										{b.name}
										<br />
										<a href={b.source} target="_blank" rel="noopener" class="sub">
											zdroj{b.as_of ? ` · ceník k ${formatDateCz(b.as_of)}` : ''}
										</a>
									</td>
									<td>{b.commission ?? <span class="sub">neověřeno</span>}</td>
									<td class="r mono">{b.fx_pct === null ? 'neověřeno' : formatPct(b.fx_pct)}</td>
								</tr>
							))}
						</tbody>
					</table>
				</div>
			</section>

			<section class="plan-part">
				<h2>Poplatky po letech</h2>
				<p class="plan-note">
					Stejná investice: {formatCzk(monthly)} měsíčně, {years} {years === 1 ? 'rok' : years < 5 ? 'roky' : 'let'}.
					Celkem vložíte {formatCzk(fees.invested)}.
				</p>
				<table class="plan-table">
					<thead>
						<tr>
							<th scope="col">Rok</th>
							<th scope="col" class="r">Bankovní fond</th>
							<th scope="col" class="r">ETF dvojče</th>
						</tr>
					</thead>
					<tbody>
						{milestones.map((y) => (
							<tr key={y.year}>
								<td class="mono">{y.year}</td>
								<td class="r mono">{formatCzk(y.lostBank)}</td>
								<td class="r mono">{formatCzk(y.lostEtf)}</td>
							</tr>
						))}
					</tbody>
				</table>
				<p class="plan-note">
					Ztráty na poplatcích oproti stejné investici bez poplatků. Předpoklad 7 % ročně před poplatky, není to slib.
					Bankovní fond podle KID<Src n={kidN} url={KID_SOURCE} label={`KID ${BANK_FUND_NAME}, ${KID_DATE_CZ}`} />, ETF
					podle XTB<Src n={xtbN} url={XTB_SOURCE} label={`XTB, ${AS_OF_CZ}`} />.
				</p>
			</section>

			<section class="plan-part">
				<h2>Daňový checklist</h2>
				<ul class="checklist">
					<li>
						<Icon name="check" size={16} />
						<span>
							{TAX_TIME_TEST.text}. <span class="sub">{TAX_TIME_TEST.law}</span>
							<Src n={taxN} url={TAX_TIME_TEST.source} label="zakonyprolidi.cz, § 4 ZDP" />
						</span>
					</li>
					<li>
						<Icon name="check" size={16} />
						<span>
							{TAX_LIMIT_100K.text}. <span class="sub">{TAX_LIMIT_100K.law}</span>
							<Src n={taxN} url={TAX_LIMIT_100K.source} label="zakonyprolidi.cz, § 4 ZDP" />
						</span>
					</li>
				</ul>
			</section>

			<section class="plan-part">
				<h2>5 kroků k prvnímu nákupu</h2>
				<ol class="steps">
					<li><span>Vyberte brokera (viz tabulka výše).</span></li>
					<li><span>Založte účet a ověřte totožnost.</span></li>
					<li><span>Pošlete na účet Kč.</span></li>
					<li>
						<span>
							Nakupte <span class="mono">{xetra}</span> na Xetře (nebo si nastavte investiční plán).
						</span>
					</li>
					<li><span>Držte alespoň 3 roky a evidujte datum každého nákupu.</span></li>
				</ol>
			</section>

			<section class="plan-part">
				<Notes items={fn.list()} />
				<p class="plan-disclaimer">
					Informace na této stránce nejsou investičním doporučením ani nabídkou. Investování je spojeno s rizikem,
					hodnota investice může klesat. Data fondů k {AS_OF_CZ}; ceníky brokerů dle data u každého řádku.
				</p>
				<button type="button" class="btn-outline no-print" onClick={() => window.print()}>
					Uložit jako PDF
				</button>
			</section>
		</article>
	);
}
