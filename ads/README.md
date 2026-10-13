# Reklamy — 2 verze

Kanál: Meta (Instagram + Facebook), mobilní feed 4:5 (1080×1350) a Stories/Reels 9:16 (1080×1920).
Cíl kampaně: Leads → optimalizace na událost `lead_submitted` (konverzní API / pixel event „Lead“).
Cílení: ČR, 22–40 let, zájmy investování / ETF / XTB / Trading 212 / Portu / finanční nezávislost; vyloučit stávající leady.
Každá verze má vlastní `utm_content`, podle kterého landing page přepne první obrazovku (message match).

---

## Verze A — „Zákaz" (zvědavost + strach z chyby)

**URL:** `https://etf-dvojce.vercel.app/?utm_source=meta&utm_medium=paid_social&utm_campaign=dvojce_launch&utm_content=ad_zakaz`

**Obrázky:** [4:5 (1080×1350)](ad-a-zakaz-4x5.png) · [9:16 (1080×1920)](ad-a-zakaz-9x16.png)

**Vizuál (text v obrázku):**
- Velký ticker `VOO` přeškrtnutý razítkem **NELZE KOUPIT**
- šipka → `SXR8` s fajfkou
- Titulek v obrázku: **VOO z Česka nekoupíte.**
- Podtitulek: **Jeho evropské dvojče ano.**

**Primary text (nad obrázkem):**
> Chtěli jste koupit VOO nebo SPY jako Američani na YouTube? U XTB, Trading 212 ani DEGIRO je jako drobný investor z EU nekoupíte — chybí jim povinný dokument KID.
>
> Existuje ale evropské „dvojče", které sleduje stejný index a má podobně nízký poplatek. Ťukněte na svůj fond a za 10 sekund uvidíte, co koupit místo něj.

**Headline (pod obrázkem):** Najděte dvojče svého ETF
**Popis:** Zdarma, bez registrace. Data ke 13. 10. 2026.
**CTA tlačítko:** Zjistit více

**Proč to funguje:** cílová skupina zná tickery z anglického obsahu a pravděpodobně už narazila na hlášku „nástroj není dostupný". Reklama pojmenuje přesně tenhle moment frustrace a slíbí okamžité řešení. Slib = jedna konkrétní odpověď, kterou landing page dá na první ťuknutí.

---

## Verze B — „Poplatky" (peníze, konkrétní číslo)

**URL:** `https://etf-dvojce.vercel.app/?utm_source=meta&utm_medium=paid_social&utm_campaign=dvojce_launch&utm_content=ad_poplatky`

**Obrázky:** [4:5 (1080×1350)](ad-b-poplatky-4x5.png) · [9:16 (1080×1920)](ad-b-poplatky-9x16.png)

**Vizuál (text v obrázku):**
- Obří číslo: **687 000 Kč**
- Pod ním: **Tolik může za 20 let stát rozdíl v poplatcích.**
- Drobně: *5 000 Kč měsíčně · bankovní fond vs. ETF · předpoklad 7 % ročně*

**Primary text:**
> Investujete 5 000 Kč měsíčně přes podílový fond z banky? Se vstupním poplatkem až 5 % a průběžnými náklady přes 2 % ročně vás to za 20 let může stát přes 700 000 Kč. Stejná investice přes ETF: zhruba 34 000 Kč.
>
> Spočítejte si to se svou částkou. Dva posuvníky, výsledek v korunách, bez registrace.

**Headline:** Kolik vás stojí poplatky? Spočítejte si to.
**Popis:** Reálná data z KID fondu a ceníků brokerů.
**CTA tlačítko:** Zjistit více

**Výpočet (ověřitelný):** 5 000 Kč/měs., 20 let, hrubé zhodnocení 7 % p. a. (předpoklad).
- Bez poplatků: 2 552 030 Kč
- Bankovní fond AMUNDI CR IM AKCIOVÝ (vstup max. 5,00 %, průběžné 2,33 % + transakční 0,01 % dle KID z 30. 9. 2022): 1 830 700 Kč → poplatky 721 330 Kč
- ETF (TER 0,07 % + konverze měny 0,5 % u každého nákupu, XTB): 2 517 634 Kč → poplatky 34 396 Kč
- Rozdíl: **686 934 Kč** (zaokrouhleno na 687 000 Kč)

**Proč to funguje:** konkrétní číslo v korunách je silnější než procenta; cílová skupina procenta poplatků podceňuje. Reklama neútočí na konkrétní banku, ale v landing page je fond pojmenován se zdrojem (transparentnost > clickbait).

---

## Compliance poznámky
- Meta: investiční obsah není „special ad category" v EU, ale reklama nesmí slibovat výnos → číslo B je výslovně „může stát" + uvedený předpoklad.
- Žádná reklama nejmenuje broker jako partnera — nejsme jejich affiliate.
- Landing i reklama: „Není investiční doporučení".
