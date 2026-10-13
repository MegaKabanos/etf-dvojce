import { useEffect, useRef, useState } from 'preact/hooks';
import { Icon } from './Icon';
import { ResultPanel } from './ResultPanel';
import { track } from '../lib/track';
import { setState } from '../lib/store';
import { focusLeadForm } from '../lib/focus-form';
import { formatTer, fundRows, isFundTicker, peekLine, type FundRow } from '../lib/view';

const ROWS: FundRow[] = fundRows();
const PEEK = peekLine('VOO');

/** The open result's lead form: `#vysledek-{ticker}` wraps the ResultPanel. */
const resultFormSelector = (ticker: string) => `#vysledek-${ticker} form[data-lead-form]`;

/**
 * The rate sheet: one row per NYSE fund. The whole row is a button; tapping it opens the result
 * directly beneath (only one at a time). ?open=VOO opens a row on load (ad deep link).
 * The window event `dvojce:open` (detail: { ticker }) is the hero button's entry point: it opens
 * that row unless a row is already open, then focuses the result's lead form.
 */
export default function RateTable() {
	const [openTicker, setOpenTicker] = useState<string | null>(null);
	const [animate, setAnimate] = useState(false);
	const openRef = useRef<string | null>(null);
	const pendingFocus = useRef<string | null>(null);
	openRef.current = openTicker;

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
		const onOpen = (event: Event) => {
			const requested = (event as CustomEvent<{ ticker?: unknown }>).detail?.ticker;
			if (typeof requested !== 'string' || !isFundTicker(requested)) return;
			const current = openRef.current;
			if (current) {
				focusLeadForm(resultFormSelector(current));
				return;
			}
			const index = ROWS.findIndex((r) => r.ticker === requested.toUpperCase());
			if (index < 0) return;
			const row = ROWS[index];
			pendingFocus.current = row.ticker;
			setAnimate(true);
			setOpenTicker(row.ticker);
			setState({ fund: row.ticker });
			track('fund_selected', { ticker: row.ticker, position: index + 1 });
			track('result_shown', { ticker: row.ticker, source: 'hero_cta' });
		};
		window.addEventListener('dvojce:open', onOpen);
		return () => window.removeEventListener('dvojce:open', onOpen);
	}, []);

	useEffect(() => {
		if (!openTicker) return;
		// The panel renders in the same commit as openTicker, so its form is in the DOM here.
		if (pendingFocus.current === openTicker) {
			pendingFocus.current = null;
			focusLeadForm(resultFormSelector(openTicker));
		}
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

	const peekRow = ROWS.find((r) => r.ticker === 'VOO');

	return (
		<div class="rt">
			<div class="rt-head" aria-hidden="true">
				<span>Země</span>
				<span>Burza</span>
				<span>Kód</span>
				<span class="r">TER %</span>
				<span>Dvojče / TER</span>
			</div>
			<ul class="rt-list">
				{ROWS.map((row, index) => {
					const isOpen = openTicker === row.ticker;
					const twin = row.twin.primary;
					return (
						<li key={row.ticker} class={isOpen ? 'rt-open' : undefined}>
							<div class="rt-row" data-open={isOpen ? 'true' : undefined}>
								{/* The whole row is the button. Cells sit beneath it and pass clicks through. */}
								<button
									type="button"
									id={`row-${row.ticker}`}
									class="rt-hit"
									aria-expanded={isOpen}
									aria-controls={isOpen ? `vysledek-${row.ticker}` : undefined}
									aria-label={`${row.ticker}, ${row.twin.us.name}, TER ${formatTer(row.terPct)} %, evropské dvojče ${twin.tickers.xetra}, TER ${formatTer(twin.ter_pct.value)} %`}
									onClick={() => onRowClick(row, index + 1)}
								/>
								<span class="c">USA</span>
								<span class="c">{row.exchange}</span>
								<span class="k">{row.ticker}</span>
								<span class="r ter">{formatTer(row.terPct)}</span>
								<span class="tw">
									<Icon name="arrow" size={10} className="arr" />
									{twin.tickers.xetra}
									<span class="tw-ter">{'  '}{formatTer(twin.ter_pct.value)}</span>
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
			{peekRow && PEEK && (
				<button
					type="button"
					class="peek"
					aria-controls={`vysledek-${peekRow.ticker}`}
					aria-expanded={openTicker === peekRow.ticker}
					onClick={() => {
						const index = ROWS.indexOf(peekRow);
						if (openTicker !== peekRow.ticker) onRowClick(peekRow, index + 1);
						document.getElementById(`row-${peekRow.ticker}`)?.scrollIntoView({ block: 'start' });
					}}
				>
					{PEEK}
				</button>
			)}
		</div>
	);
}
