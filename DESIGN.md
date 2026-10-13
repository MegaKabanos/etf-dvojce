---
name: Dvojče
description: Kurzovní lístek dvojčat, a ČNB-style daily rate sheet that quotes every US ETF's European twin like a currency.
colors:
  bulletin-red: "#c8102e"
  ink-black: "#111111"
  paper-white: "#ffffff"
  ink-secondary: "#4a4a4a"
  rule-minor: "#d9d9d9"
  tint-hover: "#f5f5f5"
  tint-pressed: "#ededed"
typography:
  display:
    fontFamily: "Barlow Semi Condensed, Arial Narrow, Arial, sans-serif"
    fontSize: "44px"
    fontWeight: 800
    lineHeight: 0.98
    letterSpacing: "-0.01em"
  headline:
    fontFamily: "Barlow Semi Condensed, Arial Narrow, Arial, sans-serif"
    fontSize: "30px"
    fontWeight: 800
    lineHeight: 1.05
    letterSpacing: "-0.005em"
  title:
    fontFamily: "Barlow Semi Condensed, Arial Narrow, Arial, sans-serif"
    fontSize: "22px"
    fontWeight: 700
    lineHeight: 1.15
  body:
    fontFamily: "Barlow Semi Condensed, Arial Narrow, Arial, sans-serif"
    fontSize: "17px"
    fontWeight: 500
    lineHeight: 1.45
  data:
    fontFamily: "Roboto Mono, ui-monospace, Menlo, Consolas, monospace"
    fontSize: "13px"
    fontWeight: 500
    lineHeight: 1.45
rounded:
  none: "0px"
spacing:
  gutter: "16px"
  section: "40px"
components:
  button-primary:
    backgroundColor: "{colors.bulletin-red}"
    textColor: "{colors.paper-white}"
    rounded: "{rounded.none}"
    height: "52px"
    padding: "0 16px"
  button-outline:
    backgroundColor: "{colors.paper-white}"
    textColor: "{colors.ink-black}"
    rounded: "{rounded.none}"
    height: "52px"
    padding: "0 16px"
  rate-row:
    backgroundColor: "{colors.paper-white}"
    textColor: "{colors.ink-black}"
    height: "48px"
    padding: "6px 0"
  rate-row-hover:
    backgroundColor: "{colors.tint-hover}"
    textColor: "{colors.ink-black}"
  rate-row-pressed:
    backgroundColor: "{colors.tint-pressed}"
    textColor: "{colors.ink-black}"
  verdict:
    backgroundColor: "{colors.bulletin-red}"
    textColor: "{colors.paper-white}"
    rounded: "{rounded.none}"
    padding: "8px 12px 7px"
  lead-input:
    backgroundColor: "{colors.paper-white}"
    textColor: "{colors.ink-black}"
    rounded: "{rounded.none}"
    height: "52px"
    padding: "0 12px"
  sticky-cta:
    backgroundColor: "{colors.bulletin-red}"
    textColor: "{colors.paper-white}"
    height: "52px"
---

# Design System: Dvojče

## Overview

**Creative North Star: "The Daily Rate Sheet"**

Dvojče is a ČNB-style daily bulletin (kurzovní lístek). Each NYSE-listed ETF is quoted the way a currency is: a ticker row on a white sheet, a black ink figure, and a European twin "rate" printed beside it. The surface reads as printed matter rather than product UI. White paper, black ink doing every job, one red band across the top, hairline rules as the only ornament, and figures in a monospace face so they align like columns in a published table.

The density is deliberate. Rows are the vertical axis of the page. A 48px row is both the reading unit and the tap target. Numbers are the heroes, and each one carries a footnote back to its source, the way a bulletin footnote does. Nothing rounds, glows, or floats. The page does not use a fintech hero, pill buttons, or rounded cards.

Motion is almost absent. The only authored motion is a digit-step settle on a figure revealed by a tap, and it respects reduced motion.

Where the build and the direction contract differ, the build is recorded here: the header band carries no bulletin number (the contract's "č. 197" is not built); the rate sheet lists its sources in a notes line under the table rather than a tag on every cell; and red also marks the key fee-difference figure, beyond the contract's list.

**Key Characteristics:**
- Flat white sheet: no shadows, no radius, no gradients.
- One ink (#111111) for all printed matter; one red (#c8102e) with a closed job list.
- Hairline rules in four weights form all structure.
- Figures and tickers in Roboto Mono, tabular and right-aligned.
- Each figure carries a footnote tag linking to its source.
- Digits step into place on reveal; nothing glides.

## Colors

The palette is a two-ink bulletin: black ink on white paper, with one red. The greys are not a palette in their own right. They are rule weights and row tints.

### Primary
- **Bulletin Red** (#c8102e): The single accent. Used for the header band, the verdict stamp, the primary action (lead submit and the mobile sticky bar), the key fee-difference figure, the focus outline, and text selection.

### Secondary
Omitted: the build has one accent.

### Tertiary
Omitted: the build has no third colour.

### Neutral
- **Bulletin Ink** (#111111): All body text, headings, and figures; every structural rule; input and outline borders; the slider track and thumb.
- **Paper White** (#ffffff): Page and surface background; text colour on red.
- **Ledger Grey** (#4a4a4a): Secondary copy, table column heads, notes lines, source tags, and sub-annotations inside tables. Never the primary reading colour.
- **Rule Grey** (#d9d9d9): Row separators inside tables and lists; bars on locked plan rows.
- **Tint Hover** (#f5f5f5): Rate row hover, and the background of the open rate row.
- **Tint Pressed** (#ededed): Rate row while pressed.

### Named Rules
**The One Ink Rule.** Black ink does every printed job. Ledger grey is for metadata and secondary copy only. The greys that remain are rule weights and row tints, never a second text colour.

**The Red Duty Rule.** Red has a closed job list: header band, verdict, primary action, key result figure, focus, and selection. Red is never body text, a decorative fill, or a card accent.

## Typography

**Display Font:** Barlow Semi Condensed (with Arial Narrow, Arial, sans-serif fallbacks)
**Body Font:** Barlow Semi Condensed (same stack)
**Label/Mono Font:** Roboto Mono (with ui-monospace, Menlo, Consolas, monospace fallbacks)

**Character:** A tight, condensed grotesque for headlines and running copy, set against a plain monospace for figures. The pairing reads like a printed table of prices: words in the sans, numbers in the mono, with tabular alignment. Both families are self-hosted through @fontsource (Barlow 500 to 800; Roboto Mono 400 to 700).

### Hierarchy
- **Display** (800, 44px fixed, line-height 0.98, letter-spacing -0.01em): The landing H1 ("VOO z Česka nekoupíte. Jeho dvojče ano."). The plan and legal page H1 drops to 40px. The size is fixed, not a clamp.
- **Headline** (800, 30px, line-height 1.05): Section titles (H2). Section H2s on the plan drop to 24px.
- **Title** (700, 22px, line-height 1.15): Twin name (H3) and legal section H2s.
- **Body** (500, 17px, line-height 1.45): Hero subline (max 34em), section sublines, the result "why" line, and FAQ and facts copy at 17 to 18px. Body weight is 500, not 400.
- **Data** (Roboto Mono 500, 13px, tabular-nums): Rate rows and table values; ticker codes at 18px. Notes lines and source tags sit at 11px.
- **Label** (Barlow 700, 17px for the label-row question; Roboto Mono 11px uppercase, 0.04em tracking, for the counter and column heads): Uppercase appears only in table column heads, the label-row counter, and the verdict stamp.

### Named Rules
**The Figures Stay Mono Rule.** Every number, ticker, TER, date, and currency amount in a table or result is set in Roboto Mono with tabular figures and aligned right in columns.

**The Step Not Glide Rule.** A figure that changes or reveals changes by digit: ten steps of 40 ms, left to right. No sliding and no count-up easing. Under reduced motion the final value shows at once.

## Layout

A single column, 720px maximum (`--wrap`), with 16px side gutters. From 1024px the page container widens to 960px, and the rate sheet and the comparison table widen with it. Other sections stay at 720px. The rate sheet is the only element that takes the wider measure.

Sections stack with 40px vertical padding and a 1px ink rule above each. The first viewport holds the header band, the landing hero, and the top of the rate sheet. The first hero row starts about 24px below the band.

The rate sheet is a five-column grid: 36px, 72px, 52px, 56px, and a fluid column, with 10px column gaps. Rows are at least 48px tall. The fixed columns leave the fluid column the remainder: about 72px at 360px viewport width, so the twin code and its TER share one line with an ellipsis.

Variant ordering: `utm_content=ad_poplatky` sets `data-variant="poplatky"`. CSS `order` then moves the fee calculator above the rate sheet and swaps the hero. All other pages keep one order.

Breakpoints: 720px hides the mobile sticky bar; 1024px is the desktop width step.

Spacing values in use run from 4px to 40px. Apart from the 16px gutter and the 40px section padding, there is no tokenised spacing scale. Read the rhythm from the rules and rows, not from a scale.

## Elevation & Depth

The system is flat. No `box-shadow`, `text-shadow`, `filter`, or gradient appears in the shipped CSS or components. Depth is conveyed by rule weight and by inversion: the red header band and the mobile sticky bar are the only filled surfaces that sit above the sheet.

### Rule Weights (the ladder)
- **Row separator** (1px, Rule Grey): Between rate rows, key-value rows, plan rows, and checklist rows.
- **Section and panel rule** (1px, Bulletin Ink): Section tops, the result panel bottom, the twin card border, the calculator sheet border.
- **Heading rule** (2px, Bulletin Ink): Label-row underline, table column-head underline, the verdict stamp borders, the footer top.
- **Total rule** (3px double, Bulletin Ink): The rule above the fee-difference figure.

### Named Rules
**The Hairline Ladder Rule.** Structure is drawn with these four rule weights and nothing else. A border that does not sit on one of these rungs is decoration.

**The Flat Sheet Rule.** Surfaces stay flat at rest and on hover. Hover changes the row tint only.

## Shapes

Every element has a 0 border radius: buttons, inputs, the range thumb, rate rows, and the e-mail button. Forms are rectangles. Borders are hairlines (1px), or outline strokes (2px for the secondary button). The range slider is a 2px ink track with a 24px square ink thumb. The error state is a 3px ink left rule, not a tinted box. Tables use rules instead of fills.

### Named Rules
**The Square Corner Rule.** No element rounds its corners. A rounded corner anywhere on the page is outside the system.

## Components

### Buttons
- **Shape:** Square, 0 radius, full width on mobile.
- **Primary (lead submit):** Bulletin Red fill, Paper White text, Barlow 700 18px, 52px minimum height, 0 16px padding. The only filled button on the page. Busy state: the label becomes "Posílám…", opacity 0.85, cursor progress.
- **Hover / Focus:** No hover treatment is defined on the primary. Focus uses the global 2px red outline, offset 2px.
- **Outline (secondary):** 2px Bulletin Ink border, Paper White fill, ink text, Barlow 700 17px, 52px height. Used for the calculator's call to action and the PDF button on the plan.

### Rate Row (signature)
- **Shape:** Full-width row, 48px minimum height, 6px vertical padding, 1px Rule Grey bottom rule.
- **Content:** Country, exchange, ticker (18px), TER, and the twin code with its TER; Roboto Mono 13px throughout except the ticker.
- **Hit area:** The whole row is one button laid over the cells. The cells pass clicks through.
- **States:** Hover Tint Hover; pressed Tint Pressed; open row Tint Hover, with its bottom rule removed and the result panel set directly beneath it under an ink rule.
- **Focus:** Global red outline, inset 2px.

### Verdict
- Bulletin Red stamp, Paper White text, uppercase Barlow 700 20px with 0.04em tracking, 2px ink top and bottom rules, 8px 12px 7px padding.

### Twin Card
- 1px ink border, 16px and 14px padding. A key-value table: labels at 42% width in Ledger Grey, values in ink, 1px Rule Grey row separators. Rows: index, match, TER, distribution, fund size, seat. Figures carry footnote tags.

### Source Tag
- A superscript footnote number in Roboto Mono 11px, Ledger Grey, with a 1px underline. Each table or panel closes with a notes line that lists the full source label and its date in 11px mono.

### Inputs / Fields
- **Style:** 52px tall, 1px ink border, Paper White, 0 radius, Barlow 500 18px. Placeholder in mid-grey (#767676).
- **Focus:** Global red outline. No separate focus treatment.
- **Error:** Message in Barlow 600 15px with a 3px ink left rule. The field carries `aria-invalid`.

### Fee Calculator Sliders
- 44px hit height, 2px ink track, 24px square ink thumb. Labels in Barlow 700 17px; live values in mono.

### Fee Difference
- The result figure is set in Bulletin Red, Roboto Mono 500, 40px (52px in the poplatky variant), tabular, beneath a 3px double rule.

### Sticky CTA
- Mobile only; hidden at 720px and up. Fixed to the bottom edge, Bulletin Red, Paper White Barlow 700 17px, 52px height, with safe-area padding. It appears once the rate sheet has scrolled away and no lead form is in view.

### Plan Teaser (sheet)
- A 1px ink-bordered sheet with a head row over a 2px rule. Numbered rows in mono 13px. Locked rows are set in Ledger Grey with Rule Grey bars in place of content.

### FAQ
- Native disclosures, each with a 1px ink top rule and a 19px Barlow 700 summary. The marker is a mono "+", which becomes "–" when open.

### E-mail
- The transactional message reuses the same hex values and square corners: a Bulletin Red masthead band and a Bulletin Red button with 0 radius. Mail clients cannot load the web fonts, so the message uses its own mail-safe type stack.

### Do's and Don'ts

### Do:
- **Do** set every number and ticker in Roboto Mono with tabular figures, right-aligned in columns (`.mono`, `.r`).
- **Do** keep all printed text in Bulletin Ink (#111111). Use Ledger Grey (#4a4a4a) only for metadata, column heads, and notes.
- **Do** draw structure with the four-rung rule ladder.
- **Do** keep rate rows at least 48px tall, buttons at least 52px, and sliders at least 44px.
- **Do** attach a source to every figure in the result, the calculator, the plan, and the comparison: a footnote tag or a notes line.
- **Do** reveal changed figures by digit steps (40 ms per step, ten steps), and skip the motion under prefers-reduced-motion.

### Don't:
- **Don't** add `border-radius`, `box-shadow`, `text-shadow`, or gradients to any element.
- **Don't** use red for body text, decorative fills, or any job beyond the Red Duty list.
- **Don't** introduce a second accent colour.
- **Don't** set numbers in the Barlow sans inside tables; figures stay in Roboto Mono.
