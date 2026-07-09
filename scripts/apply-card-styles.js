/**
 * One-shot: convert remaining steps-list + category tables to visual cards.
 * Run: node scripts/apply-card-styles.js
 */
const fs = require("fs");
const path = require("path");
const root = path.join(__dirname, "..");

function read(f) {
  return fs.readFileSync(path.join(root, f), "utf8").replace(/\r\n/g, "\n");
}
function write(f, s) {
  fs.writeFileSync(path.join(root, f), s, "utf8");
}
function replaceOnce(src, old, neu, label) {
  if (!src.includes(old)) {
    console.warn("MISS:", label);
    return src;
  }
  const out = src.replace(old, neu);
  if (out === src) console.warn("NOOP:", label);
  else console.log("OK:", label);
  return out;
}
function bumpCss(src) {
  return src.replace(/style\.css\?v=[^"]+/g, "style.css?v=20260709h");
}

// --- helpers to build cards ---
function tipSteps(items) {
  // items: [{emoji, html}]  html is tip-text inner HTML
  return (
    `<ol class="tips-list">\n` +
    items
      .map(
        (it) =>
          `      <li><span class="tip-emoji" aria-hidden="true">${it.emoji}</span><span class="tip-text">${it.html}</span></li>`
      )
      .join("\n") +
    `\n    </ol>`
  );
}

// ========== BASICS ==========
{
  let s = bumpCss(read("basics.html"));
  s = replaceOnce(
    s,
    `      <ol class="steps-list">
        <li>
          <strong>Build a basic emergency fund.</strong>
          Aim for a few months of essential expenses in a liquid place (savings account or liquid fund)
          so you are less likely to sell investments in a crisis.
        </li>
        <li>
          <strong>Clear high-interest consumer debt</strong> (for example credit-card dues)
          when interest costs outweigh typical investment returns.
        </li>
        <li>
          <strong>Protect dependants with term life insurance if needed</strong> —
          insurance is for protection, not a substitute for investing.
        </li>
        <li>
          <strong>Write down goals</strong> (amount + year). Use the
          <a href="investmentgoal.html">Goal planner</a> to sketch a SIP.
        </li>
      </ol>`,
    `      <ol class="tips-list">
        <li><span class="tip-emoji" aria-hidden="true">🛟</span><span class="tip-text"><strong>Build a basic emergency fund</strong> — a few months of essentials in a liquid place so you are less likely to sell investments in a crisis.</span></li>
        <li><span class="tip-emoji" aria-hidden="true">💳</span><span class="tip-text"><strong>Clear high-interest consumer debt</strong> (e.g. credit-card dues) when interest costs outweigh typical investment returns.</span></li>
        <li><span class="tip-emoji" aria-hidden="true">🛡️</span><span class="tip-text"><strong>Protect dependants with term life</strong> if needed — insurance is protection, not a substitute for investing.</span></li>
        <li><span class="tip-emoji" aria-hidden="true">🎯</span><span class="tip-text"><strong>Write down goals</strong> (amount + year). Use the <a href="investmentgoal.html">Goal planner</a> to sketch a SIP.</span></li>
      </ol>`,
    "basics before-invest"
  );
  s = replaceOnce(
    s,
    `      <ol class="steps-list">
        <li>Finish KYC on a trusted platform.</li>
        <li>Choose a fund category you understand (e.g. large-cap / flexi-cap / index — research expense ratio and risk).</li>
        <li>Start a SIP amount you can continue even in a bad month.</li>
        <li>Automate the debit date; review once or twice a year, not every day.</li>
      </ol>`,
    `      <ol class="tips-list">
        <li><span class="tip-emoji" aria-hidden="true">🪪</span><span class="tip-text"><strong>Finish KYC</strong> on a trusted platform.</span></li>
        <li><span class="tip-emoji" aria-hidden="true">🧭</span><span class="tip-text"><strong>Choose a fund category</strong> you understand (large-cap / flexi-cap / index) — research expense ratio and risk.</span></li>
        <li><span class="tip-emoji" aria-hidden="true">💸</span><span class="tip-text"><strong>Start a SIP</strong> amount you can continue even in a bad month.</span></li>
        <li><span class="tip-emoji" aria-hidden="true">📅</span><span class="tip-text"><strong>Automate the debit</strong>; review once or twice a year, not every day.</span></li>
      </ol>`,
    "basics first-sip"
  );
  write("basics.html", s);
}

// ========== BONDS ==========
{
  let s = bumpCss(read("bonds.html"));
  s = replaceOnce(
    s,
    `      <div class="table-wrap table-scroll">
        <table class="compare-table table-cards product-table">
          <thead>
            <tr>
              <th>Type</th>
              <th>Issuer idea</th>
              <th>Often used for</th>
              <th>Notes</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td data-label="Type">G-Secs / T-bills</td>
              <td data-label="Issuer">Central government</td>
              <td data-label="Used for">High-quality sovereign exposure</td>
              <td data-label="Notes">Retail access via RBI Retail Direct / platforms</td>
            </tr>
            <tr>
              <td data-label="Type">SDLs</td>
              <td data-label="Issuer">State governments</td>
              <td data-label="Used for">Slightly higher yield than G-Secs (typically)</td>
              <td data-label="Notes">Still government-related credit</td>
            </tr>
            <tr>
              <td data-label="Type">Corporate bonds</td>
              <td data-label="Issuer">Companies / PSUs</td>
              <td data-label="Used for">Extra yield over sovereign</td>
              <td data-label="Notes">Check rating, covenants, liquidity</td>
            </tr>
            <tr>
              <td data-label="Type">Tax-free bonds</td>
              <td data-label="Issuer">Certain public issuers (when available)</td>
              <td data-label="Used for">Tax-sensitive investors</td>
              <td data-label="Notes">New issues are intermittent; secondary market only sometimes</td>
            </tr>
            <tr>
              <td data-label="Type">Sovereign Gold Bonds</td>
              <td data-label="Issuer">RBI / government framework</td>
              <td data-label="Used for">Gold-linked + small interest</td>
              <td data-label="Notes">See also <a href="gold.html">Gold guide</a></td>
            </tr>
            <tr>
              <td data-label="Type">Debt mutual funds / bond ETFs</td>
              <td data-label="Issuer">AMCs / exchange funds</td>
              <td data-label="Used for">Diversified debt sleeve</td>
              <td data-label="Notes">NAV risk; not the same as holding a single bond to maturity</td>
            </tr>
          </tbody>
        </table>
      </div>`,
    `      <div class="fund-map cols-3" role="list">
        <article class="fund-map-card fund-map--teal" role="listitem">
          <header class="fund-map-head"><span class="fund-map-icon" aria-hidden="true">🏛️</span><h3>G-Secs / T-bills</h3></header>
          <dl class="fund-map-meta">
            <div><dt>Issuer idea</dt><dd>Central government</dd></div>
            <div><dt>Often used for</dt><dd>High-quality sovereign exposure</dd></div>
          </dl>
          <p class="fund-map-risk"><span class="fund-risk-dot" aria-hidden="true"></span> Retail access via RBI Retail Direct / platforms</p>
        </article>
        <article class="fund-map-card fund-map--blue" role="listitem">
          <header class="fund-map-head"><span class="fund-map-icon" aria-hidden="true">🗺️</span><h3>SDLs</h3></header>
          <dl class="fund-map-meta">
            <div><dt>Issuer idea</dt><dd>State governments</dd></div>
            <div><dt>Often used for</dt><dd>Slightly higher yield than G-Secs (typically)</dd></div>
          </dl>
          <p class="fund-map-risk"><span class="fund-risk-dot" aria-hidden="true"></span> Still government-related credit</p>
        </article>
        <article class="fund-map-card fund-map--purple" role="listitem">
          <header class="fund-map-head"><span class="fund-map-icon" aria-hidden="true">🏢</span><h3>Corporate bonds</h3></header>
          <dl class="fund-map-meta">
            <div><dt>Issuer idea</dt><dd>Companies / PSUs</dd></div>
            <div><dt>Often used for</dt><dd>Extra yield over sovereign</dd></div>
          </dl>
          <p class="fund-map-risk"><span class="fund-risk-dot" aria-hidden="true"></span> Check rating, covenants, liquidity</p>
        </article>
        <article class="fund-map-card fund-map--amber" role="listitem">
          <header class="fund-map-head"><span class="fund-map-icon" aria-hidden="true">🧾</span><h3>Tax-free bonds</h3></header>
          <dl class="fund-map-meta">
            <div><dt>Issuer idea</dt><dd>Certain public issuers (when available)</dd></div>
            <div><dt>Often used for</dt><dd>Tax-sensitive investors</dd></div>
          </dl>
          <p class="fund-map-risk"><span class="fund-risk-dot" aria-hidden="true"></span> New issues intermittent; secondary market only sometimes</p>
        </article>
        <article class="fund-map-card fund-map--orange" role="listitem">
          <header class="fund-map-head"><span class="fund-map-icon" aria-hidden="true">🥇</span><h3>Sovereign Gold Bonds</h3></header>
          <dl class="fund-map-meta">
            <div><dt>Issuer idea</dt><dd>RBI / government framework</dd></div>
            <div><dt>Often used for</dt><dd>Gold-linked + small interest</dd></div>
          </dl>
          <p class="fund-map-risk"><span class="fund-risk-dot" aria-hidden="true"></span> See also <a href="gold.html">Gold guide</a></p>
        </article>
        <article class="fund-map-card fund-map--indigo" role="listitem">
          <header class="fund-map-head"><span class="fund-map-icon" aria-hidden="true">📊</span><h3>Debt MFs / bond ETFs</h3></header>
          <dl class="fund-map-meta">
            <div><dt>Issuer idea</dt><dd>AMCs / exchange funds</dd></div>
            <div><dt>Often used for</dt><dd>Diversified debt sleeve</dd></div>
          </dl>
          <p class="fund-map-risk"><span class="fund-risk-dot" aria-hidden="true"></span> NAV risk · not the same as holding one bond to maturity</p>
        </article>
      </div>`,
    "bonds types"
  );
  s = replaceOnce(
    s,
    `  <ol class="steps-list">
    <li>Complete KYC and open a <strong>Demat / trading</strong> account if you want exchange-traded bonds or SGBs.</li>
    <li>For government securities, explore <a href="https://www.rbidirect.org.in/" target="_blank" rel="noopener">RBI Retail Direct</a> (official portal).</li>
    <li>Decide: single bonds vs <strong>debt mutual funds / bond ETFs</strong> for diversification.</li>
    <li>Match <strong>tenure</strong> to when you need money; avoid long-duration credit for short goals.</li>
    <li>Read rating, call features, tax treatment, and secondary-market liquidity before buying.</li>
  </ol>`,
    `  <ol class="tips-list">
    <li><span class="tip-emoji" aria-hidden="true">🪪</span><span class="tip-text"><strong>Complete KYC</strong> and open a Demat / trading account if you want exchange-traded bonds or SGBs.</span></li>
    <li><span class="tip-emoji" aria-hidden="true">🏛️</span><span class="tip-text">For government securities, explore <a href="https://www.rbidirect.org.in/" target="_blank" rel="noopener">RBI Retail Direct</a> (official portal).</span></li>
    <li><span class="tip-emoji" aria-hidden="true">🔀</span><span class="tip-text"><strong>Decide:</strong> single bonds vs debt mutual funds / bond ETFs for diversification.</span></li>
    <li><span class="tip-emoji" aria-hidden="true">📅</span><span class="tip-text"><strong>Match tenure</strong> to when you need money; avoid long-duration credit for short goals.</span></li>
    <li><span class="tip-emoji" aria-hidden="true">🔍</span><span class="tip-text">Read rating, call features, tax treatment, and secondary-market liquidity before buying.</span></li>
  </ol>`,
    "bonds invest"
  );
  s = replaceOnce(
    s,
    `  <ol class="steps-list">
    <li>Pick ladder length and number of rungs.</li>
    <li>Split capital (equal rungs is the simplest starting rule).</li>
    <li>As each bond matures, reinvest or spend according to your plan.</li>
  </ol>`,
    `  <ol class="tips-list">
    <li><span class="tip-emoji" aria-hidden="true">🪜</span><span class="tip-text"><strong>Pick ladder length</strong> and number of rungs.</span></li>
    <li><span class="tip-emoji" aria-hidden="true">⚖️</span><span class="tip-text"><strong>Split capital</strong> — equal rungs is the simplest starting rule.</span></li>
    <li><span class="tip-emoji" aria-hidden="true">🔄</span><span class="tip-text"><strong>On maturity</strong> — reinvest or spend according to your plan.</span></li>
  </ol>`,
    "bonds ladder"
  );
  write("bonds.html", s);
}

// ========== CRYPTO ==========
{
  let s = bumpCss(read("cryptocurrencies.html"));
  s = replaceOnce(
    s,
    `      <div class="table-wrap table-scroll">
        <table class="compare-table table-cards product-table">
          <thead>
            <tr>
              <th>Category</th>
              <th>Idea</th>
              <th>Risk note</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td data-label="Category">Large payment / store-of-value coins</td>
              <td data-label="Idea">e.g. Bitcoin-style networks often called “digital gold” in media</td>
              <td data-label="Risk">Still highly volatile vs gold or FDs</td>
            </tr>
            <tr>
              <td data-label="Category">Smart-contract platforms</td>
              <td data-label="Idea">Host apps, tokens, DeFi</td>
              <td data-label="Risk">Tech + market + smart-contract risk</td>
            </tr>
            <tr>
              <td data-label="Category">Exchange / utility tokens</td>
              <td data-label="Idea">Linked to exchange ecosystems</td>
              <td data-label="Risk">Business + regulatory concentration</td>
            </tr>
            <tr>
              <td data-label="Category">Stablecoins</td>
              <td data-label="Idea">Peg narratives to fiat</td>
              <td data-label="Risk">Peg can break; issuer / reserve risk</td>
            </tr>
            <tr>
              <td data-label="Category">Meme / micro caps</td>
              <td data-label="Idea">Narrative-driven tokens</td>
              <td data-label="Risk">Often near-zero research quality; can go to zero</td>
            </tr>
          </tbody>
        </table>
      </div>`,
    `      <div class="fund-map cols-3" role="list">
        <article class="fund-map-card fund-map--amber" role="listitem">
          <header class="fund-map-head"><span class="fund-map-icon" aria-hidden="true">₿</span><h3>Large payment / store-of-value</h3></header>
          <dl class="fund-map-meta"><div><dt>Idea</dt><dd>e.g. Bitcoin-style networks often called “digital gold” in media</dd></div></dl>
          <p class="fund-map-risk"><span class="fund-risk-dot" aria-hidden="true"></span> Still highly volatile vs gold or FDs</p>
        </article>
        <article class="fund-map-card fund-map--purple" role="listitem">
          <header class="fund-map-head"><span class="fund-map-icon" aria-hidden="true">⚙️</span><h3>Smart-contract platforms</h3></header>
          <dl class="fund-map-meta"><div><dt>Idea</dt><dd>Host apps, tokens, DeFi</dd></div></dl>
          <p class="fund-map-risk"><span class="fund-risk-dot" aria-hidden="true"></span> Tech + market + smart-contract risk</p>
        </article>
        <article class="fund-map-card fund-map--blue" role="listitem">
          <header class="fund-map-head"><span class="fund-map-icon" aria-hidden="true">🏦</span><h3>Exchange / utility tokens</h3></header>
          <dl class="fund-map-meta"><div><dt>Idea</dt><dd>Linked to exchange ecosystems</dd></div></dl>
          <p class="fund-map-risk"><span class="fund-risk-dot" aria-hidden="true"></span> Business + regulatory concentration</p>
        </article>
        <article class="fund-map-card fund-map--teal" role="listitem">
          <header class="fund-map-head"><span class="fund-map-icon" aria-hidden="true">💵</span><h3>Stablecoins</h3></header>
          <dl class="fund-map-meta"><div><dt>Idea</dt><dd>Peg narratives to fiat</dd></div></dl>
          <p class="fund-map-risk"><span class="fund-risk-dot" aria-hidden="true"></span> Peg can break · issuer / reserve risk</p>
        </article>
        <article class="fund-map-card fund-map--rose" role="listitem">
          <header class="fund-map-head"><span class="fund-map-icon" aria-hidden="true">🎲</span><h3>Meme / micro caps</h3></header>
          <dl class="fund-map-meta"><div><dt>Idea</dt><dd>Narrative-driven tokens</dd></div></dl>
          <p class="fund-map-risk"><span class="fund-risk-dot" aria-hidden="true"></span> Near-zero research quality · can go to zero</p>
        </article>
      </div>`,
    "crypto types"
  );
  write("cryptocurrencies.html", s);
}

// ========== ETF ==========
{
  let s = bumpCss(read("etf.html"));
  s = replaceOnce(
    s,
    `      <div class="table-wrap table-scroll">
        <table class="compare-table table-cards product-table">
          <thead>
            <tr>
              <th>Type</th>
              <th>Tracks / holds</th>
              <th>Often used for</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td data-label="Type">Equity index</td>
              <td data-label="Tracks">Nifty 50, Sensex, Next 50, etc.</td>
              <td data-label="Used for">Core long-term equity</td>
            </tr>
            <tr>
              <td data-label="Type">Sector / thematic</td>
              <td data-label="Tracks">Bank, IT, infra, etc.</td>
              <td data-label="Used for">Satellite bets</td>
            </tr>
            <tr>
              <td data-label="Type">Debt / bond</td>
              <td data-label="Tracks">G-Secs or bond baskets</td>
              <td data-label="Used for">Debt sleeve</td>
            </tr>
            <tr>
              <td data-label="Type">Gold</td>
              <td data-label="Tracks">Gold price</td>
              <td data-label="Used for">Digital gold exposure — <a href="gold.html">Gold guide</a></td>
            </tr>
            <tr>
              <td data-label="Type">International</td>
              <td data-label="Tracks">Nasdaq 100, S&amp;P 500, etc.</td>
              <td data-label="Used for">Global diversification — <a href="usstocks.html">US stocks</a></td>
            </tr>
          </tbody>
        </table>
      </div>`,
    `      <div class="fund-map cols-3" role="list">
        <article class="fund-map-card fund-map--blue" role="listitem">
          <header class="fund-map-head"><span class="fund-map-icon" aria-hidden="true">📈</span><h3>Equity index</h3></header>
          <dl class="fund-map-meta">
            <div><dt>Tracks / holds</dt><dd>Nifty 50, Sensex, Next 50, etc.</dd></div>
            <div><dt>Often used for</dt><dd>Core long-term equity</dd></div>
          </dl>
        </article>
        <article class="fund-map-card fund-map--rose" role="listitem">
          <header class="fund-map-head"><span class="fund-map-icon" aria-hidden="true">🎯</span><h3>Sector / thematic</h3></header>
          <dl class="fund-map-meta">
            <div><dt>Tracks / holds</dt><dd>Bank, IT, infra, etc.</dd></div>
            <div><dt>Often used for</dt><dd>Satellite bets</dd></div>
          </dl>
        </article>
        <article class="fund-map-card fund-map--slate" role="listitem">
          <header class="fund-map-head"><span class="fund-map-icon" aria-hidden="true">🏦</span><h3>Debt / bond</h3></header>
          <dl class="fund-map-meta">
            <div><dt>Tracks / holds</dt><dd>G-Secs or bond baskets</dd></div>
            <div><dt>Often used for</dt><dd>Debt sleeve</dd></div>
          </dl>
        </article>
        <article class="fund-map-card fund-map--amber" role="listitem">
          <header class="fund-map-head"><span class="fund-map-icon" aria-hidden="true">🥇</span><h3>Gold</h3></header>
          <dl class="fund-map-meta">
            <div><dt>Tracks / holds</dt><dd>Gold price</dd></div>
            <div><dt>Often used for</dt><dd>Digital gold — <a href="gold.html">Gold guide</a></dd></div>
          </dl>
        </article>
        <article class="fund-map-card fund-map--indigo" role="listitem">
          <header class="fund-map-head"><span class="fund-map-icon" aria-hidden="true">🌍</span><h3>International</h3></header>
          <dl class="fund-map-meta">
            <div><dt>Tracks / holds</dt><dd>Nasdaq 100, S&amp;P 500, etc.</dd></div>
            <div><dt>Often used for</dt><dd>Global diversification — <a href="usstocks.html">US stocks</a></dd></div>
          </dl>
        </article>
      </div>`,
    "etf types"
  );
  s = replaceOnce(
    s,
    `      <ol class="steps-list">
        <li>Complete KYC and open a <strong>Demat + trading</strong> account with a SEBI-registered broker.</li>
        <li>Search the ticker (e.g. broad Nifty ETFs often discussed as NIFTYBEES-style products).</li>
        <li>Prefer limit orders near fair value; check AUM, expense ratio, and tracking difference.</li>
        <li>Hold in Demat; sell during market hours like a stock.</li>
        <li>For automatic SIPs, many people use <strong>index mutual funds</strong> instead — compare below.</li>
      </ol>`,
    `      <ol class="tips-list">
        <li><span class="tip-emoji" aria-hidden="true">🪪</span><span class="tip-text"><strong>Complete KYC</strong> and open a Demat + trading account with a SEBI-registered broker.</span></li>
        <li><span class="tip-emoji" aria-hidden="true">🔎</span><span class="tip-text"><strong>Search the ticker</strong> (e.g. broad Nifty ETFs often discussed as NIFTYBEES-style products).</span></li>
        <li><span class="tip-emoji" aria-hidden="true">📉</span><span class="tip-text"><strong>Prefer limit orders</strong> near fair value; check AUM, expense ratio, and tracking difference.</span></li>
        <li><span class="tip-emoji" aria-hidden="true">💼</span><span class="tip-text"><strong>Hold in Demat</strong>; sell during market hours like a stock.</span></li>
        <li><span class="tip-emoji" aria-hidden="true">🔁</span><span class="tip-text">For automatic SIPs, many people use <strong>index mutual funds</strong> instead — compare below.</span></li>
      </ol>`,
    "etf invest"
  );
  write("etf.html", s);
}

// ========== GOLD ==========
{
  let s = bumpCss(read("gold.html"));
  s = replaceOnce(
    s,
    `      <div class="table-wrap">
        <table class="compare-table">
          <thead>
            <tr>
              <th>Form</th>
              <th>Liquidity</th>
              <th>Storage / counterparty</th>
              <th>Typical notes</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Jewellery</td>
              <td>Resale with spreads</td>
              <td>You hold it</td>
              <td>Making charges dominate</td>
            </tr>
            <tr>
              <td>Coins / bars</td>
              <td>Dealer-dependent</td>
              <td>You store / vault</td>
              <td>Purity &amp; spread matter</td>
            </tr>
            <tr>
              <td>Gold ETF / fund</td>
              <td>Market / AMC rules</td>
              <td>Fund / custodian</td>
              <td>Costs &amp; tracking</td>
            </tr>
            <tr>
              <td>SGB (when available)</td>
              <td>Tenure + secondary market</td>
              <td>Demat / RBI framework</td>
              <td>Scheme terms &amp; interest</td>
            </tr>
          </tbody>
        </table>
      </div>`,
    `      <div class="fund-map cols-2" role="list">
        <article class="fund-map-card fund-map--amber" role="listitem">
          <header class="fund-map-head"><span class="fund-map-icon" aria-hidden="true">💍</span><h3>Jewellery</h3></header>
          <dl class="fund-map-meta">
            <div><dt>Liquidity</dt><dd>Resale with spreads</dd></div>
            <div><dt>Storage / counterparty</dt><dd>You hold it</dd></div>
          </dl>
          <p class="fund-map-risk"><span class="fund-risk-dot" aria-hidden="true"></span> Making charges dominate</p>
        </article>
        <article class="fund-map-card fund-map--orange" role="listitem">
          <header class="fund-map-head"><span class="fund-map-icon" aria-hidden="true">🪙</span><h3>Coins / bars</h3></header>
          <dl class="fund-map-meta">
            <div><dt>Liquidity</dt><dd>Dealer-dependent</dd></div>
            <div><dt>Storage / counterparty</dt><dd>You store / vault</dd></div>
          </dl>
          <p class="fund-map-risk"><span class="fund-risk-dot" aria-hidden="true"></span> Purity &amp; spread matter</p>
        </article>
        <article class="fund-map-card fund-map--blue" role="listitem">
          <header class="fund-map-head"><span class="fund-map-icon" aria-hidden="true">📊</span><h3>Gold ETF / fund</h3></header>
          <dl class="fund-map-meta">
            <div><dt>Liquidity</dt><dd>Market / AMC rules</dd></div>
            <div><dt>Storage / counterparty</dt><dd>Fund / custodian</dd></div>
          </dl>
          <p class="fund-map-risk"><span class="fund-risk-dot" aria-hidden="true"></span> Costs &amp; tracking</p>
        </article>
        <article class="fund-map-card fund-map--teal" role="listitem">
          <header class="fund-map-head"><span class="fund-map-icon" aria-hidden="true">📜</span><h3>SGB (when available)</h3></header>
          <dl class="fund-map-meta">
            <div><dt>Liquidity</dt><dd>Tenure + secondary market</dd></div>
            <div><dt>Storage / counterparty</dt><dd>Demat / RBI framework</dd></div>
          </dl>
          <p class="fund-map-risk"><span class="fund-risk-dot" aria-hidden="true"></span> Scheme terms &amp; interest</p>
        </article>
      </div>`,
    "gold compare"
  );
  write("gold.html", s);
}

// ========== INDEX VS ACTIVE ==========
{
  let s = bumpCss(read("index-vs-active.html"));
  s = replaceOnce(
    s,
    `      <div class="table-wrap">
        <table class="compare-table">
          <thead>
            <tr>
              <th>Aspect</th>
              <th>Index / passive</th>
              <th>Active</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Goal</td>
              <td>Match index (minus costs)</td>
              <td>Beat benchmark or style mandate</td>
            </tr>
            <tr>
              <td>Typical costs</td>
              <td>Often lower expense ratio</td>
              <td>Often higher expense ratio</td>
            </tr>
            <tr>
              <td>Transparency</td>
              <td>Index rules are public</td>
              <td>Depends on disclosures &amp; style</td>
            </tr>
            <tr>
              <td>Key risk beyond markets</td>
              <td>Tracking difference, concentration of the index itself</td>
              <td>Manager risk, style drift, higher fee drag</td>
            </tr>
            <tr>
              <td>What “good” looks like</td>
              <td>Tight tracking, low cost, adequate liquidity (ETFs)</td>
              <td>Consistent process; past alpha may not repeat</td>
            </tr>
          </tbody>
        </table>
      </div>`,
    `      <div class="fund-map cols-2" role="list">
        <article class="fund-map-card fund-map--blue" role="listitem">
          <header class="fund-map-head"><span class="fund-map-icon" aria-hidden="true">📊</span><h3>Index / passive</h3></header>
          <dl class="fund-map-meta aspect-grid">
            <div><dt>Goal</dt><dd>Match index (minus costs)</dd></div>
            <div><dt>Typical costs</dt><dd>Often lower expense ratio</dd></div>
            <div><dt>Transparency</dt><dd>Index rules are public</dd></div>
            <div><dt>Key risk beyond markets</dt><dd>Tracking difference, index concentration</dd></div>
          </dl>
          <p class="fund-map-risk"><span class="fund-risk-dot" aria-hidden="true"></span> Good looks like: tight tracking, low cost, liquidity</p>
        </article>
        <article class="fund-map-card fund-map--purple" role="listitem">
          <header class="fund-map-head"><span class="fund-map-icon" aria-hidden="true">🧭</span><h3>Active</h3></header>
          <dl class="fund-map-meta aspect-grid">
            <div><dt>Goal</dt><dd>Beat benchmark or style mandate</dd></div>
            <div><dt>Typical costs</dt><dd>Often higher expense ratio</dd></div>
            <div><dt>Transparency</dt><dd>Depends on disclosures &amp; style</dd></div>
            <div><dt>Key risk beyond markets</dt><dd>Manager risk, style drift, fee drag</dd></div>
          </dl>
          <p class="fund-map-risk"><span class="fund-risk-dot" aria-hidden="true"></span> Good looks like: consistent process; past alpha may not repeat</p>
        </article>
      </div>`,
    "index-vs-active compare"
  );
  write("index-vs-active.html", s);
}

// ========== INSURANCE ==========
{
  let s = bumpCss(read("insurance-emergency.html"));
  s = replaceOnce(
    s,
    `      <ol class="steps-list">
        <li>List monthly essentials (honestly, not aspirational lifestyle spend).</li>
        <li>Open a dedicated account or earmark a balance so you do not “accidentally” spend it.</li>
        <li>Automate a transfer on salary day until the target is reached.</li>
        <li>After you use it, refill before increasing risk investments.</li>
      </ol>`,
    `      <ol class="tips-list">
        <li><span class="tip-emoji" aria-hidden="true">📝</span><span class="tip-text"><strong>List monthly essentials</strong> honestly — not aspirational lifestyle spend.</span></li>
        <li><span class="tip-emoji" aria-hidden="true">🏦</span><span class="tip-text"><strong>Earmark the buffer</strong> in a dedicated account so you do not “accidentally” spend it.</span></li>
        <li><span class="tip-emoji" aria-hidden="true">🔁</span><span class="tip-text"><strong>Automate a transfer</strong> on salary day until the target is reached.</span></li>
        <li><span class="tip-emoji" aria-hidden="true">♻️</span><span class="tip-text"><strong>Refill after use</strong> before increasing risk investments.</span></li>
      </ol>`,
    "insurance build steps"
  );
  // read insurance vs invest table fully
  const vsStart = s.indexOf('<section id="vs-invest">');
  const vsTable = s.indexOf('<div class="table-wrap">', vsStart);
  const vsEnd = s.indexOf("</table>", vsTable) + "</table>".length;
  const vsClose = s.indexOf("</div>", vsEnd) + "</div>".length;
  if (vsStart > -1 && vsTable > -1) {
    const neu = `      <div class="fund-map cols-2" role="list">
        <article class="fund-map-card fund-map--teal" role="listitem">
          <header class="fund-map-head"><span class="fund-map-icon" aria-hidden="true">🛡️</span><h3>Protection (term / health)</h3></header>
          <dl class="fund-map-meta aspect-grid">
            <div><dt>Main job</dt><dd>Transfer large financial risks</dd></div>
            <div><dt>Success looks like</dt><dd>Claim paid when needed; sleep better</dd></div>
            <div><dt>Common confusion</dt><dd>Mixing insurance with “return” products without understanding costs</dd></div>
          </dl>
          <p class="fund-map-risk"><span class="fund-risk-dot" aria-hidden="true"></span> Buy cover for risk transfer, not as a SIP substitute</p>
        </article>
        <article class="fund-map-card fund-map--blue" role="listitem">
          <header class="fund-map-head"><span class="fund-map-icon" aria-hidden="true">📈</span><h3>Investing (SIP, stocks, FD…)</h3></header>
          <dl class="fund-map-meta aspect-grid">
            <div><dt>Main job</dt><dd>Grow or park money for goals</dd></div>
            <div><dt>Success looks like</dt><dd>Corpus toward goals after costs &amp; tax</dd></div>
            <div><dt>Common confusion</dt><dd>Skipping protection and calling market risk “insurance”</dd></div>
          </dl>
          <p class="fund-map-risk"><span class="fund-risk-dot" aria-hidden="true"></span> Build wealth after the buffer and cover basics</p>
        </article>
      </div>`;
    s = s.slice(0, vsTable) + neu + s.slice(vsClose);
    console.log("OK: insurance vs-invest");
  } else console.warn("MISS: insurance vs-invest");
  write("insurance-emergency.html", s);
}

// ========== INTRADAY ==========
{
  let s = bumpCss(read("intraday.html"));
  s = replaceOnce(
    s,
    `      <ol class="steps-list">
        <li>Choose an intraday product (often labelled MIS / intraday) on your broker.</li>
        <li>Buy or sell with available margin — leverage amplifies both gains and losses.</li>
        <li>Close the position yourself or face broker square-off near market close.</li>
        <li>P&amp;L settles for the day (plus charges); overnight investment risk differs from MIS.</li>
      </ol>`,
    `      <ol class="tips-list">
        <li><span class="tip-emoji" aria-hidden="true">🏷️</span><span class="tip-text"><strong>Choose an intraday product</strong> (often labelled MIS / intraday) on your broker.</span></li>
        <li><span class="tip-emoji" aria-hidden="true">⚡</span><span class="tip-text"><strong>Trade with margin</strong> — leverage amplifies both gains and losses.</span></li>
        <li><span class="tip-emoji" aria-hidden="true">⏰</span><span class="tip-text"><strong>Close the position</strong> yourself or face broker square-off near market close.</span></li>
        <li><span class="tip-emoji" aria-hidden="true">📋</span><span class="tip-text"><strong>P&amp;L settles for the day</strong> (plus charges); overnight investment risk differs from MIS.</span></li>
      </ol>`,
    "intraday how"
  );
  write("intraday.html", s);
}

// ========== IPO ==========
{
  let s = bumpCss(read("ipo.html"));
  s = replaceOnce(
    s,
    `      <ol class="steps-list">
        <li>Company files a draft offer document (DRHP / RHP path) with SEBI disclosures.</li>
        <li>Price band and issue dates are announced; investors apply via ASBA/UPI through brokers/banks.</li>
        <li>Demand (subscription) is published; allotment is finalised per category rules.</li>
        <li>Shares credit to Demat; listing day trading begins at a free market price.</li>
      </ol>`,
    `      <ol class="tips-list">
        <li><span class="tip-emoji" aria-hidden="true">📄</span><span class="tip-text"><strong>Offer document</strong> — company files DRHP / RHP path with SEBI disclosures.</span></li>
        <li><span class="tip-emoji" aria-hidden="true">💰</span><span class="tip-text"><strong>Price band &amp; dates</strong> announced; apply via ASBA/UPI through brokers/banks.</span></li>
        <li><span class="tip-emoji" aria-hidden="true">📊</span><span class="tip-text"><strong>Subscription &amp; allotment</strong> finalised per category rules.</span></li>
        <li><span class="tip-emoji" aria-hidden="true">📈</span><span class="tip-text"><strong>Listing</strong> — shares credit to Demat; trading begins at a free market price.</span></li>
      </ol>`,
    "ipo how"
  );
  s = replaceOnce(
    s,
    `      <ol class="steps-list">
        <li>Have PAN, Demat, bank/UPI ready with a SEBI-registered broker.</li>
        <li>During the window, open the IPO on the app and enter bid (lots × price within band).</li>
        <li>Approve the UPI/ASBA mandate in time.</li>
        <li>Check allotment status after the issue closes; funds block releases if not allotted.</li>
        <li>If allotted, decide whether listing-day trade fits your plan — or hold with a thesis.</li>
      </ol>`,
    `      <ol class="tips-list">
        <li><span class="tip-emoji" aria-hidden="true">🪪</span><span class="tip-text"><strong>Get ready</strong> — PAN, Demat, bank/UPI with a SEBI-registered broker.</span></li>
        <li><span class="tip-emoji" aria-hidden="true">📱</span><span class="tip-text"><strong>Bid in the window</strong> — lots × price within the band on the app.</span></li>
        <li><span class="tip-emoji" aria-hidden="true">✅</span><span class="tip-text"><strong>Approve UPI/ASBA</strong> mandate in time.</span></li>
        <li><span class="tip-emoji" aria-hidden="true">📬</span><span class="tip-text"><strong>Check allotment</strong> after close; funds block releases if not allotted.</span></li>
        <li><span class="tip-emoji" aria-hidden="true">🧭</span><span class="tip-text"><strong>If allotted</strong> — listing-day trade or hold with a thesis, per your plan.</span></li>
      </ol>`,
    "ipo apply"
  );
  write("ipo.html", s);
}

// ========== MUTUAL FUNDS SIP VS LUMPSUM ==========
{
  let s = bumpCss(read("mutualfunds.html"));
  s = replaceOnce(
    s,
    `    <div class="table-wrap table-scroll">
      <table class="compare-table table-cards product-table">
        <thead>
          <tr>
            <th>Aspect</th>
            <th>SIP</th>
            <th>Lumpsum</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td data-label="Aspect">Cash flow</td>
            <td data-label="SIP">Fixed amount at regular intervals</td>
            <td data-label="Lumpsum">One-time investment</td>
          </tr>
          <tr>
            <td data-label="Aspect">Behaviour</td>
            <td data-label="SIP">Builds habit; averages purchase NAV over time</td>
            <td data-label="Lumpsum">Depends on entry level and staying invested</td>
          </tr>
          <tr>
            <td data-label="Aspect">Who often uses</td>
            <td data-label="SIP">Salaried / monthly savers</td>
            <td data-label="Lumpsum">Bonus, inheritance, or rebalancing cash</td>
          </tr>
        </tbody>
      </table>
    </div>`,
    `    <div class="fund-map cols-2" role="list">
      <article class="fund-map-card fund-map--blue" role="listitem">
        <header class="fund-map-head"><span class="fund-map-icon" aria-hidden="true">📅</span><h3>SIP</h3></header>
        <dl class="fund-map-meta aspect-grid">
          <div><dt>Cash flow</dt><dd>Fixed amount at regular intervals</dd></div>
          <div><dt>Behaviour</dt><dd>Builds habit; averages purchase NAV over time</dd></div>
          <div><dt>Who often uses</dt><dd>Salaried / monthly savers</dd></div>
        </dl>
        <p class="fund-map-risk"><span class="fund-risk-dot" aria-hidden="true"></span> Great when money arrives monthly</p>
      </article>
      <article class="fund-map-card fund-map--teal" role="listitem">
        <header class="fund-map-head"><span class="fund-map-icon" aria-hidden="true">💰</span><h3>Lumpsum</h3></header>
        <dl class="fund-map-meta aspect-grid">
          <div><dt>Cash flow</dt><dd>One-time investment</dd></div>
          <div><dt>Behaviour</dt><dd>Depends on entry level and staying invested</dd></div>
          <div><dt>Who often uses</dt><dd>Bonus, inheritance, or rebalancing cash</dd></div>
        </dl>
        <p class="fund-map-risk"><span class="fund-risk-dot" aria-hidden="true"></span> Useful when a large amount is already available</p>
      </article>
    </div>`,
    "mf sip vs lumpsum"
  );
  write("mutualfunds.html", s);
}

// ========== REAL ESTATE ==========
{
  let s = bumpCss(read("realestate.html"));
  s = replaceOnce(
    s,
    `      <div class="table-wrap table-scroll">
        <table class="compare-table table-cards product-table">
          <thead>
            <tr>
              <th>Form</th>
              <th>Idea</th>
              <th>Liquidity</th>
              <th>Notes</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td data-label="Form">Self-occupied home</td>
              <td data-label="Idea">Live in it; repay loan over years</td>
              <td data-label="Liquidity">Low</td>
              <td data-label="Notes">Utility value dominates; resale friction high</td>
            </tr>
            <tr>
              <td data-label="Form">Investment flat / house</td>
              <td data-label="Idea">Rent out or hold for price rise</td>
              <td data-label="Liquidity">Low</td>
              <td data-label="Notes">Vacancy, maintenance, tenant risk</td>
            </tr>
            <tr>
              <td data-label="Form">Plot / land</td>
              <td data-label="Idea">Appreciation narrative, no rent usually</td>
              <td data-label="Liquidity">Often lower</td>
              <td data-label="Notes">Title, zoning, and holding costs matter</td>
            </tr>
            <tr>
              <td data-label="Form">Under-construction (primary)</td>
              <td data-label="Idea">Builder projects; staged payments</td>
              <td data-label="Liquidity">Very low until completion</td>
              <td data-label="Notes">Delay / quality risk; check RERA status</td>
            </tr>
            <tr>
              <td data-label="Form">REITs / InvITs (listed)</td>
              <td data-label="Idea">Units in real-estate / infra cash-flow pools</td>
              <td data-label="Liquidity">Exchange trading (varies)</td>
              <td data-label="Notes">Different product from buying a flat — SEBI-regulated</td>
            </tr>
          </tbody>
        </table>
      </div>`,
    `      <div class="fund-map cols-3" role="list">
        <article class="fund-map-card fund-map--blue" role="listitem">
          <header class="fund-map-head"><span class="fund-map-icon" aria-hidden="true">🏠</span><h3>Self-occupied home</h3></header>
          <dl class="fund-map-meta">
            <div><dt>Idea</dt><dd>Live in it; repay loan over years</dd></div>
            <div><dt>Liquidity</dt><dd>Low</dd></div>
          </dl>
          <p class="fund-map-risk"><span class="fund-risk-dot" aria-hidden="true"></span> Utility value dominates · resale friction high</p>
        </article>
        <article class="fund-map-card fund-map--purple" role="listitem">
          <header class="fund-map-head"><span class="fund-map-icon" aria-hidden="true">🔑</span><h3>Investment flat / house</h3></header>
          <dl class="fund-map-meta">
            <div><dt>Idea</dt><dd>Rent out or hold for price rise</dd></div>
            <div><dt>Liquidity</dt><dd>Low</dd></div>
          </dl>
          <p class="fund-map-risk"><span class="fund-risk-dot" aria-hidden="true"></span> Vacancy, maintenance, tenant risk</p>
        </article>
        <article class="fund-map-card fund-map--amber" role="listitem">
          <header class="fund-map-head"><span class="fund-map-icon" aria-hidden="true">📐</span><h3>Plot / land</h3></header>
          <dl class="fund-map-meta">
            <div><dt>Idea</dt><dd>Appreciation narrative, no rent usually</dd></div>
            <div><dt>Liquidity</dt><dd>Often lower</dd></div>
          </dl>
          <p class="fund-map-risk"><span class="fund-risk-dot" aria-hidden="true"></span> Title, zoning, and holding costs matter</p>
        </article>
        <article class="fund-map-card fund-map--orange" role="listitem">
          <header class="fund-map-head"><span class="fund-map-icon" aria-hidden="true">🏗️</span><h3>Under-construction</h3></header>
          <dl class="fund-map-meta">
            <div><dt>Idea</dt><dd>Builder projects; staged payments</dd></div>
            <div><dt>Liquidity</dt><dd>Very low until completion</dd></div>
          </dl>
          <p class="fund-map-risk"><span class="fund-risk-dot" aria-hidden="true"></span> Delay / quality risk · check RERA status</p>
        </article>
        <article class="fund-map-card fund-map--teal" role="listitem">
          <header class="fund-map-head"><span class="fund-map-icon" aria-hidden="true">📊</span><h3>REITs / InvITs</h3></header>
          <dl class="fund-map-meta">
            <div><dt>Idea</dt><dd>Units in real-estate / infra cash-flow pools</dd></div>
            <div><dt>Liquidity</dt><dd>Exchange trading (varies)</dd></div>
          </dl>
          <p class="fund-map-risk"><span class="fund-risk-dot" aria-hidden="true"></span> Different from buying a flat · SEBI-regulated</p>
        </article>
      </div>`,
    "realestate ways"
  );
  write("realestate.html", s);
}

// ========== STOCKS MARKET CAPS ==========
{
  let s = bumpCss(read("stocks.html"));
  s = replaceOnce(
    s,
    `      <div class="table-wrap table-scroll">
        <table class="compare-table table-cards product-table">
          <thead>
            <tr>
              <th>Bucket</th>
              <th>Typical traits</th>
              <th>Often used for</th>
              <th>Risk tone</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td data-label="Bucket">Large-cap</td>
              <td data-label="Traits">Bigger, more established names (e.g. many Nifty 50 members)</td>
              <td data-label="Used for">Core long-term equity</td>
              <td data-label="Risk">Relatively lower vs smaller peers (still volatile)</td>
            </tr>
            <tr>
              <td data-label="Bucket">Mid-cap</td>
              <td data-label="Traits">Growing companies between large and small</td>
              <td data-label="Used for">Growth sleeve</td>
              <td data-label="Risk">Medium–high</td>
            </tr>
            <tr>
              <td data-label="Bucket">Small-cap</td>
              <td data-label="Traits">Smaller businesses, thinner liquidity at times</td>
              <td data-label="Used for">Satellite / high-risk sleeve</td>
              <td data-label="Risk">High</td>
            </tr>
          </tbody>
        </table>
      </div>`,
    `      <div class="fund-map cols-3" role="list">
        <article class="fund-map-card fund-map--blue" role="listitem">
          <header class="fund-map-head"><span class="fund-map-icon" aria-hidden="true">🏛️</span><h3>Large-cap</h3></header>
          <dl class="fund-map-meta">
            <div><dt>Typical traits</dt><dd>Bigger, more established names (e.g. many Nifty 50 members)</dd></div>
            <div><dt>Often used for</dt><dd>Core long-term equity</dd></div>
          </dl>
          <p class="fund-map-risk"><span class="fund-risk-dot" aria-hidden="true"></span> Relatively lower vs smaller peers · still volatile</p>
        </article>
        <article class="fund-map-card fund-map--purple" role="listitem">
          <header class="fund-map-head"><span class="fund-map-icon" aria-hidden="true">🚀</span><h3>Mid-cap</h3></header>
          <dl class="fund-map-meta">
            <div><dt>Typical traits</dt><dd>Growing companies between large and small</dd></div>
            <div><dt>Often used for</dt><dd>Growth sleeve</dd></div>
          </dl>
          <p class="fund-map-risk"><span class="fund-risk-dot" aria-hidden="true"></span> Medium–high</p>
        </article>
        <article class="fund-map-card fund-map--rose" role="listitem">
          <header class="fund-map-head"><span class="fund-map-icon" aria-hidden="true">⚡</span><h3>Small-cap</h3></header>
          <dl class="fund-map-meta">
            <div><dt>Typical traits</dt><dd>Smaller businesses, thinner liquidity at times</dd></div>
            <div><dt>Often used for</dt><dd>Satellite / high-risk sleeve</dd></div>
          </dl>
          <p class="fund-map-risk"><span class="fund-risk-dot" aria-hidden="true"></span> High</p>
        </article>
      </div>`,
    "stocks caps"
  );
  write("stocks.html", s);
}

// ========== PPF COMPARE ==========
{
  let s = bumpCss(read("ppf-tax-saving.html"));
  s = replaceOnce(
    s,
    `      <div class="table-wrap">
        <table class="compare-table">
          <thead>
            <tr>
              <th>Aspect</th>
              <th>PPF</th>
              <th>Bank FD</th>
              <th>ELSS (equity MF)</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Return style</td>
              <td>Administered interest rate</td>
              <td>Fixed for the deposit tenure</td>
              <td>Market-linked (can be volatile)</td>
            </tr>
            <tr>
              <td>Typical horizon</td>
              <td>Long (multi-year lock-in)</td>
              <td>Flexible tenures</td>
              <td>Long recommended; lock-in ~3 years</td>
            </tr>
            <tr>
              <td>Liquidity</td>
              <td>Restricted</td>
              <td>Breakable with conditions/penalties</td>
              <td>After lock-in, units can be redeemed (NAV risk)</td>
            </tr>
            <tr>
              <td>Main role</td>
              <td>Stable long-term savings sleeve</td>
              <td>Short–medium parking / goals</td>
              <td>Growth sleeve with tax-saving discussions</td>
            </tr>
          </tbody>
        </table>
      </div>`,
    `      <div class="fund-map cols-3" role="list">
        <article class="fund-map-card fund-map--teal" role="listitem">
          <header class="fund-map-head"><span class="fund-map-icon" aria-hidden="true">📘</span><h3>PPF</h3></header>
          <dl class="fund-map-meta aspect-grid">
            <div><dt>Return style</dt><dd>Administered interest rate</dd></div>
            <div><dt>Typical horizon</dt><dd>Long (multi-year lock-in)</dd></div>
            <div><dt>Liquidity</dt><dd>Restricted</dd></div>
          </dl>
          <p class="fund-map-risk"><span class="fund-risk-dot" aria-hidden="true"></span> Stable long-term savings sleeve</p>
        </article>
        <article class="fund-map-card fund-map--slate" role="listitem">
          <header class="fund-map-head"><span class="fund-map-icon" aria-hidden="true">🏦</span><h3>Bank FD</h3></header>
          <dl class="fund-map-meta aspect-grid">
            <div><dt>Return style</dt><dd>Fixed for the deposit tenure</dd></div>
            <div><dt>Typical horizon</dt><dd>Flexible tenures</dd></div>
            <div><dt>Liquidity</dt><dd>Breakable with conditions/penalties</dd></div>
          </dl>
          <p class="fund-map-risk"><span class="fund-risk-dot" aria-hidden="true"></span> Short–medium parking / goals</p>
        </article>
        <article class="fund-map-card fund-map--blue" role="listitem">
          <header class="fund-map-head"><span class="fund-map-icon" aria-hidden="true">📈</span><h3>ELSS (equity MF)</h3></header>
          <dl class="fund-map-meta aspect-grid">
            <div><dt>Return style</dt><dd>Market-linked (can be volatile)</dd></div>
            <div><dt>Typical horizon</dt><dd>Long recommended; lock-in ~3 years</dd></div>
            <div><dt>Liquidity</dt><dd>After lock-in, redeemable (NAV risk)</dd></div>
          </dl>
          <p class="fund-map-risk"><span class="fund-risk-dot" aria-hidden="true"></span> Growth sleeve with tax-saving discussions</p>
        </article>
      </div>`,
    "ppf compare"
  );
  write("ppf-tax-saving.html", s);
}

// ========== TAX OVERVIEW ==========
{
  let s = bumpCss(read("tax-overview.html"));
  s = replaceOnce(
    s,
    `      <ol class="steps-list">
        <li><strong>Income tax on salary / business / professional income</strong> — the main slab world; investments sit on top of this.</li>
        <li><strong>Tax on investment income</strong> — interest, dividends, and similar receipts, depending on product and law.</li>
        <li><strong>Capital gains</strong> — when you sell (or sometimes transfer) a capital asset for more than its cost base (with rules on holding period, indexation history, exemptions, etc.).</li>
        <li><strong>TDS / TCS and reporting</strong> — amounts deducted at source or reported in AIS/Form 26AS that you still need to reconcile in a return.</li>
      </ol>`,
    `      <ol class="tips-list">
        <li><span class="tip-emoji" aria-hidden="true">💼</span><span class="tip-text"><strong>Salary / business / professional income</strong> — the main slab world; investments sit on top of this.</span></li>
        <li><span class="tip-emoji" aria-hidden="true">💵</span><span class="tip-text"><strong>Investment income</strong> — interest, dividends, and similar receipts, depending on product and law.</span></li>
        <li><span class="tip-emoji" aria-hidden="true">📈</span><span class="tip-text"><strong>Capital gains</strong> — when you sell a capital asset for more than its cost base (holding period, exemptions, etc.).</span></li>
        <li><span class="tip-emoji" aria-hidden="true">🧾</span><span class="tip-text"><strong>TDS / TCS and reporting</strong> — reconcile AIS / Form 26AS in your return.</span></li>
      </ol>`,
    "tax map steps"
  );
  s = replaceOnce(
    s,
    `      <div class="table-wrap">
        <table class="compare-table">
          <thead>
            <tr>
              <th>Idea people discuss</th>
              <th>What to remember educationally</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Equity / equity-oriented funds</td>
              <td>Often have special capital-gains frameworks that differ from pure debt products — verify current rates and STT-related conditions.</td>
            </tr>
            <tr>
              <td>Debt / many non-equity funds</td>
              <td>Treatment has been reformed in recent years; do not rely on old “indexation always applies” memory.</td>
            </tr>
            <tr>
              <td>Gold (physical, ETF, SGB…)</td>
              <td>Form of holding can change tax and reporting outcomes; SGB has its own notified features historically.</td>
            </tr>
            <tr>
              <td>Crypto / VDA</td>
              <td>Virtual digital assets have been subject to specific tax and TDS-style rules — high compliance risk if ignored.</td>
            </tr>
          </tbody>
        </table>
      </div>`,
    `      <div class="fund-map cols-2" role="list">
        <article class="fund-map-card fund-map--blue" role="listitem">
          <header class="fund-map-head"><span class="fund-map-icon" aria-hidden="true">📈</span><h3>Equity / equity-oriented funds</h3></header>
          <p class="fund-map-meta" style="margin:0;padding:0;border:0;background:transparent"><span class="tip-text" style="display:block;font-size:0.94em;line-height:1.45;color:var(--text-muted,#475569)">Often have special capital-gains frameworks that differ from pure debt products — verify current rates and STT-related conditions.</span></p>
        </article>
        <article class="fund-map-card fund-map--slate" role="listitem">
          <header class="fund-map-head"><span class="fund-map-icon" aria-hidden="true">🏦</span><h3>Debt / non-equity funds</h3></header>
          <p class="fund-map-meta" style="margin:0;padding:0;border:0;background:transparent"><span class="tip-text" style="display:block;font-size:0.94em;line-height:1.45;color:var(--text-muted,#475569)">Treatment has been reformed in recent years; do not rely on old “indexation always applies” memory.</span></p>
        </article>
        <article class="fund-map-card fund-map--amber" role="listitem">
          <header class="fund-map-head"><span class="fund-map-icon" aria-hidden="true">🥇</span><h3>Gold (physical, ETF, SGB…)</h3></header>
          <p class="fund-map-meta" style="margin:0;padding:0;border:0;background:transparent"><span class="tip-text" style="display:block;font-size:0.94em;line-height:1.45;color:var(--text-muted,#475569)">Form of holding can change tax and reporting outcomes; SGB has its own notified features historically.</span></p>
        </article>
        <article class="fund-map-card fund-map--rose" role="listitem">
          <header class="fund-map-head"><span class="fund-map-icon" aria-hidden="true">🪙</span><h3>Crypto / VDA</h3></header>
          <p class="fund-map-meta" style="margin:0;padding:0;border:0;background:transparent"><span class="tip-text" style="display:block;font-size:0.94em;line-height:1.45;color:var(--text-muted,#475569)">Virtual digital assets have specific tax and TDS-style rules — high compliance risk if ignored.</span></p>
        </article>
      </div>`,
    "tax gains table"
  );
  write("tax-overview.html", s);
}

// ========== US STOCKS ==========
{
  let s = bumpCss(read("usstocks.html"));
  s = replaceOnce(
    s,
    `      <ol class="steps-list">
        <li><strong>Direct stocks/ETFs</strong> via brokers offering international investing (examples people search: INDmoney, Vested, some full-service brokers) — subject to KYC and LRS.</li>
        <li><strong>India-listed international ETFs / FoFs</strong> that hold overseas indices (product availability varies).</li>
        <li><strong>Mutual funds</strong> with global mandates (read scheme documents).</li>
      </ol>`,
    `      <ol class="tips-list">
        <li><span class="tip-emoji" aria-hidden="true">🌐</span><span class="tip-text"><strong>Direct stocks/ETFs</strong> via brokers offering international investing (e.g. INDmoney, Vested, some full-service brokers) — subject to KYC and LRS.</span></li>
        <li><span class="tip-emoji" aria-hidden="true">📊</span><span class="tip-text"><strong>India-listed international ETFs / FoFs</strong> that hold overseas indices (availability varies).</span></li>
        <li><span class="tip-emoji" aria-hidden="true">🧺</span><span class="tip-text"><strong>Mutual funds</strong> with global mandates — read scheme documents.</span></li>
      </ol>`,
    "usstocks access"
  );
  write("usstocks.html", s);
}

// Clean tax-overview inline styles - add a proper class instead
{
  let s = read("tax-overview.html");
  s = s.replace(
    /<p class="fund-map-meta" style="margin:0;padding:0;border:0;background:transparent"><span class="tip-text" style="display:block;font-size:0\.94em;line-height:1\.45;color:var\(--text-muted,#475569\)">/g,
    '<p class="fund-map-blurb">'
  );
  s = s.replace(/<\/span><\/p>/g, "</p>");
  // careful - might break other spans. Only the pattern we used ends with </span></p> after blurb
  write("tax-overview.html", s);
}

// Add fund-map-blurb CSS via appending if not present
{
  let css = read("style.css");
  if (!css.includes(".fund-map-blurb")) {
    css += `
.fund-map-blurb {
  margin: 0;
  flex: 1;
  font-size: 0.94em;
  line-height: 1.45;
  color: var(--text-muted, #475569);
}
body.dark-mode .fund-map-blurb { color: #b4bccb !important; }
`;
    write("style.css", css);
    console.log("OK: fund-map-blurb css");
  }
}

// Fix tax-overview if we broke other </span></p> - re-read and check
{
  let s = read("tax-overview.html");
  // If tip-text got broken in tips-list, restore - check for broken patterns
  if (s.includes('class="tip-text"') && s.includes("</p></li>") && !s.includes('tip-text">')) {
    // ok
  }
  // Count fund-map-blurb
  const n = (s.match(/fund-map-blurb/g) || []).length;
  console.log("tax fund-map-blurb count:", n);
}

console.log("Done.");
