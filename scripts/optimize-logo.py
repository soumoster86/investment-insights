"""Compress logo.png and generate favicon assets."""
from pathlib import Path
from PIL import Image

ROOT = Path(__file__).resolve().parent.parent
src = ROOT / "logo.png"
if not src.exists():
    raise SystemExit(f"Missing {src}")

img = Image.open(src).convert("RGBA")
print(f"Source: {src.name} {img.size[0]}x{img.size[1]}  {src.stat().st_size / 1024:.0f} KB")

# Backup original once
backup = ROOT / "logo.original.png"
if not backup.exists():
    backup.write_bytes(src.read_bytes())
    print(f"Backup: {backup.name}")

# Header logo: square-ish, crisp at 46–92 CSS px → export ~128
header = img.copy()
header.thumbnail((128, 128), Image.Resampling.LANCZOS)
# Prefer optimized PNG
header.save(src, format="PNG", optimize=True)
print(f"logo.png: {header.size[0]}x{header.size[1]}  {src.stat().st_size / 1024:.1f} KB")

# Also write WebP for modern browsers (optional progressive enhancement)
webp = ROOT / "logo.webp"
header.save(webp, format="WEBP", quality=85, method=6)
print(f"logo.webp: {webp.stat().st_size / 1024:.1f} KB")

# Favicons
def save_png(size, path):
    icon = img.copy()
    icon.thumbnail((size, size), Image.Resampling.LANCZOS)
    # Center on square canvas
    canvas = Image.new("RGBA", (size, size), (0, 0, 0, 0))
    x = (size - icon.size[0]) // 2
    y = (size - icon.size[1]) // 2
    canvas.paste(icon, (x, y), icon)
    canvas.save(path, format="PNG", optimize=True)
    print(f"{path.name}: {size}x{size}  {path.stat().st_size / 1024:.1f} KB")
    return canvas

save_png(32, ROOT / "favicon-32.png")
save_png(180, ROOT / "apple-touch-icon.png")

# Multi-size ICO
ico_sizes = [16, 32, 48]
ico_images = []
for s in ico_sizes:
    icon = img.copy()
    icon.thumbnail((s, s), Image.Resampling.LANCZOS)
    canvas = Image.new("RGBA", (s, s), (0, 0, 0, 0))
    canvas.paste(icon, ((s - icon.size[0]) // 2, (s - icon.size[1]) // 2), icon)
    ico_images.append(canvas)

ico_path = ROOT / "favicon.ico"
ico_images[0].save(
    ico_path,
    format="ICO",
    sizes=[(s, s) for s in ico_sizes],
    append_images=ico_images[1:],
)
print(f"favicon.ico: {ico_path.stat().st_size / 1024:.1f} KB")
print("Done.")
