/**
 * Audit reciprocal Previous/Next topic-nav links.
 * Path pages (1–8 + realestate path end) are listed for reference; product chain must be consistent.
 */
const fs = require("fs");

const PATH = new Set([
  "basics.html",
  "insurance-emergency.html",
  "risk-allocation.html",
  "mutualfunds.html",
  "index-vs-active.html",
  "ppf-tax-saving.html",
  "tax-overview.html",
  "gold.html",
  "realestate.html",
]);

// Expected linear product chain (matches Learn hub + nav extras)
const PRODUCT_CHAIN = [
  "stocks.html",
  "etf.html",
  "ipo.html",
  "intraday.html",
  "futures-options.html",
  "usstocks.html",
  "fixeddeposit.html",
  "postoffice.html",
  "nps.html",
  "bonds.html",
  "cryptocurrencies.html",
];

const titles = {
  "stocks.html": "Stocks",
  "etf.html": "ETFs",
  "ipo.html": "IPO",
  "intraday.html": "Intraday",
  "futures-options.html": "Futures & Options",
  "usstocks.html": "US stocks",
  "fixeddeposit.html": "Fixed deposits",
  "postoffice.html": "Post Office",
  "nps.html": "NPS",
  "bonds.html": "Bonds",
  "cryptocurrencies.html": "Crypto",
};

function parseNav(file) {
  const s = fs.readFileSync(file, "utf8");
  const m = s.match(/<nav class="topic-nav"[\s\S]*?<\/nav>/);
  if (!m) return null;
  const links = [...m[0].matchAll(/href="([^"]+)"[\s\S]*?topic-nav-kicker">([^<]*)<\/span>\s*<span class="topic-nav-title">([^<]*)/g)].map(
    (x) => ({ href: x[1].split("#")[0], kicker: x[2].trim(), title: x[3].trim() })
  );
  const prev = links.find((l) => /^Previous/i.test(l.kicker));
  const next = links.find((l) => /^Next|Path complete/i.test(l.kicker));
  return { prev, next, all: links };
}

const issues = [];
console.log("=== Path pages (1–8) — left as designed ===");
for (const f of PATH) {
  if (!fs.existsSync(f)) {
    issues.push(`missing ${f}`);
    continue;
  }
  const n = parseNav(f);
  console.log(
    f,
    "←",
    n?.prev?.href || "—",
    "→",
    n?.next?.href || "—"
  );
}

console.log("\n=== Product chain (must be reciprocal) ===");
for (let i = 0; i < PRODUCT_CHAIN.length; i++) {
  const f = PRODUCT_CHAIN[i];
  const n = parseNav(f);
  if (!n) {
    issues.push(`${f}: no topic-nav`);
    continue;
  }
  const expectPrev = i > 0 ? PRODUCT_CHAIN[i - 1] : null;
  const expectNext = i < PRODUCT_CHAIN.length - 1 ? PRODUCT_CHAIN[i + 1] : null;

  // First product page may bridge from mutualfunds (path); allow that for prev
  if (expectPrev) {
    if (!n.prev || n.prev.href !== expectPrev) {
      issues.push(
        `${f}: prev is "${n.prev?.href || "none"}", expected "${expectPrev}"`
      );
    }
  }
  if (expectNext) {
    if (!n.next || n.next.href !== expectNext) {
      issues.push(
        `${f}: next is "${n.next?.href || "none"}", expected "${expectNext}"`
      );
    }
  } else if (n.next && !/learn\.html/.test(n.next.href)) {
    // last page: next may be absent or only browse
  }

  // Reciprocal: if A→B next, B should have prev A
  if (n.next && PRODUCT_CHAIN.includes(n.next.href)) {
    const other = parseNav(n.next.href);
    if (!other?.prev || other.prev.href !== f) {
      issues.push(
        `${f} → ${n.next.href}, but ${n.next.href} prev is "${other?.prev?.href || "none"}"`
      );
    }
  }
  if (n.prev && PRODUCT_CHAIN.includes(n.prev.href)) {
    const other = parseNav(n.prev.href);
    if (!other?.next || other.next.href !== f) {
      issues.push(
        `${f} ← ${n.prev.href}, but ${n.prev.href} next is "${other?.next?.href || "none"}"`
      );
    }
  }

  console.log(
    `${i + 1}. ${titles[f] || f}: ← ${n.prev?.href || "—"} → ${n.next?.href || "—"}`
  );
}

// stocks may prev to mutualfunds (bridge) — note only
const stocks = parseNav("stocks.html");
if (stocks?.prev?.href === "mutualfunds.html") {
  console.log("\nNote: stocks.html Previous → mutualfunds.html (path bridge, OK)");
}

console.log("\n=== Issues ===");
if (issues.length === 0) console.log("None — product chain is consistent.");
else issues.forEach((i) => console.log("•", i));
process.exit(issues.length ? 1 : 0);
