/**
 * Fail if site review is overdue or checklist items are stale.
 * Usage: node scripts/verify-freshness.js
 */
const fs = require("fs");
const path = require("path");

const ROOT = path.join(__dirname, "..");
const freshnessPath = path.join(ROOT, "content", "freshness.json");
const configPath = path.join(ROOT, "js", "site-config.js");

function ok(label, cond) {
  console.log((cond ? "OK  " : "FAIL") + " " + label);
  return !!cond;
}

function parseDate(s) {
  if (!s || !/^\d{4}-\d{2}-\d{2}$/.test(s)) return null;
  return new Date(s + "T12:00:00Z");
}

let pass = true;
pass = ok("content/freshness.json exists", fs.existsSync(freshnessPath)) && pass;
if (!fs.existsSync(freshnessPath)) process.exit(1);

const data = JSON.parse(fs.readFileSync(freshnessPath, "utf8"));
const today = new Date();
today.setUTCHours(12, 0, 0, 0);

const last = parseDate(data.lastReviewed);
pass = ok("lastReviewed is a date", !!last) && pass;

const due = parseDate(data.nextReviewDue);
if (due) {
  const overdue = due.getTime() < today.getTime();
  pass = ok("nextReviewDue not past (" + data.nextReviewDue + ")", !overdue) && pass;
} else {
  pass = ok("nextReviewDue set", false) && pass;
}

const cadence = Number(data.reviewCadenceDays) || 90;
const checklist = Array.isArray(data.checklist) ? data.checklist : [];
pass = ok("checklist has items", checklist.length > 0) && pass;

const staleLimitMs = cadence * 24 * 60 * 60 * 1000;
checklist.forEach((item) => {
  const checked = parseDate(item.lastChecked);
  if (!checked) {
    pass = ok(item.id + " has lastChecked", false) && pass;
    return;
  }
  const age = today.getTime() - checked.getTime();
  pass =
    ok(
      item.id + " checked within " + cadence + "d (" + item.lastChecked + ")",
      age <= staleLimitMs
    ) && pass;
});

// site-config in sync
if (fs.existsSync(configPath)) {
  const cfg = fs.readFileSync(configPath, "utf8");
  const m = cfg.match(/contentReviewed:\s*["']([^"']+)["']/);
  pass =
    ok(
      "site-config contentReviewed matches freshness.json",
      m && m[1] === data.lastReviewed
    ) && pass;
}

// footer partial
const footer = fs.readFileSync(path.join(ROOT, "partials", "footer.html"), "utf8");
pass =
  ok(
    "footer partial has lastReviewed date",
    footer.includes(`datetime="${data.lastReviewed}"`)
  ) && pass;

// sample freshness markers on key pages
const pages = [
  "ipo.html",
  "bonds.html",
  "fixeddeposit.html",
  "stocks.html",
  "mutualfunds.html",
  "cryptocurrencies.html",
  "etf.html"
];
pages.forEach((f) => {
  if (!fs.existsSync(path.join(ROOT, f))) {
    pass = ok(f + " exists", false) && pass;
    return;
  }
  const h = fs.readFileSync(path.join(ROOT, f), "utf8");
  pass = ok(f + " has sample-freshness marker", h.includes("sample-freshness")) && pass;
});

// calculators hub still lists ladders / stock pnl (parity smoke)
const calc = fs.readFileSync(path.join(ROOT, "calculators.html"), "utf8");
[
  "fd-ladder-tool",
  "bond-ladder-tool",
  "stock-pnl",
  "crypto-risk-tool",
  "target-sip"
].forEach((frag) => {
  pass = ok("calculators.html links " + frag, calc.includes(frag)) && pass;
});

process.exit(pass ? 0 : 1);
