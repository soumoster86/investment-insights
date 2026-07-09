
// search.js
// Client-side search implementation

const searchIndex = [
  { url: "index.html", title: "Home", keywords: "home start overview explore" },
  { url: "learn.html", title: "All Learn Topics", keywords: "learn hub guides tutorials topics" },
  { url: "calculators.html", title: "Calculators Hub", keywords: "calculators sip swp fd nps goal tools lumpsum target" },
  { url: "tools.html", title: "Tools Hub", keywords: "tools calculators p&l watchlist lumpsum" },
  { url: "contact.html", title: "Contact Us", feedback: "contact message feedback support" },
  { url: "investmentgoal.html", title: "Investment Goal Planner", keywords: "goal planner target planning future corpus sip lumpsum" },
  { url: "basics.html", title: "How to start investing", keywords: "basics beginner start compounding inflation" },
  { url: "risk-allocation.html", title: "Risk & allocation", keywords: "risk asset allocation portfolio diversification" },
  { url: "ppf-tax-saving.html", title: "PPF & tax-saving", keywords: "ppf 80c tax saving elss provident fund" },
  { url: "insurance-emergency.html", title: "Emergency & insurance", keywords: "emergency fund term life health insurance safety" },
  { url: "tax-overview.html", title: "Tax overview", keywords: "tax capital gains stcg ltcg income slabs" },
  { url: "gold.html", title: "Gold investing", keywords: "gold sgb sovereign bonds etf physical" },
  { url: "index-vs-active.html", title: "Index vs active funds", keywords: "index active passive alpha expense ratio nifty" },
  { url: "mutualfunds.html", title: "Mutual funds guide", keywords: "mutual funds sip nav amc equity debt" },
  { url: "stocks.html", title: "Stocks guide", keywords: "stocks shares equity demat dividends" },
  { url: "etf.html", title: "ETFs guide", keywords: "etf exchange traded funds liquidity" },
  { url: "ipo.html", title: "IPO guide", keywords: "ipo initial public offering listing gains drhp" },
  { url: "intraday.html", title: "Intraday trading", keywords: "intraday day trading margin leverage stop loss" },
  { url: "usstocks.html", title: "US stocks", keywords: "us stocks international nasdaq s&p500 fractional lrs" },
  { url: "fixeddeposit.html", title: "Fixed deposits", keywords: "fixed deposits fd safe guaranteed interest rate" },
  { url: "nps.html", title: "NPS guide", keywords: "nps national pension system retirement 80ccd" },
  { url: "bonds.html", title: "Bonds guide", keywords: "bonds fixed income corporate g-sec yield coupon" },
  { url: "cryptocurrencies.html", title: "Crypto guide", keywords: "cryptocurrency crypto bitcoin blockchain digital high risk" }
];

document.addEventListener("DOMContentLoaded", () => {
  const searchBtns = document.querySelectorAll(".nav-search-btn");
  const searchModal = document.getElementById("search-modal");
  const searchBackdrop = document.getElementById("search-backdrop");
  const searchClose = document.getElementById("search-close");
  const searchInput = document.getElementById("search-input");
  const searchResults = document.getElementById("search-results");

  if (!searchModal || !searchInput) return;

  function openSearch() {
    searchModal.classList.add("is-open");
    searchModal.setAttribute("aria-hidden", "false");
    document.body.style.overflow = "hidden"; // prevent background scrolling
    setTimeout(() => searchInput.focus(), 100);
  }

  function closeSearch() {
    searchModal.classList.remove("is-open");
    searchModal.setAttribute("aria-hidden", "true");
    document.body.style.overflow = "";
    searchInput.value = "";
    renderResults([]);
  }

  searchBtns.forEach(btn => btn.addEventListener("click", openSearch));
  searchClose.addEventListener("click", closeSearch);
  searchBackdrop.addEventListener("click", closeSearch);

  // Keyboard shortcuts
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && searchModal.classList.contains("is-open")) {
      closeSearch();
    }
    // Ctrl+K to open search
    if ((e.ctrlKey || e.metaKey) && e.key === "k") {
      e.preventDefault();
      openSearch();
    }
  });

  // Real-time search logic
  searchInput.addEventListener("input", (e) => {
    const query = e.target.value.toLowerCase().trim();
    if (!query) {
      searchResults.innerHTML = '<div class="search-placeholder">Type to search...</div>';
      return;
    }

    const results = searchIndex.filter(item => {
      const qTokens = query.split(" ");
      const targetStr = (item.title + " " + (item.keywords || "") + " " + (item.feedback || "")).toLowerCase();
      return qTokens.every(token => targetStr.includes(token));
    });

    renderResults(results);
  });

  function renderResults(results) {
    if (results.length === 0) {
      searchResults.innerHTML = '<div class="search-placeholder">No results found. Try different keywords.</div>';
      return;
    }

    let html = "";
    results.forEach(res => {
      html += `<a href="${res.url}" class="search-result-item">
                 <div class="search-result-title">${res.title}</div>
               </a>`;
    });
    searchResults.innerHTML = html;
  }
});
