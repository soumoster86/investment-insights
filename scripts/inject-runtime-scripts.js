/**
 * Ensure every HTML page loads site-config + analytics (before nav.js).
 * Usage: node scripts/inject-runtime-scripts.js
 */
const fs = require("fs");
const path = require("path");

const ROOT = path.join(__dirname, "..");
const pages = fs.readdirSync(ROOT).filter((f) => f.endsWith(".html"));

const CONFIG = '  <script src="js/site-config.js"></script>';
const ANALYTICS = '  <script src="js/analytics.js" defer></script>';

let n = 0;
for (const file of pages) {
  const fp = path.join(ROOT, file);
  let html = fs.readFileSync(fp, "utf8");
  const before = html;

  if (!html.includes("js/site-config.js")) {
    if (/src=["']nav\.js["']/.test(html)) {
      html = html.replace(
        /(\s*)(<script src=["']nav\.js["'][^>]*><\/script>)/,
        `\n${CONFIG}\n${ANALYTICS}\n$1$2`
      );
    } else if (/<\/body>/i.test(html)) {
      html = html.replace(
        /<\/body>/i,
        `${CONFIG}\n${ANALYTICS}\n</body>`
      );
    }
  } else if (!html.includes("js/analytics.js")) {
    html = html.replace(
      /(<script src=["']js\/site-config\.js["']><\/script>)/,
      `$1\n${ANALYTICS}`
    );
  }

  // Index also needs site-config before dashboard for metalsEndpoint
  if (file === "index.html" && html.includes("js/dashboard.js")) {
    // Ensure site-config is before dashboard.js
    if (
      html.indexOf("js/site-config.js") > html.indexOf("js/dashboard.js")
    ) {
      html = html.replace(
        /\s*<script src=["']js\/site-config\.js["']><\/script>\s*/,
        "\n"
      );
      html = html.replace(
        /(<script src=["']js\/calc-core\.js["']><\/script>)/,
        `${CONFIG}\n$1`
      );
    }
  }

  if (html !== before) {
    fs.writeFileSync(fp, html, "utf8");
    n++;
    console.log("runtime scripts →", file);
  } else {
    console.log("ok", file);
  }
}
console.log(`Updated ${n} pages.`);
