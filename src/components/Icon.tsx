export type IconName = 'arrow' | 'lock' | 'check';

/** Small inline SVG icons, ink colour, 1.5px stroke. The twin marker is a filled triangle. */
export function Icon({ name, size = 16, className }: { name: IconName; size?: number; className?: string }) {
	const common = {
		width: size,
		height: size,
		viewBox: '0 0 16 16',
		fill: 'none',
		stroke: 'currentColor',
		strokeWidth: 1.5,
		strokeLinejoin: 'round' as const,
		strokeLinecap: 'round' as const,
		'aria-hidden': 'true',
		focusable: 'false',
		className,
	};
	switch (name) {
		case 'arrow':
			return (
				<svg {...common} stroke="none" fill="currentColor">
					<path d="M3.5 2.5 L12.5 8 L3.5 13.5 Z" />
				</svg>
			);
		case 'lock':
			return (
				<svg {...common}>
					<rect x="3" y="7" width="10" height="7" />
					<path d="M5.5 7 V5 a2.5 2.5 0 0 1 5 0 V7" />
				</svg>
			);
		case 'check':
			return (
				<svg {...common}>
					<path d="M2.5 8.5 L6.25 12 L13.5 4.5" />
				</svg>
			);
	}
}
