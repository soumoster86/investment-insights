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
- Local coin logos + initials avatars for stocks/funds (no third-party logo API)
- SEO: per-page meta descriptions, Open Graph, `robots.txt`, `sitemap.xml`
- No bundler required for deploy; optional Node scripts for shell sync / SEO / logo tooling

## Project structure

```
.
├── index.html … contact.html   Page content (shared header/footer injected)
├── style.css                   All shared + component styles (single source of truth)
├── nav.js                      Dark mode, mobile nav, active link, back-to-top
├── recommendations.js          Cards + search/sort/filter (+ top picks API)
├── js/
│   ├── calc-core.js            Pure calculator math (SIP, SWP, FD, NPS, goal, bond)
│   ├── storage.js              lastCalculator + investmentGoal localStorage
│   └── dashboard.js            Home: goal card, last calc, top picks, FX, metals
├── robots.txt / sitemap.xml    Search engine discovery
├── logo.png / favicon.*        Compressed brand assets
├── partials/
│   ├── header.html             Canonical site header + skip link + primary nav
│   └── footer.html             Canonical footer + back-to-top button
├── tests/                      Jest unit tests for calc-core + storage
└── scripts/
    ├── sync-shell.js           Inject partials into every *.html page
    ├── apply-seo.js            Meta / Open Graph / canonical tags
    ├── apply-a11y-main.js      Ensure main#main-content landmarks
    └── optimize-logo.py        Compress logo + generate favicons
```

### Shared assets

**`style.css`** owns layout, header, navigation (including mobile drawer and Stocks dropdown), forms/calculators, recommendation cards, dashboard cards, floating menus, tables, page-specific components (NPS bars, SWP tabs, US stock grid, IPO/ETF tables), and dark mode.

**`nav.js`** is loaded with `defer` on every page and is written defensively (every element lookup is null-checked). It handles dark mode, the mobile drawer, active-link highlighting, back-to-top, and `--header-h` sync for floating menus.

**`recommendations.js`** is loaded on Stocks, Mutual Funds, Cryptocurrencies, and Home (for top picks). It renders cards from data arrays, wires search/sort/filter toolbars, uses local logos or initials avatars, and exposes `window.IIReco.topPicks()`.

**`js/calc-core.js`** holds pure math used by the calculators and unit tests (`window.IICalc` / `require`). **`js/storage.js`** writes `lastCalculator` and `investmentGoal` snapshots. **`js/dashboard.js`** hydrates the home dashboard from that storage.

**`partials/header.html` / `partials/footer.html`** are the single source of truth for the site chrome. After editing either file, run:

```bash
npm run sync-shell
```

Pages mark the injected regions with `<!-- BEGIN SITE HEADER -->` / `<!-- END SITE HEADER -->` (and the footer equivalents) so re-runs replace only those blocks.

## Editing the recommendation lists

The Stocks, Mutual Funds, and Cryptocurrency recommendation cards are generated from data arrays in `recommendations.js` (`STOCKS`, `FUNDS`, and `CRYPTOS`). To add, remove, or edit a recommendation, change one entry in the relevant array — the card HTML, star rating, chips, and "Details" link are generated automatically. For example, a stock entry looks like:

```js
{ name: "TCS", sector: "IT", desc: "India’s IT giant…", rating: 4,
  url: "https://finance.yahoo.com/quote/TCS.NS" }
// optional: logo: "my-logo.png"  — otherwise an initials avatar is used
```

`rating` is an integer from 0 to 5 (rendered as filled/hollow stars). The matching page must contain the containers the script targets:

| Page | List id | Search id | Toolbar id | Filters |
| --- | --- | --- | --- | --- |
| stocks.html | `stock-list` | `stock-search` | `stock-toolbar` | Sector + sort |
| mutualfunds.html | `mf-list` | `mf-search` | `mf-toolbar` | Type, risk + sort |
| cryptocurrencies.html | `crypto-list` | `crypto-search` | `crypto-toolbar` | Category, risk + sort |

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
npm run apply-seo       # refresh meta / OG / canonical tags
npm run apply-a11y      # ensure main#main-content landmarks
npm run optimize-logo   # recompress logo.png + regenerate favicons (needs Pillow)
npm test                # Jest (install devDependencies first)
npm run verify-phase3   # quick SEO / a11y / toolbar smoke checks
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

- Proxy paid APIs behind serverless functions for live metals/market data.
- Rotate any API keys that were ever committed historically.
- Move remaining page UI (charts/render) fully out of inline HTML into `js/`.
- Structured data (FAQ/HowTo) for calculators; optional PWA offline calculators.
