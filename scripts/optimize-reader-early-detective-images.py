#!/usr/bin/env python3
"""Convert early detective PNG scenes to matching WebP without replacing their content."""
from __future__ import annotations

import shutil
from datetime import datetime
from pathlib import Path
from PIL import Image

ROOT = Path(__file__).resolve().parents[2]
ASSETS = ROOT / 'common/public/read/assets'
INDEX = ROOT / 'common/public/read/index.html'
BACKUP = Path('/tmp') / f'resty-reader-early-originals-{datetime.now():%Y%m%d-%H%M%S}'
MANIFEST = Path('/tmp/resty-reader-early-optimization.tsv')

source_html = INDEX.read_text(encoding='utf-8')
rows = []
for number in (1, 2):
    original_name = f'case-{number:02d}-detective.png'
    webp_name = f'case-{number:02d}-detective.webp'
    original = ASSETS / original_name
    webp = ASSETS / webp_name
    if not original.exists():
        continue
    backup = BACKUP / original_name
    backup.parent.mkdir(parents=True, exist_ok=True)
    shutil.copy2(original, backup)
    with Image.open(original) as image:
        image.load()
        alpha = 'A' in image.getbands() or 'transparency' in image.info
        converted = image.convert('RGBA' if alpha else 'RGB')
        converted.save(webp, 'WEBP', quality=82, method=6)
    source_html = source_html.replace(original_name, webp_name)
    rows.append((original_name, webp_name, original.stat().st_size, webp.stat().st_size, image.size))

INDEX.write_text(source_html, encoding='utf-8')
with MANIFEST.open('w', encoding='utf-8') as stream:
    stream.write('original\twebp\toriginal_bytes\twebp_bytes\tdimensions\n')
    for original, webp, original_bytes, webp_bytes, dimensions in rows:
        stream.write(f'{original}\t{webp}\t{original_bytes}\t{webp_bytes}\t{dimensions[0]}x{dimensions[1]}\n')
print(f'backup={BACKUP}')
print(f'changes={len(rows)}')
print(f'manifest={MANIFEST}')
