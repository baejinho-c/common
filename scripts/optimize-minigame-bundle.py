#!/usr/bin/env python3
"""Strip embedded fonts / audio / inline JS from heavy minigame bundles."""
from __future__ import annotations

import argparse
import base64
import re
import shutil
from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]
MINIGAMES = ROOT / "edugame/public/minigames"
COMMON_MINIGAMES = ROOT / "common/public/edugame/minigames"

GOOGLE_FONTS = """<link rel="preconnect" href="https://fonts.googleapis.com" />
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
  <link href="https://fonts.googleapis.com/css2?family=Jua&family=Noto+Sans+KR:wght@400;700;900&display=swap" rel="stylesheet" />"""


def sync_game(game_id: str) -> None:
    src = MINIGAMES / game_id
    dst = COMMON_MINIGAMES / game_id
    if not dst.parent.exists():
        return
    dst.mkdir(parents=True, exist_ok=True)
    for name in ["index.html", "app.js", "styles.css", "mobile-hardening.css"]:
        if (src / name).exists():
            shutil.copy2(src / name, dst / name)
    src_assets = src / "assets"
    if src_assets.exists():
        dst_assets = dst / "assets"
        dst_assets.mkdir(parents=True, exist_ok=True)
        for asset in src_assets.rglob("*"):
            if asset.is_file():
                rel = asset.relative_to(src_assets)
                target = dst_assets / rel
                target.parent.mkdir(parents=True, exist_ok=True)
                shutil.copy2(asset, target)


def optimize_animal_travel_fonts() -> dict:
    html_path = MINIGAMES / "animal-travel/index.html"
    html = html_path.read_text(encoding="utf-8")

    style_match = re.search(r"<style>(.*?)</style>", html, re.DOTALL)
    if not style_match:
        raise RuntimeError("animal-travel: missing <style> block")

    style = style_match.group(1)
    tailwind_idx = style.find("/*! tailwindcss")
    if tailwind_idx < 0:
        raise RuntimeError("animal-travel: tailwind block not found")

    tailwind_css = style[tailwind_idx:]
    styles_path = MINIGAMES / "animal-travel/styles.css"
    styles_path.write_text(tailwind_css, encoding="utf-8")

    new_style = '<link rel="stylesheet" href="styles.css?v=20260901b" />'
    if GOOGLE_FONTS not in html:
        html = html.replace("</head>", f"  {GOOGLE_FONTS}\n  {new_style}\n  </head>", 1)
    html = re.sub(r"<style>.*?</style>", "", html, count=1, flags=re.DOTALL)

    before = html_path.stat().st_size
    html_path.write_text(html, encoding="utf-8")
    sync_game("animal-travel")

    after = html_path.stat().st_size
    return {
        "game": "animal-travel",
        "before": before,
        "after": after,
        "styles_css": styles_path.stat().st_size,
    }


def optimize_fan_audio() -> dict:
    html_path = MINIGAMES / "fan/index.html"
    html = html_path.read_text(encoding="utf-8")
    before = html_path.stat().st_size

    assets_dir = MINIGAMES / "fan/assets"
    assets_dir.mkdir(parents=True, exist_ok=True)

    audio_re = re.compile(r"data:audio/wav;base64,([A-Za-z0-9+/=]+)")
    seen: dict[str, str] = {}
    idx = 1

    def replace_audio(match: re.Match[str]) -> str:
        nonlocal idx
        b64 = match.group(1)
        digest = b64[:32]
        if digest in seen:
            return seen[digest]
        filename = f"audio-{idx:02d}.wav"
        idx += 1
        rel = f"assets/{filename}"
        seen[digest] = rel
        (assets_dir / filename).write_bytes(base64.b64decode(b64))
        return rel

    html = audio_re.sub(replace_audio, html)
    html_path.write_text(html, encoding="utf-8")
    sync_game("fan")

    return {
        "game": "fan",
        "before": before,
        "after": html_path.stat().st_size,
        "audio_files": len(seen),
    }


def optimize_mine_lab_external_js() -> dict:
    html_path = MINIGAMES / "mine-lab/index.html"
    html = html_path.read_text(encoding="utf-8")
    before = html_path.stat().st_size

    scripts = list(re.finditer(r"(<script)([^>]*)(>)(.*?)(</script>)", html, re.DOTALL))
    biggest = max(
        (m for m in scripts if "src=" not in m.group(2)),
        key=lambda m: len(m.group(4)),
        default=None,
    )
    if biggest is None or len(biggest.group(4)) < 1_000_000:
        raise RuntimeError("mine-lab: main script not found")

    app_js = MINIGAMES / "mine-lab/app.js"
    app_js.write_text(biggest.group(4), encoding="utf-8")
    replacement = '<script defer src="app.js?v=20260901b"></script>'
    html = html[: biggest.start()] + replacement + html[biggest.end() :]
    html_path.write_text(html, encoding="utf-8")
    sync_game("mine-lab")

    return {
        "game": "mine-lab",
        "before": before,
        "after": html_path.stat().st_size,
        "app_js": app_js.stat().st_size,
    }


def main() -> int:
    parser = argparse.ArgumentParser()
    parser.add_argument(
        "target",
        choices=["animal-travel", "fan", "mine-lab", "all"],
        nargs="?",
        default="all",
    )
    args = parser.parse_args()

    targets = ["animal-travel", "fan", "mine-lab"] if args.target == "all" else [args.target]
    for target in targets:
        if target == "animal-travel":
            result = optimize_animal_travel_fonts()
            print(
                f"{result['game']}: {result['before']/1024/1024:.2f}MB → "
                f"html {result['after']/1024/1024:.2f}MB + styles {result['styles_css']/1024:.0f}KB"
            )
        elif target == "fan":
            result = optimize_fan_audio()
            print(
                f"{result['game']}: {result['before']/1024/1024:.2f}MB → "
                f"{result['after']/1024/1024:.2f}MB ({result['audio_files']} audio files)"
            )
        elif target == "mine-lab":
            result = optimize_mine_lab_external_js()
            print(
                f"{result['game']}: html {result['before']/1024/1024:.2f}MB → "
                f"{result['after']/1024:.0f}KB + app.js {result['app_js']/1024/1024:.2f}MB"
            )
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
