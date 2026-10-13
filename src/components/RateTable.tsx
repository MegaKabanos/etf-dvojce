import { useEffect, useState } from 'preact/hooks';
import { Icon } from './Icon';
import { Notes } from './Notes';
import { ResultPanel } from './ResultPanel';
import { Src } from './Src';
import { track } from '../lib/track';
import { setState } from '../lib/store';
import { formatDateCz } from '../lib/format';
import { Footnotes, fundRows, formatTer, isFundTicker, type FundRow } from '../lib/view';

const ROWS: FundRow[] = fundRows();

/** Footnotes for the US TER column, one number per row (each US fund has its own source page). */
const TABLE_NOTES = new Footnotes();
const TER_NUMBERS = new Map<string, number>(
	ROWS.map((row) => {
		const url = row.twin.us.expense_ratio_pct.source;
		const host = new URL(url).hostname.replace(/^www\./, '');
		const n = TABLE_NOTES.ref({ url, label: `${host}, ${formatDateCz(row.twin.us.expense_ratio_pct.as_of)}` });
		return [row.ticker, n];
	}),
);

/**
 * The rate sheet: one row per NYSE fund. The whole row is a button; tapping it opens the result
 * directly beneath (only one at a time). ?open=VOO opens a row on load (ad deep link).
 */
export default function RateTable() {
	const [openTicker, setOpenTicker] = useState<string | null>(null);
	const [animate, setAnimate] = useState(false);

	useEffect(() => {
		const requested = new URLSearchParams(location.search).get('open');
		if (!isFundTicker(requested)) return;
		const row = ROWS.find((r) => r.ticker === requested.toUpperCase());
		if (!row) return;
		setOpenTicker(row.ticker);
		setState({ fund: row.ticker });
		track('result_shown', { ticker: row.ticker, source: 'deep_link' });
	}, []);

	useEffect(() => {
		if (!openTicker) return;
		const button = document.getElementById(`row-${openTicker}`);
		if (!button) return;
		const top = button.getBoundingClientRect().top;
		if (top < 0 || top > window.innerHeight * 0.5) {
			button.scrollIntoView({ block: 'start' });
		}
	}, [openTicker]);

	function onRowClick(row: FundRow, position: number) {
		if (openTicker === row.ticker) {
			setOpenTicker(null);
			return;
		}
		setOpenTicker(row.ticker);
		setAnimate(true);
		setState({ fund: row.ticker });
		track('fund_selected', { ticker: row.ticker, position });
		track('result_shown', { ticker: row.ticker, source: 'tap' });
	}

	return (
		<div class="rt">
			<div class="rt-head" aria-hidden="true">
				<span>Země</span>
				<span>Burza</span>
				<span>Kód</span>
				<span class="r">TER %</span>
				<span>Dvojče</span>
			</div>
			<ul class="rt-list">
				{ROWS.map((row, index) => {
					const isOpen = openTicker === row.ticker;
					const n = TER_NUMBERS.get(row.ticker) ?? 0;
					return (
						<li key={row.ticker} class={isOpen ? 'rt-open' : undefined}>
							<div class="rt-row" data-open={isOpen ? 'true' : undefined}>
								{/* The whole row is the button. Cells sit beneath it and pass clicks through; only the source marker is clickable. */}
								<button
									type="button"
									id={`row-${row.ticker}`}
									class="rt-hit"
									aria-expanded={isOpen}
									aria-controls={isOpen ? `vysledek-${row.ticker}` : undefined}
									aria-label={`${row.ticker}, ${row.twin.us.name}, TER ${formatTer(row.terPct)} %, evropské dvojče ${row.twin.primary.tickers.xetra}`}
									onClick={() => onRowClick(row, index + 1)}
								/>
								<span class="c">USA</span>
								<span class="c">{row.exchange}</span>
								<span class="k">{row.ticker}</span>
								<span class="r">
									{formatTer(row.terPct)}
									<Src
										n={n}
										url={row.twin.us.expense_ratio_pct.source}
										label={`${row.ticker}, ${formatDateCz(row.twin.us.expense_ratio_pct.as_of)}`}
									/>
								</span>
								<span class="tw">
									<Icon name="arrow" size={10} className="arr" />
									{row.twin.primary.tickers.xetra}
								</span>
							</div>
							{isOpen && (
								<div id={`vysledek-${row.ticker}`}>
									<ResultPanel row={row} animate={animate} />
								</div>
							)}
						</li>
					);
				})}
			</ul>
			<Notes items={TABLE_NOTES.list()} />
		</div>
	);
}
