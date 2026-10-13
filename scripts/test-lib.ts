import assert from 'node:assert/strict';
import { feeImpact, simulate } from '../src/lib/calc.ts';
import { formatCzk, formatDateCz, formatPct } from '../src/lib/format.ts';
import { getTwin, listUsTickers } from '../src/lib/twins.ts';

let passed = 0;
function check(name: string, fn: () => void) {
	fn();
	passed++;
	console.log(`ok  ${name}`);
}

const within = (actual: number, expected: number, tol: number) =>
	assert.ok(Math.abs(actual - expected) <= tol, `expected ${expected} ±${tol}, got ${actual}`);

check('feeImpact 5000 Kč x 20 years matches reference numbers (±1 Kč)', () => {
	const r = feeImpact({ monthly: 5000, years: 20 });
	within(r.noFees, 2552030, 1);
	within(r.bank, 1830700, 1);
	within(r.etf, 2517634, 1);
	within(r.lostBank, 721331, 1);
	within(r.lostEtf, 34396, 1);
	assert.equal(r.invested, 1_200_000);
	assert.equal(r.difference, r.etf - r.bank);
});

check('simulate with zero costs equals plain monthly compounding', () => {
	const { final, yearly } = simulate({
		monthly: 1000, years: 1, grossReturn: 0.12, entryPct: 0, annualCostPct: 0, fxPct: 0,
	});
	// v_m = (v_{m-1} + 1000) * (1+rm), rm = 1.12^(1/12)-1
	const rm = 1.12 ** (1 / 12) - 1;
	let v = 0;
	for (let i = 0; i < 12; i++) v = (v + 1000) * (1 + rm);
	within(final, v, 1e-6);
	assert.equal(yearly.length, 1);
	within(yearly[0], final, 1e-9);
});

check('simulate yearly series has one entry per year, last equals final', () => {
	const r = simulate({ monthly: 5000, years: 7, grossReturn: 0.07, entryPct: 0.05, annualCostPct: 0.0234, fxPct: 0 });
	assert.equal(r.yearly.length, 7);
	within(r.yearly[6], r.final, 1e-9);
});

check('formatCzk uses NBSP separators and NBSP before Kč', () => {
	assert.equal(formatCzk(1830700), '1 830 700 Kč');
	assert.equal(formatCzk(0), '0 Kč');
	assert.equal(formatCzk(84300), '84 300 Kč');
});

check('formatPct yields Czech decimal comma and NBSP before %', () => {
	assert.equal(formatPct(0.07), '0,07 %');
	assert.equal(formatPct(0.5), '0,50 %');
});

check('formatDateCz', () => {
	assert.equal(formatDateCz('2026-10-13'), '13. 10. 2026');
	assert.equal(formatDateCz('2022-09-30'), '30. 9. 2022');
	assert.throws(() => formatDateCz('13.10.2026'));
});

check('getTwin joins VOO to CSPX (primary) and VUAA (alt), same match', () => {
	const t = getTwin('VOO');
	assert.ok(t);
	assert.equal(t.us.ticker, 'VOO');
	assert.equal(t.primary.isin, 'IE00B5BMR087');
	assert.equal(t.primary.tickers.xetra, 'SXR8');
	assert.equal(t.primary.tickers.lse, 'CSPX');
	assert.equal(t.alt?.isin, 'IE00BFMXXD54');
	assert.equal(t.match, 'same');
});

check('getTwin: VT similar with no alt, SCHD approximate, VTI approximate', () => {
	assert.equal(getTwin('VT')?.primary.isin, 'IE00BK5BQT80');
	assert.equal(getTwin('VT')?.match, 'similar');
	assert.equal(getTwin('VT')?.alt, null);
	assert.equal(getTwin('SCHD')?.primary.isin, 'IE00B8GKDB10');
	assert.equal(getTwin('SCHD')?.match, 'approximate');
	assert.equal(getTwin('VTI')?.primary.isin, 'IE00B52SFT06');
	assert.equal(getTwin('VWO')?.primary.isin, 'IE00BKM4GZ66');
});

check('getTwin is case-insensitive and returns null for unknown / excluded tickers', () => {
	assert.equal(getTwin('voo')?.us.ticker, 'VOO');
	assert.equal(getTwin('QQQ'), null);
	assert.equal(getTwin('NOPE'), null);
});

check('listUsTickers has the seven NYSE funds', () => {
	assert.deepEqual(listUsTickers(), ['VOO', 'SPY', 'IVV', 'VTI', 'VT', 'SCHD', 'VWO']);
});

console.log(`\n${passed} checks passed`);
