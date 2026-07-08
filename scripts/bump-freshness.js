/**
 * Bump content review date and sync into js/site-config.js + footer partial.
 *
 * Usage:
 *   node scripts/bump-freshness.js              # today
 *   node scripts/bump-freshness.js 2026-09-01   # explicit date
 *   node scripts/bump-freshness.js --note "Q3 recs pass"
 */
const fs = require("fs");
const path = require("path");

const ROOT = path.join(__dirname, "..");
const args = process.argv.slice(2).filter((a) => a !== "--note");
const noteIdx = process.argv.indexOf("--note");
const note =
  noteIdx >= 0 && process.argv[noteIdx + 1]
    ? process.argv[noteIdx + 1]
    : "Content review pass";

const dateArg = args.find((a) => /^\d{4}-\d{2}-\d{2}$/.test(a));
const today = dateArg || new Date().toISOString().slice(0, 10);

const freshnessPath = path.join(ROOT, "content", "freshness.json");
let data = {
  lastReviewed: today,
  reviewedBy: "site-maintainer",
  scope: "Educational copy, recommendation lists, and calculator assumptions",
  nextReviewHint: "Re-check recommendation narratives and sample figures quarterly",
  changelog: []
};
if (fs.existsSync(freshnessPath)) {
  data = JSON.parse(fs.readFileSync(freshnessPath, "utf8"));
}
data.lastReviewed = today;
data.changelog = data.changelog || [];
data.changelog.unshift({ date: today, note: note });
// Keep changelog short
data.changelog = data.changelog.slice(0, 20);
fs.writeFileSync(freshnessPath, JSON.stringify(data, null, 2) + "\n", "utf8");
console.log("freshness.json →", today);

// Sync site-config.js contentReviewed
const configPath = path.join(ROOT, "js", "site-config.js");
if (fs.existsSync(configPath)) {
  let cfg = fs.readFileSync(configPath, "utf8");
  cfg = cfg.replace(
    /contentReviewed:\s*["'][^"']*["']/,
    `contentReviewed: "${today}"`
  );
  fs.writeFileSync(configPath, cfg, "utf8");
  console.log("site-config.js contentReviewed synced");
}

// Sync footer partial reviewed line
const footerPath = path.join(ROOT, "partials", "footer.html");
if (fs.existsSync(footerPath)) {
  let footer = fs.readFileSync(footerPath, "utf8");
  const line = `<p class="footer-reviewed">Content last reviewed: <time datetime="${today}">${today}</time></p>`;
  if (footer.includes("footer-reviewed")) {
    footer = footer.replace(
      /<p class="footer-reviewed">[\s\S]*?<\/p>/,
      line
    );
  } else {
    footer = footer.replace(
      /(<p class="footer-disclaimer">[\s\S]*?<\/p>)/,
      `$1\n  ${line}`
    );
  }
  fs.writeFileSync(footerPath, footer, "utf8");
  console.log("partials/footer.html synced — run: npm run sync-shell");
}

console.log("Done. Remember: npm run sync-shell");
