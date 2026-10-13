# Research notes: ETF landing page facts (fetch date 2026-10-13)

Companion to `facts.json`. Only values from pages fetched in this session are marked `fetched`. Search-summary values are marked `search_only` and should not be published as fact.

## Verified (fetched)

- **ČNB rates, 13.10.2026 #197:** USD 21.788 CZK, EUR 24.375 CZK. UTF-8, pipe-separated, decimal comma.
- **CORS:** `Access-Control-Allow-Origin: apl.cnb.cz`. The rates file cannot be read directly from a landing page on another origin; use a server-side proxy or build-time fetch.
- **Time test:** § 4 odst. 1 písm. u) ZDP, 3-year limit. The quoted wording ("přesáhne-li ... 3 let") needs checking against the official text, since the fetch summary read the exemption direction the opposite way.
- **100 000 Kč limit:** § 4 odst. 1 písm. t) ZDP, total securities sale income per tax year.
- **40 mil. Kč cap:** § 4 odst. 3 applies to crypto assets (písm. zk), not securities. The user's assumption does not hold for ETFs; drop it from the page.
- **XTB ETFs:** 0 % up to 100 000 EUR monthly turnover, then 0,2 % (min. 10 EUR); FX conversion 0,5 % "may be charged".
- **DEGIRO:** Core Selection 0 EUR + 1 EUR handling; Global 2 EUR + 1 EUR handling; FX 0,25 %; inactivity 0 EUR; page dated 01-10-2025. No Xetra/LSE split.
- **justETF (2018 article):** explains the KID block, the brokers' removal of US ETFs, and the sophisticated-investor exception (broker-decided). Old source, use only as background.

## Not verified (landing page must not state these yet)

- **Broker help pages on US ETF restrictions:** IBKR, XTB, Trading 212 and DEGIRO help pages were not fetched (403/404 or not found). The only fetched explainer is justETF from 2018.
- **Trading 212, IBKR and Fio fees:** all blocked (403) or absent (Fio homepage only). Search snippets conflict (IBKR FX 0,20 % vs 0,03 %).
- **Czech tax on foreign ETF dividends and the CZ–US 15 % treaty rate:** the § 36 fetch was cut off before the paragraph. Search sources disagree (one says the US treaty no longer applies).
- **Irish UCITS withholding:** blog sources only.
- **Market statistics:** no ETF investor count found; fund-asset figure is from a search snippet.

## Next steps

1. Re-fetch the EUR-Lex regulation, the IBKR/Trading 212 fee pages and the § 36 text from a different URL or with a browser.
2. Verify the § 4 odst. 1 písm. u) direction against the official text and financnisprava.cz before the page says "exempt after 3 years".
3. Keep the ČNB rate call server-side; the browser will be blocked by CORS.
