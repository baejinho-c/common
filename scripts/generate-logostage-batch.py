#!/usr/bin/env python3
"""Generate LogoStage logos and write tenant public assets."""
from __future__ import annotations

import base64
import io
import json
import re
import ssl
import sys
import urllib.request
from pathlib import Path

# macOS Python often lacks system CA bundle for urllib
SSL_CTX = ssl.create_default_context()
try:
    import certifi  # type: ignore

    SSL_CTX = ssl.create_default_context(cafile=certifi.where())
except Exception:
    SSL_CTX.check_hostname = False
    SSL_CTX.verify_mode = ssl.CERT_NONE

try:
    from PIL import Image
except ImportError:
    import subprocess

    subprocess.check_call([sys.executable, "-m", "pip", "install", "Pillow", "-q"])
    from PIL import Image

ROOT = Path(__file__).resolve().parents[2]

SERVICES = [
    {
        "slug": "chicken",
        "companyName": "치킨모임",
        "industry": "전문가 커뮤니티 / 개발자 모임",
        "style": "friendly modern warm",
        "colors": ["warm orange", "crispy gold", "cream"],
        "description": "치킨모임 커뮤니티. 치킨과 모임을 상징하는 단일 심플 아이콘 마크. 텍스트 없이 심볼만.",
    },
    {
        "slug": "edugame",
        "companyName": "놀이터",
        "industry": "어린이 교육 웹 게임",
        "style": "playful colorful kid-friendly",
        "colors": ["sky blue", "sunny yellow", "soft green"],
        "description": "아이들을 위한 웹 게임 놀이터. 미끄럼틀·블록 놀이 느낌의 단일 심플 마크. 텍스트 없이.",
    },
    {
        "slug": "match",
        "companyName": "동네알바",
        "industry": "지역 기반 구인구직",
        "style": "clean modern trustworthy",
        "colors": ["teal", "navy", "white"],
        "description": "동네알바. 지도 핀과 일자리를 상징하는 단일 심플 마크. 텍스트 없이.",
    },
    {
        "slug": "math",
        "companyName": "수학의 숲",
        "industry": "수학 교육 / 증명 학습",
        "style": "elegant academic nature",
        "colors": ["forest green", "deep teal", "cream"],
        "description": "수학의 숲 Math Forest. 나무와 수학 기호가 조화된 단일 심플 마크. 하트 금지. 텍스트 없이.",
    },
    {
        "slug": "ogstudio",
        "companyName": "OG Studio",
        "industry": "Open Graph 이미지 제작 도구",
        "style": "tech minimal glass",
        "colors": ["indigo", "violet", "slate"],
        "description": "OG Studio Open Graph 이미지 생성. OG 카드 프레임을 상징하는 단일 심플 마크. 텍스트 없이.",
    },
    {
        "slug": "idea",
        "companyName": "Idea",
        "industry": "AI 아이디어 저장소 / 기획서 관리",
        "style": "warm creative minimal",
        "colors": ["amber gold", "soft cream", "warm brown"],
        "description": "AI 아이디어 저장소. 빛나는 전구·아이디어 스파크 단일 심플 앱 아이콘. 텍스트 없이 심볼만.",
    },
    {
        "slug": "linker",
        "companyName": "CorpLinker",
        "industry": "B2B 기업 정보 / 네트워킹 플랫폼",
        "style": "corporate modern trustworthy",
        "colors": ["sky blue", "navy", "white"],
        "description": "CorpLinker. 기업 노드가 연결되는 네트워크 링크 심볼. 단일 심플 앱 아이콘. 텍스트 없이.",
    },
    {
        "slug": "mindmap",
        "companyName": "MindWeave",
        "industry": "마인드맵 / 지식 시각화",
        "style": "clean modern creative",
        "colors": ["cyan", "teal", "white"],
        "description": "MindWeave 마인드맵. 중심 노드에서 가지가 뻗는 마인드맵 심볼. 단일 심플 마크. 텍스트 없이.",
    },
    {
        "slug": "physics",
        "companyName": "Physics Lab",
        "industry": "인터랙티브 물리학 실험 교육",
        "style": "scientific clean precise",
        "colors": ["deep blue", "electric cyan", "white"],
        "description": "Physics Lab. 원자·궤도(전자) 심볼의 단일 심플 앱 아이콘. 텍스트 없이.",
    },
    {
        "slug": "sight",
        "companyName": "SolveSight",
        "industry": "AI 웹 콘텐츠 학습 / 문제 해결 브라우저",
        "style": "sharp modern tech",
        "colors": ["teal cyan", "deep slate", "white"],
        "description": "SolveSight. 눈·렌즈로 웹을 분석하는 시선 심볼. 단일 심플 앱 아이콘. 텍스트 없이.",
    },
    {
        "slug": "toonsnap",
        "companyName": "ToonSnap",
        "industry": "AI 인스타툰 / 웹툰 메이커",
        "style": "playful cute comic character",
        "colors": ["coral orange", "sunny yellow", "ink black"],
        "description": "ToonSnap AI comic maker. Cute chibi cartoon character with speech bubble, comic panel feel, single simple app icon mark. No text letters.",
    },
]


def generate(svc: dict) -> dict:
    body = json.dumps(
        {
            "subdomain": "logo",
            "engine": "openai",
            "companyName": svc["companyName"],
            "industry": svc["industry"],
            "style": svc["style"],
            "colors": svc["colors"],
            "description": svc["description"],
            "referenceMode": "none",
        }
    ).encode()
    req = urllib.request.Request(
        "https://app.restyart.com/api/logo/generate",
        data=body,
        headers={
            "Content-Type": "application/json",
            "x-subdomain": "logo",
            "Origin": "https://logo.restyart.com",
        },
        method="POST",
    )
    with urllib.request.urlopen(req, timeout=180, context=SSL_CTX) as res:
        return json.loads(res.read().decode())


def trim_square(img: Image.Image) -> Image.Image:
    pixels = img.load()
    w, h = img.size

    def is_bg(x, y):
        r, g, b, a = pixels[x, y]
        if a < 20:
            return True
        return (0.299 * r + 0.587 * g + 0.114 * b) > 248

    minx, miny, maxx, maxy = w, h, 0, 0
    for y in range(h):
        for x in range(w):
            if not is_bg(x, y):
                minx = min(minx, x)
                miny = min(miny, y)
                maxx = max(maxx, x)
                maxy = max(maxy, y)
    if maxx > minx:
        pad = max(2, int(max(maxx - minx, maxy - miny) * 0.06))
        img = img.crop(
            (max(0, minx - pad), max(0, miny - pad), min(w, maxx + 1 + pad), min(h, maxy + 1 + pad))
        )
    side = max(img.size)
    canvas = Image.new("RGBA", (side, side), (0, 0, 0, 0))
    canvas.paste(img, ((side - img.size[0]) // 2, (side - img.size[1]) // 2), img)
    return canvas


def write_assets(slug: str, data_url: str, meta: dict) -> Path:
    m = re.match(r"data:image/(\w+);base64,(.+)$", data_url, re.S)
    if not m:
        raise ValueError("expected data url")
    img = Image.open(io.BytesIO(base64.b64decode(m.group(2)))).convert("RGBA")
    img = trim_square(img)
    out = ROOT / slug / "public"
    out.mkdir(parents=True, exist_ok=True)
    mark512 = img.resize((512, 512), Image.Resampling.LANCZOS)
    mark512.save(out / "logo-512.png", "PNG")
    mark512.save(out / "logo-mark.png", "PNG")
    mark512.save(out / "logo.png", "PNG")
    mark512.save(out / "android-chrome-512x512.png", "PNG")
    img.resize((192, 192), Image.Resampling.LANCZOS).save(out / "android-chrome-192x192.png", "PNG")
    img.resize((180, 180), Image.Resampling.LANCZOS).save(out / "apple-touch-icon.png", "PNG")
    img.resize((180, 180), Image.Resampling.LANCZOS).save(out / "apple-icon.png", "PNG")
    for size, name in [(48, "favicon-48x48.png"), (32, "favicon-32x32.png"), (16, "favicon-16x16.png")]:
        img.resize((size, size), Image.Resampling.LANCZOS).save(out / name, "PNG")
    img.resize((32, 32), Image.Resampling.LANCZOS).save(out / "favicon.png", "PNG")
    # ICO (multi-size)
    ico_sizes = [(16, 16), (32, 32), (48, 48)]
    ico_imgs = [img.resize(s, Image.Resampling.LANCZOS) for s in ico_sizes]
    ico_imgs[0].save(out / "favicon.ico", format="ICO", sizes=ico_sizes)
    b64 = base64.b64encode((out / "logo-mark.png").read_bytes()).decode()
    svg = f'''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" fill="none" role="img" aria-label="{slug}">
  <image href="data:image/png;base64,{b64}" width="48" height="48" preserveAspectRatio="xMidYMid meet"/>
</svg>
'''
    (out / "logo-mark.svg").write_text(svg)
    (out / "favicon.svg").write_text(svg)
    (out / "logo.svg").write_text(svg)
    (out / "apple-touch-icon.svg").write_text(svg)
    (out / "logo-logostage-meta.json").write_text(json.dumps(meta, ensure_ascii=False, indent=2))
    # also copy into common/public if exists
    pub = ROOT / "common" / "public" / slug
    pub.mkdir(parents=True, exist_ok=True)
    names = [
        "logo-mark.png",
        "logo-512.png",
        "logo.png",
        "logo-mark.svg",
        "logo.svg",
        "favicon.svg",
        "favicon.png",
        "favicon.ico",
        "favicon-16x16.png",
        "favicon-32x32.png",
        "favicon-48x48.png",
        "apple-touch-icon.png",
        "apple-touch-icon.svg",
        "apple-icon.png",
        "android-chrome-192x192.png",
        "android-chrome-512x512.png",
        "logo-logostage-meta.json",
    ]
    for name in names:
        (pub / name).write_bytes((out / name).read_bytes())
    return out


def main():
    slugs = sys.argv[1:] or [s["slug"] for s in SERVICES]
    by_slug = {s["slug"]: s for s in SERVICES}
    results = []
    for slug in slugs:
        svc = by_slug[slug]
        print(f"[gen] {slug} ({svc['companyName']})...", flush=True)
        try:
            data = generate(svc)
            if not data.get("success"):
                print(f"  FAIL {data.get('error')}", flush=True)
                results.append({"slug": slug, "ok": False, "error": data.get("error")})
                continue
            logo = data["logos"][0]
            url = logo.get("symbolImageUrl") or logo["imageUrl"]
            meta = {
                "engine": logo.get("engine"),
                "style": logo.get("style"),
                "prompt": logo.get("prompt"),
                "concept": data.get("concept"),
                "companyName": svc["companyName"],
                "source": "logo.restyart.com",
            }
            out = write_assets(slug, url, meta)
            print(f"  OK -> {out / 'logo-mark.png'} ({(out / 'logo-mark.png').stat().st_size} bytes)", flush=True)
            results.append({"slug": slug, "ok": True})
        except Exception as e:
            print(f"  ERR {e}", flush=True)
            results.append({"slug": slug, "ok": False, "error": str(e)})
    print(json.dumps(results, ensure_ascii=False, indent=2))


if __name__ == "__main__":
    main()
