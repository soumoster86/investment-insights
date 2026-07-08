const fs = require("fs");
const path = require("path");

const pages = fs.readdirSync(".").filter((f) => f.endsWith(".html"));
let ok = true;
for (const f of pages) {
  const h = fs.readFileSync(f, "utf8");
  const checks = {
    seo: h.includes("BEGIN SEO") && h.includes('name="description"'),
    main: h.includes('id="main-content"'),
    skip: h.includes("skip-link"),
    canonical: h.includes("rel=\"canonical\"") || h.includes("rel='canonical'")
  };
  const bad = Object.entries(checks).filter(([, v]) => !v).map(([k]) => k);
  if (bad.length) {
    ok = false;
    console.log("FAIL", f, bad.join(", "));
  } else {
    console.log("OK  ", f);
  }
}

const reco = fs.readFileSync("recommendations.js", "utf8");
console.log("clearbit URLs:", (reco.match(/logo\.clearbit\.com/g) || []).length);
console.log("stocks toolbar:", fs.readFileSync("stocks.html", "utf8").includes("stock-toolbar"));
console.log("mf toolbar:", fs.readFileSync("mutualfunds.html", "utf8").includes("mf-toolbar"));
console.log("crypto toolbar:", fs.readFileSync("cryptocurrencies.html", "utf8").includes("crypto-toolbar"));
console.log("robots:", fs.existsSync("robots.txt"));
console.log("sitemap:", fs.existsSync("sitemap.xml"));
console.log("currency sr-only:", fs.readFileSync("index.html", "utf8").includes('for="amount"'));

// Show stocks section snippet
const s = fs.readFileSync("stocks.html", "utf8");
const i = s.indexOf("stock-search");
console.log("\n--- stocks search area ---\n" + s.slice(Math.max(0, i - 120), i + 280));

process.exit(ok ? 0 : 1);
