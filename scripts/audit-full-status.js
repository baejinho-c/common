#!/usr/bin/env node
/**
 * 테넌트 전체 현황: sitemap / 경로 / API 연동
 * Usage: node common/scripts/audit-full-status.js [--json] [--csv]
 */
const fs = require('fs')
const path = require('path')

const WORKDIR = path.join(__dirname, '../..')
const JSON_OUT = process.argv.includes('--json')
const CSV_OUT = process.argv.includes('--csv')
const SKIP = new Set(['common', 'restyserver', 'resty-api', 'hvalue', 'node_modules', '.git'])

function walk(dir, acc = [], filter) {
  if (!fs.existsSync(dir)) return acc
  for (const ent of fs.readdirSync(dir, { withFileTypes: true })) {
    if (ent.name.startsWith('.') || ent.name === 'node_modules') continue
    const full = path.join(dir, ent.name)
    if (ent.isDirectory()) walk(full, acc, filter)
    else if (!filter || filter(full)) acc.push(full)
  }
  return acc
}

function routeFromPage(file, appDir) {
  const rel = path.relative(appDir, file).replace(/\\/g, '/')
  if (!rel.endsWith('/page.tsx') && !rel.endsWith('/page.ts')) return null
  let route = '/' + rel.replace(/\/page\.tsx?$/, '')
  if (route === '/page') route = '/'
  route = route.replace(/\/index$/, '') || '/'
  // dynamic segments kept as-is: /post/[slug]
  return route
}

function collectRoutes(appDir) {
  const pages = walk(appDir, [], (f) => /\/page\.tsx?$/.test(f))
  const routes = new Set()
  for (const p of pages) {
    const r = routeFromPage(p, appDir)
    if (r) routes.add(r)
  }
  return [...routes].sort()
}

function extractSitemapPaths(tenant) {
  const root = path.join(WORKDIR, tenant)
  const paths = new Set()
  let baseUrl = null
  let source = 'none'

  const sitemapTs = path.join(root, 'app/sitemap.ts')
  const staticXml = path.join(root, 'public/sitemap.xml')
  const pubXml = path.join(WORKDIR, 'common/public', tenant, 'sitemap.xml')

  const parseContent = (content, from) => {
    source = from
    const bases = content.match(/https?:\/\/[a-zA-Z0-9._-]+(?:\.[a-zA-Z0-9._-]+)+/g) || []
    for (const b of bases) {
      if (!b.includes('sitemaps.org') && !b.includes('w3.org') && !b.includes('google.com')) {
        if (!baseUrl) baseUrl = b.replace(/\/$/, '')
      }
    }
    const locs = content.match(/<loc>([^<]+)<\/loc>/g) || []
    for (const loc of locs) {
      const url = loc.replace(/<\/?loc>/g, '')
      try {
        const u = new URL(url)
        paths.add(u.pathname || '/')
        if (!baseUrl) baseUrl = u.origin
      } catch {
        /* ignore */
      }
    }
    const templateUrls = content.match(/`\$\{baseUrl\}([^`]+)`/g) || []
    for (const t of templateUrls) {
      const p = t.replace(/\$\{baseUrl\}/, '').replace(/`/g, '')
      if (p && !p.includes('${')) paths.add('/' + p.replace(/^\//, ''))
    }
    const routeArrays = content.match(/["'`]\/[^"'`]+["'`]/g) || []
    for (const r of routeArrays) {
      const p = r.replace(/["'`]/g, '')
      if (p.startsWith('/') && !p.includes('${') && p.length < 80) paths.add(p)
    }
    const emptyRoutes = content.match(/["'`]["'`]/g)
    if (content.includes('""') || content.includes("''")) paths.add('/')
  }

  if (fs.existsSync(sitemapTs)) parseContent(fs.readFileSync(sitemapTs, 'utf8'), 'app/sitemap.ts')
  else if (fs.existsSync(staticXml)) parseContent(fs.readFileSync(staticXml, 'utf8'), 'public/sitemap.xml')
  else if (fs.existsSync(pubXml)) parseContent(fs.readFileSync(pubXml, 'utf8'), 'published/sitemap.xml')

  return { paths: [...paths].sort(), baseUrl, source }
}

function pathMatchesRoute(sitemapPath, routes) {
  if (routes.includes(sitemapPath)) return true
  // /content/foo → /content/[slug]
  const normalized = sitemapPath.replace(/\/[^/]+$/, '/[slug]')
  if (routes.some((r) => r.includes('[slug]') && sitemapPath.startsWith(r.replace('[slug]', '')))) return true
  if (routes.some((r) => r.includes('[id]') && /\/\d+$/.test(sitemapPath))) {
    const prefix = sitemapPath.replace(/\/\d+$/, '/[id]')
    if (routes.includes(prefix)) return true
  }
  if (routes.some((r) => r.includes('[') && sitemapPath.startsWith(r.split('[')[0]))) return true
  return false
}

function analyzeApi(tenant) {
  const root = path.join(WORKDIR, tenant)
  const files = walk(root, [], (f) => /\.(ts|tsx|js|jsx)$/.test(f))
  const authFiles = files.filter((f) =>
    /auth|api-client|api\.ts|resty-auth|credits/i.test(path.relative(root, f)),
  )
  const authText = authFiles.map((f) => fs.readFileSync(f, 'utf8')).join('\n')
  const text = files.map((f) => fs.readFileSync(f, 'utf8')).join('\n')

  const usesRestyAuth = /\/api\/resty\/auth/.test(text)
  const usesRestyAuthLib = /from ["']@\/lib\/resty-auth|restyLogin|restyRegister/.test(text)
  const mockAuth =
    /mock-jwt-token|MOCK_USERS|mockUsers\.find|mock-token|Mock (로그인|회원가입)|storyflow-user/i.test(authText) &&
    !usesRestyAuthLib
  const usesPosts = /\/api\/posts/.test(text)
  const usesCompany = /\/api\/resty_company/.test(text)
  const usesCredits = /\/api\/resty\/credits|credits\/balance/i.test(text)
  const emptyApiBase = /NEXT_PUBLIC_API_BASE_URL\s*[=:]\s*["']{2}|NEXT_PUBLIC_API_BASE_URL\s*\?\?\s*["']{2}/.test(text)

  let apiStatus = 'none'
  if (mockAuth) apiStatus = 'mock-auth'
  else if (usesRestyAuthLib || usesRestyAuth) apiStatus = 'resty-auth'
  else if (/supabase|firebase|next-auth/i.test(text)) apiStatus = 'external'
  else if (hasSignupIn(text)) apiStatus = 'custom-auth'

  let dataApi = []
  if (usesPosts) dataApi.push('posts')
  if (usesCompany) dataApi.push('company')
  if (usesCredits) dataApi.push('credits')

  return { apiStatus, usesRestyAuth, usesRestyAuthLib, mockAuth, dataApi, emptyApiBase }
}

function hasSignupIn(text) {
  return /signup|register|회원가입/i.test(text)
}

function expectedBase(tenant) {
  if (tenant === 'trips') return 'https://trips.co.kr'
  if (tenant === 'trace') return 'https://gotrace.ai'
  return `https://${tenant}.restyart.com`
}

function analyzeTenant(name) {
  const root = path.join(WORKDIR, name)
  const appDir = path.join(root, 'app')
  if (!fs.existsSync(appDir)) return null

  const routes = collectRoutes(appDir)
  const publicRoutes = routes.filter(
    (r) =>
      !r.startsWith('/api/') &&
      !r.startsWith('/_') &&
      !r.includes('/admin') &&
      !/auth\/(callback|google|naver|kakao)/.test(r),
  )

  const sm = extractSitemapPaths(name)
  const expected = expectedBase(name)
  const baseOk = !sm.baseUrl || sm.baseUrl === expected || sm.baseUrl.includes(name + '.restyart.com')

  const orphanPaths = sm.paths.filter((p) => !pathMatchesRoute(p, routes))
  const notInSitemap = publicRoutes.filter(
    (r) =>
      !sm.paths.some((p) => p === r || pathMatchesRoute(p, [r])) &&
      !['/monitor', '/test', '/content-api-test'].includes(r) &&
      !r.includes('['), // skip dynamic-only
  )

  const hasSitemapTs = fs.existsSync(path.join(root, 'app/sitemap.ts'))
  const hasStaticXml = fs.existsSync(path.join(root, 'public/sitemap.xml'))
  const published = fs.existsSync(path.join(WORKDIR, 'common/public', name, 'index.html'))
  const pubSitemap = fs.existsSync(path.join(WORKDIR, 'common/public', name, 'sitemap.xml'))
  const hasRobots =
    fs.existsSync(path.join(root, 'app/robots.ts')) ||
    fs.existsSync(path.join(WORKDIR, 'common/public', name, 'robots.txt'))

  const api = analyzeApi(name)

  let sitemapStatus = 'missing'
  if (hasSitemapTs || hasStaticXml) {
    if (!baseOk) sitemapStatus = 'wrong-base-url'
    else if (orphanPaths.length > 0) sitemapStatus = 'orphan-paths'
    else sitemapStatus = 'ok'
  }

  return {
    tenant: name,
    routes: routes.length,
    publicRoutes: publicRoutes.length,
    sitemapSource: sm.source,
    sitemapPaths: sm.paths.length,
    sitemapStatus,
    baseUrl: sm.baseUrl || '-',
    expectedBase: expected,
    baseOk,
    orphanPaths,
    notInSitemap: notInSitemap.slice(0, 8),
    notInSitemapCount: notInSitemap.length,
    published,
    pubSitemap,
    hasRobots,
    ...api,
  }
}

function main() {
  const tenants = fs
    .readdirSync(WORKDIR)
    .filter((n) => !SKIP.has(n) && !n.startsWith('.') && fs.statSync(path.join(WORKDIR, n)).isDirectory())

  const rows = tenants.map(analyzeTenant).filter(Boolean)
  rows.sort((a, b) => a.tenant.localeCompare(b.tenant))

  if (JSON_OUT) {
    console.log(JSON.stringify(rows, null, 2))
    return
  }

  // Summary counts
  const total = rows.length
  const noSitemap = rows.filter((r) => r.sitemapStatus === 'missing')
  const wrongBase = rows.filter((r) => r.sitemapStatus === 'wrong-base-url')
  const orphan = rows.filter((r) => r.sitemapStatus === 'orphan-paths')
  const sitemapOk = rows.filter((r) => r.sitemapStatus === 'ok')

  const apiMock = rows.filter((r) => r.apiStatus === 'mock-auth')
  const apiResty = rows.filter((r) => r.apiStatus === 'resty-auth')
  const apiNone = rows.filter((r) => r.apiStatus === 'none')
  const apiCustom = rows.filter((r) => r.apiStatus === 'custom-auth')
  const apiExternal = rows.filter((r) => r.apiStatus === 'external')
  const withDataApi = rows.filter((r) => r.dataApi.length > 0)
  const published = rows.filter((r) => r.published)

  console.log('# Resty 전체 현황 (sitemap + 경로 + API)\n')
  console.log(`스캔 테넌트: **${total}개** Next.js 앱 | 배포됨: **${published.length}개**\n`)

  console.log('## 1. Sitemap 요약\n')
  console.log('| 상태 | 개수 | 설명 |')
  console.log('|------|------|------|')
  console.log(`| ✅ 정상 | ${sitemapOk.length} | base URL + 경로 일치 |`)
  console.log(`| ⚠️ 잘못된 도메인 | ${wrongBase.length} | vercel/외부 URL 하드코딩 |`)
  console.log(`| ⚠️ 고아 경로 | ${orphan.length} | sitemap에 있지만 페이지 없음 |`)
  console.log(`| ❌ sitemap 없음 | ${noSitemap.length} | sitemap.ts/xml 미구현 |`)
  console.log(`| 📦 pub sitemap.xml | ${rows.filter((r) => r.pubSitemap).length} | common/public에 빌드됨 |`)
  console.log('')

  console.log('## 2. API 연동 요약\n')
  console.log('| 상태 | 개수 | 설명 |')
  console.log('|------|------|------|')
  console.log(`| ✅ resty-auth 연동 | ${apiResty.length} | play.restyart.com /api/resty/* |`)
  console.log(`| ❌ mock 인증 | ${apiMock.length} | 로컬 mock/localStorage |`)
  console.log(`| 🔧 custom 인증 | ${apiCustom.length} | 자체 구현 (resty 미사용) |`)
  console.log(`| 🌐 external | ${apiExternal.length} | Supabase/NextAuth 등 |`)
  console.log(`| ⬜ 인증 없음/미확인 | ${apiNone.length} | 로그인 기능 없거나 미검출 |`)
  console.log(`| 📡 데이터 API 사용 | ${withDataApi.length} | posts/company/credits 등 |`)
  console.log('')

  if (CSV_OUT) {
    console.log('tenant,sitemap,baseUrl,expected,sitemapPaths,routes,orphans,apiStatus,dataApi,published,pubSitemap')
    for (const r of rows) {
      console.log(
        [
          r.tenant,
          r.sitemapStatus,
          r.baseUrl,
          r.expectedBase,
          r.sitemapPaths,
          r.routes,
          r.orphanPaths.length,
          r.apiStatus,
          r.dataApi.join('+') || '-',
          r.published ? 'Y' : 'N',
          r.pubSitemap ? 'Y' : 'N',
        ].join(','),
      )
    }
    return
  }

  console.log('## 3. 테넌트별 전체 리스트\n')
  console.log('| 테넌트 | sitemap | base URL | 경로수 | sitemap경로 | 고아경로 | API | 데이터API | 배포 |')
  console.log('|--------|---------|----------|--------|-------------|----------|-----|-----------|------|')
  for (const r of rows) {
    const sm =
      r.sitemapStatus === 'ok'
        ? '✅'
        : r.sitemapStatus === 'missing'
          ? '❌없음'
          : r.sitemapStatus === 'wrong-base-url'
            ? '⚠️URL'
            : '⚠️고아'
    const api =
      r.apiStatus === 'resty-auth'
        ? '✅resty'
        : r.apiStatus === 'mock-auth'
          ? '❌mock'
          : r.apiStatus === 'custom-auth'
            ? '🔧custom'
            : r.apiStatus === 'external'
              ? '🌐ext'
              : '⬜'
    console.log(
      `| ${r.tenant} | ${sm} | ${(r.baseUrl === '-' ? r.expectedBase : r.baseUrl).replace('https://', '')} | ${r.routes} | ${r.sitemapPaths || '-'} | ${r.orphanPaths.length || '-'} | ${api} | ${r.dataApi.join(',') || '-'} | ${r.published ? 'Y' : 'N'} |`,
    )
  }

  console.log('\n## 4. Sitemap 잘못된 base URL (수정 필요)\n')
  if (!wrongBase.length) console.log('없음\n')
  for (const r of wrongBase) {
    console.log(`- **${r.tenant}**: \`${r.baseUrl}\` → \`${r.expectedBase}\``)
  }

  console.log('\n## 5. Sitemap 없는 테넌트\n')
  console.log(noSitemap.map((r) => r.tenant).join(', ') || '없음')

  console.log('\n## 6. Mock 인증 테넌트 (API 미연동)\n')
  console.log(apiMock.map((r) => r.tenant).join(', ') || '없음')

  console.log('\n## 7. Resty-auth 연동 완료\n')
  console.log(apiResty.map((r) => r.tenant).join(', '))

  console.log('\n## 8. 고아 sitemap 경로 상세 (페이지 없음 → 404 위험)\n')
  for (const r of orphan.filter((x) => x.orphanPaths.length)) {
    console.log(`**${r.tenant}** (${r.orphanPaths.length}개): ${r.orphanPaths.slice(0, 10).join(', ')}${r.orphanPaths.length > 10 ? '...' : ''}`)
  }
  if (!orphan.filter((x) => x.orphanPaths.length).length) console.log('없음')

  console.log('\n## 9. sitemap 미포함 주요 공개 경로 (SEO 누락, 상위 8개만)\n')
  for (const r of rows.filter((x) => x.notInSitemapCount > 0).slice(0, 15)) {
    console.log(`- **${r.tenant}** (${r.notInSitemapCount}개): ${r.notInSitemap.join(', ')}`)
  }
}

main()
