from PIL import Image, ImageDraw
from pathlib import Path

out = Path(__file__).resolve().parents[1] / "icons"
for size in (56, 112):
    image = Image.new("RGBA", (size, size), (11, 61, 51, 255))
    draw = ImageDraw.Draw(image)
    margin = max(4, size // 9)
    draw.rounded_rectangle((margin, margin, size - margin, size - margin), radius=size // 10, outline=(240, 199, 94, 255), width=max(2, size // 28))
    draw.text((size // 2, size // 2), "ق", fill=(255, 248, 223, 255), anchor="mm")
    image.save(out / f"icon-{size}.png", "PNG", optimize=True)
