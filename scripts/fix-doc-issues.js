/**
 * Fixes from II-Issues.docx:
 * 2) Add "On this page" floating TOC to ETF / IPO / Intraday / US Stocks
 * 4) Restore NSE live ticker on stocks.html via TradingView
 */
const fs = require("fs");
const path = require("path");
const ROOT = path.join(__dirname, "..");

function read(f) {
  return fs.readFileSync(path.join(ROOT, f), "utf8");
}
function write(f, s) {
  fs.writeFileSync(path.join(ROOT, f), s, "utf8");
  console.log("updated", f);
}

/** Assign ids to bare <section> tags in order (only those without id). */
function assignSectionIds(html, ids) {
  let i = 0;
  return html.replace(/<section(\s[^>]*)?>/gi, (full, attrs) => {
    attrs = attrs || "";
    if (/\bid\s*=/.test(attrs)) return full;
    if (i >= ids.length) return full;
    const id = ids[i++];
    return `<section id="${id}"${attrs}>`;
  });
}

function tocHtml(items) {
  const lis = items
    .map(
      ([id, label]) =>
        `      <li><a href="#${id}">${label}</a></li>`
    )
    .join("\n");
  return (
    `  <nav class="floating-toc" id="floating-toc" aria-label="On this page">\n` +
    `    <div class="toc-title">On this page</div>\n` +
    `    <ul>\n${lis}\n    </ul>\n` +
    `  </nav>\n`
  );
}

function tocScrollScript(sectionIds) {
  const arr = JSON.stringify(sectionIds);
  return `
<script>
(function () {
  var sections = ${arr};
  document.querySelectorAll(".floating-toc a").forEach(function (link) {
    link.addEventListener("click", function (e) {
      var target = document.querySelector(this.getAttribute("href"));
      if (target) {
        e.preventDefault();
        window.scrollTo({ top: target.offsetTop - 65, behavior: "smooth" });
      }
    });
  });
  window.addEventListener("scroll", function () {
    var current = "";
    for (var i = 0; i < sections.length; i++) {
      var sec = document.getElementById(sections[i]);
      if (sec && window.scrollY + 120 >= sec.offsetTop) current = sections[i];
    }
    document.querySelectorAll(".floating-toc a").forEach(function (a) {
      a.classList.toggle("active", a.getAttribute("href") === "#" + current);
    });
  });
})();
</script>
`;
}

function ensureToc(html, items, insertAfterMarker) {
  if (
    html.includes('class="floating-toc"') &&
    !html.includes("<!--\n  <nav class=\"floating-toc\"") &&
    !/<!--[\s\S]*floating-toc[\s\S]*-->/.test(
      html.match(/<!--[\s\S]{0,800}floating-toc[\s\S]{0,400}-->/) || [""]
    )[0]
  ) {
    // Has live floating-toc
    if (html.includes('id="floating-toc"') && !html.includes("<!-- Floating ToC")) {
      return html;
    }
  }

  // Remove broken commented TOC blocks on usstocks
  html = html.replace(
    /<!--\s*Floating ToC[\s\S]*?<-->\s*/i,
    ""
  );
  html = html.replace(
    /<!--\s*\n\s*<nav class="floating-toc"[\s\S]*?<\/nav>\s*<-->\s*/i,
    ""
  );

  if (html.includes('class="floating-toc"') && !html.includes("<!--")) {
    // already real
  }

  const toc = tocHtml(items);
  if (insertAfterMarker && html.includes(insertAfterMarker)) {
    html = html.replace(insertAfterMarker, insertAfterMarker + "\n" + toc);
  } else if (/<!-- END SITE HEADER -->/.test(html)) {
    html = html.replace(
      /<!-- END SITE HEADER -->/,
      "<!-- END SITE HEADER -->\n" + toc
    );
  }

  // Scroll spy script once
  const ids = items.map((x) => x[0]);
  if (!html.includes("floating-toc a") || !html.includes("scrollTo")) {
    // Only add if no existing floating-toc scroll handler
    if (!/querySelectorAll\(['\"]\.floating-toc a['\"]\)/.test(html)) {
      html = html.replace(
        /(<script src=["']nav\.js["'][^>]*><\/script>)/,
        tocScrollScript(ids) + "\n$1"
      );
    }
  }
  return html;
}

// ---------- ETF ----------
{
  let h = read("etf.html");
  const ids = [
    "about-etf",
    "benefits-etf",
    "types-etf",
    "invest-etf",
    "popular-etf",
    "compare-etf",
    "sip-returns-etf",
    "sip-faq-etf",
    "who-etf",
    "faq-etf"
  ];
  const labels = [
    ["about-etf", "What is an ETF?"],
    ["benefits-etf", "Benefits"],
    ["types-etf", "Types"],
    ["invest-etf", "How to invest"],
    ["popular-etf", "Popular ETFs"],
    ["compare-etf", "ETF vs Index MF"],
    ["sip-returns-etf", "SIP returns"],
    ["sip-faq-etf", "SIP FAQs"],
    ["who-etf", "Who should invest"],
    ["faq-etf", "FAQs"]
  ];
  h = assignSectionIds(h, ids);
  if (!h.includes('class="floating-toc"')) {
    h = h.replace(
      /(<nav class="etf-float-menu">[\s\S]*?<\/nav>)/,
      "$1\n" + tocHtml(labels)
    );
  }
  if (!/querySelectorAll\(['\"]\.floating-toc a['\"]\)/.test(h)) {
    h = h.replace(
      /(<script src=["']nav\.js["'][^>]*><\/script>)/,
      tocScrollScript(ids) + "\n$1"
    );
  }
  write("etf.html", h);
}

// ---------- IPO ----------
{
  let h = read("ipo.html");
  const ids = [
    "about-ipo",
    "how-ipo",
    "why-ipo",
    "risks-ipo",
    "apply-ipo",
    "live-ipo",
    "recent-ipo",
    "listing-gains",
    "faq-ipo"
  ];
  // There may be more/fewer sections — assign sequentially to bare sections
  const labels = [
    ["about-ipo", "What is an IPO?"],
    ["how-ipo", "How it works"],
    ["why-ipo", "Why invest"],
    ["risks-ipo", "Risks"],
    ["apply-ipo", "How to apply"],
    ["live-ipo", "Live listings"],
    ["recent-ipo", "Recent IPOs"],
    ["listing-gains", "Listing gains"],
    ["faq-ipo", "FAQs"]
  ];
  h = assignSectionIds(h, ids);
  if (!h.includes('class="floating-toc"')) {
    h = h.replace(
      /(<nav class="ipo-float-menu">[\s\S]*?<\/nav>)/,
      "$1\n" + tocHtml(labels)
    );
  }
  if (!/querySelectorAll\(['\"]\.floating-toc a['\"]\)/.test(h)) {
    h = h.replace(
      /(<script src=["']nav\.js["'][^>]*><\/script>)/,
      tocScrollScript(ids) + "\n$1"
    );
  }
  write("ipo.html", h);
}

// ---------- Intraday ----------
{
  let h = read("intraday.html");
  const ids = [
    "about-intraday",
    "chart-intraday",
    "how-intraday",
    "glossary-intraday",
    "strategies-intraday",
    "tips-intraday",
    "mistakes-intraday",
    "active-stocks",
    "faq-intraday"
  ];
  const labels = [
    ["about-intraday", "What is intraday?"],
    ["chart-intraday", "Sample chart"],
    ["how-intraday", "How it works"],
    ["glossary-intraday", "Glossary"],
    ["strategies-intraday", "Strategies"],
    ["tips-intraday", "Tips"],
    ["mistakes-intraday", "Mistakes"],
    ["active-stocks", "Active stocks"],
    ["faq-intraday", "FAQs"]
  ];
  h = assignSectionIds(h, ids);
  if (!h.includes('class="floating-toc"')) {
    h = h.replace(
      /(<nav class="intraday-float-menu">[\s\S]*?<\/nav>)/,
      "$1\n" + tocHtml(labels)
    );
  }
  if (!/querySelectorAll\(['\"]\.floating-toc a['\"]\)/.test(h)) {
    h = h.replace(
      /(<script src=["']nav\.js["'][^>]*><\/script>)/,
      tocScrollScript(ids) + "\n$1"
    );
  }
  write("intraday.html", h);
}

// ---------- US Stocks: uncomment / replace broken TOC ----------
{
  let h = read("usstocks.html");
  const labels = [
    ["us-market-overview", "About US market"],
    ["why-invest-us", "Why invest"],
    ["how-invest-us", "How to invest"],
    ["us-indices-etfs", "Indices & ETFs"],
    ["top-us-stocks", "Top US stocks"],
    ["us-dividend-stocks", "Dividend stocks"],
    ["us-tax-risk", "Tax & risks"],
    ["us-tips", "Tips"],
    ["us-links", "Resources"]
  ];
  const ids = labels.map((x) => x[0]);

  // Remove broken commented TOC
  h = h.replace(
    /<!--\s*Floating ToC[\s\S]*?<-->\s*/i,
    ""
  );
  h = h.replace(
    /<!--[\s\S]*?<nav class="floating-toc"[\s\S]*?<\/nav>[\s\S]*?<-->\s*/i,
    ""
  );

  if (!h.includes('class="floating-toc"')) {
    h = h.replace(
      /(<nav class="stock-float-menu">[\s\S]*?<\/nav>)/,
      "$1\n" + tocHtml(labels)
    );
  }

  if (!/querySelectorAll\(['\"]\.floating-toc a['\"]\)/.test(h)) {
    h = h.replace(
      /(<script src=["']nav\.js["'][^>]*><\/script>)/,
      tocScrollScript(ids) + "\n$1"
    );
  }
  write("usstocks.html", h);
}

// ---------- Stocks: TradingView NSE/BSE ticker ----------
{
  let h = read("stocks.html");
  const ticker = `
    <!-- NSE & BSE live ticker (TradingView — no API keys) -->
    <div id="live-ticker" class="live-ticker-wrap" aria-label="Live market ticker">
      <div class="tradingview-widget-container">
        <div class="tradingview-widget-container__widget"></div>
        <script type="text/javascript" src="https://s3.tradingview.com/external-embedding/embed-widget-ticker-tape.js" async>
        {
          "symbols": [
            { "proName": "BSE:SENSEX", "title": "Sensex" },
            { "proName": "NSE:NIFTY", "title": "Nifty 50" },
            { "proName": "NSE:BANKNIFTY", "title": "Nifty Bank" },
            { "proName": "BSE:BANK", "title": "Bankex" },
            { "proName": "NSE:RELIANCE", "title": "Reliance" },
            { "proName": "NSE:TCS", "title": "TCS" },
            { "proName": "NSE:HDFCBANK", "title": "HDFC Bank" },
            { "proName": "NSE:INFY", "title": "Infosys" }
          ],
          "colorTheme": "dark",
          "isTransparent": false,
          "displayMode": "adaptive",
          "locale": "en"
        }
        </script>
      </div>
      <p class="ticker-note">Live tape via TradingView (may be delayed). Educational use only.</p>
    </div>
`;

  // Replace existing live-ticker strip (commented or message version)
  if (h.includes('id="live-ticker"')) {
    h = h.replace(
      /<!--\s*NSE\/BSE Live Ticker[\s\S]*?-->\s*/i,
      ""
    );
    h = h.replace(
      /<!-- Market strip[\s\S]*?<div id="live-ticker"[\s\S]*?<\/div>\s*/i,
      ticker
    );
    // If still old strip
    h = h.replace(
      /<div id="live-ticker"[\s\S]*?<\/div>\s*(?=\s*<section)/i,
      ticker
    );
  } else {
    h = h.replace(
      /(<main[^>]*>)/i,
      "$1\n" + ticker
    );
  }
  write("stocks.html", h);
}

console.log("Doc issues fixed.");
