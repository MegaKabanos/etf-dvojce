import { Icon } from './Icon';
import { track } from '../lib/track';

/**
 * Zakaz hero button. It asks the rate sheet to open VOO (or keep the row that is already open) and
 * to focus that result's lead form. The rate sheet listens for the window event `dvojce:open`.
 */
export default function HeroCta() {
	function onClick() {
		track('hero_cta_clicked', { variant: 'zakaz' });
		window.dispatchEvent(new CustomEvent('dvojce:open', { detail: { ticker: 'VOO' } }));
	}

	return (
		<div class="hero-cta">
			<button type="button" class="btn-primary btn-cta" onClick={onClick}>
				<span>Pošlete mi plán zdarma</span>
				<Icon name="arrow" size={12} />
			</button>
			<p class="hero-micro">Zdarma · stačí e-mail · plán uvidíte hned</p>
		</div>
	);
}
