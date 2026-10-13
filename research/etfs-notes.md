# ETF research notes (fetched 2026-10-13)

## Problems and uncertainties

**US ETFs**
- Vanguard issuer pages (investor.vanguard.com) returned only the page title for VOO, VTI and VT. Vanguard data (AUM, yields, 5y/10y returns) is therefore missing from the issuer; everything Vanguard came from stockanalysis.com.
- etf.com, invesco.com (partial), schwabassetmanagement.com and morningstar.com returned HTTP 403 or no usable data.
- stockanalysis.com gives no as-of dates for most fields (only "last checked 2026-10-13"). Its 1y returns are labelled "total return including dividends" with no end date. Its 5y/10y returns are not shown for any fund, so these are null.
- **Unreconciled 1y return conflict:** SPY 1y is 15.60% (SSGA, as of 2026-09-30) and IVV 1y is 15.71% (iShares feed), but stockanalysis shows VOO 20.40%, IVV 20.42%, VTI 19.91% (all S&P/US-market funds, so these should be close). The stockanalysis windows are probably different, so the 1y figures should not be mixed across sources.
- SPY 1y/5y/10y values come from the SSGA table, mapped by column position. Verify before publishing.
- IVV 1y/5y/10y come from the iShares JSON feed, which is labelled "Total Return" (not NAV) with no as-of date in the fetched part; the page was truncated at 100000 characters.
- IVV AUM: iShares gives $896.34B (2026-10-12); stockanalysis gives $891.04B (undated). The iShares figure is used.
- SPY expense ratio is the gross ratio (0.0945%) per SSGA.
- Domicile is not stated on any US fund page fetched, so all US `domicile` values are null (they are US-domiciled ETFs in reality, but this was not verified from a fetched page).
- VOO, VTI, VT, SCHD, VEA, VWO and QQQ AUM and dividend yields are undated (stockanalysis). The "as of" dates are not known.
- QQQ is Nasdaq-listed (stockanalysis header "Stock Exchange Nasdaq") and is placed in `excluded`. The Invesco page did not state the exchange.
- Inception dates for the US funds come from stockanalysis (except SPY, IVV, from SSGA/iShares). Verify against issuer pages.

**UCITS**
- justETF pages show "As of 31/08/2026" only for holdings. Fund size and return figures are undated on all pages, so `as_of` is "no date shown".
- **VT match: VWCE (IE00BK5BQT80) is listed with TER 0.14%.** This is lower than the figure I expected for VWCE, so please check it on the factsheet before use.
- **VWCE "FTSE All-World" vs VT "FTSE Global All Cap":** VT includes small caps, VWCE does not. Recorded as `similar`.
- **VEA has no verified UCITS match.** The iShares Core MSCI EAFE UCITS ISIN could not be found. IE00B4L5YX21 is MSCI Japan IMI and IE00B4L5YC18 is MSCI EM (both rejected). The Vanguard FTSE Developed ex-US UCITS ISIN could not be found either. Left as null in `ucits`.
- **SCHD:** no UCITS tracking the Dow Jones U.S. Dividend 100 was found. The closest options are the global high-dividend Vanguard funds VHYL (IE00B8GKDB10, Dist) and VHYA (IE00BK5BR626, Acc). Both are `approximate`.
- **VTI:** the closest UCITS is iShares MSCI USA (IE00B52SFT06), which is large and mid cap only. Recorded as `approximate`.
- XETRA tickers: VWCE, VUAA and CSPX are listed on XETRA or other exchanges as per the justETF listing tables. Check the exchange listing table if you need a single "primary" ticker.
- IE00B5BMR087 (CSPX): justETF lists the Borsa Italiana ticker as CSSPX and the Xetra ticker as SXR8.
- Not verified: `replication` for IE00BFMXXD54 (VUAA) and IE00B52SFT06 are taken directly from justETF.
- 5y returns for UCITS funds are cumulative percentages from justETF (not annualized), as shown on the page.

## Summary of nulls
- US: 5y and 10y NAV returns for VOO, VTI, VT, SCHD, VEA, VWO, QQQ (not shown in any fetched source). 10y for IVV is from an unclear feed.
- US: domicile (all funds).
- US: SEC 30-day yield for everything except SPY and IVV.
- UCITS: entire VEA record (no verified fund).
- UCITS: no Dow Jones U.S. Dividend 100 UCITS (SCHD proxies used instead).
