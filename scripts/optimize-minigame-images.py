#!/usr/bin/env python3
"""Extract inline base64 images from minigame index.html into assets/ and optionally convert to WebP."""
from __future__ import annotations

import argparse
import base64
import hashlib
import re
import sys
from pathlib import Path

try:
    from PIL import Image
except ImportError:
    Image = None  # type: ignore

ROOT = Path(__file__).resolve().parents[2]
MINIGAMES = ROOT / "edugame/public/minigames"
COMMON_MINIGAMES = ROOT / "common/public/edugame/minigames"

DATA_URL_RE = re.compile(
    r"data:image/(webp|png|jpe?g);base64,([A-Za-z0-9+/=]+)",
    re.IGNORECASE,
)


def convert_to_webp(raw: bytes, src_fmt: str) -> bytes:
    if Image is None:
        raise RuntimeError("Pillow is required for PNG/JPEG → WebP conversion")
    from io import BytesIO

    with Image.open(BytesIO(raw)) as image:
        image.load()
        alpha = "A" in image.getbands() or "transparency" in image.info
        converted = image.convert("RGBA" if alpha else "RGB")
        out = BytesIO()
        converted.save(out, "WEBP", quality=82, method=6)
        return out.getvalue()


def optimize_game(game_id: str, *, to_webp: bool = True, dry_run: bool = False) -> dict:
    html_path = MINIGAMES / game_id / "index.html"
    if not html_path.exists():
        raise FileNotFoundError(html_path)

    html = html_path.read_text(encoding="utf-8")
    assets_dir = MINIGAMES / game_id / "assets"
    seen: dict[str, str] = {}
    replacements: list[tuple[str, str]] = []
    saved_bytes = 0
    original_embed = 0
    next_idx = 1

    existing = set()
    if assets_dir.exists():
        existing = {p.name for p in assets_dir.glob("*")}
        nums = [int(n[4:-5]) for n in existing if n.startswith("img-") and n.endswith(".webp")]
        if nums:
            next_idx = max(nums) + 1

    for match in DATA_URL_RE.finditer(html):
        fmt = match.group(1).lower()
        b64 = match.group(2)
        data_url = match.group(0)
        original_embed += len(b64)

        digest = hashlib.sha256(b64.encode("ascii")).hexdigest()[:16]
        if digest in seen:
            replacements.append((data_url, seen[digest]))
            continue

        raw = base64.b64decode(b64)
        if to_webp and fmt != "webp":
            file_bytes = convert_to_webp(raw, fmt)
            filename = f"img-{next_idx:03d}.webp"
        else:
            ext = "jpg" if fmt in ("jpeg", "jpg") else fmt
            file_bytes = raw
            filename = f"img-{next_idx:03d}.{ext}"

        rel = f"assets/{filename}"
        seen[digest] = rel
        replacements.append((data_url, rel))
        saved_bytes += len(b64) - len(file_bytes)
        next_idx += 1

        if not dry_run:
            assets_dir.mkdir(parents=True, exist_ok=True)
            (assets_dir / filename).write_bytes(file_bytes)

    unique_urls = len(seen)
    if unique_urls == 0:
        return {
            "game": game_id,
            "images": 0,
            "html_before": html_path.stat().st_size,
            "html_after": html_path.stat().st_size,
        }

    # Replace longest URLs first to avoid partial replacement issues.
    for data_url, rel in sorted(replacements, key=lambda item: -len(item[0])):
        html = html.replace(data_url, rel)

    html_after_size = len(html.encode("utf-8"))
    if not dry_run:
        html_path.write_text(html, encoding="utf-8")
        common_html = COMMON_MINIGAMES / game_id / "index.html"
        if common_html.parent.exists():
            common_assets = COMMON_MINIGAMES / game_id / "assets"
            common_assets.mkdir(parents=True, exist_ok=True)
            common_html.write_text(html, encoding="utf-8")
            if assets_dir.exists():
                for asset in assets_dir.iterdir():
                    if asset.is_file():
                        dest = common_assets / asset.name
                        dest.write_bytes(asset.read_bytes())

    assets_total = sum(p.stat().st_size for p in assets_dir.glob("*")) if assets_dir.exists() else 0

    return {
        "game": game_id,
        "images": unique_urls,
        "html_before": html_path.stat().st_size if dry_run else html_after_size,
        "html_after": html_after_size,
        "embed_before": original_embed,
        "assets_total": assets_total,
        "saved_embed": original_embed - assets_total,
    }


def main() -> int:
    parser = argparse.ArgumentParser()
    parser.add_argument("games", nargs="+", help="minigame ids")
    parser.add_argument("--dry-run", action="store_true")
    parser.add_argument("--keep-format", action="store_true", help="do not convert PNG/JPEG to WebP")
    args = parser.parse_args()

    print("game\timages\thtml_before\thtml_after\tassets\tsaved")
    for game in args.games:
        try:
            result = optimize_game(game, to_webp=not args.keep_format, dry_run=args.dry_run)
        except Exception as exc:  # noqa: BLE001
            print(f"{game}\tERROR\t{exc}", file=sys.stderr)
            continue
        if result["images"] == 0:
            print(f"{game}\t0\t{result['html_before']/1024/1024:.2f}MB\t(no embedded images)")
            continue
        print(
            f"{result['game']}\t{result['images']}\t"
            f"{result.get('embed_before', 0)/1024/1024:.1f}MB embed → "
            f"html {result['html_after']/1024/1024:.2f}MB + "
            f"assets {result['assets_total']/1024/1024:.2f}MB"
        )
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
