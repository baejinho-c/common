#!/usr/bin/env python3
"""Sync converted Edugame catalogue icons to the gateway mirror and replace runtime references.

The command updates the first-party minigame HTML and the current gateway mirror only.
It never changes backups, generated-image source scripts, or source originals.
"""
from __future__ import annotations

import csv
import shutil
from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]
MANIFEST = Path('/tmp/resty-image-optimization-manifest.tsv')
MIRROR = ROOT / 'common/public/edugame'
TEXT_EXTENSIONS = {'.html', '.js', '.mjs', '.css', '.json', '.tsx', '.ts'}
TEXT_ROOTS = [
    ROOT / 'edugame/public/minigames',
    ROOT / 'common/public/edugame',
]

rows = list(csv.DictReader(MANIFEST.open(encoding='utf-8', newline=''), delimiter='\t'))
icon_rows = [row for row in rows if row['type'] == 'catalog-icon']
replacements = {}
for row in icon_rows:
    original = Path(row['original'])
    webp = Path(row['webp'])
    replacements[original.name] = webp.name
    source = ROOT / webp
    target = MIRROR / 'icons' / webp.name
    target.parent.mkdir(parents=True, exist_ok=True)
    shutil.copy2(source, target)

changed_files = 0
replaced_urls = 0
for text_root in TEXT_ROOTS:
    if not text_root.exists():
        continue
    for path in text_root.rglob('*'):
        if not path.is_file() or path.suffix.lower() not in TEXT_EXTENSIONS:
            continue
        try:
            content = path.read_text(encoding='utf-8')
        except UnicodeDecodeError:
            continue
        updated = content
        for original_name, webp_name in replacements.items():
            count = updated.count(original_name)
            if count:
                updated = updated.replace(original_name, webp_name)
                replaced_urls += count
        if updated != content:
            path.write_text(updated, encoding='utf-8')
            changed_files += 1

# Match the gateway mirror's file set to the catalogue: remove superseded PNGs only there.
removed_mirror_pngs = 0
for original_name in replacements:
    old = MIRROR / 'icons' / original_name
    if old.exists():
        old.unlink()
        removed_mirror_pngs += 1

print(f'icon_files_synced={len(icon_rows)}')
print(f'runtime_files_updated={changed_files}')
print(f'url_replacements={replaced_urls}')
print(f'mirror_pngs_removed={removed_mirror_pngs}')
