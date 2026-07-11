"""Deduplicate nav.js tags and restore reliable hamburger markup."""
from pathlib import Path
import re

root = Path(r"C:\Users\soumo\HTMLProjects\investment-insights")

# Match any nav-toggle button (content may be corrupted)
NAV_TOGGLE_RE = re.compile(
    r'<button\s+type="button"\s+class="nav-toggle"\s+id="nav-toggle"[^>]*>.*?</button>',
    re.DOTALL | re.IGNORECASE,
)
NAV_CLOSE_RE = re.compile(
    r'<button\s+type="button"\s+class="nav-close"\s+id="nav-close"[^>]*>.*?</button>',
    re.DOTALL | re.IGNORECASE,
)
# Any script tag loading nav.js
NAV_SCRIPT_RE = re.compile(
    r'^[ \t]*<script\s+src="nav\.js(?:\?[^"]*)?"\s+defer></script>\s*\r?\n',
    re.MULTILINE | re.IGNORECASE,
)

NEW_TOGGLE = (
    '<button type="button" class="nav-toggle" id="nav-toggle" '
    'aria-label="Open menu" aria-controls="main-nav" aria-expanded="false">'
    '<span class="nav-burger" aria-hidden="true">'
    "<span></span><span></span><span></span>"
    "</span></button>"
)
NEW_CLOSE = (
    '<button type="button" class="nav-close" id="nav-close" '
    'aria-label="Close menu">&times;</button>'
)
SINGLE_NAV = '  <script src="nav.js?v=20260711nav" defer></script>\n'

for path in sorted(root.glob("*.html")):
    text = path.read_text(encoding="utf-8", errors="replace")
    original = text

    text = NAV_TOGGLE_RE.sub(NEW_TOGGLE, text)
    text = NAV_CLOSE_RE.sub(NEW_CLOSE, text)

    scripts = list(NAV_SCRIPT_RE.finditer(text))
    if scripts:
        # Remove all, then re-insert a single copy at the first location
        first = scripts[0]
        text = NAV_SCRIPT_RE.sub("", text)
        # Re-find insertion point near end of body (before search modal or last scripts)
        # Prefer place of first original script
        insert_at = first.start()
        # After removals, index may shift — find a stable anchor
        if 'src="nav.js' not in text:
            # Insert before search-modal or before </body>
            anchor = text.find("<!-- Search Modal -->")
            if anchor < 0:
                anchor = text.rfind("</body>")
            if anchor >= 0:
                text = text[:anchor] + SINGLE_NAV + text[anchor:]
            else:
                text = text + "\n" + SINGLE_NAV

    if text != original:
        path.write_text(text, encoding="utf-8", newline="\n")
        print("fixed", path.name)
    else:
        print("unchanged", path.name)
