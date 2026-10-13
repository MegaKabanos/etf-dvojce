# Product

**Dvojče** — a mobile-first lead-magnet landing page that helps Czech retail investors find the European "twin" (UCITS equivalent) of a popular NYSE-listed ETF and see, in Czech crowns, what fees cost them. It exchanges a personalised "ETF plán" for an e-mail address.

## Platform
web

## Stack
Astro (static output) + Preact islands for interactive parts, @astrojs/vercel adapter with on-demand API routes (`/api/lead`). Leads stored in Supabase (EU), one transactional e-mail via Brevo, funnel analytics via PostHog EU Cloud in cookieless mode. Data snapshot in `src/data/*.json`, every value carries `source_url` + `as_of`. Exchange rates from ČNB (server-side; their endpoint has no open CORS).

## Users
Czech retail investors, 22–40, investing or about to invest 2 000–10 000 Kč per month. They consume English finance content (YouTube, Reddit, X) and therefore know US tickers (VOO, SPY, VTI, SCHD), but usually do not know that EU retail clients cannot buy US-domiciled ETFs (PRIIPs / missing KID). Many still hold or are offered bank mutual funds with ~1.5–2 % ongoing charges and entry fees.

Arrival: a paid social ad (Instagram / Facebook), on a phone, one hand, a few seconds of attention. They decide in the first viewport whether to stay.

## Product Purpose
Convert ad traffic into e-mail leads by giving real, immediate value first: a one-tap answer ("you can't buy VOO from Czechia — here is its twin") and a fee number in CZK. The full plan (where to buy cheapest, CZK conversion cost, tax checklist, year-by-year fee breakdown) is the reward for an e-mail.

## Positioning
Not a broker, not an advisor, not a generic "learn to invest" blog. A sharp, honest tool that answers one question Czech investors actually get stuck on, with sources under every number. Tone: a knowledgeable friend who reads the fine print — direct, a little wry, never salesy, never fear-mongering.

## Operating Context
- Primary: 360–430 px wide phones, often on mobile data. Must feel instant (target LCP < 1.5 s, JS minimal).
- Hero must continue the exact promise of the ad that brought the visitor (`utm_content=ad_zakaz` → "VOO z Česka nekoupíte"; `utm_content=ad_poplatky` → fee calculator first). Default = zakaz.
- Language: Czech only, native quality, Czech number formatting (`84 300 Kč`, `0,07 %`).

## Capabilities and Constraints
- Interactive: (1) twin finder — tap a familiar US ticker → availability verdict + UCITS twin card; (2) fee calculator — monthly amount + years → fees in CZK, bank fund vs ETF twin; (3) sourced comparison table.
- Every interactive element ends in the same one-field e-mail form, placed inside the result card (ask at the "aha" moment, never on arrival, no pop-ups).
- After submit: full plan reveals instantly on the page + one e-mail with a stateless link to the plan.
- Returns are NOT shown as data claims in the calculator; projected growth uses a clearly labelled assumption.
- Legal: "není investiční doporučení" disclaimer; GDPR notice under the button (no mandatory checkbox); data controller = private person, demo project, deletion after 30 days.
- Funnel tracking: landing_view → first_interaction → result_shown → email_focus → lead_submitted, split by utm_content.

## Brand Commitments
- Name: Dvojče. The "twin" metaphor carries the visual idea (US fund ↔ European twin, pairs, mirroring).
- Must NOT look like default AI/SaaS output: no purple/blue gradients, no glassmorphism, no emoji bullets, no generic hero illustration, no three-icon feature grid.
- Numbers are the heroes: big CZK figures, tickers in monospace.

## Evidence on Hand
- Research snapshot in `research/` (etfs.json, facts.json, czech-funds-brokers.json) with URLs and dates.
- Verified: CSPX TER 0,07 % (justETF), VWCE TER 0,14 % (justETF), VOO 0,03 % NYSE Arca (stockanalysis), časový test § 4 odst. 1 písm. u) ZDP, 100 000 Kč limit § 4 odst. 1 písm. t) ZDP, PRIIPs KID restriction (justETF, finhacker.cz).

## Product Principles
1. Value before the ask — the visitor sees a real answer before any form.
2. One tap to the first answer.
3. Every number has a source a sceptic can click.
4. One field. Nothing else.
5. Honest framing — no fake urgency, no fake scarcity, no fake testimonials.

## Accessibility & Inclusion
WCAG 2.2 AA contrast, 44 px touch targets, works without JS for reading content (interactive parts progressively enhanced), respects prefers-reduced-motion, readable at 200 % zoom, Czech `lang="cs"`.
