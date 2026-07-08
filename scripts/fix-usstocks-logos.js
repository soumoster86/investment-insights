const fs = require("fs");
const path = require("path");
const fp = path.join(__dirname, "..", "usstocks.html");
let html = fs.readFileSync(fp, "utf8");

const map = {
  "apple.com": { initials: "AAPL", hue: 210, label: "Apple" },
  "microsoft.com": { initials: "MSFT", hue: 200, label: "Microsoft" },
  "abc.xyz": { initials: "GOOGL", hue: 145, label: "Alphabet" },
  "amazon.com": { initials: "AMZN", hue: 28, label: "Amazon" },
  "tesla.com": { initials: "TSLA", hue: 0, label: "Tesla" },
  "nvidia.com": { initials: "NVDA", hue: 120, label: "Nvidia" }
};

html = html.replace(
  /<img\s+src="https:\/\/logo\.clearbit\.com\/([^"]+)"\s+alt="([^"]*)"\s*>/g,
  (full, domain, alt) => {
    const info = map[domain] || {
      initials: (alt || "?").slice(0, 2).toUpperCase(),
      hue: 210,
      label: alt
    };
    return (
      `<span class="rec-avatar us-stock-avatar" aria-hidden="true" ` +
      `style="--av-hue:${info.hue}" title="${info.label}">${info.initials}</span>`
    );
  }
);

// Also ensure details links have rel=noopener
html = html.replace(
  /target="_blank" class="btn"/g,
  'target="_blank" rel="noopener noreferrer" class="btn"'
);

fs.writeFileSync(fp, html, "utf8");
console.log(
  "clearbit left:",
  (html.match(/clearbit/g) || []).length
);
