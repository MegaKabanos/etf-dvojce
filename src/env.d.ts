/// <reference types="astro/client" />

interface DvojceUtm {
	source: string | null;
	medium: string | null;
	campaign: string | null;
	content: string | null;
}

interface Window {
	/** Set by the inline script in the layout before first paint. */
	__dvojce?: {
		utm: Partial<DvojceUtm>;
		variant: 'zakaz' | 'poplatky';
	};
}
