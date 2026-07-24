#!/usr/bin/env node
/** 정적 SPA/레거시 테넌트에 terms.html · privacy.html 생성 */
const fs = require('fs')
const path = require('path')

const ROOT = path.resolve(__dirname, '../..')
const PUBLIC = path.join(ROOT, 'common/public')
const COMPANY = { ...require('../legal-company.json') }
const overridePath = path.join(__dirname, '../legal-company.override.json')
if (fs.existsSync(overridePath)) {
  Object.assign(COMPANY, JSON.parse(fs.readFileSync(overridePath, 'utf8')))
}

const AI_DISCLOSURE =
  '본 서비스의 일부 콘텐츠·응답·추천·이미지 등은 인공지능(AI) 기술을 활용하여 생성될 수 있으며, ' +
  'AI 생성 결과는 참고용이며 정확성·완전성을 보장하지 않습니다.'

const TENANT_NAMES = {
  photo: 'Zero Photo',
  play: 'Play',
  r: 'R',
  subway: 'Subway',
  worm: '꿈틀꿈틀 지렁이',
}

function pageShell(title, body, tenant) {
  const serviceName = TENANT_NAMES[tenant] || tenant
  return `<!DOCTYPE html>
<html lang="ko">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>${title} — ${serviceName}</title>
  <style>
    body{font-family:system-ui,-apple-system,sans-serif;line-height:1.7;color:#111;max-width:720px;margin:0 auto;padding:24px 20px 48px}
  h1{font-size:1.75rem;margin-bottom:.25rem}
  h2{font-size:1.1rem;margin-top:1.75rem}
  p,li{color:#374151}
  .muted{color:#6b7280;font-size:.9rem}
  a{color:#2563eb}
  .box{background:#f3f4f6;padding:12px;border-radius:8px;font-size:.9rem}
  </style>
</head>
<body>
  <p><a href="/">← 홈으로</a></p>
  ${body}
  <hr style="margin:2rem 0;border:none;border-top:1px solid #e5e7eb" />
  <p class="muted">${COMPANY.name} · ${COMPANY.address}<br>사업자등록번호 ${COMPANY.businessNumber} · <a href="mailto:${COMPANY.email}">${COMPANY.email}</a></p>
  <p class="muted">&copy; ${new Date().getFullYear()} ${COMPANY.name}</p>
</body>
</html>`
}

function termsBody(serviceName) {
  return `
  <h1>이용약관</h1>
  <p class="muted">${serviceName}(${COMPANY.name} 운영) · 시행일 2026년 6월 30일</p>
  <h2>제1조 (목적)</h2>
  <p>본 약관은 ${COMPANY.name}(이하 &quot;회사&quot;)이 제공하는 ${serviceName}(이하 &quot;서비스&quot;)의 이용과 관련하여 회사와 이용자 간의 권리·의무 및 책임사항을 규정함을 목적으로 합니다.</p>
  <h2>제2조 (회원가입 및 리스티아트 계정)</h2>
  <ul>
    <li>회원가입 시 이메일·비밀번호 등 정보를 제공하며, 서비스별 테넌트(subdomain) 단위로 계정이 생성됩니다.</li>
    <li>동일 이메일이라도 서비스마다 별도 계정으로 관리될 수 있습니다.</li>
  </ul>
  <h2>제3조 (서비스의 제공)</h2>
  <p>회사는 웹·앱 기반 콘텐츠·도구 서비스를 제공합니다.</p>
  <p class="box"><strong>AI 이용 안내</strong> — ${AI_DISCLOSURE}</p>
  <p><a href="/privacy">개인정보처리방침</a></p>`
}

function privacyBody(serviceName) {
  return `
  <h1>개인정보처리방침</h1>
  <p class="muted">${serviceName} · ${COMPANY.name} · 시행일 2025년 1월 1일</p>
  <h2>1. 수집하는 개인정보</h2>
  <ul>
    <li>필수: 이메일, 비밀번호(암호화 저장), 서비스 이용 기록</li>
    <li>선택: 이름, 프로필 정보</li>
  </ul>
  <h2>2. 이용 목적</h2>
  <p>회원 식별, 서비스 제공, 고객 문의 응대, 서비스 개선 및 법령 준수</p>
  <h2>3. 문의</h2>
  <p><a href="mailto:${COMPANY.email}">${COMPANY.email}</a></p>
  <p><a href="/terms">이용약관</a></p>`
}

const tenants = process.argv.slice(2)
const targets = tenants.length ? tenants : ['photo', 'play', 'r', 'subway', 'worm']

for (const tenant of targets) {
  const dir = path.join(PUBLIC, tenant)
  if (!fs.existsSync(dir)) {
    console.warn(`[skip] ${tenant}: no public folder`)
    continue
  }
  const serviceName = TENANT_NAMES[tenant] || tenant
  fs.writeFileSync(path.join(dir, 'terms.html'), pageShell('이용약관', termsBody(serviceName), tenant), 'utf8')
  fs.writeFileSync(path.join(dir, 'privacy.html'), pageShell('개인정보처리방침', privacyBody(serviceName), tenant), 'utf8')
  console.log(`[static-legal] ${tenant}: terms.html + privacy.html`)
}

console.log('Done.')
