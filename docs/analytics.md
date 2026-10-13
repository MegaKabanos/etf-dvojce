# Analytics: funnel definition

Cookieless PostHog EU capture (`src/lib/track.ts`). No cookies, no localStorage; `distinct_id` is an in-memory UUID per page load. Every event also carries `variant` (`zakaz` / `poplatky`), `utm_source`, `utm_medium`, `utm_campaign`, `utm_content`, `$current_url`.

## Funnel (in order)

1. `landing_view`: on load. Props: `viewport_width`, `referrer_domain`.
2. `fund_selected`: visitor taps a ticker row. Props: `ticker`, `position` (1-7).
3. `result_shown`: a result opens. Props: `ticker`, `source` (`tap`, `deep_link` or `hero_cta`).
4. `email_focus`: first focus in a lead form, once per form location per page load. Props: `form_location` (`result` / `calculator` / `plan`).
5. `lead_submitted`: API accepted the lead. Props: `location`, `fund`, `variant`.

## Other events

- `calculator_used`: first slider change only. Props: `monthly`, `years`.
- `cta_clicked`: calculator CTA opens the inline form. Props: `location`.
- `hero_cta_clicked`: first-screen button. Zakaz: opens the VOO result and focuses its form. Poplatky: opens the calculator's inline form and focuses it. Props: `variant` (`zakaz` / `poplatky`).
- `sticky_cta_clicked`: mobile bottom bar tapped.
- `lead_error`: validation or API failure. Props: `reason` (`invalid_email`, `http_<status>`, `network`), `location`.
- `scroll_depth`: 25 / 50 / 75 / 100, once each. Props: `depth`.
- `faq_opened`: FAQ item opened. Props: `question_idx` (0-based).
- `source_clicked`: outbound link with `target="_blank"`. Props: `domain`.
