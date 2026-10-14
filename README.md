# Dvojče — evropská dvojčata amerických ETF

Američtí investoři mají VOO, SPY nebo VTI. Čeští drobní investoři je ale u běžného brokera nekoupí, protože jim chybí povinný dokument KID. Dvojče řeší jednu konkrétní otázku: který evropský fond (UCITS) sleduje stejný index, kolik stojí, a kolik korun vám za 20 let vezmou poplatky bankovního fondu oproti ETF. Odpovědi jsou se zdrojem: všechny zdroje v rozbalovací sekci Zdroje dat na konci stránky. Plán na míru dostanete za jeden e-mail.

- **Živá stránka:** https://etf-dvojce-ashen.vercel.app
- **Repozitář:** https://github.com/MegaKabanos/etf-dvojce
- **Reklamní verze A a B:** viz [ads/README.md](ads/README.md) (texty, `utm_content`, obrázky)
- **Měření a trychtýř:** [docs/analytics.md](docs/analytics.md)

## Cílová skupina

Lidé ve věku 22–40 let z ČR, kteří investují nebo plánují investovat 2 000–10 000 Kč měsíčně. Znají US tickery z anglického obsahu (YouTube, Reddit, X), ale nevědí, proč je nemohou koupit. Přicházejí z Meta reklamy na mobilu, s několika vteřinami pozornosti.

Podpora z průzkumu AMF / BVA Xsight *Investment scams in France* (říjen 2024, 5 001 respondentů, Francie):

| Údaj | Hodnota | Slide |
|---|---|---|
| Po investiční reklamě hledali další informace (populace / 18–24) | 35 % / 45 % | 22 |
| Po investiční reklamě zanechali kontakt (populace / 18–24) | 13 % / 24 % | 22 |
| Důvěra v influencery (18–34 vs. populace) | 30 % vs. 13 % | 43 |

**Výhrady.** Průzkum je z Francie, týká se atypických investic (ne ETF) a jde o self-report. Čísla bereme jako **směr, ne benchmark**. Neříkají nic o konverzi landing page.

**Co z toho plyne pro design.** Stejná skupina je nejvíc ohrožená podvody: 68 % obětí je ve věku 18–34 let, a podvody stojí na „garanci", „rychlých ziscích" a „bez rizika". Dvojče proto dělá opak. Nedává žádný slib výnosu, zhodnocení v kalkulačce je jen označený předpoklad (7 %), zdroje jsou v rozbalovací sekci Zdroje dat na konci stránky a jméno konkrétního fondu s KID. Důvěryhodnost je konverzní faktor i etická povinnost.

## Co návštěvník získá a kdy žádáme kontakt

**Zdarma před formulářem:** verdikt „nelze koupit", karta evropského dvojčete (tickery, TER, index), číslo poplatků v korunách z kalkulačky.

**Za e-mail (plán na míru):** vaše dvojčata a tickery na Xetře a v Londýně, srovnání brokerů, poplatky po jednotlivých letech, daňový checklist, 5 kroků k prvnímu nákupu.

**Kdy se ptáme:** formulář je uvnitř karty výsledku, hned po „aha" momentu, a po kalkulačce. Nikdy při příchodu, žádné pop-upy. Lepicí CTA lišta se objeví po přejetí tabulky. Formulář má **jedno pole** (e-mail).

**Po odeslání:** plán se hned zobrazí na stránce, pošleme e-mail s bezstavovým odkazem na plán a odkazem na odhlášení.

## Pořadí sekcí a proč

Výchozí varianta (zákaz):

1. **Hero + tabulka fondů** — reklama slibuje „VOO nekoupíte", stránka to pokračuje stejným nadpisem. V první obrazovce je červené tlačítko „Pošlete mi plán zdarma" (zákaz): otevře řádek VOO a přesune návštěvníka na formulář výsledku s fokusem na e-mail. Náhled výsledku je vidět ještě před ťuknutím.
2. **Panel výsledku s formulářem** — první „aha" (verdikt + dvojče) a první výzva ve chvíli, kdy má návštěvník hodnotu v ruce.
3. **Kalkulačka poplatků** — druhý háček (peníze) a druhá výzva pro ty, kdo nejdřív nevyberou fond.
4. **Tři fakta** — důvěra: proč to tak je.
5. **Srovnávací tabulka** — důkaz pro skeptiky, který si mohou prohlédnout detaily.
6. **Náhled plánu** — co přesně dostanou za e-mail; závěrečná výzva.
7. **FAQ** — námitky (zdarma? kdo za tím stojí? co s e-mailem?).
8. **Zdroje dat** — jedna sbalená sekce (rozbalovací „Zdroje dat a metodika (N)"): věta o datu a předpokladu 7 % a seznam všech zdrojů jednou, s daty a odkazy. Pod ní patička s právním upozorněním a odkazem na zpracování dat.

Lepicí CTA (mobil) se objeví až po přejetí tabulky a zmizí, když je některý formulář vidět — výzva je dostupná, ale nikdy nepřekrývá obsah.

Varianta poplatky (ad B): kalkulačka je první pod hero s velkým číslem v Kč, tabulka fondů až za ní. Zpráva reklamy (687 000 Kč) tak sedí na první obrazovku.

## Reklamy

| Verze | `utm_content` | Hero | Háček |
|---|---|---|---|
| A — Zákaz | `ad_zakaz` | „VOO z Česka nekoupíte. Jeho dvojče ano." + výběr tickeru | zvědavost, frustrace z chyby |
| B — Poplatky | `ad_poplatky` | „Kolik vás stojí poplatky? V korunách. Za 20 let." + kalkulačka | konkrétní číslo v Kč |

Hero se přepíná podle `utm_content` (message match): reklama slíbí, co stránka hned ukáže. Obrázky: [ads/ad-a-zakaz-4x5.png](ads/ad-a-zakaz-4x5.png), [ads/ad-a-zakaz-9x16.png](ads/ad-a-zakaz-9x16.png), [ads/ad-b-poplatky-4x5.png](ads/ad-b-poplatky-4x5.png), [ads/ad-b-poplatky-9x16.png](ads/ad-b-poplatky-9x16.png). Úplné texty a odůvodnění jsou v [ads/README.md](ads/README.md).

## Data a zdroje

Landing page necituje zdroj u každého čísla. Všechny zdroje jsou v rozbalovací sekci Zdroje dat na konci stránky a jsou v ní vedle sebe s daty a odkazy. Plán, který se zobrazí po odeslání e-mailu, uvádí zdroje u jednotlivých hodnot. Výnosy se nikde nezobrazují jako data. Kalkulačka používá explicitní předpoklad 7 % ročně před poplatky.

| Data | Zdroj | Datum |
|---|---|---|
| US ETF (burza, TER, index, AUM) | stockanalysis.com, stránky správců | 13. 10. 2026 |
| UCITS dvojčata (ISIN, TER, velikost, tickery) | justETF | 13. 10. 2026 |
| Bankovní fond AMUNDI CR IM AKCIOVÝ (C) | KID z 30. 9. 2022, staženo 13. 10. 2026 | 30. 9. 2022 |
| Brokeři: XTB (poplatky, FX 0,5 %), IBKR | ceníky brokerů | 13. 10. 2026 |
| Brokeři: DEGIRO | degiro.cz/poplatky | 1. 10. 2025 |
| Brokeři: Fio (0,15 %, min. 9,95 EUR) | ceník Fio | 28. 7. 2020 |
| Brokeři: Trading 212 (FX 0,15 %) | komunitní oznámení | 2. 3. 2021 |
| Daň: časový test a limit 100 000 Kč | zákon č. 586/1992 Sb., § 4 odst. 1 písm. u) a t) | platné znění |
| PRIIPs / KID omezení | justETF, finhacker.cz | 2018 (justETF), finhacker.cz (bez data) |
| Kurzy EUR a USD | ČNB, denní kurz | 13. 10. 2026 |

US ETF hodnoty pocházejí ze stockanalysis.com (sekundární zdroj, ověřeno proti stránkám správců u VOO); klíčové hodnoty — TER dvojčat (justETF), KID bankovního fondu, znění zákona a kurz ČNB — byly ověřeny přímo u zdroje.

**Vzorec poplatků.** Každý měsíční vklad se sníží o vstupní poplatek a o konverzi měny. Portfolio se každý měsíc zhodnotí o 7 % ročně (měsíčně složeně) a sníží o roční náklady (`(1 − náklady)^(1/12)` za měsíc). Poplatky = hodnota bez nákladů − hodnota s náklady. Bankovní fond: vstup 5 %, průběžné náklady 2,33 % + transakční 0,01 %. ETF: TER 0,07 % + konverze 0,5 %.

**Referenční výsledek** (5 000 Kč měsíčně, 20 let, celkem vloženo 1 200 000 Kč):

| | Hodnota portfolia | Poplatky |
|---|---|---|
| Bez poplatků | 2 552 030 Kč | — |
| Bankovní fond | 1 830 700 Kč | 721 330 Kč |
| ETF dvojče | 2 517 634 Kč | 34 396 Kč |
| **Rozdíl** | | **686 934 Kč** |

## Měření

Analytika je **bez cookies** (PostHog EU, přímé API volání, bez SDK, bez localStorage). Každý page load je nová anonymní návštěva. Události:

`landing_view` → `fund_selected` nebo `calculator_used` → `result_shown` → `email_focus` → `lead_submitted`

Všechny události nesou `variant`, `utm_source`, `utm_medium`, `utm_campaign` a `utm_content`, takže trychtýř lze dělit podle reklamy. Úplná definice je v [docs/analytics.md](docs/analytics.md).

**Proč bez cookies.** Bez cookies není potřeba cookie lišta, takže nepřijde o část návštěvníků hned na začátku. Bez cookies a bez localStorage odpadá povinnost souhlasu podle ePrivacy; data jsou minimalizovaná (žádné profily osob, `$process_person_profile: false`, PostHog EU). IP adresu technicky vidí poskytovatel analytiky — to je uvedeno v zásadách zpracování.

Leady se ukládají do Supabase (EU) s UTM parametry. Zdroj leadu je tedy atribuovatelný i na serveru, nezávisle na analytice.

## Očekávaná konverze

**Benchmark (ověřeno).** Unbounce Conversion Benchmark Report 2020 (`https://unbounce.com/conversion-benchmark-report-2020/`) uvádí medián konverze **3,2 %** pro všechny analyzované landing pages a **25 %** pro top 25 %. „Konverze" je v něm libovolná žádaná akce (nákup, stažení, přihlášení). Medián pro finance a pojištění z této stránky ověřit nelze, je jen v grafech. Novější čísla z reportu 2024 jsme nenašli v ověřitelné podobě, proto je nepoužíváme.

**Odhad pro Dvojče** (studený paid social, mobil, základní případ):

| Krok | Podíl | Na 1 000 návštěv |
|---|---|---|
| landing_view | 100 % | 1 000 |
| první interakce (ťuknutí na fond nebo kalkulačku) | 45 % | 450 |
| result_shown | 38 % | 380 |
| email_focus | 12 % | 120 |
| lead_submitted | **5 %** (rozsah 3–7 %) | **50** |

**Proč tolik.** Nástroj je interaktivní a hodnota přichází před výzvou, což konverzi zvedá. Studený finanční provoz na mobilu ji naopak snižuje, zejména v prvním kroku. Odhad je **odhad k ověření**: prvních 1 000 návštěv ukáže, jestli jsme blízko.

## A/B hypotézy (seřazeno podle očekávaného dopadu)

Velikost vzorku: baseline 5 %, síla 80 %, α = 0,05 (dvoustranně), dvouvýběrový test podílů, na jednu variantu. Pro metriky s jiným výchozím podílem je uvedeno zvlášť.

**1. Vstup do stránky** (největší propad je v první obrazovce)
- Hypotéza: Pokud místo tabulky tickerů dáme v první obrazovce jedno velké číslo v Kč a jedno CTA, pak víc lidí udělá první interakci, protože hned vidí hodnotu, kvůli které zůstali.
- Primární metrika: první interakce (`first interaction rate`).
- Očekávaný efekt: +10 až +20 p. b. na první interakci (45 % → 55–65 %).
- Vzorek pro primární metriku (45 % → 55 %): **n ≈ 391** na variantu; jako kontrolní (guardrail) metriku sledujeme lead rate — pro rozlišení 5 % → 7 % by bylo potřeba **n = 2 213** na variantu.

**2. Otevřený vs. částečně zamčený výsledek (gating)**
- Hypotéza: Pokud v kartě výsledku necháme verdikt a dvojče volně, ale srovnání brokerů a poplatky po letech ukážeme rozmazané se zámkem, pak víc lidí odešle e-mail, protože uvidí konkrétní obsah, který jim chybí — za cenu mírně nižší důvěry.
- Kontrola: současný stav (výsledek otevřený, plán popsaný seznamem).
- Primární metrika: `lead_submitted / result_shown`; guardrail: podíl odchodů bez interakce s formulářem.
- Očekávaný efekt: 5 % → 6,5 % (+30 % relativně).
- Vzorek: **n = 3 780** na variantu.

**3. Formulace CTA**
- Hypotéza: Pokud tlačítko řekne konkrétní přínos („Chci vědět, kde koupím SXR8 nejlevněji"), pak víc lidí odešle e-mail, protože vidí přesně, co dostanou.
- Varianta se generuje podle fondu (SXR8 → jiný text pro VUAA).
- Primární metrika: `lead / email_focus`.
- Očekávaný efekt: 5 % → 6 % (+20 % relativně), menší jistota.
- Vzorek: **n = 8 158** na variantu.

Při ~1 000 návštěvách za týden (50 leadů) nelze rozlišit rozdíl menší než několik procentních bodů. Závěry z prvních tisíce návštěv jsou orientační.

## Technické řešení

- **Stack:** Astro (statický výstup) s Preact ostrůvky pro interaktivní části. Adaptér `@astrojs/vercel`.
- **Backend:** Vercel funkce `/api/lead` a `/api/unsubscribe`, Supabase (tabulka `leads`, RLS bez politik, zápis jen serverem), Brevo (jeden transakční e-mail).
- **Analytika:** PostHog EU, bez cookies.
- **Fonty:** self-hosted (`@fontsource`), žádné externí CDN.
- **Kurzy ČNB:** snapshot k 13. 10. 2026 v `src/data/etfs.json` (endpoint ČNB nemá CORS pro prohlížeč; pro produkci by se načítal při buildu).
- **Cookies:** žádné.

**Lokální spuštění:**

```
npm i
cp .env.example .env     # doplňte klíče (PostHog, Supabase, Brevo)
npm run dev
npm test
```

Poznámka: `npm run build` lokálně selže, pokud je cesta projektu s ne-ASCII znaky (chyba `fs.cpSync` v Node). Build na Vercelu prochází.

**Struktura:**

```
src/
  pages/        index.astro, plan.astro, soukromi.astro, api/ (lead, unsubscribe)
  components/   RateTable, ResultPanel, FeeCalculator, Facts, Comparison, Faq, ...
  lib/          calc.ts (výpočet), twins.ts, track.ts, email.ts, store.ts
  data/         etfs.json, costs.json (každá hodnota má source a as_of)
research/       zdrojová data a poznámky z ověřování
docs/           copy.md (texty), analytics.md (trychtýř), build-spec.md
ads/            texty reklam a obrázky
supabase/       schema.sql
ai-log/         přepisy Claude Code sessions (/export)
```

## Práce s AI

Složka `ai-log/` obsahuje přepisy Claude Code sessions (`/export`). Workflow: Opus 5.5 plánoval a ověřoval, Haiku 5.5 subagenti psali kód a sbírali data. **Klíčová čísla byla znovu ověřena přímo u zdroje** (justETF, KID fondu, text zákona, ČNB); u každé hodnoty je uveden zdroj a datum, sekundární zdroje jsou označené.

## Omezení a co dál

- **Bankovní fond:** KID je z 30. 9. 2022. Aktuální KID vydává distributor a měl by se doplnit.
- **Trading 212:** poplatek za nákup se nepodařilo ověřit u primárního zdroje (na stránce označeno „neověřeno"); konverze 0,15 % je z oznámení z roku 2021.
- **Fio:** ceník je z roku 2020.
- **VEA:** vyřazeno, pro něj nebylo ověřené UCITS dvojče.
- **QQQ:** vyloučeno, je na Nasdaqu, ne na NYSE.
- **GDPR:** demo projekt. Správce je soukromá osoba. Data se mažou po 30 dnech.
- **E-mailová sekvence:** implementován je e-mail č. 1 (plán). Navazující e-maily (připravený obsah, neodesílá se): č. 2 za 2 dny — jak nastavit investiční plán a ušetřit na konverzi měny; č. 3 za 5 dní — časový test v praxi (jak evidovat datum nákupu); č. 4 za 10 dní — rebalancování a co dělat při poklesu trhu.
