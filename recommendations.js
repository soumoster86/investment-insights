/* ============================================================
   Investment Insights — data-driven recommendations
   Renders Stocks / Mutual Funds / Cryptocurrency cards, search,
   sort, and filter controls. Local logos or initials avatars
   (no Clearbit). Exposes window.IIReco for the home dashboard.
   ============================================================ */
(function (global) {
  "use strict";

  /* ---------- Data (logo: local path or omit for initials) ---------- */

  var STOCKS = [
    { name: "TCS", sector: "IT", desc: "India’s IT giant, global leader in digital transformation", rating: 4, url: "https://finance.yahoo.com/quote/TCS.NS" },
    { name: "Infosys", sector: "IT", desc: "Leading IT services firm, strong global client base", rating: 4, url: "https://finance.yahoo.com/quote/INFY.NS" },
    { name: "HDFC Bank", sector: "Banking", desc: "India’s largest private sector bank, stable returns", rating: 5, url: "https://finance.yahoo.com/quote/HDFCBANK.NS" },
    { name: "ICICI Bank", sector: "Banking", desc: "Strong retail presence, tech-driven banking leader", rating: 4, url: "https://finance.yahoo.com/quote/ICICIBANK.NS" },
    { name: "Hindustan Unilever", sector: "FMCG", desc: "India’s leading FMCG company, trusted brands portfolio", rating: 4, url: "https://finance.yahoo.com/quote/HINDUNILVR.NS" },
    { name: "Asian Paints", sector: "FMCG", desc: "Market leader in decorative paints and coatings", rating: 4, url: "https://finance.yahoo.com/quote/ASIANPAINT.NS" },
    { name: "Maruti Suzuki", sector: "Auto", desc: "India’s top automobile manufacturer, strong sales", rating: 4, url: "https://finance.yahoo.com/quote/MARUTI.NS" },
    { name: "Tata Motors", sector: "Auto", desc: "Leading auto player, strong EV and CV portfolio", rating: 4, url: "https://finance.yahoo.com/quote/TATAMOTORS.NS" },
    { name: "Larsen & Toubro", sector: "Infra", desc: "Engineering and infra conglomerate, diversified order book", rating: 4, url: "https://finance.yahoo.com/quote/LT.NS" },
    { name: "Bharti Airtel", sector: "Telecom", desc: "Top telecom operator, growing data market share", rating: 4, url: "https://finance.yahoo.com/quote/BHARTIARTL.NS" },
    { name: "Reliance Industries", sector: "Conglomerate", desc: "Diversified energy, retail, digital, telecom businesses", rating: 5, url: "https://finance.yahoo.com/quote/RELIANCE.NS" }
  ];

  var FUNDS = [
    { name: "Parag Parikh Flexi Cap", type: "Multi-cap", risk: "Moderate", desc: "Long-term, value-focused, global exposure", rating: 5, url: "https://www.ppfas.com/mutual-fund/schemes/parag-parikh-flexi-cap-fund/" },
    { name: "Axis Bluechip Fund", type: "Large-cap", risk: "Low", desc: "Consistent performer in top large caps", rating: 4, url: "https://www.axismf.com/" },
    { name: "DSP Midcap Fund", type: "Mid-cap", risk: "Moderate", desc: "Growth-focused, seasoned fund management", rating: 4, url: "https://www.dspim.com/our-funds/dsp-midcap-fund-direct-plan-growth" },
    { name: "HDFC Balanced Advantage", type: "Hybrid", risk: "Low", desc: "Balances growth & stability, dynamic asset allocation", rating: 4, url: "https://www.hdfcfund.com/products/mutual-fund/hdfc-balanced-advantage-fund/regular-plan/growth" },
    { name: "ICICI Pru Equity & Debt", type: "Large & Mid-cap", risk: "Moderate", desc: "Equity/debt mix, good for balanced growth", rating: 4, url: "https://www.icicipruamc.com/mutual-fund-scheme/icici-prudential-equity-and-debt-fund" },
    { name: "Mirae Asset Large Cap", type: "Large-cap", risk: "Low", desc: "Strong large cap focus, consistent performance", rating: 4, url: "https://www.miraeassetmf.co.in/mutual-fund-schemes/equity/mirae-asset-large-cap-fund" },
    { name: "SBI Small Cap Fund", type: "Small-cap", risk: "High", desc: "High growth potential, suitable for aggressive investors", rating: 4, url: "https://www.sbimf.com/en-us/schemes/equity/sbi-small-cap-fund/regular-plan/growth" },
    { name: "Aditya Birla Sun Life Tax Relief 96", type: "ELSS", risk: "Moderate", desc: "Popular tax-saving (80C) equity fund, >20-year track record", rating: 4, url: "https://mutualfund.adityabirlacapital.com/products/equity-schemes/tax-savings-funds/aditya-birla-sun-life-tax-relief-96" }
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
    return String(s)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
  }

  function stars(n) {
    n = Math.max(0, Math.min(5, n | 0));
    return "⭐️".repeat(n) + "☆".repeat(5 - n);
  }

  function initials(name) {
    var parts = String(name)
      .replace(/\(.*?\)/g, "")
      .trim()
      .split(/\s+/)
      .filter(Boolean);
    if (!parts.length) return "?";
    if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
  }

  /** Stable hue from name so avatars look consistent. */
  function avatarHue(name) {
    var h = 0;
    var s = String(name);
    for (var i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) % 360;
    return h;
  }

  function logoOrAvatar(logo, name) {
    if (logo) {
      return (
        '<img src="' +
        esc(logo) +
        '" alt="" width="34" height="34" loading="lazy" ' +
        'class="rec-logo" onerror="this.style.display=\'none\';var n=this.nextElementSibling;if(n)n.hidden=false;">' +
        '<span class="rec-avatar" hidden aria-hidden="true" style="--av-hue:' +
        avatarHue(name) +
        '">' +
        esc(initials(name)) +
        "</span>"
      );
    }
    return (
      '<span class="rec-avatar" aria-hidden="true" style="--av-hue:' +
      avatarHue(name) +
      '">' +
      esc(initials(name)) +
      "</span>"
    );
  }

  function detailsLink(url) {
    return (
      '<a href="' +
      esc(url) +
      '" target="_blank" rel="noopener noreferrer" class="btn rec-details-btn">Details <span class="sr-only">(opens in new tab)</span></a>'
    );
  }

  function header(logo, name, chipsHtml) {
    return (
      '<div class="rec-card-header">' +
      logoOrAvatar(logo, name) +
      "<strong>" +
      esc(name) +
      "</strong>" +
      chipsHtml +
      "</div>"
    );
  }

  function desc(text) {
    return '<div class="rec-card-desc">' + esc(text) + "</div>";
  }

  function riskChip(cls, risk) {
    var high = risk === "High" ? " risk-high" : "";
    return '<span class="' + cls + high + '">' + esc(risk) + "</span>";
  }

  function stockCard(s) {
    var chips = '<span class="sector-chip">' + esc(s.sector) + "</span>";
    return (
      '<article class="stock-card" data-sector="' +
      esc(s.sector) +
      '" data-rating="' +
      s.rating +
      '">' +
      header(s.logo, s.name, chips) +
      desc(s.desc) +
      '<div class="rec-card-rating" aria-label="Rating ' +
      s.rating +
      ' of 5">' +
      stars(s.rating) +
      "</div>" +
      detailsLink(s.url) +
      "</article>"
    );
  }

  function fundCard(f) {
    var chips =
      '<span class="mf-type-chip">' +
      esc(f.type) +
      "</span>" +
      riskChip("mf-risk-chip", f.risk);
    return (
      '<article class="mf-card" data-type="' +
      esc(f.type) +
      '" data-risk="' +
      esc(f.risk) +
      '" data-rating="' +
      f.rating +
      '">' +
      header(f.logo, f.name, chips) +
      desc(f.desc) +
      '<div class="rec-card-rating" aria-label="Rating ' +
      f.rating +
      ' of 5">' +
      stars(f.rating) +
      "</div>" +
      detailsLink(f.url) +
      "</article>"
    );
  }

  function cryptoCard(c) {
    var chips =
      '<span class="crypto-type-chip">' +
      esc(c.category) +
      "</span>" +
      riskChip("crypto-risk-chip", c.risk);
    return (
      '<article class="crypto-card" data-category="' +
      esc(c.category) +
      '" data-risk="' +
      esc(c.risk) +
      '" data-rating="' +
      c.rating +
      '">' +
      header(c.logo, c.name, chips) +
      desc(c.desc) +
      '<div class="rec-card-rating crypto" aria-label="Rating ' +
      c.rating +
      ' of 5">' +
      stars(c.rating) +
      "</div>" +
      detailsLink(c.url) +
      "</article>"
    );
  }

  function uniqueValues(items, field) {
    var seen = {};
    var out = [];
    items.forEach(function (it) {
      var v = it[field];
      if (v && !seen[v]) {
        seen[v] = true;
        out.push(v);
      }
    });
    out.sort();
    return out;
  }

  function sortItems(items, mode) {
    var copy = items.slice();
    if (mode === "rating-desc") {
      copy.sort(function (a, b) {
        return b.rating - a.rating || a.name.localeCompare(b.name);
      });
    } else if (mode === "rating-asc") {
      copy.sort(function (a, b) {
        return a.rating - b.rating || a.name.localeCompare(b.name);
      });
    } else if (mode === "name-asc") {
      copy.sort(function (a, b) {
        return a.name.localeCompare(b.name);
      });
    } else if (mode === "name-desc") {
      copy.sort(function (a, b) {
        return b.name.localeCompare(a.name);
      });
    }
    return copy;
  }

  /**
   * options: {
   *   listId, searchId, toolbarId, items, cardFn, searchFields,
   *   filterField?: 'sector'|'type'|'category',
   *   riskField?: boolean  // show risk filter when items have .risk
   * }
   */
  function setupList(options) {
    var list = document.getElementById(options.listId);
    if (!list) return;

    var items = options.items;
    var cardFn = options.cardFn;
    var searchFields = options.searchFields;
    var search = options.searchId
      ? document.getElementById(options.searchId)
      : null;
    var toolbar = options.toolbarId
      ? document.getElementById(options.toolbarId)
      : null;

    var state = {
      q: "",
      filter: "",
      risk: "",
      sort: "rating-desc"
    };

    function buildToolbar() {
      if (!toolbar) return;

      var filterOpts = "";
      if (options.filterField) {
        var vals = uniqueValues(items, options.filterField);
        var label =
          options.filterField === "sector"
            ? "Sector"
            : options.filterField === "type"
              ? "Type"
              : "Category";
        filterOpts =
          '<label class="rec-control">' +
          '<span class="rec-control-label">' +
          label +
          "</span>" +
          '<select id="' +
          options.listId +
          '-filter" aria-label="Filter by ' +
          label.toLowerCase() +
          '">' +
          '<option value="">All</option>' +
          vals
            .map(function (v) {
              return '<option value="' + esc(v) + '">' + esc(v) + "</option>";
            })
            .join("") +
          "</select></label>";
      }

      var riskOpts = "";
      if (options.riskField) {
        riskOpts =
          '<label class="rec-control">' +
          '<span class="rec-control-label">Risk</span>' +
          '<select id="' +
          options.listId +
          '-risk" aria-label="Filter by risk">' +
          '<option value="">All</option>' +
          '<option value="Low">Low</option>' +
          '<option value="Moderate">Moderate</option>' +
          '<option value="High">High</option>' +
          "</select></label>";
      }

      toolbar.innerHTML =
        '<div class="rec-toolbar" role="search">' +
        filterOpts +
        riskOpts +
        '<label class="rec-control">' +
        '<span class="rec-control-label">Sort</span>' +
        '<select id="' +
        options.listId +
        '-sort" aria-label="Sort recommendations">' +
        '<option value="rating-desc">Rating (high → low)</option>' +
        '<option value="rating-asc">Rating (low → high)</option>' +
        '<option value="name-asc">Name (A → Z)</option>' +
        '<option value="name-desc">Name (Z → A)</option>' +
        "</select></label>" +
        '<p class="rec-count" id="' +
        options.listId +
        '-count" aria-live="polite"></p>' +
        "</div>";

      var filterEl = document.getElementById(options.listId + "-filter");
      var riskEl = document.getElementById(options.listId + "-risk");
      var sortEl = document.getElementById(options.listId + "-sort");

      if (filterEl) {
        filterEl.addEventListener("change", function () {
          state.filter = filterEl.value;
          render();
        });
      }
      if (riskEl) {
        riskEl.addEventListener("change", function () {
          state.risk = riskEl.value;
          render();
        });
      }
      if (sortEl) {
        sortEl.value = state.sort;
        sortEl.addEventListener("change", function () {
          state.sort = sortEl.value;
          render();
        });
      }
    }

    function matches(item) {
      if (state.filter && options.filterField) {
        if (item[options.filterField] !== state.filter) return false;
      }
      if (state.risk && item.risk !== state.risk) return false;
      if (state.q) {
        var hay = searchFields
          .map(function (f) {
            return item[f];
          })
          .join(" ")
          .toLowerCase();
        if (hay.indexOf(state.q) === -1) return false;
      }
      return true;
    }

    function render() {
      var filtered = items.filter(matches);
      var sorted = sortItems(filtered, state.sort);
      list.innerHTML = sorted.map(cardFn).join("");

      var empty = document.getElementById(options.listId + "-empty");
      if (empty) empty.style.display = sorted.length ? "none" : "";

      var countEl = document.getElementById(options.listId + "-count");
      if (countEl) {
        countEl.textContent =
          sorted.length +
          " of " +
          items.length +
          " shown" +
          (sorted.length === 0 ? " — try clearing filters" : "");
      }
    }

    buildToolbar();

    if (search) {
      if (!search.getAttribute("aria-label") && search.placeholder) {
        search.setAttribute("aria-label", search.placeholder);
      }
      search.addEventListener("input", function () {
        state.q = search.value.trim().toLowerCase();
        render();
      });
    }

    render();
  }

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
    setupList({
      listId: "stock-list",
      searchId: "stock-search",
      toolbarId: "stock-toolbar",
      items: STOCKS,
      cardFn: stockCard,
      searchFields: ["name", "sector", "desc"],
      filterField: "sector"
    });
    setupList({
      listId: "mf-list",
      searchId: "mf-search",
      toolbarId: "mf-toolbar",
      items: FUNDS,
      cardFn: fundCard,
      searchFields: ["name", "type", "risk", "desc"],
      filterField: "type",
      riskField: true
    });
    setupList({
      listId: "crypto-list",
      searchId: "crypto-search",
      toolbarId: "crypto-toolbar",
      items: CRYPTOS,
      cardFn: cryptoCard,
      searchFields: ["name", "category", "risk", "desc"],
      filterField: "category",
      riskField: true
    });
  });
})(typeof window !== "undefined" ? window : globalThis);
