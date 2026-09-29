#!/usr/bin/env python3
"""Convert high-value published image assets to WebP and update first-party references.

The original source files are copied to a temporary backup directory before any change.
This script deliberately leaves originals in place; remove them only after runtime validation.
"""
from __future__ import annotations

import re
import shutil
from datetime import datetime
from pathlib import Path
from PIL import Image

ROOT = Path(__file__).resolve().parents[2]
BACKUP = Path('/tmp') / f'resty-image-originals-{datetime.now():%Y%m%d-%H%M%S}'
MANIFEST = Path('/tmp/resty-image-optimization-manifest.tsv')


def convert(source: Path, destination: Path, max_side: int | None, quality: int) -> tuple[tuple[int, int], tuple[int, int], int]:
    destination.parent.mkdir(parents=True, exist_ok=True)
    with Image.open(source) as image:
        image.load()
        original_size = image.size
        if max_side and max(image.size) > max_side:
            scale = max_side / max(image.size)
            target = (round(image.size[0] * scale), round(image.size[1] * scale))
            image = image.resize(target, Image.Resampling.LANCZOS)
        else:
            target = image.size
        has_alpha = 'A' in image.getbands() or 'transparency' in image.info
        image = image.convert('RGBA' if has_alpha else 'RGB')
        temporary = destination.with_suffix(destination.suffix + '.tmp')
        image.save(temporary, 'WEBP', quality=quality, method=6)
        temporary.replace(destination)
    return original_size, target, destination.stat().st_size


def backup(source: Path) -> None:
    target = BACKUP / source.relative_to(ROOT)
    target.parent.mkdir(parents=True, exist_ok=True)
    shutil.copy2(source, target)


changes: list[tuple[str, Path, Path, tuple[int, int], tuple[int, int], int, int]] = []
# Only PNG catalog icons actually registered in the live game catalogue are changed.
games_file = ROOT / 'edugame/lib/games.ts'
games_source = games_file.read_text(encoding='utf-8')
registered = sorted(set(re.findall(r"/icons/([^?'\"]+\.png)", games_source, flags=re.I)))
for name in registered:
    source = ROOT / 'edugame/public/icons' / name
    if not source.exists():
        continue
    destination = source.with_suffix('.webp')
    backup(source)
    original_dims, target_dims, webp_bytes = convert(source, destination, max_side=384, quality=82)
    old = f'/icons/{name}'
    new = f'/icons/{Path(name).with_suffix(".webp").as_posix()}'
    games_source = games_source.replace(old, new)
    changes.append(('catalog-icon', source, destination, original_dims, target_dims, source.stat().st_size, webp_bytes))
games_file.write_text(games_source, encoding='utf-8')

# The reader already uses WebP for stories 1–8. Convert the later PNG-only story art while retaining full resolution.
reader_file = ROOT / 'common/public/read/index.html'
reader_source = reader_file.read_text(encoding='utf-8')
for identifier in range(14, 21):
    name = f'case-{identifier:02d}-detective.png'
    source = ROOT / 'common/public/read/assets' / name
    if not source.exists():
        continue
    destination = source.with_suffix('.webp')
    backup(source)
    original_dims, target_dims, webp_bytes = convert(source, destination, max_side=None, quality=82)
    reader_source = reader_source.replace(name, destination.name)
    changes.append(('story-art', source, destination, original_dims, target_dims, source.stat().st_size, webp_bytes))
reader_file.write_text(reader_source, encoding='utf-8')

with MANIFEST.open('w', encoding='utf-8') as stream:
    stream.write('type\toriginal\twebp\toriginal_dimensions\ttarget_dimensions\toriginal_bytes\twebp_bytes\tsavings_bytes\n')
    for type_, source, destination, original_dims, target_dims, original_bytes, webp_bytes in changes:
        stream.write('\t'.join(map(str, [type_, source.relative_to(ROOT), destination.relative_to(ROOT), f'{original_dims[0]}x{original_dims[1]}', f'{target_dims[0]}x{target_dims[1]}', original_bytes, webp_bytes, original_bytes - webp_bytes])) + '\n')

print(f'backup={BACKUP}')
print(f'manifest={MANIFEST}')
print(f'changes={len(changes)}')
