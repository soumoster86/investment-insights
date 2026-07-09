import os
import re

html_files = [f for f in os.listdir('.') if f.endswith('.html')]

for f in html_files:
    with open(f, 'r', encoding='utf-8') as file:
        content = file.read()
    
    # Add search button
    pattern = r'(<a href="contact\.html"[^>]*>Contact</a>\s*)</nav>'
    replacement = r'\1  <button type="button" class="nav-search-btn" id="nav-search-btn" aria-label="Search" title="Search (Ctrl+K)">\n      <svg width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" viewBox="0 0 24 24"><path d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>\n    </button>\n  </nav>'
    if not '<button type="button" class="nav-search-btn"' in content:
        content = re.sub(pattern, replacement, content)

    # Add search modal
    modal_html = '''
<!-- Search Modal -->
<div id="search-modal" class="search-modal" aria-hidden="true">
  <div class="search-modal-backdrop" id="search-backdrop"></div>
  <div class="search-modal-content">
    <div class="search-header">
      <input type="text" id="search-input" placeholder="Search guides, tools, calculators..." autocomplete="off" />
      <button type="button" class="search-close" id="search-close" aria-label="Close search">×</button>
    </div>
    <div id="search-results" class="search-results">
      <div class="search-placeholder">Type to search...</div>
    </div>
  </div>
</div>
<script src="js/search.js" defer></script>
</body>'''
    if not 'id="search-modal"' in content:
        content = content.replace('</body>', modal_html)
        
    with open(f, 'w', encoding='utf-8') as file:
        file.write(content)
print("Updated all HTML files!")
