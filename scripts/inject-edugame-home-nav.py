#!/usr/bin/env python3
"""Inject the shared Eding home button loader into selected static game sites.

Usage: inject-edugame-home-nav.py HOSTS_FILE BACKUP_DIR
Requires read/write access to /etc/nginx/conf.d and the selected static roots.
"""
from __future__ import annotations

import re
import shutil
import sys
from pathlib import Path

LOADER = '<script src="https://edugame.restyart.com/edugame-home-nav.js?v=20260821e"></script>'
MARKER = 'edugame-home-nav.js'


def static_root_for_host(host: str) -> Path | None:
    for config in sorted(Path('/etc/nginx/conf.d').glob('*.conf')):
        try:
            text = config.read_text(encoding='utf-8')
        except OSError:
            continue
        if not re.search(rf'\bserver_name\b[^;]*\b{re.escape(host)}\b', text):
            continue
        roots = re.findall(r'\broot\s+([^;\s]+)\s*;', text)
        for root in roots:
            candidate = Path(root)
            if str(candidate).startswith('/var/www/'):
                return candidate
    return None


def inject(index_path: Path, backup_root: Path) -> str:
    content = index_path.read_text(encoding='utf-8')
    backup_name = str(index_path).lstrip('/').replace('/', '__')
    backup_root.mkdir(parents=True, exist_ok=True)
    if MARKER in content:
        updated = re.sub(r'edugame-home-nav\.js\?v=20260821[a-d]', 'edugame-home-nav.js?v=20260821e', content).replace('<script defer src="https://edugame.restyart.com/edugame-home-nav.js?v=20260821e">', '<script src="https://edugame.restyart.com/edugame-home-nav.js?v=20260821e">')
        if updated == content:
            return 'already-present'
        shutil.copy2(index_path, backup_root / backup_name)
        index_path.write_text(updated, encoding='utf-8')
        return 'updated'

    shutil.copy2(index_path, backup_root / backup_name)
    # Always inject before the LAST </body> so inline JS that contains the
    # literal text "</body>" (e.g. corrupted or string data) is not matched.
    match = None
    for match in re.finditer(r'</body\s*>', content, flags=re.IGNORECASE):
        pass
    if match is not None:
        updated = f'{content[:match.start()]}{LOADER}\n{content[match.start():]}'
    else:
        updated = f'{content}\n{LOADER}\n'
    index_path.write_text(updated, encoding='utf-8')
    return 'injected'


def main() -> int:
    if len(sys.argv) != 3:
        print('usage: inject-edugame-home-nav.py HOSTS_FILE BACKUP_DIR', file=sys.stderr)
        return 2

    hosts_path = Path(sys.argv[1])
    backup_root = Path(sys.argv[2])
    hosts = [line.strip().lower() for line in hosts_path.read_text(encoding='utf-8').splitlines() if line.strip()]

    counts = {'injected': 0, 'already-present': 0, 'missing-root': 0, 'missing-index': 0, 'error': 0}
    for host in hosts:
        root = static_root_for_host(host)
        if root is None:
            counts['missing-root'] += 1
            print(f'{host}\tmissing-root')
            continue
        index_path = root / 'index.html'
        if not index_path.is_file():
            counts['missing-index'] += 1
            print(f'{host}\tmissing-index\t{index_path}')
            continue
        try:
            result = inject(index_path, backup_root)
            counts[result] += 1
            print(f'{host}\t{result}\t{index_path}')
        except Exception as exc:  # noqa: BLE001
            counts['error'] += 1
            print(f'{host}\terror\t{exc}', file=sys.stderr)

    print('summary\t' + '\t'.join(f'{key}={value}' for key, value in counts.items()))
    return 0 if counts['error'] == 0 else 1


if __name__ == '__main__':
    raise SystemExit(main())
