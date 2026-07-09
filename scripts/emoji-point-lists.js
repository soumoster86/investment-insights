/**
 * Convert remaining plain content <ul> lists to .point-list emoji cards.
 * Skips: nav, footer, already-styled lists, product cards, FAQ, resource links.
 * Usage: node scripts/emoji-point-lists.js
 */
const fs = require("fs");
const path = require("path");

const ROOT = path.join(__dirname, "..");
const files = fs.readdirSync(ROOT).filter((f) => f.endsWith(".html"));

const EMOJIS = [
  "📌", "💡", "✨", "🔹", "⭐", "📍", "🧭", "📘", "🔎", "💬",
  "🎯", "📊", "🏦", "📈", "🛡️", "⏱️", "🌍", "💼", "🏠", "🔑"
];

function pickEmoji(text, i) {
  const t = text.toLowerCase();
  if (/salary|salaried|employee|job|income/.test(t)) return "💼";
  if (/horizon|long[- ]term|year|retirement|age/.test(t)) return "📅";
  if (/emergency|buffer|cash|liquid/.test(t)) return "🛟";
  if (/risk|loss|drawdown|volatil|scam|hack|danger|warn/.test(t)) return "⚠️";
  if (/tax|tds|filing|regime|capital gain/.test(t)) return "🧾";
  if (/equity|stock|growth|nifty|market/.test(t)) return "📈";
  if (/debt|fd|bond|ppf|epf|fixed/.test(t)) return "🏦";
  if (/diversif|allocation|mix|core|sleeve/.test(t)) return "🎯";
  if (/cost|fee|expense|spread|brokerage/.test(t)) return "💸";
  if (/liquidity|liquid|demat|trading|order/.test(t)) return "💧";
  if (/gold|metal|sgb/.test(t)) return "🥇";
  if (/crypto|token|wallet|2fa|custody/.test(t)) return "🔐";
  if (/loan|emi|property|real estate|home|rera/.test(t)) return "🏠";
  if (/insurance|health|term|cover/.test(t)) return "🛡️";
  if (/sip|contribute|invest/.test(t)) return "🌱";
  if (/who often|people|investor|saver/.test(t)) return "👥";
  if (/credit|rating|default/.test(t)) return "📋";
  if (/inflation|currency|fx|usd|inr/.test(t)) return "💱";
  if (/tip|prefer|should|keep|review|match/.test(t)) return "💡";
  if (/fomo|chase|hype|hot/.test(t)) return "🔥";
  if (/record|document|statement|proof|download/.test(t)) return "📁";
  if (/platform|exchange|broker|site/.test(t)) return "🔗";
  return EMOJIS[i % EMOJIS.length];
}

function shouldSkipBlock(block, before) {
  const ctx = before + block.slice(0, 200);
  if (
    /dropdown|footer|main-nav|floating-toc|page-jump|toc-title|role="menu"|nav-drawer/.test(
      ctx
    )
  )
    return true;
  if (
    /mistakes-list|tips-list|limits-list|check-list|point-list|footer-links/.test(
      block
    )
  )
    return true;
  // product / platform cards already styled
  if (
    /bond-card|platform-card|mf-card|stock-card|crypto-card|feature-card|alloc-card/.test(
      before
    )
  )
    return true;
  // illustration footnotes / methodology notes — keep compact
  if (
    /illust-notes|etf-sip-assumptions|sp-nifty-notes|ipo-listing-notes|how this is built|how to read this/i.test(
      before
    )
  )
    return true;
  // resource link dumps
  if (/id="us-links"|Resources<\/h2>/i.test(before) && /http/i.test(block))
    return true;
  // FAQ accordion content often has single short lists inside details
  if (/<\/summary>|<details/i.test(before.slice(-200))) return true;
  // legend / tiny
  if (/legend-alloc|class="legend/i.test(before)) return true;
  return false;
}

function convertUl(block, indexBase) {
  // already converted?
  if (/class="[^"]*(?:point-list|tips-list|mistakes-list|limits-list)/.test(block))
    return null;

  const lis = [...block.matchAll(/<li([^>]*)>([\s\S]*?)<\/li>/gi)];
  if (lis.length < 2) return null;

  // skip if li already has tip-emoji or mistake-emoji
  if (lis.some((l) => /tip-emoji|mistake-emoji|mistake-text|tip-text/.test(l[2])))
    return null;

  // skip if all items are only links (resource lists)
  const onlyLinks = lis.every((l) => {
    const inner = l[2].trim();
    return /^<a[\s>][\s\S]*<\/a>$/i.test(inner) || /^<a[\s\S]*<\/a>\s*$/i.test(inner);
  });
  if (onlyLinks) return null;

  const items = lis.map((l, i) => {
    let inner = l[2].trim();
    // strip leading emoji already present
    inner = inner.replace(/^[\u{1F300}-\u{1FAFF}\u{2600}-\u{27BF}\u{FE0F}\u{200D}]+\s*/u, "");
    const plain = inner.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();
    const emoji = pickEmoji(plain, indexBase + i);
    return `    <li><span class="tip-emoji" aria-hidden="true">${emoji}</span><span class="tip-text">${inner}</span></li>`;
  });

  return `<ul class="point-list">\n${items.join("\n")}\n  </ul>`;
}

let total = 0;
for (const f of files) {
  let html = fs.readFileSync(path.join(ROOT, f), "utf8");
  const re = /<ul(?![^>]*class=)[^>]*>[\s\S]*?<\/ul>|<ul\s+class="(?![^"]*(?:point-list|tips-list|mistakes-list|limits-list|check-list|footer-links)[^"]*")[^>]*>[\s\S]*?<\/ul>/gi;

  // Simpler: match any ul, filter later
  const simpleRe = /<ul\b[^>]*>[\s\S]*?<\/ul>/gi;
  let m;
  const replacements = [];
  while ((m = simpleRe.exec(html))) {
    const block = m[0];
    const before = html.slice(Math.max(0, m.index - 220), m.index);
    if (shouldSkipBlock(block, before)) continue;
    // must be classless or only unstyled class
    const open = block.match(/^<ul([^>]*)>/i);
    if (!open) continue;
    const attrs = open[1] || "";
    if (/class\s*=\s*["'][^"']*(?:mistakes-list|tips-list|limits-list|point-list|check-list|footer-links)/i.test(attrs))
      continue;
    // skip classed nav lists
    if (/class\s*=\s*["'][^"']*(?:nav|menu|dropdown)/i.test(attrs)) continue;

    const converted = convertUl(block, total);
    if (!converted) continue;
    replacements.push({ start: m.index, end: m.index + block.length, text: converted });
    total++;
  }

  if (!replacements.length) continue;

  // apply from end so offsets stay valid
  for (let i = replacements.length - 1; i >= 0; i--) {
    const r = replacements[i];
    html = html.slice(0, r.start) + r.text + html.slice(r.end);
  }
  fs.writeFileSync(path.join(ROOT, f), html, "utf8");
  console.log("updated", f, "lists:", replacements.length);
}

console.log("Total lists converted:", total);
