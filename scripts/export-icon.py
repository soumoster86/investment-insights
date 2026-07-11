"""Export redesigned site icon to logo/favicon sizes."""
from collections import deque
from pathlib import Path

from PIL import Image

src = Path(
    r"C:\Users\soumo\.grok\sessions\C%3A%5CUsers%5Csoumo%5CHTMLProjects%5Cinvestment-insights"
    r"\019f42ea-80bd-7230-912e-ac410b847e99\images\1.jpg"
)
root = Path(r"C:\Users\soumo\HTMLProjects\investment-insights")

im = Image.open(src).convert("RGBA")
w, h = im.size
pixels = im.load()


def is_bg(r, g, b):
    # light background only (not pure white icon bars which sit on blue)
    return r > 248 and g > 248 and b > 248


# Flood-fill from corners: only exterior light bg becomes transparent
visited = [[False] * w for _ in range(h)]
q = deque()
for x, y in ((0, 0), (w - 1, 0), (0, h - 1), (w - 1, h - 1)):
    r, g, b, a = pixels[x, y]
    if is_bg(r, g, b):
        q.append((x, y))
        visited[y][x] = True

while q:
    x, y = q.popleft()
    r, g, b, a = pixels[x, y]
    if is_bg(r, g, b):
        pixels[x, y] = (255, 255, 255, 0)
    for nx, ny in ((x - 1, y), (x + 1, y), (x, y - 1), (x, y + 1)):
        if 0 <= nx < w and 0 <= ny < h and not visited[ny][nx]:
            nr, ng, nb, na = pixels[nx, ny]
            if is_bg(nr, ng, nb):
                visited[ny][nx] = True
                q.append((nx, ny))

bbox = im.getbbox()
if bbox:
    pad = 4
    x0 = max(0, bbox[0] - pad)
    y0 = max(0, bbox[1] - pad)
    x1 = min(w, bbox[2] + pad)
    y1 = min(h, bbox[3] + pad)
    im = im.crop((x0, y0, x1, y1))

side = max(im.size)
sq = Image.new("RGBA", (side, side), (0, 0, 0, 0))
ox = (side - im.size[0]) // 2
oy = (side - im.size[1]) // 2
sq.paste(im, (ox, oy), im)
im = sq

logo_path = root / "logo.png"
if logo_path.exists():
    backup = root / "logo.before-redesign.png"
    if not backup.exists():
        try:
            Image.open(logo_path).save(backup)
        except Exception:
            pass


def save_png(size, path):
    # Composite onto transparent for PNGs used on light/dark headers
    out = im.resize((size, size), Image.Resampling.LANCZOS)
    out.save(path, "PNG", optimize=True)
    print("wrote", path, size)


save_png(256, root / "logo.png")
save_png(512, root / "logo-512.png")
save_png(180, root / "apple-touch-icon.png")
save_png(32, root / "favicon-32.png")
save_png(48, root / "favicon-48.png")

ico16 = im.resize((16, 16), Image.Resampling.LANCZOS)
ico32 = im.resize((32, 32), Image.Resampling.LANCZOS)
ico48 = im.resize((48, 48), Image.Resampling.LANCZOS)
# ICO: solid blue fallback for tiny sizes if needed — use RGBA as-is
ico32.save(
    root / "favicon.ico",
    format="ICO",
    sizes=[(16, 16), (32, 32), (48, 48)],
    append_images=[ico16, ico48],
)
print("wrote favicon.ico")

im.resize((256, 256), Image.Resampling.LANCZOS).save(
    root / "logo.webp", "WEBP", quality=92
)
print("done")
