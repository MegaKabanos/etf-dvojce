# Czech funds and brokers: research notes (as of 2026-10-13)

## Part 1 - funds
- **KB / Amundi - AMUNDI CR IM AKCIOVÝ (C), CZ0008475811, CZK.** KID dated 30.09.2022 (https://www.amundi-kb.cz/storage/app/media/KIID/KIID_CZ0008475811.pdf). Entry max 5.00%, exit 0%, admin/operating 2.33%, transaction 0.01%. Total 2.34% is derived by summing the two lines; the KID does not print a total. KID is about 4 years old.
- **Erste - ERSTE STOCK GLOBAL.** The CZK ISIN AT0000639497 was not verified in a 2026 document (it comes from a 2013 Hungarian KIID and third-party listings). The only 2026 Erste document retrieved is a factsheet dated 27.02.2026 for the EUR R01 tranche. It gives fund-level entry max 4.00% and management fee 1.80% p.a., but no KID and no ongoing-charges figure. Ongoing charges left null.
- **ČSOB - ČSOB Akciový.** No KID or CZ ISIN found. ČSOB Akciový Mix (770000001170) is a different fund and its KII is valid from 2014, so it is not used.

## Part 2 - brokers
- **Trading 212:** FX 0.15% per the company's community post of 2021-03-02 (https://community.trading212.com/t/introduction-of-fx-conversion-fee/46787). Commission for ETFs not verified: trading212.com fee pages return 403.
- **Interactive Brokers:** Germany tiered commission 0.05% of trade value, min EUR 1.25, max EUR 29 per order (https://www.interactivebrokers.com/en/pricing/commissions-stocks.php, no date shown). FX conversion not found on the official page (IBKR regional pages return 403). Third-party 0.002% claim not used.
- **Fio e-Broker:** Xetra 0.15% of volume, min 9.95 EUR, plus 10 EUR surcharge on Frankfurt only (https://www.fio.cz/docs/cz/C_zaklad_200728.pdf, vyhlášen 26.6.2020, účinnost 28.7.2020). This is the newest general price list retrieved, so it is 2020. The 2026 annex (C_trh_260921.pdf) has no Xetra commission lines. No FX spread is published.
- **XTB:** 0% commission up to EUR 100,000 monthly turnover, then 0.2% (min EUR 10); FX 0.5% ("Může být účtován poplatek 0,5 % za konverzi měn.") - https://www.xtb.com/cz/etf, no date shown (copyright 2026).

## Limits
- Several sites (Erste, ČSOB, IBKR regional, Trading 212, Fio main page) returned 403 or were not reachable from the fetch tools; values were taken only from pages that loaded.
- Full data, including nulls and quotes, is in `czech-funds-brokers.json`.
