import { createSubscriber } from 'svelte/reactivity';

export class ReactiveValue<T> {
	#fn;
	#subscribe;

	constructor(fn: () => T, onsubscribe: (update: () => void) => void) {
		this.#fn = fn;
		this.#subscribe = createSubscriber(onsubscribe);
	}

	get current() {
		this.#subscribe();
		return this.#fn();
	}
}
