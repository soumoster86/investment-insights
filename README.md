# Investment Insights

A static, multi-page educational website about investing in India — covering stocks, mutual funds, fixed deposits, NPS, cryptocurrencies, bonds, IPOs, ETFs, US stocks, and goal-based planning. It includes interactive calculators (SIP, SWP, FD, NPS, investment goal), data-driven recommendation lists, live market widgets, light/dark mode, and a mobile-friendly navigation drawer.

The site is built with plain HTML, CSS, and vanilla JavaScript — no framework — so it can be hosted on any static host (it currently runs on Netlify). Shared chrome (header/footer) is maintained as partials and synced into every page with a small Node script.

## Live site

https://investment-insight.netlify.app

## Tech stack

- HTML5, CSS3, and vanilla JavaScript (ES5-compatible, no transpiler)
- [Chart.js](https://www.chartjs.org/) (via CDN) for calculator and IPO charts
- TradingView embedded widgets for the live ticker on the home and US stocks pages
- [Formspree](https://formspree.io/) for the contact form submission
- Clearbit Logo API and local image files for company/coin logos
- No bundler required for deploy; optional Node scripts for shell sync / logo tooling

## Project structure

```
.
├── index.html … contact.html   Page content (shared header/footer injected)
├── style.css                   All shared + component styles (single source of truth)
├── nav.js                      Dark mode, mobile nav, active link, back-to-top
├── recommendations.js          Stocks / MF / Crypto cards + search
├── logo.png / favicon.*        Compressed brand assets
├── partials/
│   ├── header.html             Canonical site header + primary nav
│   └── footer.html             Canonical footer + back-to-top button
└── scripts/
    ├── sync-shell.js           Inject partials into every *.html page
    └── optimize-logo.py        Compress logo + generate favicons
```

### Shared assets

**`style.css`** owns layout, header, navigation (including mobile drawer and Stocks dropdown), forms/calculators, recommendation cards, dashboard cards, floating menus, tables, page-specific components (NPS bars, SWP tabs, US stock grid, IPO/ETF tables), and dark mode.

**`nav.js`** is loaded with `defer` on every page and is written defensively (every element lookup is null-checked). It handles dark mode, the mobile drawer, active-link highlighting, back-to-top, and `--header-h` sync for floating menus.

**`recommendations.js`** is loaded only on Stocks, Mutual Funds, and Cryptocurrencies. It renders cards from data arrays and wires search.

**`partials/header.html` / `partials/footer.html`** are the single source of truth for the site chrome. After editing either file, run:

```bash
npm run sync-shell
```

Pages mark the injected regions with `<!-- BEGIN SITE HEADER -->` / `<!-- END SITE HEADER -->` (and the footer equivalents) so re-runs replace only those blocks.

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

Each of those pages includes `<script src="recommendations.js" defer></script>` before `nav.js`.

## Running locally

Because everything is static, you can open the files directly or serve the folder. Serving is recommended so that relative paths and the shared scripts resolve exactly as they do in production:

```bash
# Python 3
python -m http.server 8000

# or Node
npx serve .
```

Then open `http://localhost:8000` in a browser.

### Optional tooling

```bash
npm run sync-shell      # re-inject header/footer partials into all pages
npm run optimize-logo   # recompress logo.png + regenerate favicons (needs Pillow)
npm test                # Jest (install devDependencies first)
```

## Deployment

The site is a static bundle, so deployment is a drag-and-drop (or Git-connected) publish on Netlify, GitHub Pages, Vercel, or any static host. No build command is required for Netlify; the publish directory is the project root.

Ensure these ship with the HTML:

- `style.css`, `nav.js`, `recommendations.js`
- Logo / favicon assets (`logo.png`, `favicon.ico`, `favicon-32.png`, `apple-touch-icon.png`)
- Local coin/exchange images used on the crypto page

`partials/` and `scripts/` are for maintainers only — they are not required at runtime.

## Notes & disclaimers

- All recommendations, calculator outputs, and sample charts are for **educational illustration only** and are not financial advice. Figures such as IPO listing gains use placeholder data.
- Some pages embed third-party widgets and call third-party logo/data services; those depend on the external services being reachable.
- Market data shown via embedded widgets may be delayed.
- **API keys must never be committed** in page source. Prefer server-side proxies (e.g. Netlify Functions) for any authenticated market/metals APIs.

## Possible next steps

- Move calculators into shared `js/` modules and expand unit tests.
- Wire the home dashboard to real goal / last-calculator localStorage data.
- Add sort/filter controls (by rating, sector, or risk) to recommendation lists.
- Proxy paid APIs behind serverless functions; rotate any keys that were ever exposed client-side.
- SEO: meta descriptions, Open Graph tags, `sitemap.xml`.
