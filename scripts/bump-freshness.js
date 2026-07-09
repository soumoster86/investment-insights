/**
 * Bump content review date and sync into js/site-config.js + footer partial.
 *
 * Usage:
 *   node scripts/bump-freshness.js
 *   node scripts/bump-freshness.js 2026-10-01
 *   node scripts/bump-freshness.js --note "Q3 sample IPO refresh"
 *   node scripts/bump-freshness.js --item ipo-sample --note "IPO table updated"
 *   node scripts/bump-freshness.js --all-items   # mark every checklist item today
 */
const fs = require("fs");
const path = require("path");

const ROOT = path.join(__dirname, "..");
const argv = process.argv.slice(2);

function flagValue(name) {
  const i = argv.indexOf(name);
  if (i < 0) return null;
  return argv[i + 1] && !argv[i + 1].startsWith("--") ? argv[i + 1] : null;
}

const note = flagValue("--note") || "Content review pass";
const itemId = flagValue("--item");
const allItems = argv.includes("--all-items");
const dateArg = argv.find((a) => /^\d{4}-\d{2}-\d{2}$/.test(a));
const today = dateArg || new Date().toISOString().slice(0, 10);

const freshnessPath = path.join(ROOT, "content", "freshness.json");
let data = {
  lastReviewed: today,
  reviewedBy: "site-maintainer",
  scope: "Educational copy, recommendation lists, sample tables, and calculator assumptions",
  nextReviewHint: "Re-check sample data and recommendation narratives quarterly",
  nextReviewDue: "",
  reviewCadenceDays: 90,
  checklist: [],
  changelog: []
};
if (fs.existsSync(freshnessPath)) {
  data = JSON.parse(fs.readFileSync(freshnessPath, "utf8"));
}

data.lastReviewed = today;
const cadence = Number(data.reviewCadenceDays) || 90;
const due = new Date(today + "T12:00:00");
due.setDate(due.getDate() + cadence);
data.nextReviewDue = due.toISOString().slice(0, 10);
data.reviewCadenceDays = cadence;

if (!Array.isArray(data.checklist)) data.checklist = [];
if (allItems) {
  data.checklist.forEach((c) => {
    c.lastChecked = today;
  });
} else if (itemId) {
  const row = data.checklist.find((c) => c.id === itemId);
  if (!row) {
    console.error("Unknown checklist item:", itemId);
    console.error(
      "Known:",
      data.checklist.map((c) => c.id).join(", ") || "(none)"
    );
    process.exit(1);
  }
  row.lastChecked = today;
}

data.changelog = data.changelog || [];
data.changelog.unshift({ date: today, note: note });
data.changelog = data.changelog.slice(0, 24);
fs.writeFileSync(freshnessPath, JSON.stringify(data, null, 2) + "\n", "utf8");
console.log("freshness.json → lastReviewed", today, "· next due", data.nextReviewDue);
if (itemId) console.log("  checklist item", itemId, "→", today);
if (allItems) console.log("  all checklist items →", today);

// Sync site-config.js contentReviewed
const configPath = path.join(ROOT, "js", "site-config.js");
if (fs.existsSync(configPath)) {
  let cfg = fs.readFileSync(configPath, "utf8");
  if (/contentReviewed:\s*["'][^"']*["']/.test(cfg)) {
    cfg = cfg.replace(
      /contentReviewed:\s*["'][^"']*["']/,
      `contentReviewed: "${today}"`
    );
  } else {
    cfg = cfg.replace(
      /global\.IIConfig\s*=\s*\{/,
      `global.IIConfig = {\n    contentReviewed: "${today}",`
    );
  }
  // optional nextReviewDue field
  if (/nextReviewDue:\s*["'][^"']*["']/.test(cfg)) {
    cfg = cfg.replace(
      /nextReviewDue:\s*["'][^"']*["']/,
      `nextReviewDue: "${data.nextReviewDue}"`
    );
  } else if (/contentReviewed:/.test(cfg)) {
    cfg = cfg.replace(
      /(contentReviewed:\s*["'][^"']*["'])/,
      `$1,\n    nextReviewDue: "${data.nextReviewDue}"`
    );
  }
  fs.writeFileSync(configPath, cfg, "utf8");
  console.log("site-config.js contentReviewed + nextReviewDue synced");
}

// Sync footer partial reviewed line
const footerPath = path.join(ROOT, "partials", "footer.html");
if (fs.existsSync(footerPath)) {
  let footer = fs.readFileSync(footerPath, "utf8");
  const line = `<p class="footer-reviewed">Content last reviewed: <time datetime="${today}">${today}</time></p>`;
  if (footer.includes("footer-reviewed")) {
    footer = footer.replace(/<p class="footer-reviewed">[\s\S]*?<\/p>/, line);
  } else {
    footer = footer.replace(
      /(<p class="footer-disclaimer">[\s\S]*?<\/p>)/,
      `$1\n      ${line}`
    );
  }
  fs.writeFileSync(footerPath, footer, "utf8");
  console.log("partials/footer.html synced — run: npm run sync-shell");
}

console.log("Done. Remember: npm run sync-shell");
