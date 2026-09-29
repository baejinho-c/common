#!/usr/bin/env python3
"""Summarize image source assets, duplication, and high-value compression candidates."""
from __future__ import annotations

import csv
import hashlib
from collections import defaultdict
from pathlib import Path
from PIL import Image

ROOT = Path(__file__).resolve().parents[2]
INVENTORY = Path('/tmp/resty-image-inventory.tsv')
OUTPUT = Path('/tmp/resty-image-analysis')
OUTPUT.mkdir(parents=True, exist_ok=True)

records = []
with INVENTORY.open(encoding='utf-8', newline='') as stream:
    for size, ext, dimensions, rel in csv.reader(stream, delimiter='\t'):
        records.append({'size': int(size), 'ext': ext, 'dimensions': dimensions, 'rel': rel, 'path': ROOT / rel})


def area(dimensions: str) -> int:
    try:
        width, height = map(int, dimensions.split('x'))
        return width * height
    except ValueError:
        return 0


def family(rel: str) -> str:
    bits = rel.split('/')
    if len(bits) >= 2 and bits[0] in {'common', 'restyserver'} and bits[1] == 'public':
        return '/'.join(bits[:3]) if len(bits) >= 3 else '/'.join(bits[:2])
    if len(bits) >= 2 and bits[1] in {'public', 'assets'}:
        return '/'.join(bits[:2])
    return bits[0]


def digest(path: Path) -> str:
    hash_ = hashlib.sha256()
    with path.open('rb') as stream:
        for block in iter(lambda: stream.read(1024 * 1024), b''):
            hash_.update(block)
    return hash_.hexdigest()

# Broad source family totals.
family_totals: dict[str, list[int]] = defaultdict(lambda: [0, 0])
for record in records:
    count, bytes_ = family_totals[family(record['rel'])]
    family_totals[family(record['rel'])] = [count + 1, bytes_ + record['size']]

with (OUTPUT / 'families.tsv').open('w', newline='', encoding='utf-8') as stream:
    writer = csv.writer(stream, delimiter='\t')
    writer.writerow(['asset_family', 'files', 'bytes', 'mib'])
    for key, (count, bytes_) in sorted(family_totals.items(), key=lambda item: item[1][1], reverse=True):
        writer.writerow([key, count, bytes_, f'{bytes_ / 1048576:.2f}'])

# Hash sufficiently large rasters to distinguish repeated source/deployment copies from distinct originals.
hash_groups: dict[str, list[dict]] = defaultdict(list)
for record in records:
    if record['ext'] == 'svg' or record['size'] < 256 * 1024:
        continue
    try:
        hash_groups[digest(record['path'])].append(record)
    except OSError:
        continue

duplicates = []
for hash_, group in hash_groups.items():
    if len(group) < 2:
        continue
    duplicated_bytes = sum(item['size'] for item in group) - max(item['size'] for item in group)
    duplicates.append((duplicated_bytes, hash_, group))

with (OUTPUT / 'duplicate-groups.tsv').open('w', newline='', encoding='utf-8') as stream:
    writer = csv.writer(stream, delimiter='\t')
    writer.writerow(['duplicated_bytes', 'copies', 'size_each', 'dimensions', 'paths'])
    for duplicated_bytes, _, group in sorted(duplicates, key=lambda item: item[0], reverse=True):
        writer.writerow([duplicated_bytes, len(group), max(item['size'] for item in group), group[0]['dimensions'], ' | '.join(item['rel'] for item in group)])

# High-value conversion candidates: large photographic-style PNG/JPEG/WebP source images.
candidates = []
for record in records:
    if record['ext'] not in {'png', 'jpg', 'jpeg', 'webp'} or record['size'] < 500 * 1024 or area(record['dimensions']) < 300_000:
        continue
    mode = 'unknown'
    alpha = 'unknown'
    try:
        with Image.open(record['path']) as image:
            mode = image.mode
            alpha = 'yes' if 'A' in image.getbands() or image.mode == 'P' and 'transparency' in image.info else 'no'
    except Exception:
        pass
    candidates.append({**record, 'mode': mode, 'alpha': alpha, 'pixels': area(record['dimensions'])})

with (OUTPUT / 'large-raster-candidates.tsv').open('w', newline='', encoding='utf-8') as stream:
    writer = csv.writer(stream, delimiter='\t')
    writer.writerow(['bytes', 'mib', 'ext', 'dimensions', 'pixels', 'alpha', 'mode', 'asset_family', 'path'])
    for item in sorted(candidates, key=lambda entry: entry['size'], reverse=True):
        writer.writerow([item['size'], f"{item['size'] / 1048576:.2f}", item['ext'], item['dimensions'], item['pixels'], item['alpha'], item['mode'], family(item['rel']), item['rel']])

print(f'records={len(records)}')
print(f'families={OUTPUT / "families.tsv"}')
print(f'duplicates={OUTPUT / "duplicate-groups.tsv"}')
print(f'candidates={OUTPUT / "large-raster-candidates.tsv"}')
