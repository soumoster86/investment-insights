/**
 * Sync shared shell (header / footer) into every HTML page and strip
 * per-page chrome CSS that now lives in style.css.
 *
 * Usage: node scripts/sync-shell.js
 *
 * Edit partials/header.html or partials/footer.html, then re-run.
 */
const fs = require("fs");
const path = require("path");

const ROOT = path.join(__dirname, "..");
const PAGES = fs
  .readdirSync(ROOT)
  .filter((f) => f.endsWith(".html"))
  .sort();

const headerPartial = fs.readFileSync(path.join(ROOT, "partials", "header.html"), "utf8").trim();
const footerPartial = fs.readFileSync(path.join(ROOT, "partials", "footer.html"), "utf8").trim();

const FAVICON_LINKS =
  '  <link rel="icon" href="favicon.ico" sizes="any" />\n' +
  '  <link rel="icon" href="favicon-32.png" type="image/png" sizes="32x32" />\n' +
  '  <link rel="apple-touch-icon" href="apple-touch-icon.png" />';

function stripStyleBlocks(html) {
  return html.replace(/<style\b[^>]*>[\s\S]*?<\/style>\s*/gi, "");
}

function ensureFavicon(html) {
  if (/rel=["']icon["']/i.test(html)) return html;
  // Insert after stylesheet link when present, else after viewport meta.
  if (/href=["']style\.css["']/i.test(html)) {
    return html.replace(
      /(<link\s+rel=["']stylesheet["']\s+href=["']style\.css["']\s*\/?>)/i,
      `$1\n${FAVICON_LINKS}`
    );
  }
  return html.replace(
    /(<meta\s+name=["']viewport["'][^>]*>)/i,
    `$1\n${FAVICON_LINKS}`
  );
}

function replaceHeader(html) {
  // Already marked — replace between markers.
  if (/<!--\s*BEGIN SITE HEADER\s*-->/i.test(html)) {
    return html.replace(
      /<!--\s*BEGIN SITE HEADER\s*-->[\s\S]*?<!--\s*END SITE HEADER\s*-->/i,
      headerPartial
    );
  }
  // First-time: replace <header class="site-header">…</header>
  if (!/<header\b[^>]*class=["'][^"']*site-header/i.test(html)) {
    console.warn("  ! no site-header found");
    return html;
  }
  return html.replace(
    /<header\b[^>]*class=["'][^"']*site-header[^"']*["'][^>]*>[\s\S]*?<\/header>/i,
    headerPartial
  );
}

function replaceFooter(html) {
  // Drop any existing back-to-top — footer partial includes it.
  html = html.replace(/\s*<button\b[^>]*id=["']back-to-top["'][\s\S]*?<\/button>/gi, "");

  if (/<!--\s*BEGIN SITE FOOTER\s*-->/i.test(html)) {
    return html.replace(
      /<!--\s*BEGIN SITE FOOTER\s*-->[\s\S]*?<!--\s*END SITE FOOTER\s*-->/i,
      footerPartial
    );
  }

  if (!/<footer\b/i.test(html)) {
    // Insert before last script or before </body>
    if (/<\/body>/i.test(html)) {
      return html.replace(/<\/body>/i, `${footerPartial}\n</body>`);
    }
    console.warn("  ! no footer and no </body>");
    return html;
  }

  // Replace first <footer>…</footer>
  return html.replace(/<footer\b[^>]*>[\s\S]*?<\/footer>/i, footerPartial);
}

function tidyHead(html) {
  // Collapse excessive blank lines in <head> after style removal
  return html.replace(/<head>([\s\S]*?)<\/head>/i, (full, head) => {
    const cleaned = head
      .replace(/\n{3,}/g, "\n\n")
      .replace(/[ \t]+\n/g, "\n");
    return `<head>${cleaned}</head>`;
  });
}

function tidyBody(html) {
  return html.replace(/\n{4,}/g, "\n\n\n");
}

let changed = 0;
for (const file of PAGES) {
  const filePath = path.join(ROOT, file);
  const original = fs.readFileSync(filePath, "utf8");
  let html = original;

  html = stripStyleBlocks(html);
  html = ensureFavicon(html);
  html = replaceHeader(html);
  html = replaceFooter(html);
  html = tidyHead(html);
  html = tidyBody(html);

  // Ensure nav.js is present
  if (!/src=["']nav\.js["']/.test(html)) {
    html = html.replace(/<\/body>/i, '  <script src="nav.js" defer></script>\n</body>');
  }

  if (html !== original) {
    fs.writeFileSync(filePath, html, "utf8");
    const before = original.length;
    const after = html.length;
    const delta = after - before;
    console.log(
      `✓ ${file}  ${before} → ${after} bytes (${delta > 0 ? "+" : ""}${delta})`
    );
    changed++;
  } else {
    console.log(`· ${file}  (unchanged)`);
  }
}

console.log(`\nDone. Updated ${changed}/${PAGES.length} pages.`);
console.log("Re-run after editing partials/header.html or partials/footer.html.");
