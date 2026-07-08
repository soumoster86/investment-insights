const fs = require("fs");
const files = ["stocks.html", "mutualfunds.html", "cryptocurrencies.html"];
for (const f of files) {
  let h = fs.readFileSync(f, "utf8");
  const before = h;
  // Fix malformed self-closers like `/ />` or `//>`
  h = h.replace(/\s*\/\s*\/>/g, " />");
  h = h.replace(/\/\/>/g, "/>");
  fs.writeFileSync(f, h, "utf8");
  console.log(f, before === h ? "ok" : "fixed");
  const m = h.match(
    /id="(?:stock|mf|crypto)-search"[\s\S]{0,100}/
  );
  console.log(" ", m ? m[0].replace(/\s+/g, " ") : "no match");
}
