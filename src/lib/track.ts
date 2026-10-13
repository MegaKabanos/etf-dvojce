/**
 * Cookieless analytics: PostHog EU capture API via fetch, no SDK, no cookies, no localStorage.
 * distinct_id lives only in memory, so each page load is a new anonymous visitor.
 */

const API_KEY: string | undefined = import.meta.env.PUBLIC_POSTHOG_KEY;
const HOST: string = (import.meta.env.PUBLIC_POSTHOG_HOST || 'https://eu.i.posthog.com').replace(/\/$/, '');

const distinctId: string =
	typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function'
		? crypto.randomUUID()
		: `anon-${Math.random().toString(36).slice(2)}${Date.now().toString(36)}`;

export function track(event: string, props: Record<string, unknown> = {}): void {
	if (typeof window === 'undefined') return;
	const ctx = window.__dvojce;
	const utm = ctx?.utm ?? {};
	const properties = {
		...props,
		variant: ctx?.variant ?? null,
		utm_source: utm.source ?? null,
		utm_medium: utm.medium ?? null,
		utm_campaign: utm.campaign ?? null,
		utm_content: utm.content ?? null,
		$current_url: location.href,
		$process_person_profile: false,
	};

	if (!API_KEY) {
		console.debug('[track]', event, properties);
		return;
	}

	try {
		void fetch(`${HOST}/i/v0/e/`, {
			method: 'POST',
			keepalive: true,
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({ api_key: API_KEY, event, distinct_id: distinctId, properties }),
		}).catch(() => undefined);
	} catch {
		// Analytics must never break the page.
	}
}
