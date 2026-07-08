/**
 * Ensure every page has <main id="main-content" tabindex="-1"> for skip link.
 * Usage: node scripts/apply-a11y-main.js
 */
const fs = require("fs");
const path = require("path");
const ROOT = path.join(__dirname, "..");

const pages = fs.readdirSync(ROOT).filter((f) => f.endsWith(".html"));
let n = 0;
for (const file of pages) {
  const fp = path.join(ROOT, file);
  let html = fs.readFileSync(fp, "utf8");
  const before = html;

  // Normalize <main ...> → id="main-content" tabindex="-1"
  html = html.replace(/<main(\s[^>]*)?>/i, (m, attrs) => {
    attrs = attrs || "";
    if (!/\bid\s*=/.test(attrs)) attrs += ' id="main-content"';
    else attrs = attrs.replace(/\bid\s*=\s*["'][^"']*["']/, ' id="main-content"');
    if (!/\btabindex\s*=/.test(attrs)) attrs += ' tabindex="-1"';
    return `<main${attrs}>`;
  });

  if (html !== before) {
    fs.writeFileSync(fp, html, "utf8");
    n++;
    console.log("main landmark →", file);
  } else {
    console.log("ok", file);
  }
}
console.log(`Updated ${n} pages.`);
