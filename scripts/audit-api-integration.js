#!/usr/bin/env node
/**
 * 테넌트별 API 연동 상태 감사
 * Usage: node common/scripts/audit-api-integration.js [--json] [--live]
 */
const fs = require('fs')
const path = require('path')
const http = require('http')
const https = require('https')

const WORKDIR = path.join(__dirname, '../..')
const LIVE = process.argv.includes('--live')
const JSON_OUT = process.argv.includes('--json')
const API_BASE = process.env.RESTY_API_BASE || 'https://app.restyart.com'

const SKIP = new Set(['common', 'restyserver', 'resty-api', 'hvalue', 'node_modules', '.git'])

function walkFiles(dir, acc = []) {
  if (!fs.existsSync(dir)) return acc
  for (const ent of fs.readdirSync(dir, { withFileTypes: true })) {
    if (ent.name.startsWith('.') || ent.name === 'node_modules') continue
    const full = path.join(dir, ent.name)
    if (ent.isDirectory()) walkFiles(full, acc)
    else if (/\.(ts|tsx|js|jsx)$/.test(ent.name)) acc.push(full)
  }
  return acc
}

function readProject(name) {
  const root = path.join(WORKDIR, name)
  const files = walkFiles(root)
  const authFiles = files.filter((f) =>
    /auth|api-client|api\.ts|resty-auth|credits/i.test(path.relative(root, f)),
  )
  const authOnlyText = authFiles.map((f) => fs.readFileSync(f, 'utf8')).join('\n')
  const text = files.map((f) => fs.readFileSync(f, 'utf8')).join('\n')

  const hasApp = fs.existsSync(path.join(root, 'app'))
  const hasSignup =
    fs.existsSync(path.join(root, 'app/signup')) ||
    fs.existsSync(path.join(root, 'app/auth/signup')) ||
    fs.existsSync(path.join(root, 'app/auth/register')) ||
    /signup|register/i.test(text)
  const hasTerms = fs.existsSync(path.join(root, 'app/terms/page.tsx'))
  const hasPrivacy = fs.existsSync(path.join(root, 'app/privacy/page.tsx'))
  const hasRestyAuthLib = fs.existsSync(path.join(root, 'lib/resty-auth.ts'))

  const usesRestyAuthEndpoint = /\/api\/resty\/auth/.test(text)
  const usesLegacyAuth = /\/api\/auth\/(login|register|me)/.test(text) && !usesRestyAuthEndpoint
  const usesHikemate = /hikemate\/auth/.test(text)
  const usesWrongResty = /\/resty\/auth/.test(text) && !/\/api\/resty\/auth/.test(text)
  const mockAuth =
    /mock-jwt-token|Mock (로그인|회원가입)|\/\/ Mock (로그인|회원가입)|MOCK_USERS\.find|mockUsers\.find\([^)]*password/i.test(
      authOnlyText,
    ) ||
    (/setTimeout\([^)]*1000/.test(authOnlyText) && /mockUser/i.test(authOnlyText))
  const emptyApiBase = /NEXT_PUBLIC_API_BASE_URL\s*[=:]\s*["']{2}|NEXT_PUBLIC_API_BASE_URL\s*\?\?\s*["']{2}/.test(text)
  const localhostApi = /localhost:\d+|127\.0\.0\.1:\d+/.test(text) && /api|API/.test(text)
  const playApi = /play\.restyart\.com/.test(text)
  const usesCredits = /\/api\/resty\/credits|resty\/credits|credits\/balance/i.test(text)
  const usesPosts = /\/api\/posts|\/api\/resty_company/.test(text)
  const usesGatewayOnly = emptyApiBase && usesRestyAuthEndpoint

  let authPattern = 'none'
  if (mockAuth && !usesRestyAuthEndpoint) authPattern = 'mock'
  else if (usesHikemate) authPattern = 'hikemate-legacy'
  else if (usesLegacyAuth) authPattern = 'blog-legacy'
  else if (usesWrongResty) authPattern = 'wrong-path'
  else if (usesRestyAuthEndpoint) authPattern = 'resty-central'
  else if (/supabase|firebase|next-auth|NextAuth/i.test(text)) authPattern = 'external-auth'

  let subdomainHint = name
  const subMatch = text.match(/NEXT_PUBLIC_SUBDOMAIN[=:\s.z]+default\(["']([a-z0-9_-]+)/i)
  if (subMatch) subdomainHint = subMatch[1]
  const wrongSub = subdomainHint !== name && !['default', 'blog'].includes(subdomainHint)

  let priority = 'P3-low'
  let issues = []

  if (!hasApp) {
    priority = 'skip'
    issues.push('no-next-app')
  } else if (mockAuth && !usesRestyAuthEndpoint) {
    priority = 'P0-critical'
    issues.push('mock-auth-only')
  } else if (mockAuth && usesRestyAuthEndpoint) {
    priority = 'P1-high'
    issues.push('mock-auth-still-in-code')
  } else if (usesHikemate || usesLegacyAuth || usesWrongResty) {
    priority = 'P0-critical'
    if (usesHikemate) issues.push('hikemate-endpoint')
    if (usesLegacyAuth) issues.push('legacy-/api/auth')
    if (usesWrongResty) issues.push('missing-/api-prefix')
  } else if (usesGatewayOnly) {
    priority = 'P1-high'
    issues.push('empty-api-base→gateway-sqlite')
  } else if (wrongSub) {
    priority = 'P1-high'
    issues.push(`wrong-subdomain:${subdomainHint}`)
  } else if (!usesRestyAuthEndpoint && hasSignup) {
    priority = 'P1-high'
    issues.push('signup-but-no-resty-auth')
  } else if (usesRestyAuthEndpoint && !hasRestyAuthLib) {
    priority = 'P2-medium'
    issues.push('resty-auth-not-using-shared-lib')
  } else if (usesRestyAuthEndpoint) {
    priority = 'P2-medium'
    issues.push('ok-auth-verify-live')
  }

  if (hasSignup && (!hasTerms || !hasPrivacy)) {
    if (priority === 'P2-medium' || priority === 'P3-low') priority = 'P2-medium'
    if (!hasTerms) issues.push('missing-terms-page')
    if (!hasPrivacy) issues.push('missing-privacy-page')
  }
  if (localhostApi && priority !== 'P0-critical') {
    issues.push('localhost-api-in-code')
  }

  return {
    tenant: name,
    subdomain: subdomainHint,
    hasApp,
    hasSignup,
    hasTerms,
    hasPrivacy,
    hasRestyAuthLib,
    authPattern,
    usesRestyAuthEndpoint,
    usesCredits,
    usesPosts,
    playApi,
    mockAuth,
    wrongSub,
    priority,
    issues,
    authFileCount: authFiles.length,
    published: fs.existsSync(path.join(WORKDIR, 'common/public', name, 'index.html')),
  }
}

function probeLogin(subdomain) {
  return new Promise((resolve) => {
    const body = JSON.stringify({ subdomain, email: '', password: '' })
    const url = new URL('/api/resty/auth/login', API_BASE)
    const lib = url.protocol === 'https:' ? https : http
    const req = lib.request(
      {
        hostname: url.hostname,
        port: url.port || (url.protocol === 'https:' ? 443 : 80),
        path: url.pathname,
        method: 'POST',
        headers: {
          'content-type': 'application/json',
          'content-length': Buffer.byteLength(body),
          'x-subdomain': subdomain,
        },
        timeout: 8000,
      },
      (res) => {
        let data = ''
        res.on('data', (c) => (data += c))
        res.on('end', () => {
          try {
            const j = JSON.parse(data)
            resolve({
              status: res.statusCode,
              ok: res.statusCode === 400 && /이메일|비밀번호/.test(j.message || ''),
              message: j.message,
            })
          } catch {
            resolve({ status: res.statusCode, ok: false, message: data.slice(0, 80) })
          }
        })
      },
    )
    req.on('error', (e) => resolve({ status: 0, ok: false, message: e.message }))
    req.on('timeout', () => {
      req.destroy()
      resolve({ status: 0, ok: false, message: 'timeout' })
    })
    req.write(body)
    req.end()
  })
}

async function main() {
  const tenants = fs
    .readdirSync(WORKDIR)
    .filter((n) => !SKIP.has(n) && fs.statSync(path.join(WORKDIR, n)).isDirectory())

  const rows = tenants.map(readProject).filter((r) => r.hasApp)

  if (LIVE) {
    for (const row of rows.filter((r) => r.usesRestyAuthEndpoint && r.priority !== 'skip')) {
      row.liveProbe = await probeLogin(row.subdomain)
      row.liveOk = row.liveProbe.ok
    }
  }

  rows.sort((a, b) => {
    const order = { 'P0-critical': 0, 'P1-high': 1, 'P2-medium': 2, 'P3-low': 3, skip: 9 }
    return (order[a.priority] ?? 5) - (order[b.priority] ?? 5) || a.tenant.localeCompare(b.tenant)
  })

  if (JSON_OUT) {
    console.log(JSON.stringify(rows, null, 2))
    return
  }

  const counts = { P0: 0, P1: 0, P2: 0, P3: 0 }
  for (const r of rows) {
    if (r.priority.startsWith('P0')) counts.P0++
    else if (r.priority.startsWith('P1')) counts.P1++
    else if (r.priority.startsWith('P2')) counts.P2++
    else counts.P3++
  }

  console.log('# Resty API 연동 감사 리포트\n')
  console.log(`스캔: ${rows.length}개 Next.js 테넌트 | API: ${API_BASE}`)
  console.log(`우선순위: P0=${counts.P0} P1=${counts.P1} P2=${counts.P2} P3=${counts.P3}\n`)

  const byPriority = ['P0-critical', 'P1-high', 'P2-medium', 'P3-low']
  for (const p of byPriority) {
    const group = rows.filter((r) => r.priority === p)
    if (!group.length) continue
    console.log(`## ${p} (${group.length})\n`)
    console.log('| 테넌트 | subdomain | auth | 이슈 | 배포 | live |')
    console.log('|--------|-----------|------|------|------|------|')
    for (const r of group) {
      const live = LIVE && r.liveProbe ? (r.liveOk ? '✓' : `✗ ${r.liveProbe.status}`) : '-'
      console.log(
        `| ${r.tenant} | ${r.subdomain} | ${r.authPattern} | ${r.issues.join(', ')} | ${r.published ? 'yes' : 'no'} | ${live} |`,
      )
    }
    console.log('')
  }

  console.log('## 검사 방법\n')
  console.log('```bash')
  console.log('# 정적 코드 감사')
  console.log('node common/scripts/audit-api-integration.js')
  console.log('')
  console.log('# 프로덕션 API 엔드포인트 프로브 (login 400 = 정상)')
  console.log('node common/scripts/audit-api-integration.js --live')
  console.log('')
  console.log('# 로컬 API + 게이트웨이')
  console.log('cd resty-api && npm i && node index.js          # :5001')
  console.log('cd common && RESTY_API_BACKEND=http://127.0.0.1:5001 npm start  # :4000')
  console.log('```')
}

main().catch((e) => {
  console.error(e)
  process.exit(1)
})
