/**
 * Add screen-reader labels to the home currency converter controls.
 */
const fs = require("fs");
const path = require("path");
const fp = path.join(__dirname, "..", "index.html");
let html = fs.readFileSync(fp, "utf8");

if (html.includes('for="amount"')) {
  console.log("currency labels already present");
  process.exit(0);
}

html = html.replace(
  /(<div class="card" id="currency-card">\s*<h3>[^<]*<\/h3>\s*<div[^>]*>\s*)(<input type="number" id="amount")/,
  `$1<label class="sr-only" for="amount">Amount</label>\n    $2`
);

html = html.replace(
  /(<input type="number" id="amount"[^>]*>\s*)(<select id="from-currency")/,
  `$1<label class="sr-only" for="from-currency">From currency</label>\n    $2`
);

html = html.replace(
  /(to\s*)(<select id="to-currency")/,
  `$1<label class="sr-only" for="to-currency">To currency</label>\n    $2`
);

fs.writeFileSync(fp, html, "utf8");
console.log("currency labels → index.html");
