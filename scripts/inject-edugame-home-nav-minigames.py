#!/usr/bin/env python3
"""Inject the shared Eding home button loader into all Eding static minigame HTML files."""
from __future__ import annotations

import shutil
import sys
from pathlib import Path

LOADER = '<script src="/edugame-home-nav.js?v=20260821e"></script>'
MARKER = 'edugame-home-nav.js'


def main() -> int:
    if len(sys.argv) != 3:
        print('usage: inject-edugame-home-nav-minigames.py MINIGAMES_ROOT BACKUP_DIR', file=sys.stderr)
        return 2
    root = Path(sys.argv[1])
    backup = Path(sys.argv[2])
    if not root.is_dir():
        print(f'missing root: {root}', file=sys.stderr)
        return 2

    backup.mkdir(parents=True, exist_ok=True)
    injected = 0
    updated = 0
    unchanged = 0
    for html in sorted(root.rglob('*.html')):
        text = html.read_text(encoding='utf-8')
        relative = html.relative_to(root)
        backup_file = backup / relative
        backup_file.parent.mkdir(parents=True, exist_ok=True)
        if MARKER in text:
            revised = text.replace('edugame-home-nav.js?v=20260821a', 'edugame-home-nav.js?v=20260821e').replace('edugame-home-nav.js?v=20260821b', 'edugame-home-nav.js?v=20260821e').replace('edugame-home-nav.js?v=20260821c', 'edugame-home-nav.js?v=20260821e').replace('edugame-home-nav.js?v=20260821d', 'edugame-home-nav.js?v=20260821e').replace('<script defer src="/edugame-home-nav.js?v=20260821e">', '<script src="/edugame-home-nav.js?v=20260821e">')
            if revised != text:
                shutil.copy2(html, backup_file)
                html.write_text(revised, encoding='utf-8')
                updated += 1
            else:
                unchanged += 1
            continue
        if '</body>' in text.lower():
            lower_index = text.lower().rfind('</body>')
            revised = f'{text[:lower_index]}{LOADER}\n{text[lower_index:]}'
        else:
            revised = f'{text}\n{LOADER}\n'
        shutil.copy2(html, backup_file)
        html.write_text(revised, encoding='utf-8')
        injected += 1

    print(f'summary injected={injected} updated={updated} unchanged={unchanged}')
    return 0


if __name__ == '__main__':
    raise SystemExit(main())
