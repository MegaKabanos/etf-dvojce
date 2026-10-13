import { useState } from 'preact/hooks';
import { PlanView } from './PlanView';
import { track } from '../lib/track';
import { getState, setState, type FormLocation } from '../lib/store';
import { useStore } from '../lib/use-store';

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const MSG_INVALID = 'Zkontrolujte prosím e-mail.';
const MSG_GENERIC = 'Něco se pokazilo. Zkuste to prosím znovu.';

/** email_focus fires once per location and page load. */
const focusedLocations = new Set<FormLocation>();

interface Props {
	location: FormLocation;
}

/**
 * The one-field e-mail form. Every form on the page shares the store: after a successful submit
 * all of them show the success state, and the form that submitted reveals the plan right there.
 */
export function LeadForm({ location }: Props) {
	const submitted = useStore((s) => s.submitted);
	const [email, setEmail] = useState('');
	const [website, setWebsite] = useState(''); // honeypot
	const [error, setError] = useState<string | null>(null);
	const [busy, setBusy] = useState(false);
	const inputId = `lead-email-${location}`;
	const errorId = `${inputId}-error`;

	if (submitted) {
		return (
			<div class="done" role="status">
				<h2>Hotovo. Tady je váš plán.</h2>
				<p>
					Kopii jsme poslali na {submitted.email}. Kdyby nedorazila, mrkněte do složky Hromadné / Promo.
				</p>
				{submitted.location === location && (
					<PlanView fund={submitted.fund} monthly={submitted.monthly} years={submitted.years} />
				)}
			</div>
		);
	}

	async function onSubmit(event: Event) {
		event.preventDefault();
		if (busy) return;
		const value = email.trim().toLowerCase();
		if (!EMAIL_RE.test(value) || value.length > 254) {
			setError(MSG_INVALID);
			track('lead_error', { reason: 'invalid_email', location });
			document.getElementById(inputId)?.focus();
			return;
		}

		const current = getState();
		const ctx = window.__dvojce;
		setBusy(true);
		setError(null);
		try {
			const res = await fetch('/api/lead', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({
					email: value,
					fund: current.fund,
					monthly: current.monthly,
					years: current.years,
					variant: ctx?.variant ?? null,
					utm: ctx?.utm ?? {},
					website,
				}),
			});
			const data: unknown = await res.json().catch(() => null);
			const ok = res.ok && typeof data === 'object' && data !== null && (data as { ok?: unknown }).ok === true;
			if (!ok) {
				const apiError =
					typeof data === 'object' && data !== null && typeof (data as { error?: unknown }).error === 'string'
						? (data as { error: string }).error
						: MSG_GENERIC;
				setError(apiError);
				track('lead_error', { reason: `http_${res.status}`, location });
				setBusy(false);
				return;
			}
			track('lead_submitted', { location, fund: current.fund });
			setState({
				submitted: {
					location,
					email: value,
					fund: current.fund,
					monthly: current.monthly,
					years: current.years,
				},
			});
		} catch {
			setError(MSG_GENERIC);
			track('lead_error', { reason: 'network', location });
			setBusy(false);
		}
	}

	return (
		<form class="lead" data-lead-form data-location={location} onSubmit={onSubmit} noValidate>
			<label class="lead-label" for={inputId}>
				E-mail
			</label>
			<input
				id={inputId}
				class="lead-input"
				type="email"
				name="email"
				autoComplete="email"
				inputMode="email"
				placeholder="váš@email.cz"
				value={email}
				aria-invalid={error ? 'true' : undefined}
				aria-describedby={error ? errorId : undefined}
				onInput={(e) => setEmail(e.currentTarget.value)}
				onFocus={() => {
					if (focusedLocations.has(location)) return;
					focusedLocations.add(location);
					track('email_focus', { form_location: location });
				}}
			/>
			<div class="hp" aria-hidden="true">
				<label>
					Web
					<input
						type="text"
						name="website"
						tabIndex={-1}
						autoComplete="off"
						value={website}
						onInput={(e) => setWebsite(e.currentTarget.value)}
					/>
				</label>
			</div>
			{error && (
				<p id={errorId} class="lead-error" role="alert">
					{error}
				</p>
			)}
			<button class="btn-primary" type="submit" disabled={busy}>
				{busy ? 'Posílám…' : 'Poslat plán zdarma'}
			</button>
			<p class="lead-micro">
				Plán uvidíte hned a pošleme ho i na e-mail. Žádný spam, odhlásit se jde jedním klikem.{' '}
				<a href="/soukromi">Jak zacházíme s daty</a>
			</p>
		</form>
	);
}
