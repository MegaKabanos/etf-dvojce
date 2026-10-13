# Build spec — landing page UI (Kurzovní lístek world)

Read first: PRODUCT.md, docs/copy.md (all Czech text comes from there, verbatim unless this file overrides), `.impeccable/mocks/decision/model-pick.html` + `.png` (approved first-viewport sketch — match its composition), src/data/*.json, src/lib/*.ts.

## World (non-negotiable)
- Paper: `#FFFFFF`. Ink: `#111111` for everything printed (text, rules, borders, icons). Bulletin red `#C8102E` ONLY for: the header band, the bulletin number line, the "nelze koupit" verdict, the key CZK figure in results, focus ring. Secondary text = `#4A4A4A` (≥4.5:1). Hairline rules `1px solid #111` (major) / `1px solid #D9D9D9` (minor row separators).
- No border-radius anywhere (0). No box-shadows. No gradients. No emoji. No icon fonts. Small inline SVG icons only (arrow ▸ drawn as SVG triangle, lock, check), 1.5px stroke, ink colour.
- Type: self-hosted via `@fontsource/barlow-semi-condensed` (600, 700, 800) for display/headings/labels and `@fontsource/roboto-mono` (400, 500, 700) for ALL data (tickers, numbers, table cells, CZK amounts) with `font-variant-numeric: tabular-nums`. Body copy: Barlow Semi Condensed 500 at 17px/1.45 (it reads well). Import ONLY `latin-ext` + `latin` subsets (Czech diacritics!). `font-display: swap`. No Google Fonts link.
- Display H1: 44px mobile / 64px desktop, weight 800, line-height 0.98, letter-spacing -0.01em, `text-wrap: balance`.
- No eyebrow/kicker labels above headings (banned). Section headings stand alone.
- Numbers right-aligned in tables. Czech formatting only via src/lib/format.ts.
- Landing page: no inline citations. All landing sources are listed once, deduplicated by URL, in the collapsed "Zdroje dat a metodika (N)" section before the footer (src/components/Sources.astro; each item links target _blank rel noopener, dates via formatDateCz). Per-value source tags (tiny 11px mono, #4A4A4A footnote number linking to the source URL, grouped as "Zdroje: [1] justETF, 13. 10. 2026 …") exist only in the delivered plan (PlanView).
- Motion: one authored moment only — when a ticker row is tapped, the result expands below the row and the twin's figures "step in" digit by digit (each digit swaps in ~40ms steps, total <500ms; no sliding/gliding). Respect `prefers-reduced-motion` (no animation). Nothing else animates.
- Browser surfaces: `::selection { background:#C8102E; color:#fff }`, `caret-color:#C8102E`, focus-visible = 2px solid #C8102E outline offset 2px, link underline-offset 3px, accent-color #C8102E for range inputs.
- Touch targets ≥ 48px. Mobile-first; max content width 720px centered on desktop with the red band full-bleed.

## Page structure (src/pages/index.astro, components in src/components/)
0. `<head>`: title "Dvojče — evropská dvojčata amerických ETF", meta description (Czech, ~150 chars), OG tags (og:title, og:description, og:image `/og.png` placeholder path, og:locale cs_CZ), theme-color #C8102E, canonical. Inline tiny script BEFORE body paint: reads `utm_content` from URL; if `ad_poplatky` sets `document.documentElement.dataset.variant="poplatky"` else "zakaz". CSS shows the matching hero. Also store utm params in `window.__dvojce = {utm:{...}, variant}`.
1. **Header band** (red, full-bleed): left "Dvojče" (Barlow 800, white), right mono white small "Kurzovní lístek dvojčat · č. 197 · 13. 10. 2026" (date from etfs.json as_of via formatDateCz; "č. 197" is the ČNB bulletin number of the same day — keep as is).
2. **Hero ZÁKAZ** (default): H1 + sub from copy.md §1, then prompt "Který fond jste chtěli koupit?" + right "7 položek" (mono small), then **RateTable** island (§3 below), then micro text.
   **Hero POPLATKY** (variant): H1 + sub from copy.md §1b, then the **FeeCalculator** island directly; below it a line "Nebo najděte dvojče svého fondu ↓" linking to #lístek. In this variant the rate table section appears after the calculator.
3. **RateTable** (Preact island, `client:load`, id="lístek"): columns ZEMĚ | BURZA | KÓD | TER | DVOJČE (header row: 11px mono uppercase #4A4A4A). Rows for VOO SPY IVV VTI VT SCHD VWO from etfs.json: USA · NYSE Arca · ticker (mono 18px 500) · TER formatted · "▸ SXR8" (twin primary ticker, Xetra). Entire row is a `<button>` (aria-expanded). Tapping expands an inline **ResultPanel** directly under that row (only one open at a time), scrolls it into view if needed.
   **ResultPanel** content (copy.md §2, adapted to this world; no kicker):
   - Verdict line in red: "{{ticker}} z Česka jako drobný investor nekoupíte." + one-sentence why (KID/PRIIPs), no inline source tag.
   - Twin block styled as a bulletin entry: twin full name (Barlow 700, 22px), tickers line mono "SXR8 · Xetra (EUR)   CSPX · Londýn (USD)", then a 2-col mini table: Index / Shoda (same/similar/approximate label in Czech) / TER (twin vs original) / Dividendy (Akumuluje / Vyplácí) / Velikost fondu (formatted "141,2 mld. EUR") / Sídlo (Irsko, UCITS). Values carry no inline source tag. If match != same, show the honest note sentence.
   - Alt twin (if any) as a single line "Alternativa: VUAA · Vanguard S&P 500 UCITS · TER 0,07 %".
   - **Lead teaser + LeadForm** (copy.md §2 "Co dál?"): heading "Pošleme vám úplný lístek na míru." (override), 3 locked items with lock SVG, then LeadForm.
4. **FeeCalculator** (Preact island, `client:visible` except in poplatky variant hero where it's `client:load` — simplest: always client:load, it's tiny), section heading + sub from copy.md §3. Two range sliders (styled: 2px ink track, square 24px red thumb, labels mono values "5 000 Kč", "20 let"). Result as a 3-row bulletin table: "Bankovní fond (AMUNDI CR IM AKCIOVÝ)" → lostBank; "ETF dvojče" → lostEtf; double rule; "Rozdíl" → difference in BIG red mono (40px). Assumption line always visible (copy.md §3) with source tags to KID + XTB. Under it CTA button "Chci rozpis po letech + nejlevnějšího brokera" which reveals an inline LeadForm right there (no modal).
   Calculator must call src/lib/calc.ts feeImpact. Update results live on input (no button). Fire analytics `calculator_used` once (first change) with values.
5. **Facts** section: heading "Tři věci, které vám YouTube neřekne", three numbered bulletin entries (numbers are meaningful here as a list; mono "1", "2", "3") from copy.md §4, no inline source tags (PRIIPs: justETF + finhacker; twins: justETF; tax: zakonyprolidi § 4 are listed in the collapsed sources section).
6. **Full comparison** section (copy.md §5): a dense rate table NYSE fund | TER | Dvojče | TER | Shoda for all 7; on mobile it's the same table with smaller mono (13px) and horizontal fit (no horizontal scroll at 360px — abbreviate headers). No footnotes on the landing page (sources in the collapsed section).
7. **Plan preview** (copy.md §6): heading, the 5-item list rendered as a mock "lístek" excerpt (a bordered printed sheet preview with blurred-out/greyed lines for locked content — use real structure, mark synthetic sample values "ukázka"), then LeadForm again.
8. **FAQ** (copy.md §7) as `<details>` elements, ink rules between.
9. **Footer** (copy.md §8) + link to /soukromi.
10. **Sticky bottom CTA** (mobile only, appears after the user scrolled past the hero AND has not submitted): a slim red bar "Pošlete mi plán zdarma" that scrolls to the nearest form (prefer the open ResultPanel form, else #plan form). Hidden when any form is in viewport.

## LeadForm (Preact component, reused)
- One field: email (type=email, autocomplete=email, inputmode=email, placeholder "váš@email.cz", visible label "E-mail" small mono above), honeypot input name="website" visually hidden (not display:none; off-screen, tabindex -1, aria-hidden).
- Button full-width red bg #C8102E white text Barlow 700 18px "Poslat plán zdarma", height 52px. Loading state "Posílám…" (disabled). Error state: red text under field from API error or "Něco se pokazilo. Zkuste to prosím znovu." Network failure handled.
- Microcopy under button (copy.md §2, 13px #4A4A4A) with link /soukromi.
- POST /api/lead with {email, fund (current selected ticker or null), monthly, years (current calculator values), variant, utm, website}. Shared state via a tiny module store (src/lib/store.ts with simple pub/sub) so all islands know selected fund + calculator values + submitted flag.
- On success: replace ALL forms with the success state (copy.md §9) and reveal the **PlanView** inline right there (same component used by /plan page) — then `location.hash` not changed. Fire `lead_submitted`.
- Fire `email_focus` once on first focus, with `form_location` property ("result" | "calculator" | "plan").

## PlanView (src/components/PlanView.tsx) + /plan page
Stateless plan from params f (ticker), m (monthly), y (years). Sections: (1) Vaše dvojče (twin details + both tickers), (2) Kde koupit — broker table from costs.json (XTB, DEGIRO, Trading 212 FX only, IBKR, Fio) columns Broker | Poplatek za nákup | Převod měny | Zdroj — use "neověřeno" where null; (3) Poplatky po letech — table year | bank lost | ETF lost (every 5 years + final) from calc yearly series; (4) Daňový checklist — časový test + 100k limit with law refs; (5) 5 kroků k prvnímu nákupu (author concise Czech steps: vybrat brokera → založit účet a ověřit totožnost → poslat Kč → nakoupit {{ticker_xetra}} na Xetře (nebo nastavit investiční plán) → držet min. 3 roky, evidovat datum nákupu). Footer disclaimer. "Uložit jako PDF" button = window.print() with a print stylesheet (white, black, no band background issues).
`src/pages/plan.astro`: static page that renders PlanView client-side from URL params (client:load), noindex meta.

## /soukromi page
Czech privacy notice (Zásady zpracování osobních údajů): controller "{{CONTROLLER_NAME}}, kontakt: {{CONTROLLER_EMAIL}}" (keep these literal placeholders — I will fill them), purpose (zaslání plánu, případně občasné aktualizace), legal basis (čl. 6 odst. 1 písm. b) GDPR – plnění na žádost subjektu; for occasional updates oprávněný zájem / odhlášení kdykoli), data (e-mail, zvolený fond a parametry výpočtu, UTM údaje), processors (Supabase – EU Frankfurt, Brevo – EU, Vercel hosting, PostHog EU – anonymní statistika bez cookies), retention 30 days (demo projekt), rights (přístup, výmaz, námitka, stížnost u ÚOOÚ), cookies: none. Same visual world, simple.

## Analytics (src/lib/track.ts) — no library
- `track(event, props)` → `fetch('https://eu.i.posthog.com/i/v0/e/', {method:'POST', keepalive:true, body: JSON.stringify({api_key: import.meta.env.PUBLIC_POSTHOG_KEY, event, distinct_id, properties:{...props, $current_url, variant, utm_*, $process_person_profile:false}})})`. If no key → console.debug only.
- `distinct_id`: random UUID kept ONLY in memory (no cookies, no localStorage) → cookieless, no consent banner needed. (/plan page has its own id; fine.)
- Events: `landing_view` (on load, with variant, utm, viewport width, referrer domain), `fund_selected` (ticker, position), `result_shown` (ticker), `calculator_used` (once; monthly, years), `cta_clicked` (location), `email_focus` (location), `lead_submitted` (location, fund, variant), `lead_error` (reason), `scroll_depth` (25/50/75/100, once each), `faq_opened` (question idx), `source_clicked` (domain), `sticky_cta_clicked`.
- Put event names + their order as the funnel definition in docs/analytics.md (I will build the PostHog funnel from it).

## Quality gates (do all before reporting)
- `npm test`, `npx astro check`, `npx tsc --noEmit` pass.
- Run `npx astro dev` and screenshot with headless Edge (`"C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe" --headless=new --disable-gpu --hide-scrollbars --window-size=390,844 --screenshot=<abs png> <url>`), at least: `/` (390x844 first viewport), `/` full page at 390 wide (use --window-size=390,6000), `/?utm_content=ad_poplatky` first viewport, `/` at 1440x900, `/plan?f=VOO&m=5000&y=20` at 390 wide tall. Save into `.impeccable/review/` as mobile.png (full page 390), mobile-first.png, mobile-poplatky.png, desktop.png (1440 wide full page via --window-size=1440,5000), plan.png. Open each with the Read tool and fix obvious defects ONCE (overflow, broken diacritics, contrast, layout breaks).
- Interactive states can't be screenshotted easily headless; at least make sure the ResultPanel can be server-rendered open for review: support `/?open=VOO` query param that opens that row on load (also useful for ads deep-link). Screenshot `/?open=VOO` full page at 390 too → mobile-open.png.
- Run `"$HOME/.claude/skills/impeccable/scripts/impeccable" detect --json src` once at the end and fix mechanical findings.
- Commit in logical steps (layout+fonts+tokens; rate table+result; calculator; lead form+plan; analytics; pages) — each message ends with:
  Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>
  Also commit ads/README.md separately ("Add ad copy for both variants").
