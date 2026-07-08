const fs = require("fs");
const path = require("path");
const ROOT = path.join(__dirname, "..");

// --- nav.js: clear theme toggle UX ---
let nav = fs.readFileSync(path.join(ROOT, "nav.js"), "utf8");
nav = nav.replace(
  /function setMode\(dark\) \{[\s\S]*?try \{ localStorage\.setItem\("theme", dark \? "dark" : "light"\); \} catch \(e\) \{\}\s*\}/,
  `function setMode(dark) {
    var label = document.getElementById("dm-label");
    var toggle = document.getElementById("darkmode-toggle");
    if (dark) {
      document.body.classList.add("dark-mode");
    } else {
      document.body.classList.remove("dark-mode");
    }
    // Label always names the control; checked = dark mode is ON
    if (label) label.textContent = "Dark mode";
    if (toggle) toggle.checked = !!dark;
    try { localStorage.setItem("theme", dark ? "dark" : "light"); } catch (e) {}
  }`
);
fs.writeFileSync(path.join(ROOT, "nav.js"), nav, "utf8");
console.log("nav.js theme toggle updated");

// --- style.css: strip PowerShell corruption of font-weight ---
let css = fs.readFileSync(path.join(ROOT, "style.css"), "utf8");
css = css
  .split(/\r?\n/)
  .map((line) => {
    if (line.includes("param($m)")) {
      return line.replace(/param\(\$m\)\s*\$m/g, "font-weight: 600;");
    }
    return line;
  })
  .join("\n");
fs.writeFileSync(path.join(ROOT, "style.css"), css, "utf8");
console.log("style.css font-weight corruption cleaned");

// --- partials header label ---
let header = fs.readFileSync(path.join(ROOT, "partials", "header.html"), "utf8");
header = header.replace(/>Dark Mode</g, ">Dark mode<");
header = header.replace(/>Light Mode</g, ">Dark mode<");
fs.writeFileSync(path.join(ROOT, "partials", "header.html"), header, "utf8");
console.log("header partial label updated");

const MARKER_START = "/* BEGIN READABILITY FIXES */";
const MARKER_END = "/* END READABILITY FIXES */";

const block = `${MARKER_START}
/* ============================================================
   Readability fixes (II-Issues2)
   - Light mode buttons: solid contrast
   - Dark mode: neutral surfaces + high-contrast body text
   - Override common dark-blue inline colors on dark backgrounds
   ============================================================ */

/* Primary actions: solid brand + white text */
.btn:not(.secondary):not(.outline-btn):not(.btn.outline-btn),
.learn-more,
.primary-btn,
button[type="submit"],
button.btn:not(.secondary):not(.outline-btn) {
  background: #0a4d8c !important;
  background-image: none !important;
  color: #ffffff !important;
  border: 1.5px solid #0a4d8c !important;
  font-weight: 600 !important;
  text-shadow: none !important;
  opacity: 1 !important;
}
.btn:not(.secondary):not(.outline-btn):hover,
.learn-more:hover,
.primary-btn:hover,
button[type="submit"]:hover {
  background: #063566 !important;
  background-image: none !important;
  color: #ffffff !important;
  border-color: #063566 !important;
}

/* Secondary / reset */
.btn.secondary,
.secondary-btn,
.outline-btn,
.btn.outline-btn,
button.secondary-btn,
button.outline-btn {
  background: #ffffff !important;
  background-image: none !important;
  color: #0a4d8c !important;
  border: 2px solid #0a4d8c !important;
  font-weight: 600 !important;
  box-shadow: none !important;
  opacity: 1 !important;
}
.btn.secondary:hover,
.secondary-btn:hover,
.outline-btn:hover,
.btn.outline-btn:hover {
  background: #e8f1fc !important;
  color: #063566 !important;
  border-color: #063566 !important;
}

.swp-tab-btn {
  color: #2b3a52 !important;
  font-weight: 600 !important;
}
.swp-tab-btn.active {
  color: #ffffff !important;
}

/* ---------- Dark mode: neutral + high contrast ---------- */
body.dark-mode {
  --dm-bg: #0e1116;
  --dm-surface: #171b22;
  --dm-surface-2: #1c212b;
  --dm-border: #2c3340;
  --dm-text: #eef1f6;
  --dm-text-muted: #b4bccb;
  --dm-heading: #f5f7fb;
  --dm-link: #8ec5ff;
  background:
    radial-gradient(900px 420px at 12% -8%, rgba(80, 120, 180, 0.08), transparent 55%),
    linear-gradient(180deg, #0e1116 0%, #12161d 100%) !important;
  color: var(--dm-text) !important;
}

body.dark-mode .site-header {
  background: rgba(14, 17, 22, 0.9) !important;
  border-bottom: 1px solid #2c3340 !important;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.35) !important;
}
body.dark-mode .main-nav a { color: #e8edf5 !important; }
body.dark-mode .main-nav a.active,
body.dark-mode .main-nav a:hover,
body.dark-mode .main-nav a:focus-visible {
  background: rgba(255, 255, 255, 0.1) !important;
  color: #fff !important;
}
body.dark-mode .dropdown-menu {
  background: #1a1f28 !important;
  border-color: #2c3340 !important;
}
body.dark-mode #dm-label { color: #eef1f6 !important; }
body.dark-mode .dm-toggle {
  background: rgba(255, 255, 255, 0.08);
  border-color: rgba(255, 255, 255, 0.16);
}

body.dark-mode main:not(.layout-wide) {
  background: var(--dm-surface) !important;
  border-color: var(--dm-border) !important;
  color: var(--dm-text) !important;
  box-shadow: 0 10px 36px rgba(0, 0, 0, 0.4) !important;
}
body.dark-mode.page-home main {
  background: transparent !important;
  box-shadow: none !important;
  border: none !important;
}

body.dark-mode main > section,
body.dark-mode section,
body.dark-mode .card,
body.dark-mode .dashboard-section .card,
body.dark-mode .kpi-card,
body.dark-mode .feature-card,
body.dark-mode .tools-card,
body.dark-mode .learn-item,
body.dark-mode .calculator-box {
  background: var(--dm-surface-2) !important;
  color: var(--dm-text) !important;
  border-color: var(--dm-border) !important;
}

body.dark-mode main,
body.dark-mode main p,
body.dark-mode main li,
body.dark-mode main ul,
body.dark-mode main ol,
body.dark-mode main td,
body.dark-mode main th,
body.dark-mode main label,
body.dark-mode main small,
body.dark-mode section p,
body.dark-mode section li,
body.dark-mode section ul,
body.dark-mode section ol,
body.dark-mode section td,
body.dark-mode section label,
body.dark-mode section small {
  color: var(--dm-text) !important;
}

body.dark-mode main strong,
body.dark-mode main b,
body.dark-mode section strong,
body.dark-mode section b {
  color: #ffffff !important;
}

body.dark-mode h1,
body.dark-mode h2,
body.dark-mode h3,
body.dark-mode h4,
body.dark-mode main h2,
body.dark-mode main h3,
body.dark-mode section h2,
body.dark-mode section h3 {
  color: var(--dm-heading) !important;
  border-color: var(--dm-border) !important;
}
body.dark-mode h2::after {
  background: linear-gradient(90deg, #6eb0ff, transparent) !important;
  opacity: 0.55;
}

body.dark-mode main a:not(.btn):not(.learn-more):not(.feature-card):not(.calc-chip),
body.dark-mode section a:not(.btn):not(.learn-more):not(.feature-card):not(.calc-chip) {
  color: var(--dm-link) !important;
}

/* Beat common inline navy colors from calculators / copy */
body.dark-mode main [style*="color:#004080"],
body.dark-mode main [style*="color: #004080"],
body.dark-mode main [style*="color:#1a2c4b"],
body.dark-mode main [style*="color: #1a2c4b"],
body.dark-mode main [style*="color:#5370a2"],
body.dark-mode main [style*="color: #5370a2"],
body.dark-mode main [style*="color:#222"],
body.dark-mode main [style*="color: #222"],
body.dark-mode main [style*="color:#253f5c"],
body.dark-mode main [style*="color:#2c3851"],
body.dark-mode main [style*="color:#2b3a52"],
body.dark-mode main [style*="color:#666"],
body.dark-mode main [style*="color:#444"],
body.dark-mode section [style*="color:#004080"],
body.dark-mode section [style*="color: #004080"],
body.dark-mode section [style*="color:#1a2c4b"],
body.dark-mode section [style*="color:#5370a2"] {
  color: var(--dm-text) !important;
}

body.dark-mode .btn:not(.secondary):not(.outline-btn),
body.dark-mode .learn-more,
body.dark-mode .primary-btn,
body.dark-mode button[type="submit"] {
  background: #3d7dd6 !important;
  border-color: #3d7dd6 !important;
  color: #ffffff !important;
}
body.dark-mode .btn:not(.secondary):not(.outline-btn):hover,
body.dark-mode .learn-more:hover,
body.dark-mode button[type="submit"]:hover {
  background: #5a96e8 !important;
  border-color: #5a96e8 !important;
  color: #ffffff !important;
}
body.dark-mode .btn.secondary,
body.dark-mode .secondary-btn,
body.dark-mode .outline-btn,
body.dark-mode .btn.outline-btn {
  background: transparent !important;
  color: #d7e6ff !important;
  border: 2px solid #7aa7e0 !important;
}
body.dark-mode .btn.secondary:hover,
body.dark-mode .secondary-btn:hover,
body.dark-mode .outline-btn:hover {
  background: rgba(122, 167, 224, 0.12) !important;
  color: #ffffff !important;
}

body.dark-mode main table,
body.dark-mode section table,
body.dark-mode .ipo-table,
body.dark-mode .etf-compare-table {
  background: #151a22 !important;
  color: var(--dm-text) !important;
}
body.dark-mode main th,
body.dark-mode section th,
body.dark-mode .ipo-table th,
body.dark-mode .etf-compare-table th {
  background: #222833 !important;
  color: #f0f3f8 !important;
}
body.dark-mode main td,
body.dark-mode section td {
  background: #171b22 !important;
  color: var(--dm-text) !important;
  border-color: var(--dm-border) !important;
}

body.dark-mode form label,
body.dark-mode .calculator-box label {
  color: #c5cddc !important;
}
body.dark-mode form input,
body.dark-mode form select,
body.dark-mode form textarea,
body.dark-mode .calculator-box input,
body.dark-mode .calculator-box select {
  background: #12161d !important;
  color: #eef1f6 !important;
  border-color: #3a4252 !important;
}

body.dark-mode .kpi-meta,
body.dark-mode .kpi-empty,
body.dark-mode .dashboard-lead,
body.dark-mode .home-hero-sub,
body.dark-mode .section-heading p,
body.dark-mode .feature-card p,
body.dark-mode .footer-disclaimer,
body.dark-mode .footer-reviewed,
body.dark-mode .ticker-note,
body.dark-mode .rec-freshness,
body.dark-mode .rec-count {
  color: var(--dm-text-muted) !important;
}

body.dark-mode footer {
  background: #0e1116 !important;
  border-top-color: #2c3340 !important;
  color: var(--dm-text-muted) !important;
}
body.dark-mode .footer-brand { color: #eef1f6 !important; }

body.dark-mode .floating-toc,
body.dark-mode .stock-float-menu,
body.dark-mode .etf-float-menu,
body.dark-mode .ipo-float-menu,
body.dark-mode .intraday-float-menu {
  background: rgba(22, 26, 34, 0.94) !important;
  border-color: #2c3340 !important;
  color: var(--dm-text) !important;
}
body.dark-mode .floating-toc a,
body.dark-mode .stock-float-menu a,
body.dark-mode .etf-float-menu a,
body.dark-mode .ipo-float-menu a,
body.dark-mode .intraday-float-menu a {
  color: #d5deec !important;
}
body.dark-mode .floating-toc .toc-title,
body.dark-mode .stock-float-menu .float-title,
body.dark-mode .etf-float-menu .float-title,
body.dark-mode .ipo-float-menu .float-title,
body.dark-mode .intraday-float-menu .float-title {
  color: #f0f3f8 !important;
}

body.dark-mode #sip-result,
body.dark-mode #swp-result,
body.dark-mode #swp-max-result,
body.dark-mode #fd-result,
body.dark-mode #goal-result,
body.dark-mode #nps-result,
body.dark-mode #bondYieldResult {
  background: #1a1f28 !important;
  border-color: #343b4a !important;
  color: var(--dm-text) !important;
}
body.dark-mode #sip-result strong,
body.dark-mode #swp-result strong,
body.dark-mode #fd-result strong,
body.dark-mode #goal-result strong,
body.dark-mode #nps-result strong,
body.dark-mode #bondYieldResult b {
  color: #9ec9ff !important;
}

body.dark-mode .home-hero {
  background: linear-gradient(145deg, #171b22 0%, #12161d 100%) !important;
  border-color: #2c3340 !important;
}
body.dark-mode .home-hero-title { color: #f5f7fb !important; }
body.dark-mode .hero-stat {
  background: #1c212b !important;
  border-color: #2c3340 !important;
}
body.dark-mode .hero-stat-value { color: #9ec9ff !important; }

body.dark-mode .stock-card,
body.dark-mode .mf-card,
body.dark-mode .crypto-card,
body.dark-mode .bond-card,
body.dark-mode .us-stock-card {
  background: #1c212b !important;
  color: var(--dm-text) !important;
  border-color: #2c3340 !important;
}
body.dark-mode .rec-toolbar {
  background: #171b22 !important;
  border-color: #2c3340 !important;
}
body.dark-mode .rec-control-label {
  color: var(--dm-text-muted) !important;
}
body.dark-mode .rec-control select {
  background: #12161d !important;
  color: #eef1f6 !important;
  border-color: #3a4252 !important;
}

body.dark-mode .swp-tab-btn {
  background: #1c212b !important;
  color: #c5cddc !important;
}
body.dark-mode .swp-tab-btn.active {
  background: #3d7dd6 !important;
  color: #ffffff !important;
}
body.dark-mode .swp-tab-content {
  background: #171b22 !important;
  color: var(--dm-text) !important;
}

/* Do not force icon/button spans to dm-text */
body.dark-mode .btn span,
body.dark-mode .learn-more span {
  color: inherit !important;
}
body.dark-mode .sector-chip,
body.dark-mode .mf-type-chip,
body.dark-mode .crypto-type-chip,
body.dark-mode .us-stock-sector {
  background: #2a3140 !important;
  color: #cfe0ff !important;
}

@media (max-width: 820px) {
  body.dark-mode .site-header .main-nav {
    background: #141820 !important;
  }
}
${MARKER_END}
`;

css = fs.readFileSync(path.join(ROOT, "style.css"), "utf8");
if (css.includes(MARKER_START)) {
  css = css.replace(
    new RegExp(
      MARKER_START.replace(/[/*]/g, "\\$&") +
        "[\\s\\S]*?" +
        MARKER_END.replace(/[/*]/g, "\\$&")
    ),
    block.trim()
  );
  console.log("replaced existing readability block");
} else {
  css = css + "\n" + block;
  console.log("appended readability block");
}
fs.writeFileSync(path.join(ROOT, "style.css"), css, "utf8");
console.log("style.css bytes", fs.statSync(path.join(ROOT, "style.css")).size);

// Sync header into all pages
const { execSync } = require("child_process");
execSync("node scripts/sync-shell.js", { cwd: ROOT, stdio: "inherit" });
console.log("done");
