import { useEffect, useState } from 'preact/hooks';

const STEP_MS = 40;
const STEPS = 10;

const isDigit = (c: string) => c >= '0' && c <= '9';
const reducedMotion = () =>
	typeof window !== 'undefined' && typeof window.matchMedia === 'function' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

/**
 * The one authored motion on the page: digits of a figure settle left to right in ~40 ms steps
 * (total about 400 ms). Only digits change; no sliding. Static when animate is false or motion is reduced.
 */
export function Tick({ text, animate }: { text: string; animate: boolean }) {
	const [shown, setShown] = useState(text);

	useEffect(() => {
		if (!animate || reducedMotion()) {
			setShown(text);
			return;
		}
		const chars = Array.from(text);
		const digitPositions = chars.flatMap((c, i) => (isDigit(c) ? [i] : []));
		let tick = 0;
		const frame = () =>
			chars
				.map((c, i) => {
					if (!isDigit(c)) return c;
					const settleAt = Math.min(STEPS, 2 + digitPositions.indexOf(i));
					return tick >= settleAt ? c : String(Math.floor(Math.random() * 10));
				})
				.join('');

		setShown(frame());
		const id = window.setInterval(() => {
			tick++;
			if (tick >= STEPS) {
				window.clearInterval(id);
				setShown(text);
				return;
			}
			setShown(frame());
		}, STEP_MS);
		return () => window.clearInterval(id);
	}, [text, animate]);

	return <span>{shown}</span>;
}
