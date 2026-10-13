import { Icon } from './Icon';
import { LeadForm } from './LeadForm';
import { Notes } from './Notes';
import { Src } from './Src';
import { Tick } from './Tick';
import {
	distributionLabel,
	Footnotes,
	formatTer,
	matchLabel,
	PRIIPS_SOURCES,
	sizeLabel,
	type FundRow,
} from '../lib/view';
import { formatDateCz } from '../lib/format';

interface Props {
	row: FundRow;
	/** True only when the visitor tapped the row; deep links render static. */
	animate: boolean;
}

const LOCKED_ITEMS = [
	'U kterého brokera {x} koupíte nejlevněji',
	'Kolik vás stojí převod korun na eura (a jak to obejít)',
	'Jak po 3 letech neplatit daň z prodeje',
];

/** Result for one US fund: unavailability verdict, the European twin as a bulletin entry, and the locked teaser. */
export function ResultPanel({ row, animate }: Props) {
	const { ticker, twin } = row;
	const { us, primary, alt, match, note_cs: note } = twin;
	const fn = new Footnotes();
	const dated = (name: string, asOf: string) => `${name}, ${formatDateCz(asOf)}`;

	const kid = fn.ref({ url: PRIIPS_SOURCES[0], label: dated('justETF, PRIIPs', primary.as_of) });
	const twinSrc = fn.ref({ url: primary.source, label: dated('justETF, profil fondu', primary.as_of) });
	const usSrc = fn.ref({ url: us.expense_ratio_pct.source, label: dated(hostOf(us.expense_ratio_pct.source), us.expense_ratio_pct.as_of) });

	const terTwin = `${formatTer(primary.ter_pct.value)} %`;
	const terUs = `${formatTer(us.expense_ratio_pct.value)} %`;
	const size = sizeLabel(primary.fund_size_eur_bn.value);

	return (
		<div class="panel">
			<p class="verdict">Nelze koupit</p>
			<p class="why">
				{ticker} z Česka jako drobný investor nekoupíte. Fondy z USA nemají sdělení klíčových informací (KID), které evropská regulace PRIIPs vyžaduje. Brokeři jako XTB
				nebo DEGIRO vám je proto neprodají.
				<Src n={kid} url={PRIIPS_SOURCES[0]} label={dated('justETF, PRIIPs', primary.as_of)} />
			</p>

			<article class="twin" aria-label="Evropské dvojče">
				<h3>{primary.name}</h3>
				<p class="tickers mono">
					<span>{primary.tickers.xetra} · Xetra (EUR)</span>
					<span>{primary.tickers.lse} · Londýn (USD)</span>
				</p>
				<table class="kv">
					<tbody>
						<tr>
							<th scope="row">Index</th>
							<td>
								{primary.index.value}
								<Src n={twinSrc} url={primary.index.source} label={dated('justETF, profil fondu', primary.as_of)} />
							</td>
						</tr>
						<tr>
							<th scope="row">Shoda</th>
							<td>{matchLabel(match)}</td>
						</tr>
						<tr>
							<th scope="row">TER</th>
							<td class="mono">
								<Tick text={terTwin} animate={animate} />
								<Src n={twinSrc} url={primary.ter_pct.source} label={dated('justETF, profil fondu', primary.as_of)} />
								<span class="sub"> (originál: {terUs})</span>
								<Src n={usSrc} url={us.expense_ratio_pct.source} label={dated(hostOf(us.expense_ratio_pct.source), us.expense_ratio_pct.as_of)} />
							</td>
						</tr>
						<tr>
							<th scope="row">Dividendy</th>
							<td>
								{distributionLabel(primary.distribution)}
								<Src n={twinSrc} url={primary.source} label={dated('justETF, profil fondu', primary.as_of)} />
							</td>
						</tr>
						<tr>
							<th scope="row">Velikost fondu</th>
							<td class="mono">
								<Tick text={size} animate={animate} />
								<Src n={twinSrc} url={primary.fund_size_eur_bn.source} label={dated('justETF, profil fondu', primary.as_of)} />
							</td>
						</tr>
						<tr>
							<th scope="row">Sídlo</th>
							<td>Irsko (UCITS)</td>
						</tr>
					</tbody>
				</table>

				{match !== 'same' && <p class="note">{note}</p>}
				{match === 'approximate' && (
					<p class="note">
						Přesná kopie v Evropě neexistuje. Tohle je nejbližší rozumná alternativa — rozdíly máte v plánu.
					</p>
				)}
				<Notes items={fn.list()} />
			</article>

			{alt && (
				<p class="alt">
					Alternativa: {alt.tickers.xetra} · {alt.name} · TER {formatTer(alt.ter_pct.value)} %
				</p>
			)}

			<div class="teaser">
				<h3>Pošleme vám úplný lístek na míru.</h3>
				<ul>
					{LOCKED_ITEMS.map((text) => (
						<li key={text}>
							<Icon name="lock" size={16} />
							<span>{text.replace('{x}', primary.tickers.xetra)}</span>
						</li>
					))}
				</ul>
				<LeadForm location="result" />
			</div>
		</div>
	);
}

function hostOf(url: string): string {
	return new URL(url).hostname.replace(/^www\./, '');
}
