# Copy deck — Dvojče (CZ)

Zdroj pravdy pro všechny texty na stránce. Čísla v `{{…}}` dopočítává kód z `src/data/*.json`.
Formát čísel: mezera jako oddělovač tisíců (nezlomitelná), desetinná čárka, `Kč` za číslem, `%` s mezerou (`0,07 %`).

---

## 1. Hero — varianta ZÁKAZ (default, `utm_content=ad_zakaz`)

**Nadpis (H1):**
VOO z Česka nekoupíte.
Jeho dvojče ano.

**Podnadpis:**
Americké ETF jsou pro drobné investory v EU od roku 2018 nedostupné. Ťukněte na fond, který znáte, a hned uvidíte evropskou alternativu se stejným indexem.

**Výzva nad čipy:** Který fond jste chtěli koupit?
**Čipy:** VOO · SPY · IVV · VTI · VT · SCHD · VWO
**Mikrotext pod čipy:** Zdarma, bez registrace. Data k {{data_as_of}}.

## 1b. Hero — varianta POPLATKY (`utm_content=ad_poplatky`)

**Nadpis (H1):**
Kolik vás stojí poplatky?
V korunách. Za 20 let.

**Podnadpis:**
Porovnejte bankovní podílový fond s ETF, které koupíte u běžného brokera. Dva posuvníky, žádná registrace.

(Pod heroem rovnou kalkulačka, viz sekce 3.)

---

## 2. Výsledek — Najděte dvojče

**Stav „nedostupné" (pro vybraný US fond):**
- Štítek: `NYSE Arca` · `{{us.ticker}}`
- Verdikt: **Z Česka ho jako drobný investor nekoupíte.**
- Proč (1 věta): Fondy z USA nemají sdělení klíčových informací (KID), které evropská regulace PRIIPs vyžaduje. Brokeři jako XTB nebo DEGIRO vám je proto neprodají.

**Karta dvojčete:**
- Nadtitulek: Evropské dvojče
- Název: {{ucits.name}}
- Tickery: `{{ucits.ticker_xetra}}` (Xetra) · `{{ucits.ticker_lse}}` (Londýn)
- Řádky:
  - Index: {{ucits.index}} — {{match_label}}
  - Roční poplatek (TER): {{ucits.ter}} (originál: {{us.expense}})
  - Dividendy: {{ucits.policy_label}}
  - Velikost fondu: {{ucits.size}}
  - Sídlo: Irsko (UCITS)
- `match_label`: „stejný index" / „podobný index" / „přibližná náhrada"
- Pro přibližné náhrady (VTI, SCHD) vždy jedna věta upřímně: „Přesná kopie v Evropě neexistuje. Tohle je nejbližší rozumná alternativa — rozdíly máte v plánu."

**Teaser + formulář (uvnitř karty):**
- Nadpis: Co dál? Pošleme vám plán na míru.
- Seznam (3 položky, s ikonou zámku u zamčených):
  - U kterého brokera {{ucits.ticker_xetra}} koupíte nejlevněji
  - Kolik vás stojí převod korun na eura (a jak to obejít)
  - Jak po 3 letech neplatit daň z prodeje
- Pole: `váš@email.cz` (placeholder), label pro čtečky: „E-mail"
- Tlačítko: **Poslat plán zdarma**
- Pod tlačítkem (12 px): Plán uvidíte hned a pošleme ho i na e-mail. Žádný spam, odhlásit se jde jedním klikem. [Jak zacházíme s daty](/soukromi)

---

## 3. Kalkulačka poplatků

**Nadpis (H2):** Kolik vám ukrojí poplatky
**Podnadpis:** Stejná investice, stejný trh. Rozdíl je jen v tom, kolik si každý rok vezme správce.

**Posuvník 1:** Měsíčně investuji — {{monthly}} Kč (500–30 000, krok 500, default 5 000)
**Posuvník 2:** Po dobu — {{years}} let (1–40, default 20)

**Výsledek (2 řádky + rozdíl):**
- Bankovní podílový fond ({{bank.ongoing}} ročně + {{bank.entry}} vstupní poplatek): **{{fees_bank}} Kč** na poplatcích
- ETF dvojče ({{etf.ter}} ročně + {{broker.fx}} za převod měny): **{{fees_etf}} Kč**
- Velké číslo: **{{difference}} Kč** — tolik vám zůstane navíc.

**Předpoklad (malým písmem, vždy viditelné):** Výpočet předpokládá zhodnocení 7 % ročně před poplatky. Je to předpoklad, ne slib — minulé výnosy nezaručují budoucí. Poplatky bankovního fondu podle KID fondu {{bank.name}} ({{bank.kid_date}}).

**CTA:** Chci rozpis po letech + nejlevnějšího brokera → (posune na formulář / otevře stejný formulář inline)

---

## 4. Proč to tak je (3 fakta, každé se zdrojem)

**Nadpis (H2):** Tři věci, které vám YouTube neřekne

1. **Americké ETF tu nekoupíte.** Od roku 2018 musí mít každý fond pro drobné investory v EU dokument KID. Američtí správci ho nevydávají, takže VOO, SPY ani SCHD vám evropský broker neprodá. [zdroj]
2. **Evropská dvojčata jsou plnohodnotná.** Fondy s irským sídlem sledují stejné indexy, mají srovnatelně nízké poplatky a většinou dividendy rovnou reinvestují (akumulují). [zdroj]
3. **Po 3 letech neplatíte daň.** Prodáte-li ETF po více než 3 letech držení, je zisk osvobozený od daně (časový test). Osvobozený je i prodej do 100 000 Kč za rok. [§ 4 odst. 1 písm. t) a u) ZDP]

---

## 5. Srovnávací tabulka

**Nadpis (H2):** Všechna dvojčata na jednom místě
**Sloupce (mobil = karty, desktop = tabulka):** Fond z NYSE · TER · Evropské dvojče · TER · Shoda
**Pod tabulkou:** Zdroje: stránky správců a justETF, stav k {{data_as_of}}. Každé číslo je proklik na zdroj.

---

## 6. Co je v plánu (náhled)

**Nadpis (H2):** Váš ETF plán. Na jedné stránce.
- Vaše dvojčata a jejich tickery na Xetře a v Londýně
- Srovnání brokerů: poplatek za nákup, převod korun, investiční plány
- Poplatky v korunách po jednotlivých letech
- Daňový checklist: časový test, limit 100 000 Kč
- 5 kroků k prvnímu nákupu

**Formulář (stejný jako v sekci 2).**

---

## 7. Otázky

- **Je to zdarma?** Ano. Plán dostanete hned po zadání e-mailu.
- **Kdo za tím stojí?** Dvojče je nezávislý projekt. Nejsme broker ani banka a nedostáváme provize od fondů.
- **Je to investiční doporučení?** Ne. Ukazujeme veřejná data a srovnání. Rozhodnutí je na vás.
- **Co uděláte s mým e-mailem?** Pošleme vám plán. Občas se můžeme ozvat s aktualizací dat nebo tipem k ETF — odhlásit se můžete kdykoli jedním klikem. E-mail nikomu neprodáváme.

---

## 8. Patička

Dvojče · Informace na této stránce nejsou investičním doporučením ani nabídkou. Investování je spojeno s rizikem, hodnota investice může klesat. Data k {{data_as_of}}, zdroje u každého údaje. [Zásady zpracování osobních údajů](/soukromi)

---

## 9. Po odeslání (stav na stránce)

- Nadpis: Hotovo. Tady je váš plán.
- Text: Kopii jsme poslali na {{email}}. Kdyby nedorazila, mrkněte do složky Hromadné / Promo.
- → okamžitě se rozbalí celý plán (stejný obsah jako e-mail)
- Další krok (sekundární CTA): Uložit jako PDF

## 10. E-mail č. 1 (ihned)

- **Předmět:** Váš ETF plán: {{us.ticker}} → {{ucits.ticker_xetra}}
- **Preheader:** Kde ho koupit nejlevněji a kolik ušetříte na poplatcích.
- **Tělo:**
  Dobrý den,
  tady je plán, který jste si vyžádali na Dvojčeti.
  [Otevřít můj plán →]
  Ve zkratce: místo {{us.ticker}} můžete koupit {{ucits.name}} ({{ucits.ticker_xetra}}). Při {{monthly}} Kč měsíčně po dobu {{years}} let vás poplatky vyjdou zhruba na {{fees_etf}} Kč.
  Máte dotaz k plánu? Stačí odpovědět na tento e-mail.
  — Dvojče
  _Není to investiční doporučení. Odhlásit se můžete [zde]._
