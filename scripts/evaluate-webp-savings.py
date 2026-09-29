#!/usr/bin/env python3
"""Measure WebP savings without modifying project assets."""
from __future__ import annotations

import io
import re
from dataclasses import dataclass
from pathlib import Path
from PIL import Image

ROOT = Path(__file__).resolve().parents[2]
OUT = Path('/tmp/resty-image-analysis/webp-projections.tsv')


@dataclass
class Projection:
    group: str
    source: Path
    original_bytes: int
    source_size: tuple[int, int]
    target_size: tuple[int, int]
    webp_bytes: int
    alpha: bool


def fitted_size(size: tuple[int, int], bound: int | None) -> tuple[int, int]:
    if not bound or max(size) <= bound:
        return size
    scale = bound / max(size)
    return (round(size[0] * scale), round(size[1] * scale))


def project(group: str, source: Path, bound: int | None, quality: int) -> Projection | None:
    try:
        with Image.open(source) as image:
            image.load()
            alpha = 'A' in image.getbands() or ('transparency' in image.info)
            target = fitted_size(image.size, bound)
            if image.size != target:
                image.thumbnail(target, Image.Resampling.LANCZOS)
            if alpha:
                image = image.convert('RGBA')
            else:
                image = image.convert('RGB')
            buffer = io.BytesIO()
            image.save(buffer, 'WEBP', quality=quality, method=6)
            return Projection(group, source, source.stat().st_size, image.size if image.size != target else target, target, buffer.tell(), alpha)
    except Exception:
        return None

# URLs registered in the live game catalogue only.
games_source = (ROOT / 'edugame/lib/games.ts').read_text(encoding='utf-8')
icon_urls = sorted(set(re.findall(r"/icons/([^?'\"]+\.(?:png|jpg|jpeg))", games_source, flags=re.I)))
items: list[tuple[str, Path, int | None, int]] = []
for name in icon_urls:
    file = ROOT / 'edugame/public/icons' / name
    if file.exists():
        # At 3 columns the home grid renders around 110px; 256px keeps a >2x mobile raster margin.
        items.append(('edugame_catalog_icon_256px_q82', file, 256, 82))

# Story visual assets are content illustrations: retain their full 1536px geometry and assess conversion only.
for file in sorted((ROOT / 'common/public/read/assets').glob('*.png')):
    items.append(('read_story_art_fullsize_q82', file, None, 82))

# Game backgrounds with photographic/illustrated pixels: retain geometry for a conservative initial projection.
for root in [ROOT / 'edugame/public/minigames', ROOT / 'wonder/public/scenes']:
    if root.exists():
        for file in sorted(root.rglob('*.png')):
            if file.stat().st_size >= 1_000_000:
                items.append(('large_game_art_fullsize_q82', file, None, 82))

projections = [entry for group, file, bound, quality in items if (entry := project(group, file, bound, quality))]
OUT.parent.mkdir(parents=True, exist_ok=True)
with OUT.open('w', encoding='utf-8') as stream:
    stream.write('group\toriginal_bytes\twebp_bytes\tsavings_bytes\tsavings_percent\tsource_dimensions\ttarget_dimensions\talpha\tpath\n')
    for entry in projections:
        savings = entry.original_bytes - entry.webp_bytes
        percent = 100 * savings / entry.original_bytes if entry.original_bytes else 0
        stream.write(f'{entry.group}\t{entry.original_bytes}\t{entry.webp_bytes}\t{savings}\t{percent:.1f}\t{entry.source_size[0]}x{entry.source_size[1]}\t{entry.target_size[0]}x{entry.target_size[1]}\t{entry.alpha}\t{entry.source.relative_to(ROOT)}\n')

for group in sorted({entry.group for entry in projections}):
    rows = [entry for entry in projections if entry.group == group]
    original = sum(entry.original_bytes for entry in rows)
    optimized = sum(entry.webp_bytes for entry in rows)
    print(f'{group}\tfiles={len(rows)}\toriginal={original / 1048576:.2f} MiB\twebp={optimized / 1048576:.2f} MiB\tsavings={(original - optimized) / 1048576:.2f} MiB ({(original - optimized) * 100 / original:.1f}%)')
print(OUT)
