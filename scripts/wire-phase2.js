/**
 * One-shot Phase 2 wiring: inject js/* scripts and patch calculator math hooks.
 * Safe to re-run (idempotent where possible).
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

function ensureScripts(html, scripts, beforeNav) {
  // scripts: array of src paths without leading ./
  scripts.forEach((src) => {
    if (html.includes(`src="${src}"`) || html.includes(`src='${src}'`)) return;
    const tag = `  <script src="${src}"></script>\n`;
    if (beforeNav && /src=["']nav\.js["']/.test(html)) {
      html = html.replace(/(\s*<script src=["']nav\.js["'][^>]*>\s*<\/script>)/, "\n" + tag + "$1");
    } else if (/<\/body>/i.test(html)) {
      html = html.replace(/<\/body>/i, tag + "</body>");
    }
  });
  return html;
}

function rememberSnippet(name, link) {
  return `
  if (window.IIStorage) {
    window.IIStorage.rememberCalculator(${JSON.stringify(name)}, ${JSON.stringify(link)});
  }
`;
}

// ---------- mutualfunds.html ----------
{
  let h = read("mutualfunds.html");
  // SIP math
  h = h.replace(
    /function calculateSIP\(event\) \{[\s\S]*?const stepup = parseFloat\(document\.getElementById\('sip-stepup'\)\.value \|\| 0\);\s*let totalInvested = 0, corpus = 0, currP = P;\s*const yearlyData = \[\], labels = \[\];\s*for \(let year = 1; year <= years; year\+\+\) \{\s*for \(let m = 1; m <= 12; m\+\+\) \{\s*corpus = \(corpus \+ currP\) \* \(1 \+ r\);\s*totalInvested \+= currP;\s*\}\s*yearlyData\.push\(corpus\);\s*labels\.push\('Year ' \+ year\);\s*currP \*= \(1 \+ stepup \/ 100\);\s*\}\s*const gain = corpus - totalInvested;\s*const cagr = \(Math\.pow\(corpus \/ totalInvested, 1 \/ years\) - 1\) \* 100;/,
    `function calculateSIP(event) {
  event.preventDefault();
  const P = parseFloat(document.getElementById('sip-amount').value);
  const annualRate = parseFloat(document.getElementById('sip-rate').value);
  const years = parseInt(document.getElementById('sip-years').value);
  const stepup = parseFloat(document.getElementById('sip-stepup').value || 0);
  const result = window.IICalc.sip(P, annualRate, years, stepup);
  if (result.error) { alert(result.error); return; }
  const totalInvested = result.totalInvested, corpus = result.corpus, gain = result.gain, cagr = result.cagr;
  const yearlyData = result.yearlyData, labels = result.labels;`
  );

  // Fix leftover broken first lines if replace left duplicate event.preventDefault path
  // Remove old localStorage SIP block and use IIStorage
  h = h.replace(
    /\/\/ Save last calculator\s*localStorage\.setItem\("lastCalculator", JSON\.stringify\(\{[\s\S]*?\}\)\);/,
    `// Save last calculator` + rememberSnippet("SIP Calculator", "mutualfunds.html#sipcalc-mutual")
  );

  // SWP math body
  h = h.replace(
    /function calculateSWP\(event\) \{\s*event\.preventDefault\(\);\s*const corpus = parseFloat\(document\.getElementById\('swp-corpus'\)\.value\);\s*const rate = parseFloat\(document\.getElementById\('swp-rate'\)\.value\) \/ 100 \/ 12;\s*const withdraw = parseFloat\(document\.getElementById\('swp-withdraw'\)\.value\);\s*const years = parseInt\(document\.getElementById\('swp-years'\)\.value\);\s*let balance = corpus, exhaustedAt = null, months = years \* 12;\s*const data = \[\];\s*for \(let i = 1; i <= months; i\+\+\) \{\s*balance = balance \* \(1 \+ rate\);\s*balance -= withdraw;\s*if \(balance <= 0 && !exhaustedAt\) exhaustedAt = i;\s*data\.push\(balance > 0 \? balance : 0\);\s*if \(balance <= 0\) break;\s*\}\s*\/\/ Create labels and yearly data\s*const yearlyData = \[\], labels = \[\];\s*for \(let y = 1; y <= Math\.floor\(data\.length \/ 12\); y\+\+\) \{\s*yearlyData\.push\(data\[y \* 12 - 1\]\);\s*labels\.push\('Year ' \+ y\);\s*\}\s*const endBalance = Math\.max\(0, data\[data\.length - 1\]\);/,
    `function calculateSWP(event) {
  event.preventDefault();
  const corpus = parseFloat(document.getElementById('swp-corpus').value);
  const annualRate = parseFloat(document.getElementById('swp-rate').value);
  const withdraw = parseFloat(document.getElementById('swp-withdraw').value);
  const years = parseInt(document.getElementById('swp-years').value);
  const result = window.IICalc.swp(corpus, annualRate, withdraw, years);
  if (result.error) { alert(result.error); return; }
  const exhaustedAt = result.exhaustedAt;
  const yearlyData = result.yearlyData, labels = result.labels;
  const endBalance = result.endBalance;`
  );

  // After SWP chart, remember
  if (!h.includes('rememberCalculator("SWP Calculator"')) {
    h = h.replace(
      /(window\.swpChartInstance = new Chart\(ctx, \{[\s\S]*?\}\);\s*\n\})/,
      `$1`.replace(
        /\}\);(\s*\n\})/,
        `});
` + rememberSnippet("SWP Calculator", "mutualfunds.html#swpcalc-mutual") + `$1`
      )
    );
    // safer: inject before closing of calculateSWP after last chart block
    h = h.replace(
      /(window\.swpChartInstance = new Chart\(ctx, \{[\s\S]*?scales: \{[\s\S]*?\}\s*\}\s*\}\);\s*)(\n\})/,
      `$1` + rememberSnippet("SWP Calculator", "mutualfunds.html#swpcalc-mutual") + `$2`
    );
  }

  // max SWP
  h = h.replace(
    /function calculateMaxSWP\(event\) \{\s*event\.preventDefault\(\);\s*const corpus = parseFloat\(document\.getElementById\('swp-max-corpus'\)\.value\);\s*const rate = parseFloat\(document\.getElementById\('swp-max-rate'\)\.value\) \/ 100 \/ 12;\s*const years = parseInt\(document\.getElementById\('swp-max-years'\)\.value\);\s*const months = years \* 12;\s*let maxSWP;\s*if \(corpus <= 0 \|\| rate < 0 \|\| years <= 0\) \{\s*alert\('Please enter valid inputs\.'\);\s*return;\s*\}\s*if \(rate === 0\) maxSWP = corpus \/ months;\s*else maxSWP = corpus \* rate \/ \(1 - Math\.pow\(1 \+ rate, -months\)\);\s*let balance = corpus;\s*const data = \[\];\s*for \(let i = 1; i <= months; i\+\+\) \{\s*balance = balance \* \(1 \+ rate\);\s*balance -= maxSWP;\s*data\.push\(balance > 0 \? balance : 0\);\s*\}\s*const yearlyData = \[\], labels = \[\];\s*for \(let y = 1; y <= Math\.floor\(data\.length \/ 12\); y\+\+\) \{\s*yearlyData\.push\(data\[y \* 12 - 1\]\);\s*labels\.push\('Year ' \+ y\);\s*\}\s*const endBalance = Math\.max\(0, data\[data\.length - 1\]\);/,
    `function calculateMaxSWP(event) {
  event.preventDefault();
  const corpus = parseFloat(document.getElementById('swp-max-corpus').value);
  const annualRate = parseFloat(document.getElementById('swp-max-rate').value);
  const years = parseInt(document.getElementById('swp-max-years').value);
  const result = window.IICalc.maxSwp(corpus, annualRate, years);
  if (result.error) { alert('Please enter valid inputs.'); return; }
  const maxSWP = result.maxMonthly;
  const months = result.months;
  const yearlyData = result.yearlyData, labels = result.labels;
  const endBalance = result.endBalance;`
  );

  if (!h.includes('rememberCalculator("Max SWP Calculator"')) {
    h = h.replace(
      /(window\.swpMaxChartInstance = new Chart\(ctx2, \{[\s\S]*?scales: \{[\s\S]*?\}\s*\}\s*\}\);\s*)(\n\})/,
      `$1` + rememberSnippet("Max SWP Calculator", "mutualfunds.html#swpcalc-mutual") + `$2`
    );
  }

  h = ensureScripts(h, ["js/calc-core.js", "js/storage.js"], true);
  write("mutualfunds.html", h);
}

// ---------- fixeddeposit.html ----------
{
  let h = read("fixeddeposit.html");
  h = h.replace(
    /function calculateFD\(event\) \{\s*event\.preventDefault\(\);\s*\/\/ Gather inputs\s*const P = parseFloat\(document\.getElementById\('fd-principal'\)\.value\);\s*const r = parseFloat\(document\.getElementById\('fd-rate'\)\.value\) \/ 100;\s*const n = parseInt\(document\.getElementById\('fd-compounding'\)\.value\);\s*const years = parseInt\(document\.getElementById\('fd-years'\)\.value\) \|\| 0;\s*const months = parseInt\(document\.getElementById\('fd-months'\)\.value\) \|\| 0;\s*const days = parseInt\(document\.getElementById\('fd-days'\)\.value\) \|\| 0;\s*const totalYears = years \+ \(months \/ 12\) \+ \(days \/ 365\);\s*if \(!P \|\| !r \|\| !n \|\| totalYears <= 0\) \{\s*alert\("Please fill all fields and provide a valid tenure\."\);\s*return;\s*\}\s*\/\/ Compound interest calculation\s*const A = P \* Math\.pow\(1 \+ r \/ n, n \* totalYears\);\s*const totalInterest = A - P;\s*const apy = \(Math\.pow\(1 \+ r \/ n, n\) - 1\) \* 100;/,
    `function calculateFD(event) {
  event.preventDefault();
  const P = parseFloat(document.getElementById('fd-principal').value);
  const annualRate = parseFloat(document.getElementById('fd-rate').value);
  const n = parseInt(document.getElementById('fd-compounding').value);
  const years = parseInt(document.getElementById('fd-years').value) || 0;
  const months = parseInt(document.getElementById('fd-months').value) || 0;
  const days = parseInt(document.getElementById('fd-days').value) || 0;
  const result = window.IICalc.fd(P, annualRate, n, years, months, days);
  if (result.error) {
    alert("Please fill all fields and provide a valid tenure.");
    return;
  }
  const A = result.maturity;
  const totalInterest = result.totalInterest;
  const apy = result.apy;
  const totalYears = result.totalYears;
  const r = annualRate / 100;`
  );

  // Replace breakdown loop with result.rows when present - if old loop still there, inject remember at end
  if (!h.includes('rememberCalculator("FD Calculator"')) {
    h = h.replace(
      /(document\.getElementById\('fd-chart-container'\)\.style\.display = 'block';\s*document\.getElementById\('fd-result'\)\.style\.display = 'block';\s*)(\})/,
      `$1` + rememberSnippet("FD Calculator", "fixeddeposit.html") + `$2`
    );
  }

  h = ensureScripts(h, ["js/calc-core.js", "js/storage.js"], true);
  write("fixeddeposit.html", h);
}

// ---------- nps.html ----------
{
  let h = read("nps.html");
  h = h.replace(
    /\/\/ ✅ STEP 3: Convert values\s*const rate = rateInput \/ 100 \/ 12;\s*const annuityRate = annuityInput \/ 100;\s*const months = years \* 12;\s*\/\/ ✅ STEP 4: Calculation\s*const corpus = monthly \* \(\(Math\.pow\(1 \+ rate, months\) - 1\) \/ rate\) \* \(1 \+ rate\);\s*const invested = monthly \* months;\s*const gain = corpus - invested;\s*const lumpSum = corpus \* 0\.6;\s*const annuityCorpus = corpus \* 0\.4;\s*const monthlyPension = \(annuityCorpus \* annuityRate\) \/ 12;/,
    `// ✅ STEP 3–4: Calculation via shared IICalc
  const result = window.IICalc.nps(monthly, rateInput, years, annuityInput);
  if (result.error) {
    document.getElementById("nps-result").innerHTML = \`
      <div class="error-box">⚠️ \${result.error}</div>\`;
    return;
  }
  const corpus = result.corpus;
  const invested = result.invested;
  const gain = result.gain;
  const lumpSum = result.lumpSum;
  const annuityCorpus = result.annuityCorpus;
  const monthlyPension = result.monthlyPension;`
  );

  if (!h.includes('rememberCalculator("NPS Calculator"')) {
    h = h.replace(
      /(document\.getElementById\("nps-result"\)\.innerHTML = `[\s\S]*?insight-box">\s*\$\{generateInsight\(monthlyPension\)\}\s*<\/div>\s*`;\s*)(\})/,
      `$1` + rememberSnippet("NPS Calculator", "nps.html") + `$2`
    );
  }

  h = ensureScripts(h, ["js/calc-core.js", "js/storage.js"], true);
  write("nps.html", h);
}

// ---------- bonds.html ----------
{
  let h = read("bonds.html");
  h = h.replace(
    /\/\/ Calculate Annual Coupon\s*const annualCoupon = face \* coupon \/ 100;\s*\/\/ Current Yield = Annual Coupon \/ Market Price\s*const currentYield = \(annualCoupon \/ price\) \* 100;\s*\/\/ Yield to Maturity \(approximate formula\)\s*const ytm = \(\(annualCoupon \+ \(face - price\) \/ years\) \/ \(\(face \+ price\) \/ 2\)\) \* 100;/,
    `const by = window.IICalc.bondYield(face, coupon, years, price);
  if (by.error) { alert(by.error); return; }
  const annualCoupon = by.annualCoupon;
  const currentYield = by.currentYield;
  const ytm = by.ytm;`
  );

  if (!h.includes('rememberCalculator("Bond Yield Calculator"')) {
    h = h.replace(
      /(document\.getElementById\('bondYieldFaq'\)\.style\.display = 'block';\s*)(\})/,
      `$1` + rememberSnippet("Bond Yield Calculator", "bonds.html") + `$2`
    );
  }

  h = ensureScripts(h, ["js/calc-core.js", "js/storage.js"], true);
  write("bonds.html", h);
}

// ---------- investmentgoal.html ----------
{
  let h = read("investmentgoal.html");
  h = h.replace(
    /const r = rate \/ 100 \/ 12;\s*const months = n \* 12;\s*let FV;\s*if \(r === 0\) \{\s*FV = P \* months;\s*\} else \{\s*FV = P \* \(\(\(Math\.pow\(1 \+ r, months\) - 1\) \/ r\) \* \(1 \+ r\)\);\s*\}\s*\/\/ Inflation-adjusted corpus\s*const inflationFactor = Math\.pow\(1 \+ inflation \/ 100, n\);\s*const FVReal = FV \/ inflationFactor;/,
    `const goal = window.IICalc.goalSip(P, rate, n, inflation);
      if (goal.error) { alert(goal.error); return; }
      const FV = goal.futureValue;
      const FVReal = goal.futureValueReal;
      const months = n * 12;`
  );

  h = h.replace(
    /\/\/ Example for GoalSet Calculator page\s*localStorage\.setItem\("lastCalculator", JSON\.stringify\(\{[\s\S]*?\}\)\);/,
    `if (window.IIStorage) {
        window.IIStorage.rememberCalculator("Investment Goal Calculator", "investmentgoal.html");
        window.IIStorage.saveGoalSnapshot({
          monthlySip: P,
          years: n,
          expectedCorpus: FV,
          expectedCorpusReal: FVReal,
          rate: rate,
          inflation: inflation,
          routes: routes
        });
      }`
  );

  h = ensureScripts(h, ["js/calc-core.js", "js/storage.js"], true);
  write("investmentgoal.html", h);
}

// ---------- index.html ----------
{
  let h = read("index.html");

  // Goal card markup
  h = h.replace(
    /<div class="card">\s*<h3>🎯 Your Investment Goal<\/h3>\s*<p><span class="highlight">Monthly SIP:<\/span> ₹10,000<\/p>\s*<p><span class="highlight">Target Duration:<\/span> 15 years<\/p>\s*<p><span class="highlight">Expected Corpus:<\/span> ₹50,00,000<\/p>\s*<a href="investmentgoal\.html" class="btn">View or Edit<\/a>\s*<\/div>/,
    `<div class="card" id="goal-summary-card">
        <h3>🎯 Your Investment Goal</h3>
        <div id="goal-summary-empty">
          <p>No goal saved yet. Run the Investment Goal calculator to personalize this card.</p>
        </div>
        <div id="goal-summary-filled" style="display:none;">
          <p><span class="highlight">Monthly SIP:</span> <span id="goal-summary-sip">—</span></p>
          <p><span class="highlight">Target Duration:</span> <span id="goal-summary-years">—</span></p>
          <p><span class="highlight">Expected Corpus:</span> <span id="goal-summary-corpus">—</span></p>
        </div>
        <a href="investmentgoal.html" class="btn" id="goal-summary-btn">Plan a Goal</a>
      </div>`
  );

  // Last calculator placeholder
  h = h.replace(
    /You last used the <strong>FD Calculator<\/strong> on <em>July 1<\/em>\./,
    "No calculator used recently."
  );

  // Top picks list
  h = h.replace(
    /<div class="card">\s*<h3>⭐ Top Picks Today<\/h3>\s*<ul>\s*<li><strong>Parag Parikh Flexi Cap<\/strong> – 5★ Rated<\/li>\s*<li><strong>TCS<\/strong> – IT Sector Leader<\/li>\s*<li><strong>HDFC Bank<\/strong> – Consistent Performer<\/li>\s*<\/ul>\s*<a href="stocks\.html" class="btn">Explore More<\/a>\s*<\/div>/,
    `<div class="card" id="top-picks-card">
        <h3>⭐ Top Picks Today</h3>
        <ul id="top-picks-list">
          <li>Loading recommendations…</li>
        </ul>
        <a href="stocks.html" class="btn">Explore More</a>
      </div>`
  );

  // Remove old last-calc / currency / metals scripts; dashboard.js handles them
  h = h.replace(
    /<script>\s*document\.addEventListener\('DOMContentLoaded', function\(\) \{\s*const lastCalc = localStorage\.getItem\("lastCalculator"\);[\s\S]*?\}\);\s*<\/script>/,
    ""
  );
  h = h.replace(
    /<script>\s*\/\/ You can use "https:\/\/api\.exchangerate-api\.com[\s\S]*?async function convertCurrency\(\) \{[\s\S]*?\}\s*<\/script>/,
    ""
  );
  h = h.replace(
    /<script>\s*async function fetchMetalRates\(\) \{[\s\S]*?fetchMetalRates\(\);\s*<\/script>/,
    ""
  );

  // Ensure dashboard scripts (order: calc-core, storage, recommendations, dashboard, nav)
  ["js/calc-core.js", "js/storage.js", "recommendations.js", "js/dashboard.js"].forEach((src) => {
    if (!h.includes(`src="${src}"`)) {
      h = h.replace(
        /(<script src=["']nav\.js["'] defer><\/script>)/,
        `  <script src="${src}"${src.includes("recommendations") || src.includes("dashboard") ? " defer" : ""}></script>\n$1`
      );
    }
  });

  write("index.html", h);
}

console.log("Phase 2 wiring complete.");
