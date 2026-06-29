#!/usr/bin/env node
/**
 * ARC 전자책 표지 SVG 생성
 * Usage: node common/scripts/generate-arc-book-covers.js
 */
const fs = require('fs')
const path = require('path')

const OUT_DIR = path.join(__dirname, '../../arc/public/covers')

const BOOKS = [
  {
    file: 'book-1-chatgpt.svg',
    title: 'AI 비전공자를 위한\nChatGPT 업무 자동화\n실전 가이드',
    subtitle: '업무 효율 300% 향상',
    category: 'AI & Tech',
    c1: '#312e81',
    c2: '#6366f1',
    accent: '#a5b4fc',
  },
  {
    file: 'book-2-ai-art.svg',
    title: 'Midjourney &\nStable Diffusion\n상업용 AI 아트',
    subtitle: 'AI 시안 · 프로 납품',
    category: 'AI & Tech',
    c1: '#581c87',
    c2: '#c026d3',
    accent: '#f0abfc',
  },
  {
    file: 'book-3-startup.svg',
    title: '스타트업 투자 유치\nA to Z',
    subtitle: 'IR부터 계약까지',
    category: '비즈니스 & 전략',
    c1: '#1e3a5f',
    c2: '#2563eb',
    accent: '#93c5fd',
  },
  {
    file: 'book-4-government.svg',
    title: '정부지원사업\n합격 사업계획서\n작성법',
    subtitle: '1인 기업가 실전',
    category: '비즈니스 & 전략',
    c1: '#134e4a',
    c2: '#0d9488',
    accent: '#5eead4',
  },
  {
    file: 'book-5-seo.svg',
    title: '2025 구글 SEO\n& GEO 전략',
    subtitle: '검색 최적화 실전',
    category: '마케팅 & 성장',
    c1: '#9a3412',
    c2: '#ea580c',
    accent: '#fdba74',
  },
  {
    file: 'book-6-shortform.svg',
    title: '인스타 릴스 &\n유튜브 숏폼\n바이럴 전략',
    subtitle: '저장·공유되는 콘텐츠',
    category: '마케팅 & 성장',
    c1: '#9d174d',
    c2: '#e11d48',
    accent: '#fda4af',
  },
  {
    file: 'book-7-pm.svg',
    title: '실리콘밸리 PM\n생산성 노하우',
    subtitle: 'OKR · 칸반 · 딥워크',
    category: '생산성 & 자기계발',
    c1: '#14532d',
    c2: '#16a34a',
    accent: '#86efac',
  },
  {
    file: 'book-8-portfolio.svg',
    title: '이직·연봉협상\n포트폴리오 전략',
    subtitle: '실력을 증명하라',
    category: '생산성 & 자기계발',
    c1: '#1e40af',
    c2: '#0891b2',
    accent: '#67e8f9',
  },
]

function esc(s) {
  return String(s)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
}

function renderCover(book) {
  const titleLines = book.title.split('\n')
  const titleY = 200
  const lineHeight = 38
  const titleSvg = titleLines
    .map(
      (line, i) =>
        `<tspan x="40" dy="${i === 0 ? 0 : lineHeight}" font-size="28" font-weight="800">${esc(line)}</tspan>`,
    )
    .join('')

  return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="400" height="600" viewBox="0 0 400 600">
  <defs>
    <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="${book.c1}"/>
      <stop offset="100%" stop-color="${book.c2}"/>
    </linearGradient>
    <filter id="shadow" x="-20%" y="-20%" width="140%" height="140%">
      <feDropShadow dx="0" dy="4" stdDeviation="8" flood-opacity="0.25"/>
    </filter>
  </defs>
  <rect width="400" height="600" fill="url(#bg)"/>
  <circle cx="320" cy="80" r="120" fill="${book.accent}" opacity="0.15"/>
  <circle cx="60" cy="520" r="90" fill="${book.accent}" opacity="0.12"/>
  <rect x="0" y="0" width="8" height="600" fill="${book.accent}" opacity="0.6"/>
  <rect x="40" y="48" rx="6" ry="6" width="auto" height="28" fill="rgba(255,255,255,0.18)"/>
  <text x="52" y="68" fill="white" font-family="'Noto Sans KR', 'Apple SD Gothic Neo', sans-serif" font-size="13" font-weight="600" opacity="0.95">${esc(book.category)}</text>
  <text x="40" y="${titleY}" fill="white" font-family="'Noto Sans KR', 'Apple SD Gothic Neo', sans-serif" filter="url(#shadow)">
    ${titleSvg}
  </text>
  <line x1="40" y1="380" x2="160" y2="380" stroke="${book.accent}" stroke-width="3" opacity="0.8"/>
  <text x="40" y="410" fill="white" font-family="'Noto Sans KR', 'Apple SD Gothic Neo', sans-serif" font-size="16" font-weight="500" opacity="0.85">${esc(book.subtitle)}</text>
  <text x="40" y="560" fill="white" font-family="system-ui, sans-serif" font-size="12" font-weight="700" letter-spacing="2" opacity="0.5">INSIGHT ARC</text>
</svg>`
}

fs.mkdirSync(OUT_DIR, { recursive: true })
for (const book of BOOKS) {
  const out = path.join(OUT_DIR, book.file)
  fs.writeFileSync(out, renderCover(book), 'utf8')
  console.log('wrote', out)
}
