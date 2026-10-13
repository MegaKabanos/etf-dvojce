import { useEffect, useState } from 'preact/hooks';
import { PlanView, type PlanViewProps } from './PlanView';
import { CALC_DEFAULTS, clampInt, isFundTicker, MONTHLY_RANGE, YEARS_RANGE } from '../lib/view';

/** Reads f / m / y from the URL after mount (the page itself is static, so no SSR of params). */
export default function PlanPage() {
	const [params, setParams] = useState<PlanViewProps | null>(null);

	useEffect(() => {
		const q = new URLSearchParams(location.search);
		const f = q.get('f');
		setParams({
			fund: isFundTicker(f) ? f.toUpperCase() : null,
			monthly: clampInt(q.get('m'), MONTHLY_RANGE.min, MONTHLY_RANGE.max, CALC_DEFAULTS.monthly),
			years: clampInt(q.get('y'), YEARS_RANGE.min, YEARS_RANGE.max, CALC_DEFAULTS.years),
		});
	}, []);

	if (!params) return <p class="plan-note">Načítám plán…</p>;
	return <PlanView {...params} />;
}
