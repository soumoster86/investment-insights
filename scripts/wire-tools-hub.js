const fs = require("fs");
const path = require("path");

const cards = `
        <a class="feature-card calc-feature" href="tools.html#emi">
          <span class="ii-icon feature-icon" aria-hidden="true"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="4" width="18" height="16" rx="2"/><path d="M7 8h10M7 12h6"/></svg></span>
          <h3>EMI calculator</h3>
          <p>Home, car, or personal loan EMI with total interest.</p>
          <span class="feature-cta">Open EMI →</span>
        </a>
        <a class="feature-card calc-feature" href="tools.html">
          <span class="ii-icon feature-icon" aria-hidden="true"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 20h16M6 16l4-8 3 5 3-7 4 10"/></svg></span>
          <h3>More tools</h3>
          <p>Lumpsum, CAGR, inflation, target SIP, PPF, and RD calculators.</p>
          <span class="feature-cta">Open tools →</span>
        </a>`;

const calcPath = path.join(__dirname, "..", "calculators.html");
let h = fs.readFileSync(calcPath, "utf8");
if (!h.includes("tools.html")) {
  h = h.replace(
    /(Open bond yield →<\/span>\s*<\/a>)/,
    `$1\n${cards}`
  );
  h = h.replace(
    /SIP, SWP, FD, NPS, goal, and bond tools with clear assumptions\./,
    "SIP, SWP, FD, NPS, goal, bond, EMI, PPF, RD, and more — with clear assumptions."
  );
  fs.writeFileSync(calcPath, h, "utf8");
  console.log("calculators.html updated");
} else {
  console.log("calculators.html already linked");
}

// index chips
const indexPath = path.join(__dirname, "..", "index.html");
let idx = fs.readFileSync(indexPath, "utf8");
if (!idx.includes("tools.html")) {
  idx = idx.replace(
    /(href="bonds\.html">[\s\S]*?Bond yield\s*<\/a>)/,
    `$1
        <a class="calc-chip" href="tools.html#emi">
          <span class="ii-icon" aria-hidden="true"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="4" width="18" height="16" rx="2"/></svg></span>
          EMI
        </a>
        <a class="calc-chip" href="tools.html#ppf">
          <span class="ii-icon" aria-hidden="true"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 3v18M8 7h5a3 3 0 010 6H8"/></svg></span>
          PPF
        </a>
        <a class="calc-chip" href="tools.html">
          <span class="ii-icon" aria-hidden="true"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M5 12h14"/></svg></span>
          More tools
        </a>`
  );
  fs.writeFileSync(indexPath, idx, "utf8");
  console.log("index.html chips updated");
} else {
  console.log("index already has tools");
}
