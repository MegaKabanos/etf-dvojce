import { useEffect, useState } from 'preact/hooks';
import { getState, subscribe, type StoreState } from './store';

/** Subscribes a component to a slice of the shared store. */
export function useStore<T>(selector: (s: StoreState) => T): T {
	const [value, setValue] = useState<T>(() => selector(getState()));
	useEffect(() => {
		const update = () => setValue(selector(getState()));
		update();
		return subscribe(update);
	}, [selector]);
	return value;
}
