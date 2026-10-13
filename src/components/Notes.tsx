import type { SourceRef } from '../lib/view';

/** "Zdroje: [1] justETF, 13. 10. 2026 · [2] ..." grouped under a table or panel. */
export function Notes({ items }: { items: Array<SourceRef & { n: number }> }) {
	if (items.length === 0) return null;
	return (
		<p class="notes">
			<span>Zdroje: </span>
			{items.map((item, i) => (
				<span key={item.url}>
					{i > 0 ? ' · ' : ''}
					[{item.n}]{' '}
					<a href={item.url} target="_blank" rel="noopener">
						{item.label}
					</a>
				</span>
			))}
		</p>
	);
}
