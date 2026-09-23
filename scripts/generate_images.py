"""Generate the site's image derivatives from frontend/IMG_2164.jpg.

Usage:
    uv run --with pillow python scripts/generate_images.py

Run this when the source portrait changes. The outputs are committed; nothing
resizes images at deploy time.
"""

from pathlib import Path

from PIL import Image, ImageDraw, ImageFont, ImageOps

ROOT = Path(__file__).resolve().parent.parent
FRONTEND = ROOT / "frontend"
SOURCE = ROOT / "assets" / "IMG_2164.jpg"

CANVAS = (250, 249, 246)  # --canvas from DESIGN.md, behind the OG card
INK = (26, 27, 24)  # --ink
MONOGRAM = "DN"
# JetBrains Mono is one of the site's three families; DejaVu keeps the script
# working on a machine that does not have it.
FONT_CANDIDATES = [
    "/usr/share/fonts/truetype/jetbrains-mono/JetBrainsMono-Bold.ttf",
    "/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf",
]


def save_jpeg(image: Image.Image, path: Path, quality: int) -> None:
    image.convert("RGB").save(path, "JPEG", quality=quality, optimize=True, progressive=True)
    print(f"Wrote {path.relative_to(ROOT)} ({path.stat().st_size // 1024} KB)")


def monogram(size: int) -> Image.Image:
    """The favicon mark: the monogram in canvas on an ink square, same as favicon.svg."""
    font_path = next((p for p in FONT_CANDIDATES if Path(p).exists()), None)
    if font_path is None:
        raise SystemExit(f"No font found. Install one of: {', '.join(FONT_CANDIDATES)}")

    image = Image.new("RGB", (size, size), INK)
    draw = ImageDraw.Draw(image)
    font = ImageFont.truetype(font_path, int(size * 0.5))
    left, top, right, bottom = draw.textbbox((0, 0), MONOGRAM, font=font)
    draw.text(
        ((size - right - left) / 2, (size - bottom - top) / 2),
        MONOGRAM,
        font=font,
        fill=CANVAS,
    )
    return image


def main() -> None:
    try:
        source = ImageOps.exif_transpose(Image.open(SOURCE))
    except OSError as exc:
        raise SystemExit(f"Cannot read {SOURCE}: {exc}")

    # The hero crops to 4:5, so the slot needs vertical pixels, not just width.
    portrait = ImageOps.contain(source, (900, 750), Image.LANCZOS)
    save_jpeg(portrait, FRONTEND / "portrait.jpg", 82)

    # Social cards are 1.91:1. Crop the portrait to that ratio around the face,
    # which sits in the upper half of the frame.
    og = ImageOps.fit(source, (1200, 630), Image.LANCZOS, centering=(0.5, 0.35))
    save_jpeg(og, FRONTEND / "og-image.jpg", 82)

    touch_icon = ImageOps.fit(source, (180, 180), Image.LANCZOS, centering=(0.5, 0.3))
    touch_icon.save(FRONTEND / "apple-touch-icon.png", "PNG", optimize=True)
    print(f"Wrote frontend/apple-touch-icon.png ({(FRONTEND / 'apple-touch-icon.png').stat().st_size // 1024} KB)")

    mark = monogram(256)
    mark.save(FRONTEND / "favicon.ico", sizes=[(16, 16), (32, 32), (48, 48)])
    print(f"Wrote frontend/favicon.ico ({(FRONTEND / 'favicon.ico').stat().st_size // 1024} KB)")


if __name__ == "__main__":
    main()
