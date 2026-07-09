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
├── index.html                  Modern home (hero, KPI, topics)
├── learn.html                  Learn hub (all educational topics)
├── calculators.html            Calculators hub (SIP, SWP, FD, NPS, goal, bond)
├── stocks.html … contact.html  Topic/tool pages (shared header/footer)
├── style.css                   All shared + component styles (single source of truth)
├── nav.js                      Dark mode, mobile nav, active link, back-to-top
├── recommendations.js          Cards + search/sort/filter (+ top picks API)
├── js/
│   ├── util.js                 Shared escapeHtml + INR/percent formatters
│   ├── calc-core.js            Pure calculator math (SIP, SWP, FD, NPS, goal, bond)
│   ├── storage.js              lastCalculator + investmentGoal localStorage
│   └── dashboard.js            Home: goal card, last calc, top picks, FX, metals
├── robots.txt / sitemap.xml    Search engine discovery
├── content/freshness.json      Content review date + changelog
├── netlify.toml                Headers, functions dir
├── netlify/functions/
│   └── metals.js               Gold/silver proxy (GOLDAPI_KEY server-side)
├── logo.png / favicon.*        Compressed brand assets
├── partials/
│   ├── header.html             Canonical site header + skip link + primary nav
│   └── footer.html             Canonical footer + review date + back-to-top
├── tests/                      Jest unit tests for calc-core + storage
└── scripts/
    ├── sync-shell.js           Inject partials into every *.html page
    ├── apply-seo.js            Meta / Open Graph / canonical tags
    ├── apply-jsonld.js         Schema.org JSON-LD blocks
    ├── bump-freshness.js       Update content review date
    └── optimize-logo.py        Compress logo + generate favicons
```

### Shared assets

**`style.css`** owns layout, header, navigation (including mobile drawer and Stocks dropdown), forms/calculators, recommendation cards, dashboard cards, floating menus, tables, page-specific components (NPS bars, SWP tabs, US stock grid, IPO/ETF tables), and dark mode.

**`nav.js`** is loaded with `defer` on every page and is written defensively (every element lookup is null-checked). It handles dark mode, the mobile drawer, active-link highlighting, back-to-top, and `--header-h` sync for floating menus.

**`recommendations.js`** is loaded on Stocks, Mutual Funds, Cryptocurrencies, and Home (for top picks). It renders cards from data arrays, wires search/sort/filter toolbars, uses local logos or initials avatars, and exposes `window.IIReco.topPicks()`.

**`js/util.js`** exposes `window.IIUtil` (`escapeHtml`, `formatINR`, `formatPct`) — the single copy of the HTML escaper and number formatters. It must be included (plain `<script>`, no defer) before `recommendations.js`, `js/dashboard.js`, the `js/*-page.js` scripts, and `js/tools-calcs.js`.

**`js/calc-core.js`** holds pure math used by the calculators and unit tests (`window.IICalc` / `require`). **`js/storage.js`** writes `lastCalculator` and `investmentGoal` snapshots. **`js/dashboard.js`** hydrates the home dashboard and fetches metals via the Netlify function. **`js/site-config.js`** holds public runtime config (analytics opt-in, endpoints). **`js/analytics.js`** loads Plausible only when enabled and when DNT/GPC is off. **`js/india-ticker.js`** powers the stocks-page NSE tape via `/.netlify/functions/india-stocks` (proxy for [Indian Stock Market API](https://github.com/0xramm/Indian-Stock-Market-API); demo fallback if upstream is down).

**`partials/header.html` / `partials/footer.html`** are the single source of truth for the site chrome. Primary nav is **Home · Learn ▾ · Calculators ▾ · Contact** (topic pages live under Learn; tools under Calculators). After editing either file, run:

```bash
npm run sync-shell
```

### Content freshness (sample data)

Sample IPO rows, rate bands, and recommendation cards go stale. Source of truth:

- `content/freshness.json` — last review, next due, per-item checklist  
- `content/REVIEW-CHECKLIST.md` — human quarterly process  

```bash
npm run bump-freshness -- --note "Q3 IPO + rec lists"
npm run bump-freshness -- --item ipo-sample --note "IPO table refresh"
npm run sync-shell
npm run verify-freshness
```

Sample blocks use a `.sample-freshness` stamp; dates fill from `IIConfig.contentReviewed` via `nav.js`.

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
npm run sync-shell       # re-inject header/footer partials into all pages
npm run apply-seo        # refresh meta / OG / canonical tags
npm run apply-a11y       # ensure main#main-content landmarks
npm run apply-jsonld     # Schema.org JSON-LD on key pages
npm run bump-freshness   # set content review date (then sync-shell)
npm run optimize-logo    # recompress logo.png + regenerate favicons (needs Pillow)
npm test                 # Jest (install devDependencies first)
npm run verify-phase3    # SEO / a11y / toolbar smoke checks
npm run verify-phase4    # functions, freshness, runtime scripts
```

## Deployment (Netlify)

Git-connected Netlify deploy from `main` is the intended path. Config lives in `netlify.toml` (publish = site root, functions = `netlify/functions`).

### Live metals prices

1. Create a free/paid key at [GoldAPI](https://www.goldapi.io/) (or your provider).
2. In Netlify → Site settings → Environment variables, set:
   - `GOLDAPI_KEY` = your secret
3. Redeploy. The home dashboard calls `/.netlify/functions/metals` (no key in the browser).
4. Without the env var, the function returns **demo rates** so the UI still works.

See `.env.example` for the variable names (local reference only — do not commit real `.env` files).

### Privacy-friendly analytics (optional)

In `js/site-config.js`:

```js
analytics: {
  provider: "plausible",  // or "none"
  domain: "investment-insight.netlify.app",
  scriptUrl: "https://plausible.io/js/script.js"
}
```

Analytics stay off by default. When enabled, loading respects **Do Not Track** and **Global Privacy Control**.

### Content freshness workflow

```bash
npm run bump-freshness -- --note "Q3 recommendation review"
# or: node scripts/bump-freshness.js 2026-10-01 --note "..."
npm run sync-shell
```

This updates `content/freshness.json`, `js/site-config.js`, and the footer “Content last reviewed” line.

Ensure these ship with the HTML:

- `style.css`, `nav.js`, `recommendations.js`, `js/*`
- Logo / favicon assets
- Local coin/exchange images
- `netlify/functions` (for Netlify)

`partials/`, `scripts/`, and `content/` are for maintainers; `content/freshness.json` is the source of truth for review dates.

## Notes & disclaimers

- All recommendations, calculator outputs, and sample charts are for **educational illustration only** and are not financial advice. Not a SEBI-registered advisor.
- Figures such as IPO listing gains use placeholder/sample data.
- Market data via TradingView widgets may be delayed.
- **API keys must never be committed** in page source — only Netlify env + serverless functions.

## Possible next steps

- Rotate any API keys that were ever committed historically.
- Move remaining calculator UI fully out of inline HTML into `js/`.
- Optional PWA / offline calculators.
- Additional Netlify proxies (e.g. FX) if free-tier APIs become unreliable.
