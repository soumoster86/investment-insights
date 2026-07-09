/**
 * Client-side site search (header Ctrl+K / search button).
 * Includes individual calculators with deep links, not only hub pages.
 */
(function () {
  "use strict";

  /** @type {{ url: string, title: string, type: string, keywords: string, blurb?: string }[]} */
  var searchIndex = [
    // —— Calculators (deep links first so specific tools rank well) ——
    {
      url: "mutualfunds.html#sipcalc-mutual",
      title: "SIP calculator",
      type: "Calculator",
      keywords:
        "sip systematic investment plan monthly invest step-up corpus cagr mutual fund calculator tool",
      blurb: "Project corpus from a monthly SIP with optional step-up."
    },
    {
      url: "mutualfunds.html#swpcalc-mutual",
      title: "SWP calculator",
      type: "Calculator",
      keywords:
        "swp systematic withdrawal plan withdraw monthly corpus drawdown mutual fund calculator tool",
      blurb: "Model regular withdrawals or max sustainable drawdown."
    },
    {
      url: "investmentgoal.html",
      title: "Goal planner",
      type: "Calculator",
      keywords:
        "goal planner target sip investment goal future corpus inflation step-up portfolio model calculator tool",
      blurb: "Inflation-aware SIP / target planning with scenarios."
    },
    {
      url: "tools.html#target-sip",
      title: "Target SIP calculator",
      type: "Calculator",
      keywords: "target sip reverse sip goal amount monthly needed calculator tool how much sip",
      blurb: "How much to invest monthly to aim for a goal amount."
    },
    {
      url: "tools.html#lumpsum",
      title: "Lumpsum calculator",
      type: "Calculator",
      keywords: "lumpsum lump sum one time investment future value calculator tool",
      blurb: "Future value of a one-time investment."
    },
    {
      url: "tools.html#cagr",
      title: "CAGR calculator",
      type: "Calculator",
      keywords: "cagr compound annual growth rate return calculator tool",
      blurb: "Compound annual growth rate between two values."
    },
    {
      url: "tools.html#inflation",
      title: "Inflation calculator",
      type: "Calculator",
      keywords: "inflation purchasing power future cost calculator tool cpi",
      blurb: "How inflation raises future costs."
    },
    {
      url: "tools.html#emi",
      title: "EMI calculator",
      type: "Calculator",
      keywords: "emi loan home car personal emi interest tenure calculator tool",
      blurb: "Home, car, or personal loan EMI estimate."
    },
    {
      url: "tools.html#ppf",
      title: "PPF calculator",
      type: "Calculator",
      keywords: "ppf public provident fund calculator tool 15 year contribution",
      blurb: "PPF-style growth sketch with yearly contributions."
    },
    {
      url: "tools.html#rd",
      title: "RD calculator",
      type: "Calculator",
      keywords: "rd recurring deposit calculator tool monthly deposit maturity",
      blurb: "Recurring deposit maturity estimate."
    },
    {
      url: "fixeddeposit.html#fd-calculator",
      title: "FD maturity calculator",
      type: "Calculator",
      keywords: "fd fixed deposit maturity interest compounding calculator tool bank",
      blurb: "Principal, rate, compounding, and maturity breakdown."
    },
    {
      url: "fixeddeposit.html#fd-ladder-tool",
      title: "FD ladder planner",
      type: "Calculator",
      keywords: "fd ladder fixed deposit ladder stagger maturity calculator tool",
      blurb: "Split a deposit across staggered maturities."
    },
    {
      url: "nps.html#calculator-nps",
      title: "NPS planner",
      type: "Calculator",
      keywords: "nps national pension system calculator pension corpus retirement tool",
      blurb: "NPS corpus and illustrative pension estimate."
    },
    {
      url: "bonds.html#bond-yield-calculator",
      title: "Bond yield calculator",
      type: "Calculator",
      keywords: "bond yield ytm current yield coupon price calculator tool fixed income",
      blurb: "Approximate YTM from price, coupon, and tenure."
    },
    {
      url: "bonds.html#bond-ladder-tool",
      title: "Bond ladder planner",
      type: "Calculator",
      keywords: "bond ladder maturity ladder fixed income calculator tool",
      blurb: "Simple bond maturity ladder sketch."
    },
    {
      url: "stocks.html#stock-pnl",
      title: "Stock trade P&L",
      type: "Calculator",
      keywords: "stock pnl p&l profit loss trade calculator shares equity tool",
      blurb: "Buy/sell P&L sketch with optional fees."
    },
    {
      url: "cryptocurrencies.html#crypto-risk-tool",
      title: "Crypto risk capital",
      type: "Calculator",
      keywords: "crypto risk capital allocation sizing bitcoin calculator tool high risk",
      blurb: "Size a high-risk crypto allocation."
    },
    {
      url: "cryptocurrencies.html#crypto-pnl",
      title: "Crypto trade P&L",
      type: "Calculator",
      keywords: "crypto pnl p&l profit loss trade calculator tool",
      blurb: "Round-trip crypto P&L with fee estimate."
    },
    {
      url: "intraday.html#risk-capital-intraday",
      title: "Intraday risk size",
      type: "Calculator",
      keywords: "intraday risk capital day trading sizing calculator tool leverage",
      blurb: "Cap the day’s risk capital (educational)."
    },
    {
      url: "calculators.html",
      title: "All calculators",
      type: "Hub",
      keywords: "calculators hub all tools sip swp fd nps goal emi list catalogue",
      blurb: "Browse every calculator on the site."
    },
    {
      url: "tools.html",
      title: "More tools (EMI · PPF · RD · …)",
      type: "Hub",
      keywords: "tools hub emi ppf rd lumpsum cagr inflation target sip",
      blurb: "Standalone tools page with jump chips."
    },

    // —— Home dashboard tools (KPI strip) ——
    {
      url: "index.html#currency-card",
      title: "Currency converter",
      type: "Tool",
      keywords:
        "currency converter fx foreign exchange usd inr eur gbp jpy sgd chf convert money rate home dashboard kpi",
      blurb: "Convert amounts between INR and major currencies on the home page."
    },
    {
      url: "index.html#gold-silver-card",
      title: "Metals (gold & silver rates)",
      type: "Tool",
      keywords:
        "metals metal gold silver rate price per gram 10g bullion bullion rates refresh home dashboard kpi",
      blurb: "Indicative gold and silver rates in INR on the home page."
    },
    {
      url: "index.html#kpi",
      title: "Last calculator",
      type: "Tool",
      keywords:
        "last calculator recent calculator reopen last used tool history home dashboard kpi resume",
      blurb: "Reopen the calculator you used most recently (saved in this browser)."
    },
    {
      url: "index.html#goal-summary-card",
      title: "Your goal snapshot",
      type: "Tool",
      keywords:
        "your goal goal summary saved goal dashboard home snapshot sip corpus plan kpi",
      blurb: "Saved goal plan from the goal planner, shown on the home dashboard."
    },
    {
      url: "index.html#kpi",
      title: "Home tools snapshot",
      type: "Hub",
      keywords:
        "home tools snapshot kpi dashboard metals currency last calculator your goal strip",
      blurb: "Goal, last calculator, metals, and currency on the home page."
    },

    // —— Guides & pages ——
    {
      url: "index.html",
      title: "Home",
      type: "Page",
      keywords:
        "home start overview explore dashboard goal metals currency gold silver last calculator fx convert"
    },
    {
      url: "learn.html",
      title: "All Learn topics",
      type: "Hub",
      keywords: "learn hub guides tutorials topics path beginner"
    },
    {
      url: "contact.html",
      title: "Contact",
      type: "Page",
      keywords: "contact message feedback support email"
    },
    {
      url: "basics.html",
      title: "How to start investing",
      type: "Guide",
      keywords: "basics beginner start kyc demat compounding inflation first sip"
    },
    {
      url: "risk-allocation.html",
      title: "Risk & allocation",
      type: "Guide",
      keywords: "risk asset allocation portfolio diversification horizon"
    },
    {
      url: "ppf-tax-saving.html",
      title: "PPF & tax-saving",
      type: "Guide",
      keywords: "ppf 80c tax saving elss provident fund"
    },
    {
      url: "insurance-emergency.html",
      title: "Emergency & insurance",
      type: "Guide",
      keywords: "emergency fund term life health insurance safety buffer"
    },
    {
      url: "tax-overview.html",
      title: "Tax overview",
      type: "Guide",
      keywords: "tax capital gains stcg ltcg income slabs investor"
    },
    {
      url: "gold.html",
      title: "Gold investing",
      type: "Guide",
      keywords: "gold sgb sovereign bonds etf physical jewellery"
    },
    {
      url: "realestate.html",
      title: "Real estate investing",
      type: "Guide",
      keywords: "real estate property home loan emi reit flat residential commercial stamp duty rera"
    },
    {
      url: "index-vs-active.html",
      title: "Index vs active funds",
      type: "Guide",
      keywords: "index active passive alpha expense ratio nifty"
    },
    {
      url: "mutualfunds.html",
      title: "Mutual funds guide",
      type: "Guide",
      keywords: "mutual funds sip nav amc equity debt hybrid categories"
    },
    {
      url: "stocks.html",
      title: "Stocks guide",
      type: "Guide",
      keywords: "stocks shares equity demat dividends nse bse market cap"
    },
    {
      url: "etf.html",
      title: "ETFs guide",
      type: "Guide",
      keywords: "etf exchange traded funds liquidity index tracking expense"
    },
    {
      url: "ipo.html",
      title: "IPO guide",
      type: "Guide",
      keywords: "ipo initial public offering listing gains drhp allotment"
    },
    {
      url: "intraday.html",
      title: "Intraday trading",
      type: "Guide",
      keywords: "intraday day trading margin leverage stop loss risk"
    },
    {
      url: "futures-options.html",
      title: "Futures & Options (F&O)",
      type: "Guide",
      keywords:
        "futures options f&o derivatives call put premium strike expiry margin leverage nifty bank nifty hedging payoff",
      blurb: "How futures and options work, risks, and a simple payoff sketch."
    },
    {
      url: "usstocks.html",
      title: "US stocks",
      type: "Guide",
      keywords: "us stocks international nasdaq s&p500 fractional lrs forex"
    },
    {
      url: "fixeddeposit.html",
      title: "Fixed deposits guide",
      type: "Guide",
      keywords: "fixed deposits fd bank interest compounding ladder"
    },
    {
      url: "nps.html",
      title: "NPS guide",
      type: "Guide",
      keywords: "nps national pension system retirement 80ccd annuity"
    },
    {
      url: "bonds.html",
      title: "Bonds guide",
      type: "Guide",
      keywords: "bonds fixed income corporate g-sec yield coupon credit"
    },
    {
      url: "cryptocurrencies.html",
      title: "Crypto guide",
      type: "Guide",
      keywords: "cryptocurrency crypto bitcoin blockchain digital high risk india"
    }
  ];

  function normalize(s) {
    return String(s || "")
      .toLowerCase()
      .replace(/&/g, " and ")
      .replace(/[^a-z0-9%.\s#+-]/g, " ")
      .replace(/\s+/g, " ")
      .trim();
  }

  function tokens(query) {
    return normalize(query)
      .split(" ")
      .filter(function (t) {
        return t.length > 0;
      });
  }

  function scoreItem(item, qTokens, rawQuery) {
    if (!qTokens.length) return 0;
    var title = normalize(item.title);
    var keywords = normalize(item.keywords);
    var blurb = normalize(item.blurb || "");
    var type = normalize(item.type || "");
    var hay = title + " " + keywords + " " + blurb + " " + type;
    var score = 0;
    var i;

    // Every token must match somewhere
    for (i = 0; i < qTokens.length; i++) {
      if (hay.indexOf(qTokens[i]) === -1) return 0;
    }

    // Exact / prefix title boosts
    var nq = normalize(rawQuery);
    if (title === nq) score += 200;
    if (title.indexOf(nq) === 0) score += 80;
    if (title.indexOf(nq) !== -1) score += 40;

    for (i = 0; i < qTokens.length; i++) {
      var t = qTokens[i];
      if (title === t) score += 50;
      else if (title.indexOf(t) === 0) score += 30;
      else if (title.indexOf(t) !== -1) score += 18;
      if (keywords.indexOf(t) !== -1) score += 10;
      if (blurb.indexOf(t) !== -1) score += 4;
    }

    // Prefer calculators / home tools when query looks tool-oriented
    var toolish =
      /\b(calc|calculator|emi|sip|swp|fd|nps|ppf|rd|ytm|pnl|p&l|lumpsum|ladder|cagr|inflation|goal|currency|converter|fx|metal|metals|gold|silver|last calculator)\b/.test(
        nq
      );
    if (toolish && item.type === "Calculator") score += 25;
    if (toolish && item.type === "Tool") score += 28;
    if (toolish && item.type === "Hub") score += 8;
    if (!toolish && item.type === "Guide") score += 6;

    // Slight boost for shorter, more specific calculator/tool titles
    if (item.type === "Calculator" || item.type === "Tool") score += 5;

    return score;
  }

  function search(query) {
    var qTokens = tokens(query);
    if (!qTokens.length) return [];
    var scored = [];
    for (var i = 0; i < searchIndex.length; i++) {
      var item = searchIndex[i];
      var sc = scoreItem(item, qTokens, query);
      if (sc > 0) scored.push({ item: item, score: sc });
    }
    scored.sort(function (a, b) {
      return b.score - a.score || a.item.title.localeCompare(b.item.title);
    });
    return scored.slice(0, 12).map(function (s) {
      return s.item;
    });
  }

  function escapeHtml(s) {
    return String(s)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
  }

  function typeClass(type) {
    if (type === "Calculator") return "search-type-calc";
    if (type === "Tool") return "search-type-tool";
    if (type === "Guide") return "search-type-guide";
    if (type === "Hub") return "search-type-hub";
    return "search-type-page";
  }

  document.addEventListener("DOMContentLoaded", function () {
    var searchBtns = document.querySelectorAll(".nav-search-btn");
    var searchModal = document.getElementById("search-modal");
    var searchBackdrop = document.getElementById("search-backdrop");
    var searchClose = document.getElementById("search-close");
    var searchInput = document.getElementById("search-input");
    var searchResults = document.getElementById("search-results");

    if (!searchModal || !searchInput || !searchResults) return;

    function openSearch() {
      searchModal.classList.add("is-open");
      searchModal.setAttribute("aria-hidden", "false");
      document.body.style.overflow = "hidden";
      setTimeout(function () {
        searchInput.focus();
      }, 50);
    }

    function closeSearch() {
      searchModal.classList.remove("is-open");
      searchModal.setAttribute("aria-hidden", "true");
      document.body.style.overflow = "";
      searchInput.value = "";
      searchResults.innerHTML =
        '<div class="search-placeholder">Type to search — e.g. SIP, EMI, metals, currency, last calculator…</div>';
    }

    searchBtns.forEach(function (btn) {
      btn.addEventListener("click", openSearch);
    });
    if (searchClose) searchClose.addEventListener("click", closeSearch);
    if (searchBackdrop) searchBackdrop.addEventListener("click", closeSearch);

    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && searchModal.classList.contains("is-open")) {
        closeSearch();
      }
      if ((e.ctrlKey || e.metaKey) && (e.key === "k" || e.key === "K")) {
        e.preventDefault();
        if (searchModal.classList.contains("is-open")) closeSearch();
        else openSearch();
      }
    });

    function renderResults(results, query) {
      if (!query) {
        searchResults.innerHTML =
          '<div class="search-placeholder">Type to search — e.g. SIP, EMI, metals, currency, last calculator…</div>';
        return;
      }
      if (!results.length) {
        searchResults.innerHTML =
          '<div class="search-placeholder">No matches for “' +
          escapeHtml(query) +
          '”. Try SIP, EMI, FD, metals, currency, or a topic name.</div>';
        return;
      }

      var html = "";
      results.forEach(function (res) {
        html +=
          '<a href="' +
          escapeHtml(res.url) +
          '" class="search-result-item">' +
          '<div class="search-result-row">' +
          '<span class="search-result-type ' +
          typeClass(res.type) +
          '">' +
          escapeHtml(res.type || "Page") +
          "</span>" +
          '<span class="search-result-title">' +
          escapeHtml(res.title) +
          "</span>" +
          "</div>";
        if (res.blurb) {
          html +=
            '<div class="search-result-blurb">' + escapeHtml(res.blurb) + "</div>";
        }
        html += "</a>";
      });
      searchResults.innerHTML = html;
    }

    searchInput.addEventListener("input", function (e) {
      var query = e.target.value.trim();
      renderResults(search(query), query);
    });

    // Enter opens top result
    searchInput.addEventListener("keydown", function (e) {
      if (e.key !== "Enter") return;
      var first = searchResults.querySelector(".search-result-item");
      if (first) {
        e.preventDefault();
        window.location.href = first.getAttribute("href");
      }
    });
  });
})();
