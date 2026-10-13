import { useEffect, useState } from 'preact/hooks';
import { Icon } from './Icon';
import { track } from '../lib/track';
import { getState } from '../lib/store';
import { useStore } from '../lib/use-store';

/**
 * Mobile-only bottom bar. Shown after the hero has scrolled away and while no lead form is in view.
 * It scrolls to the open result form, else to the plan form, else to the calculator.
 */
export default function StickyCta() {
	const submitted = useStore((s) => s.submitted);
	const [visible, setVisible] = useState(false);

	useEffect(() => {
		let frame = 0;
		const compute = () => {
			frame = 0;
			const endSelector = document.documentElement.dataset.variant === 'poplatky' ? '#kalkulacka' : '#lístek';
			const end = document.querySelector<HTMLElement>(endSelector);
			const pastHero = !!end && end.offsetParent !== null && end.getBoundingClientRect().bottom <= 0;
			const formInView = [...document.querySelectorAll<HTMLElement>('form[data-lead-form]')].some((form) => {
				const r = form.getBoundingClientRect();
				return r.bottom > 0 && r.top < window.innerHeight;
			});
			setVisible(pastHero && !formInView && !getState().submitted);
		};
		const onChange = () => {
			if (!frame) frame = requestAnimationFrame(compute);
		};
		window.addEventListener('scroll', onChange, { passive: true });
		window.addEventListener('resize', onChange);
		compute();
		return () => {
			window.removeEventListener('scroll', onChange);
			window.removeEventListener('resize', onChange);
			if (frame) cancelAnimationFrame(frame);
		};
	}, []);

	if (submitted || !visible) return null;

	function onClick() {
		track('sticky_cta_clicked');
		const target =
			document.querySelector<HTMLElement>('[id^="vysledek-"] form[data-lead-form]') ??
			document.querySelector<HTMLElement>('#plan form[data-lead-form]') ??
			document.querySelector<HTMLElement>('#kalkulacka');
		if (!target) return;
		target.scrollIntoView({ block: 'center' });
		target.querySelector<HTMLInputElement>('input[type="email"]')?.focus({ preventScroll: true });
	}

	return (
		<div class="sticky">
			<button type="button" onClick={onClick}>
				<span>Pošlete mi plán zdarma</span>
				<Icon name="arrow" size={12} />
			</button>
		</div>
	);
}
