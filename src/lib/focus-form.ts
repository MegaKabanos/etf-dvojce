/**
 * Scrolls a lead form into view (centred) and focuses its e-mail input. Deferred one frame so it
 * also works right after a state change that has only just mounted the form.
 */
export function focusLeadForm(formSelector: string): void {
	requestAnimationFrame(() => {
		const form = document.querySelector<HTMLFormElement>(formSelector);
		if (!form) return;
		form.scrollIntoView({ block: 'center' });
		form.querySelector<HTMLInputElement>('input[type="email"]')?.focus({ preventScroll: true });
	});
}
