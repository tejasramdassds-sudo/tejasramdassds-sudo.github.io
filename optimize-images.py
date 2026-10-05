"""Build responsive WebP copies without changing or cropping the originals."""

from pathlib import Path
from PIL import Image

ROOT = Path(__file__).resolve().parent / "assets"
FIGURES = [
    "search-incursion.png", "search-incursion-distance.png", "search-landscape.png",
    "ai-coordination.png", "recombination-spaces.png", "genesis-of-constitutions.png",
    "bellwether-trades.png", "iconic-constitutions.png", "tejas-ramdas-portrait-wide.jpg",
]

for filename in FIGURES:
    source = ROOT / filename
    with Image.open(source) as original:
        widths = sorted({min(width, original.width) for width in (640, 960, 1600)})
        for width in widths:
            height = round(original.height * width / original.width)
            image = original.convert("RGB").resize((width, height), Image.Resampling.LANCZOS)
            target = ROOT / f"{source.stem}-{width}.webp"
            image.save(target, "WEBP", quality=90, method=6)
            print(f"{target.name}: {width}x{height}, {target.stat().st_size:,} bytes")
