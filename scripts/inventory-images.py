#!/usr/bin/env python3
"""Inventory project image source assets without following generated/dependency directories."""
from __future__ import annotations

import csv
import os
from pathlib import Path
from PIL import Image

ROOT = Path(__file__).resolve().parents[2]
OUTPUT = Path('/tmp/resty-image-inventory.tsv')
EXTENSIONS = {'.png', '.jpg', '.jpeg', '.webp', '.gif', '.svg', '.avif'}
PRUNE_NAMES = {'.git', 'node_modules', '.next', 'dist', 'build', '.production-work', '.home-nav-backups', '.turbo', 'coverage'}


def raster_dimensions(path: Path) -> str:
    if path.suffix.lower() == '.svg':
        return 'vector'
    try:
        with Image.open(path) as image:
            return f'{image.width}x{image.height}'
    except Exception:
        return 'unreadable'


with OUTPUT.open('w', newline='', encoding='utf-8') as stream:
    writer = csv.writer(stream, delimiter='\t')
    for directory, dirs, files in os.walk(ROOT):
        dirs[:] = [name for name in dirs if name not in PRUNE_NAMES]
        base = Path(directory)
        for name in files:
            path = base / name
            if path.suffix.lower() not in EXTENSIONS:
                continue
            try:
                writer.writerow([path.stat().st_size, path.suffix.lower().lstrip('.'), raster_dimensions(path), path.relative_to(ROOT)])
            except OSError:
                continue
print(OUTPUT)
