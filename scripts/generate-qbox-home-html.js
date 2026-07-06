#!/usr/bin/env node
/**
 * QBox 홈 index.html — 크롤러용 SSR 본문 주입
 * Usage: node common/scripts/generate-qbox-home-html.js [destDir]
 */
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const destRoot = path.resolve(process.argv[2] || path.join(__dirname, '../public/qbox'))
const SITE = 'https://qbox.restyart.com'

const AI_DISCLOSURE =
  '본 서비스의 일부 콘텐츠·응답·추천·이미지 등은 인공지능(AI) 기술을 활용하여 생성될 수 있으며, ' +
  'AI 생성 결과는 참고용이며 정확성·완전성을 보장하지 않습니다.'

function escapeHtml(text) {
  return String(text || '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
}

function buildHomeSsrBlock() {
  const tags = ['React', 'Next.js', 'TypeScript', 'JavaScript', 'Node.js', 'Docker']
  const tagLinks = tags
    .map(
      (t) =>
        `<li><a href="${SITE}/tag/${encodeURIComponent(t)}/">${escapeHtml(t)} 개발 질문</a></li>`,
    )
    .join('')

  return `<div id="qbox-home-ssr" data-qbox-ssr="1" class="min-h-screen bg-[#f9fafb]" style="font-family:system-ui,sans-serif;line-height:1.6;color:#374151">
  <header style="background:linear-gradient(135deg,#0891b2,#3498db);color:#fff;padding:3rem 1rem;text-align:center">
    <img src="${SITE}/og-image.png" alt="AI 기반 개발자 Q&amp;A 플랫폼 QBox 메인" width="600" height="315" style="max-width:100%;height:auto;border-radius:12px;margin:0 auto 1.5rem;display:block" />
    <h1 style="font-size:clamp(1.75rem,4vw,2.5rem);font-weight:700;margin-bottom:1rem">QBox - AI 기반 개발자 Q&amp;A 플랫폼</h1>
    <p style="max-width:36rem;margin:0 auto 1rem;color:#e5e7eb">개발 질문, AI가 즉시 답변해드립니다. React, Next.js, TypeScript 등 모든 개발 관련 질문을 QBox AI에 물어보세요.</p>
    <p style="margin-top:1rem"><a href="${SITE}/ask/" style="color:#fff;margin:0 0.5rem">질문하기</a> · <a href="${SITE}/questions/" style="color:#fff;margin:0 0.5rem">질문 목록</a> · <a href="${SITE}/tags/" style="color:#fff;margin:0 0.5rem">태그</a></p>
  </header>
  <main style="max-width:48rem;margin:0 auto;padding:2rem 1rem">
    <section style="margin-bottom:2rem">
      <h2 style="font-size:1.5rem;font-weight:700;margin-bottom:0.75rem">QBox 소개</h2>
      <p style="color:#6b7280;margin-bottom:1rem">QBox는 개발자가 React, Next.js, TypeScript, JavaScript, Node.js, Python 등 다양한 기술 스택에 대해 질문을 올리면 AI가 즉시 답변해 주는 Q&amp;A 플랫폼입니다. 코드 리뷰, 디버깅, 아키텍처 설계, 성능 최적화, 배포·운영까지 실무에서 마주치는 문제를 빠르게 해결할 수 있도록 돕습니다.</p>
      <p style="color:#6b7280">검색으로 기존 질문을 찾거나 새 질문을 등록하면 AI Assistant가 맥락을 이해한 답변을 제공합니다. 프론트엔드·백엔드·DevOps·커리어 등 개발 전반의 질문을 환영합니다.</p>
    </section>
    <section style="margin-bottom:2rem">
      <h2 style="font-size:1.5rem;font-weight:700;margin-bottom:0.75rem">주요 기능</h2>
      <h3 style="font-size:1.1rem;font-weight:600;margin-bottom:0.5rem">즉각적인 AI 답변</h3>
      <p style="color:#6b7280;margin-bottom:1rem">질문 등록 시 AI가 코드 예시와 함께 단계별 설명을 제공합니다.</p>
      <h3 style="font-size:1.1rem;font-weight:600;margin-bottom:0.5rem">태그·검색 기반 탐색</h3>
      <p style="color:#6b7280;margin-bottom:1rem">React, Next.js, TypeScript 등 인기 태그로 관련 질문을 빠르게 찾을 수 있습니다.</p>
      <h3 style="font-size:1.1rem;font-weight:600;margin-bottom:0.5rem">커뮤니티 Q&amp;A</h3>
      <p style="color:#6b7280">다른 개발자의 질문과 답변을 읽으며 실무 노하우를 공유할 수 있습니다.</p>
    </section>
    <section style="margin-bottom:2rem">
      <h2 style="font-size:1.5rem;font-weight:700;margin-bottom:0.75rem">이용 방법</h2>
      <ol style="color:#6b7280;padding-left:1.25rem">
        <li><a href="${SITE}/register/">회원가입</a> 후 또는 <a href="${SITE}/ask/">질문하기</a>로 시작</li>
        <li>제목·본문·태그를 입력하고 질문 등록</li>
        <li>AI 답변과 커뮤니티 답변 확인</li>
        <li><a href="${SITE}/my-questions/">내 질문</a>에서 이력 관리</li>
      </ol>
    </section>
    <section style="margin-bottom:2rem">
      <h2 style="font-size:1.5rem;font-weight:700;margin-bottom:0.75rem">인기 개발 주제</h2>
      <ul style="display:flex;flex-wrap:wrap;gap:0.5rem;list-style:none;padding:0">${tagLinks}</ul>
    </section>
    <section style="margin-bottom:2rem">
      <h2 style="font-size:1.5rem;font-weight:700;margin-bottom:0.75rem">AI 이용 안내</h2>
      <p style="color:#6b7280">${escapeHtml(AI_DISCLOSURE)}</p>
    </section>
    <section>
      <h2 style="font-size:1.5rem;font-weight:700;margin-bottom:0.75rem">연관 서비스</h2>
      <ul style="color:#6b7280;list-style:none;padding:0">
        <li style="margin-bottom:0.5rem"><a href="https://qbank.restyart.com/">QBank</a> — AI 문제 은행·오답노트</li>
        <li style="margin-bottom:0.5rem"><a href="https://tech.restyart.com/">Tech 블로그</a> — 개발 트렌드·AI 코딩</li>
        <li style="margin-bottom:0.5rem"><a href="https://vibecommunity.restyart.com/">Vibe Community</a> — 바이브 코딩 커뮤니티</li>
        <li><a href="https://logo.restyart.com/">Logo Maker</a> — AI 로고 생성</li>
      </ul>
    </section>
  </main>
</div>`
}

const SKELETON_RE =
  /<div class="min-h-screen bg-\[#f9fafb\]"><div class="animate-pulse">[\s\S]*?<\/div><\/div>/

function patchIndexHtml(html) {
  if (!SKELETON_RE.test(html)) {
    return html
  }
  const ssrBlock = buildHomeSsrBlock()
  return html.replace(SKELETON_RE, ssrBlock)
}

function main() {
  const targets = [
    path.join(destRoot, 'index.html'),
    path.join(destRoot, 'app', 'index.html'),
  ].filter((p) => fs.existsSync(p))

  if (!targets.length) {
    console.warn('[generate-qbox-home-html] no index.html found under', destRoot)
    return
  }

  for (const file of targets) {
    const html = fs.readFileSync(file, 'utf8')
    const patched = patchIndexHtml(html)
    if (patched === html) {
      console.log('[generate-qbox-home-html] skip (already has content):', file)
      continue
    }
    fs.writeFileSync(file, patched)
    console.log('[generate-qbox-home-html] patched', file)
  }
}

main()
