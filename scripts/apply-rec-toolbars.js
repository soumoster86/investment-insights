/**
 * Add recommendation toolbars + accessible search labels on list pages.
 * Usage: node scripts/apply-rec-toolbars.js
 */
const fs = require("fs");
const path = require("path");
const ROOT = path.join(__dirname, "..");

const PAGES = [
  {
    file: "stocks.html",
    searchId: "stock-search",
    listId: "stock-list",
    toolbarId: "stock-toolbar",
    label: "Search stocks",
    ariaLabel: "Search stocks or sectors"
  },
  {
    file: "mutualfunds.html",
    searchId: "mf-search",
    listId: "mf-list",
    toolbarId: "mf-toolbar",
    label: "Search funds",
    ariaLabel: "Search mutual funds"
  },
  {
    file: "cryptocurrencies.html",
    searchId: "crypto-search",
    listId: "crypto-list",
    toolbarId: "crypto-toolbar",
    label: "Search cryptocurrencies",
    ariaLabel: "Search cryptocurrencies"
  }
];

for (const opts of PAGES) {
  const fp = path.join(ROOT, opts.file);
  let html = fs.readFileSync(fp, "utf8");

  if (!html.includes(`id="${opts.toolbarId}"`)) {
    html = html.replace(
      new RegExp(`(<div\\s+id="${opts.listId}"[^>]*>)`),
      `<div id="${opts.toolbarId}" class="rec-toolbar-host"></div>\n  $1`
    );
  }

  // Replace the search input with labelled control (once)
  if (!html.includes(`for="${opts.searchId}"`)) {
    const inputRe = new RegExp(
      `<input([^>]*\\bid="${opts.searchId}"[^>]*?)\\s*\\/?>`,
      "i"
    );
    html = html.replace(inputRe, (full, attrs) => {
      let a = attrs.replace(/\s*\/\s*$/, "").trim();
      if (!/^\s/.test(a) && a.length) a = " " + a;
      if (!/\btype=/.test(a)) a = ' type="text"' + a;
      if (!/\baria-label=/.test(a)) {
        a += ` aria-label="${opts.ariaLabel}"`;
      }
      return (
        `<div class="rec-controls-wrap">\n` +
        `  <label class="rec-search-label" for="${opts.searchId}">${opts.label}</label>\n` +
        `  <input${a} />\n` +
        `</div>`
      );
    });
  }

  fs.writeFileSync(fp, html, "utf8");
  console.log("toolbar →", opts.file);
}
