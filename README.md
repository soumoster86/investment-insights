# Investment Insights

A static, multi-page educational website about investing in India — covering stocks, mutual funds, fixed deposits, NPS, cryptocurrencies, bonds, IPOs, ETFs, US stocks, and goal-based planning. It includes interactive calculators (SIP, SWP, FD, NPS, investment goal), data-driven recommendation lists, live market widgets, light/dark mode, and a mobile-friendly navigation drawer.

The site is built with plain HTML, CSS, and vanilla JavaScript — no build step and no framework — so it can be hosted on any static host (it currently runs on Netlify).

## Live site

https://investment-insight.netlify.app

## Tech stack

- HTML5, CSS3, and vanilla JavaScript (ES5-compatible, no transpiler)
- [Chart.js](https://www.chartjs.org/) (via CDN) for calculator and IPO charts
- TradingView embedded widgets for the live ticker on the home and US stocks pages
- [Formspree](https://formspree.io/) for the contact form submission
- Clearbit Logo API and local image files for company/coin logos
- No bundler, package manager, or server-side code required

## Project structure

The shared shell (header, navigation, dark mode, calculators, recommendation cards, floating menus) lives in three shared assets that every page links. Each page also keeps a page-specific `<style>` block for content unique to that page.

```
.
├── index.html            Home dashboard (live ticker, goal summary)
├── stocks.html           Stocks overview + dynamic stock recommendations
├── etf.html              ETF overview
├── ipo.html              IPO guide + listing-gains chart
├── intraday.html         Intraday trading overview + sample chart
├── usstocks.html         US market overview + live US ticker
├── mutualfunds.html      MF overview + SIP & SWP calculators + dynamic fund recommendations
├── fixeddeposit.html     FD overview + FD calculator
├── nps.html              NPS overview + NPS calculator
├── cryptocurrencies.html Crypto overview + dynamic coin recommendations
├── bonds.html            Bonds overview
├── investmentgoal.html   Goal-based planning calculator
├── contact.html          Contact form (Formspree)
│
├── style.css             Shared shell: layout, header, nav, dropdown,
│                         mobile drawer, calculators, floating menus, dark mode
├── nav.js                Shared behaviour: dark-mode toggle, mobile nav,
│                         active-link highlight, back-to-top, header-height sync
└── recommendations.js    Data-driven Stocks / Mutual Funds / Crypto cards + search
```

### Shared assets

**`style.css`** owns everything that should look the same on every page: the sticky header, the primary navigation (including the mobile hamburger drawer and the "Stocks" dropdown), form and calculator styling, the floating "Quick Access" / "On this page" side menus, the back-to-top button, and all dark-mode rules.

**`nav.js`** is loaded with `defer` on every page and is written defensively (every element lookup is null-checked, so a page missing an element never throws). It handles:
- Dark-mode toggle with `localStorage` persistence and a system-preference fallback
- The mobile navigation drawer (hamburger open/close, scrim, Escape to close, inline dropdown expand on touch)
- Active-link highlighting in the header
- The back-to-top button
- Measuring the real header height and publishing it as the `--header-h` CSS variable, so floating side menus position correctly regardless of how the nav wraps

**`recommendations.js`** is loaded only on the three pages that show recommendation cards (Stocks, Mutual Funds, Cryptocurrencies). It renders the cards from data arrays and wires up each search box.

## Editing the recommendation lists

The Stocks, Mutual Funds, and Cryptocurrency recommendation cards are generated from data arrays in `recommendations.js` (`STOCKS`, `FUNDS`, and `CRYPTOS`). To add, remove, or edit a recommendation, change one entry in the relevant array — the card HTML, star rating, chips, and "Details" link are generated automatically. For example, a stock entry looks like:

```js
{ name: "TCS", sector: "IT", desc: "India’s IT giant…", rating: 4,
  logo: "https://logo.clearbit.com/tcs.com",
  url: "https://finance.yahoo.com/quote/TCS.NS" }
```

`rating` is an integer from 0 to 5 (rendered as filled/hollow stars). The matching page must contain the container and search input the script targets:

| Page | List container id | Search input id |
| --- | --- | --- |
| stocks.html | `stock-list` | `stock-search` |
| mutualfunds.html | `mf-list` | `mf-search` |
| cryptocurrencies.html | `crypto-list` | `crypto-search` |

Each page also includes `<script src="recommendations.js" defer></script>` before `nav.js`. If the cards ever stop appearing, the first thing to check is that this script tag is present on the page.

## Running locally

Because everything is static, you can open the files directly or serve the folder. Serving is recommended so that relative paths and the shared scripts resolve exactly as they do in production:

```bash
# Python 3
python3 -m http.server 8000

# or Node
npx serve .
```

Then open `http://localhost:8000` in a browser.

## Deployment

The site is a static bundle, so deployment is a drag-and-drop (or Git-connected) publish on Netlify, GitHub Pages, Vercel, or any static host. No build command is needed; the publish directory is the project root. Ensure `style.css`, `nav.js`, and `recommendations.js` are deployed alongside the HTML, and that local logo images (e.g. the crypto coin logos) are included.

## Notes & disclaimers

- All recommendations, calculator outputs, and sample charts are for **educational illustration only** and are not financial advice. Figures such as IPO listing gains use placeholder data.
- Some pages embed third-party widgets and call third-party logo/data services; those depend on the external services being reachable.
- Market data shown via embedded widgets may be delayed.

## Possible next steps

- Consolidate the per-page inline `<style>` blocks into `style.css` so styling has a single source of truth and stops drifting between pages.
- Move any client-side third-party API keys out of page source (e.g. behind a small serverless proxy) so they aren't publicly exposed.
- Add optional sort/filter controls (by rating, sector, or risk) to the recommendation lists, now that the data is structured.
