const fs = require("fs");
const path = require("path");
const fp = path.join(__dirname, "..", "index.html");
let h = fs.readFileSync(fp, "utf8");

// Hero CTAs: keep Plan a goal; point secondary to calculators hub
if (!h.includes('href="calculators.html"')) {
  h = h.replace(
    /<a class="btn secondary" href="mutualfunds\.html#sipcalc-mutual">Try SIP calculator<\/a>/,
    '<a class="btn secondary" href="calculators.html">All calculators</a>\n          <a class="btn secondary" href="mutualfunds.html#sipcalc-mutual">Try SIP</a>'
  );
}

if (!h.includes('href="learn.html"')) {
  h = h.replace(
    /<h2>Explore topics<\/h2>\s*<p>[^<]*<\/p>/,
    `<h2>Explore topics</h2>
        <p>Short, practical primers — written for Indian investors. <a href="learn.html">All topics →</a></p>`
  );
}

if (!h.includes('calculators.html">All calculators') && h.includes("Popular calculators")) {
  h = h.replace(
    /<h2>Popular calculators<\/h2>\s*<p>[^<]*<\/p>/,
    `<h2>Popular calculators</h2>
        <p>Transparent formulas — estimates only, not advice. <a href="calculators.html">All tools →</a></p>`
  );
}

fs.writeFileSync(fp, h, "utf8");
console.log({
  learn: h.includes("learn.html"),
  calcs: h.includes("calculators.html"),
  headerLearn: h.includes("Learn ▾")
});
