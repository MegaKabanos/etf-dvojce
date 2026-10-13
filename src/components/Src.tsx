/** Footnote marker: a tiny superscript number that links to the source (opens in a new tab). */
export function Src({ n, url, label }: { n: number; url: string; label: string }) {
	return (
		<a class="src" href={url} target="_blank" rel="noopener" title={label} aria-label={`Zdroj ${n}: ${label}`}>
			{n}
		</a>
	);
}
