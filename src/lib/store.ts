import { CALC_DEFAULTS } from './view';

/**
 * Tiny shared state for the islands on the page (no framework dependency, module singleton).
 * Islands read it through useStore() in use-store.ts.
 */

export type FormLocation = 'result' | 'calculator' | 'plan';

export interface Submitted {
	location: FormLocation;
	email: string;
	fund: string | null;
	monthly: number;
	years: number;
}

export interface StoreState {
	/** Last US ticker the visitor opened, or null. */
	fund: string | null;
	monthly: number;
	years: number;
	/** Set after a successful lead submit; every form then shows the success state. */
	submitted: Submitted | null;
}

let state: StoreState = {
	fund: null,
	monthly: CALC_DEFAULTS.monthly,
	years: CALC_DEFAULTS.years,
	submitted: null,
};

const listeners = new Set<() => void>();

export function getState(): StoreState {
	return state;
}

export function setState(patch: Partial<StoreState>): void {
	state = { ...state, ...patch };
	for (const listener of listeners) listener();
}

export function subscribe(listener: () => void): () => void {
	listeners.add(listener);
	return () => {
		listeners.delete(listener);
	};
}
