# Quarterly sample-data review

Educational sample tables and recommendation lists **drift**. Run this checklist about every **90 days** (see `nextReviewDue` in `freshness.json`).

## Quick workflow

1. Open [NSE IPO](https://www.nseindia.com/market-data/all-upcoming-issues-ipo) / broker calendars, bank rate pages, and AMC/exchange pages as needed.
2. Update sample rows or rec arrays only when stale or wrong.
3. Bump the site review date:

```bash
npm run bump-freshness -- --note "Q3 sample IPO + rec lists"
npm run sync-shell
```

4. Optionally mark one checklist item:

```bash
node scripts/bump-freshness.js --item ipo-sample --note "IPO sample table refresh"
```

5. Verify:

```bash
npm run verify-freshness
```

## Checklist items

| ID | What to check | File / section |
|----|----------------|----------------|
| `ipo-sample` | IPO sample dates, bands, sizes, status | `ipo.html#recent-ipo` |
| `bonds-sample` | Sample bond products still illustrative | `bonds.html#sample-bonds` |
| `fd-rates` | Sample FD rate bands not presented as live offers | `fixeddeposit.html#rates-fd` |
| `rec-stocks` | `STOCKS` in `recommendations.js` | `stocks.html` |
| `rec-funds` | `FUNDS` in `recommendations.js` | `mutualfunds.html` |
| `rec-crypto` | `CRYPTOS` in `recommendations.js` | `cryptocurrencies.html` |
| `etf-sample` | Sample ETF tickers / wording | `etf.html#popular-etf` |
| `calc-assumptions` | Defaults, goal portfolio models | calculators + goal planner |
| `metals-fx` | Home KPI metals + currency | `index.html` |

## Rules of thumb

- Always keep **“illustrative / not live / not advice”** wording on sample blocks.
- Prefer **generic rate bands** over naming a single bank offer as current.
- IPO rows: snapshot date in the section intro; link to NSE for live status.
- Never put API keys in the client; metals use the Netlify function.
