#!/usr/bin/env python3
"""Remove originals replaced by verified WebP files from active runtime asset roots.

Checks only current runtime source and gateway mirror paths. Historical backups, stale build
artifacts, and image-generation scripts intentionally do not block cleanup.
"""
from __future__ import annotations

import csv
from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]
MANIFEST = Path('/tmp/resty-image-optimization-manifest.tsv')
ACTIVE_TEXT_ROOTS = [
    ROOT / 'edugame/lib/games.ts',
    ROOT / 'edugame/public/minigames',
    ROOT / 'common/public/edugame',
    ROOT / 'common/public/read/index.html',
]
TEXT_EXTENSIONS = {'.ts', '.tsx', '.js', '.mjs', '.html', '.css', '.json'}
rows = list(csv.DictReader(MANIFEST.open(encoding='utf-8', newline=''), delimiter='\t'))
original_names = {Path(row['original']).name for row in rows}
stale: dict[str, list[str]] = {name: [] for name in original_names}

for root in ACTIVE_TEXT_ROOTS:
    files = [root] if root.is_file() else [path for path in root.rglob('*') if path.is_file() and path.suffix.lower() in TEXT_EXTENSIONS]
    for path in files:
        try:
            text = path.read_text(encoding='utf-8')
        except UnicodeDecodeError:
            continue
        for name in original_names:
            if name in text:
                stale[name].append(str(path.relative_to(ROOT)))

remaining = {name: paths for name, paths in stale.items() if paths}
if remaining:
    for name, paths in sorted(remaining.items()):
        print(f'stale_runtime_reference={name}: {", ".join(paths)}')
    raise SystemExit('Original files were retained because active runtime references remain.')

removed = 0
bytes_removed = 0
for row in rows:
    original = ROOT / row['original']
    webp = ROOT / row['webp']
    if not webp.exists():
        raise RuntimeError(f'Missing converted WebP: {webp}')
    if original.exists():
        bytes_removed += original.stat().st_size
        original.unlink()
        removed += 1
    if row['type'] == 'catalog-icon':
        mirror_original = ROOT / 'common/public/edugame/icons' / original.name
        if mirror_original.exists():
            bytes_removed += mirror_original.stat().st_size
            mirror_original.unlink()
            removed += 1

print(f'removed={removed}')
print(f'bytes_removed={bytes_removed}')
