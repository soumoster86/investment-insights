/* ============================================================
   Investment Insights — data-driven recommendations
   Renders the Stocks / Mutual Funds / Cryptocurrency recommendation
   cards from data arrays instead of hardcoded HTML, and wires up the
   search box (the previous filter*() functions were referenced in
   onkeyup but never defined, so search did nothing).

   To add or edit a recommendation, change ONE entry below — the card
   is generated automatically. Loaded with `defer` only on the three
   pages that need it; each page renders whichever lists are present.
   ============================================================ */
(function (global) {
  "use strict";

  /* ---------- Data ---------- */

  var STOCKS = [
    { name: "TCS", sector: "IT", desc: "India’s IT giant, global leader in digital transformation", rating: 4, logo: "https://logo.clearbit.com/tcs.com", url: "https://finance.yahoo.com/quote/TCS.NS" },
    { name: "Infosys", sector: "IT", desc: "Leading IT services firm, strong global client base", rating: 4, logo: "https://logo.clearbit.com/infosys.com", url: "https://finance.yahoo.com/quote/INFY.NS" },
    { name: "HDFC Bank", sector: "Banking", desc: "India’s largest private sector bank, stable returns", rating: 5, logo: "https://logo.clearbit.com/hdfcbank.com", url: "https://finance.yahoo.com/quote/HDFCBANK.NS" },
    { name: "ICICI Bank", sector: "Banking", desc: "Strong retail presence, tech-driven banking leader", rating: 4, logo: "https://logo.clearbit.com/icicibank.com", url: "https://finance.yahoo.com/quote/ICICIBANK.NS" },
    { name: "Hindustan Unilever", sector: "FMCG", desc: "India’s leading FMCG company, trusted brands portfolio", rating: 4, logo: "https://logo.clearbit.com/hul.co.in", url: "https://finance.yahoo.com/quote/HINDUNILVR.NS" },
    { name: "Asian Paints", sector: "FMCG", desc: "Market leader in decorative paints and coatings", rating: 4, logo: "https://logo.clearbit.com/asianpaints.com", url: "https://finance.yahoo.com/quote/ASIANPAINT.NS" },
    { name: "Maruti Suzuki", sector: "Auto", desc: "India’s top automobile manufacturer, strong sales", rating: 4, logo: "https://logo.clearbit.com/marutisuzuki.com", url: "https://finance.yahoo.com/quote/MARUTI.NS" },
    { name: "Tata Motors", sector: "Auto", desc: "Leading auto player, strong EV and CV portfolio", rating: 4, logo: "https://logo.clearbit.com/tatamotors.com", url: "https://finance.yahoo.com/quote/TATAMOTORS.NS" },
    { name: "Larsen & Toubro", sector: "Infra", desc: "Engineering and infra conglomerate, diversified order book", rating: 4, logo: "https://logo.clearbit.com/larsentoubro.com", url: "https://finance.yahoo.com/quote/LT.NS" },
    { name: "Bharti Airtel", sector: "Telecom", desc: "Top telecom operator, growing data market share", rating: 4, logo: "https://logo.clearbit.com/airtel.com", url: "https://finance.yahoo.com/quote/BHARTIARTL.NS" },
    { name: "Reliance Industries", sector: "Conglomerate", desc: "Diversified energy, retail, digital, telecom businesses", rating: 5, logo: "https://logo.clearbit.com/ril.com", url: "https://finance.yahoo.com/quote/RELIANCE.NS" }
  ];

  var FUNDS = [
    { name: "Parag Parikh Flexi Cap", type: "Multi-cap", risk: "Moderate", desc: "Long-term, value-focused, global exposure", rating: 5, logo: "https://logo.clearbit.com/ppfas.com", url: "https://www.ppfas.com/mutual-fund/schemes/parag-parikh-flexi-cap-fund/" },
    { name: "Axis Bluechip Fund", type: "Large-cap", risk: "Low", desc: "Consistent performer in top large caps", rating: 4, logo: "https://logo.clearbit.com/axismf.com", url: "https://www.axismf.com/" },
    { name: "DSP Midcap Fund", type: "Mid-cap", risk: "Moderate", desc: "Growth-focused, seasoned fund management", rating: 4, logo: "https://logo.clearbit.com/dspim.com", url: "https://www.dspim.com/our-funds/dsp-midcap-fund-direct-plan-growth" },
    { name: "HDFC Balanced Advantage", type: "Hybrid", risk: "Low", desc: "Balances growth & stability, dynamic asset allocation", rating: 4, logo: "https://logo.clearbit.com/hdfcfund.com", url: "https://www.hdfcfund.com/products/mutual-fund/hdfc-balanced-advantage-fund/regular-plan/growth" },
    { name: "ICICI Pru Equity & Debt", type: "Large & Mid-cap", risk: "Moderate", desc: "Equity/debt mix, good for balanced growth", rating: 4, logo: "https://logo.clearbit.com/icicipruamc.com", url: "https://www.icicipruamc.com/mutual-fund-scheme/icici-prudential-equity-and-debt-fund" },
    { name: "Mirae Asset Large Cap", type: "Large-cap", risk: "Low", desc: "Strong large cap focus, consistent performance", rating: 4, logo: "https://logo.clearbit.com/miraeassetmf.co.in", url: "https://www.miraeassetmf.co.in/mutual-fund-schemes/equity/mirae-asset-large-cap-fund" },
    { name: "SBI Small Cap Fund", type: "Small-cap", risk: "High", desc: "High growth potential, suitable for aggressive investors", rating: 4, logo: "https://logo.clearbit.com/sbimf.com", url: "https://www.sbimf.com/en-us/schemes/equity/sbi-small-cap-fund/regular-plan/growth" },
    { name: "Aditya Birla Sun Life Tax Relief 96", type: "ELSS", risk: "Moderate", desc: "Popular tax-saving (80C) equity fund, >20-year track record", rating: 4, logo: "https://logo.clearbit.com/abslmf.com", url: "https://mutualfund.adityabirlacapital.com/products/equity-schemes/tax-savings-funds/aditya-birla-sun-life-tax-relief-96" }
  ];

  var CRYPTOS = [
    { name: "Bitcoin (BTC)", category: "Payment", risk: "High", desc: "First and largest cryptocurrency, “digital gold”", rating: 5, logo: "bitcoin-logo.png", url: "https://www.coingecko.com/en/coins/bitcoin" },
    { name: "Ethereum (ETH)", category: "Smart Contracts", risk: "High", desc: "Smart contracts pioneer, DeFi & NFT leader", rating: 5, logo: "ethereum-logo.png", url: "https://www.coingecko.com/en/coins/ethereum" },
    { name: "BNB (Binance Coin)", category: "Exchange", risk: "High", desc: "Major exchange token, utility on Binance ecosystem", rating: 4, logo: "binance-coin-logo.png", url: "https://www.coingecko.com/en/coins/binancecoin" },
    { name: "Solana (SOL)", category: "Smart Contracts", risk: "High", desc: "High-speed, low-cost blockchain for DeFi & NFTs", rating: 4, logo: "solana-logo.png", url: "https://www.coingecko.com/en/coins/solana" },
    { name: "Polygon (MATIC)", category: "Layer 2", risk: "High", desc: "Ethereum scaling, Indian founders, rapid ecosystem growth", rating: 4, logo: "polygon-logo.png", url: "https://www.coingecko.com/en/coins/polygon" },
    { name: "XRP (Ripple)", category: "Payment", risk: "High", desc: "Cross-border payments network, fast settlements", rating: 4, logo: "ripple-xrp-logo.png", url: "https://www.coingecko.com/en/coins/ripple" }
  ];

  /* ---------- Helpers ---------- */

  function esc(s) {
    return String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
  }

  // Build a 5-slot star string: filled ⭐️ up to rating, hollow ☆ after.
  function stars(n) {
    n = Math.max(0, Math.min(5, n | 0));
    return "⭐️".repeat(n) + "☆".repeat(5 - n);
  }

  function detailsLink(url) {
    return '<a href="' + esc(url) + '" target="_blank" rel="noopener" class="btn rec-details-btn">Details</a>';
  }

  function header(logo, name, chipsHtml) {
    return '<div class="rec-card-header">' +
      '<img src="' + esc(logo) + '" alt="' + esc(name) + '" width="34" height="34" loading="lazy" ' +
      'onerror="this.style.display=\'none\'">' +
      '<strong>' + esc(name) + '</strong>' + chipsHtml + '</div>';
  }

  function desc(text) {
    return '<div class="rec-card-desc">' + esc(text) + '</div>';
  }

  /* ---------- Card builders ---------- */

  function stockCard(s) {
    var chips = '<span class="sector-chip">' + esc(s.sector) + '</span>';
    return '<div class="stock-card" data-sector="' + esc(s.sector) + '">' +
      header(s.logo, s.name, chips) + desc(s.desc) +
      '<div class="rec-card-rating">' + stars(s.rating) + '</div>' +
      detailsLink(s.url) + '</div>';
  }

  function riskChip(cls, risk) {
    var high = risk === "High" ? " risk-high" : "";
    return '<span class="' + cls + high + '">' + esc(risk) + '</span>';
  }

  function fundCard(f) {
    var chips = '<span class="mf-type-chip">' + esc(f.type) + '</span>' +
      riskChip("mf-risk-chip", f.risk);
    return '<div class="mf-card" data-type="' + esc(f.type) + '" data-risk="' + esc(f.risk) + '">' +
      header(f.logo, f.name, chips) + desc(f.desc) +
      '<div class="rec-card-rating">' + stars(f.rating) + '</div>' +
      detailsLink(f.url) + '</div>';
  }

  function cryptoCard(c) {
    var chips = '<span class="crypto-type-chip">' + esc(c.category) + '</span>' +
      riskChip("crypto-risk-chip", c.risk);
    return '<div class="crypto-card" data-category="' + esc(c.category) + '" data-risk="' + esc(c.risk) + '">' +
      header(c.logo, c.name, chips) + desc(c.desc) +
      '<div class="rec-card-rating crypto">' + stars(c.rating) + '</div>' +
      detailsLink(c.url) + '</div>';
  }

  /* ---------- Render + search ---------- */

  // Render `items` into `listId`, then wire `searchId` to filter on the
  // given searchable fields. No-ops if the list isn't on this page.
  function setupList(listId, searchId, items, cardFn, fields) {
    var list = document.getElementById(listId);
    if (!list) return;

    list.innerHTML = items.map(cardFn).join("");

    var search = document.getElementById(searchId);
    if (!search) return;

    search.addEventListener("input", function () {
      var q = search.value.trim().toLowerCase();
      var cards = list.children;
      var anyVisible = false;
      for (var i = 0; i < cards.length; i++) {
        var item = items[i];
        var hay = fields.map(function (f) { return item[f]; }).join(" ").toLowerCase();
        var show = !q || hay.indexOf(q) !== -1;
        cards[i].style.display = show ? "" : "none";
        if (show) anyVisible = true;
      }
      var empty = document.getElementById(listId + "-empty");
      if (empty) empty.style.display = anyVisible ? "none" : "";
    });
  }

  /** Highest-rated picks across stocks / funds / crypto for the home dashboard. */
  function topPicks(limit) {
    limit = limit || 3;
    var pool = [];
    STOCKS.forEach(function (s) {
      pool.push({
        name: s.name,
        rating: s.rating,
        detail: s.sector + " · " + s.rating + "★",
        href: "stocks.html",
        kind: "stock"
      });
    });
    FUNDS.forEach(function (f) {
      pool.push({
        name: f.name,
        rating: f.rating,
        detail: f.type + " · " + f.rating + "★",
        href: "mutualfunds.html",
        kind: "fund"
      });
    });
    CRYPTOS.forEach(function (c) {
      pool.push({
        name: c.name,
        rating: c.rating,
        detail: c.category + " · " + c.rating + "★",
        href: "cryptocurrencies.html",
        kind: "crypto"
      });
    });
    pool.sort(function (a, b) {
      return b.rating - a.rating || a.name.localeCompare(b.name);
    });
    // Prefer diversity: one of each kind when possible
    var picked = [];
    var usedKind = {};
    var i;
    for (i = 0; i < pool.length && picked.length < limit; i++) {
      if (!usedKind[pool[i].kind]) {
        picked.push(pool[i]);
        usedKind[pool[i].kind] = true;
      }
    }
    for (i = 0; i < pool.length && picked.length < limit; i++) {
      if (picked.indexOf(pool[i]) === -1) picked.push(pool[i]);
    }
    return picked;
  }

  global.IIReco = {
    STOCKS: STOCKS,
    FUNDS: FUNDS,
    CRYPTOS: CRYPTOS,
    topPicks: topPicks
  };

  document.addEventListener("DOMContentLoaded", function () {
    setupList("stock-list", "stock-search", STOCKS, stockCard, ["name", "sector", "desc"]);
    setupList("mf-list", "mf-search", FUNDS, fundCard, ["name", "type", "risk", "desc"]);
    setupList("crypto-list", "crypto-search", CRYPTOS, cryptoCard, ["name", "category", "risk", "desc"]);
  });
})(typeof window !== "undefined" ? window : globalThis);
