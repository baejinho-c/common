#!/usr/bin/env node
/**
 * validate-dynamic-routes.js
 *
 * 소스의 app 동적 세그먼트([param]) page.tsx 와 public/{tenant} 빌드 산출물을 대조합니다.
 * generateStaticParams 없이 배포된 동적 경로는 HTML이 없어 게이트웨이가 index.html(SPA 폴백)만
 * 내려주므로 상세 페이지가 비어 보일 수 있습니다.
 *
 * Usage:
 *   node scripts/validate-dynamic-routes.js              # public/ 전체
 *   node scripts/validate-dynamic-routes.js cafe gpt   # 특정 테넌트만
 *   node scripts/validate-dynamic-routes.js --url https://cafe.restyart.com cafe
 */

const fs = require('fs')
const path = require('path')
const http = require('http')
const https = require('https')

const BASE = path.join(__dirname, '..', '..')
const PUBLIC = path.join(__dirname, '..', 'public')

function listTenants(filter) {
  if (filter && filter.length) return filter
  if (!fs.existsSync(PUBLIC)) return []
  return fs.readdirSync(PUBLIC).filter((name) => {
    const p = path.join(PUBLIC, name)
    return fs.statSync(p).isDirectory() && fs.existsSync(path.join(p, 'index.html'))
  })
}

/** app/cafe/[id]/page.tsx → cafe/:id */
function findDynamicRoutes(tenantSrc) {
  const appDir = path.join(tenantSrc, 'app')
  if (!fs.existsSync(appDir)) return []

  const routes = []

  function walk(dir, segments) {
    for (const ent of fs.readdirSync(dir, { withFileTypes: true })) {
      const full = path.join(dir, ent.name)
      if (ent.isDirectory()) {
        walk(full, segments.concat(ent.name))
      } else if (ent.name === 'page.tsx' || ent.name === 'page.ts' || ent.name === 'page.jsx') {
        const dyn = segments.filter((s) => s.startsWith('[') && s.endsWith(']'))
        if (dyn.length) {
          const routePath = '/' + segments.map((s) => (s.startsWith('[') ? `:${s.slice(1, -1)}` : s)).join('/')
          const pageFile = full
          const src = fs.readFileSync(pageFile, 'utf8')
          const hasStaticParams = /generateStaticParams\s*\(/.test(src)
          routes.push({ routePath, segments, pageFile, hasStaticParams, dynamicSegments: dyn })
        }
      }
    }
  }

  walk(appDir, [])
  return routes
}

/** generateStaticParams에서 id 목록 추출 */
function extractStaticParamSamples(pageFile, tenantSrc) {
  const src = fs.readFileSync(pageFile, 'utf8')
  if (!/generateStaticParams\s*\(/.test(src)) return null

  const mockImport = src.match(/import\s*\{[^}]*\bMOCK_CAFE_IDS\b[^}]*\}\s*from\s*['"]@\/lib\/api['"]/)
  if (mockImport) {
    const apiFile = path.join(tenantSrc, 'lib', 'api.ts')
    if (fs.existsSync(apiFile)) {
      const apiSrc = fs.readFileSync(apiFile, 'utf8')
      const m = apiSrc.match(/export const MOCK_CAFE_IDS\s*=\s*mockCompanies\.map\(\(c\)\s*=>\s*String\(c\.id\)\)/)
      if (m) {
        const ids = [...apiSrc.matchAll(/id:\s*(\d+)/g)].map((x) => x[1])
        if (ids.length) return [...new Set(ids)]
      }
      const arr = apiSrc.match(/export const MOCK_CAFE_IDS\s*=\s*\[([^\]]+)\]/)
      if (arr) {
        return arr[1].split(',').map((s) => s.trim().replace(/['"]/g, '')).filter(Boolean)
      }
    }
  }

  const mapMatch = src.match(/\.map\s*\(\s*\(?\s*(\w+)\s*\)?\s*=>\s*\(\s*\{\s*(\w+)\s*:\s*\1\s*\}/)
  if (mapMatch) {
    const constName = mapMatch[1]
    const re = new RegExp(`export const ${constName}\\s*=\\s*\\[([^\\]]+)\\]`)
    const m = src.match(re)
    if (m) {
      return m[1].split(',').map((s) => s.trim().replace(/['"]/g, '')).filter(Boolean)
    }
  }

  const objMatches = [...src.matchAll(/\{\s*(\w+)\s*:\s*['"]([^'"]+)['"]\s*\}/g)]
  if (objMatches.length) return objMatches.map((m) => m[2])

  return ['1']
}

function resolvePublishedHtml(publicRoot, segments, paramValues) {
  const parts = segments.map((s, i) => {
    if (s.startsWith('[')) {
      const key = s.slice(1, -1)
      const idx = segments.filter((x) => x.startsWith('[')).indexOf(s)
      return paramValues[idx] || 'sample'
    }
    return s
  })
  const rel = parts.join('/') + '.html'
  const candidates = [
    path.join(publicRoot, rel),
    path.join(publicRoot, parts.join('/'), 'index.html'),
  ]
  for (const c of candidates) {
    if (fs.existsSync(c)) return c
  }
  return null
}

function fetchUrl(url) {
  return new Promise((resolve, reject) => {
    const lib = url.startsWith('https') ? https : http
    lib
      .get(url, { timeout: 15000 }, (res) => {
        let body = ''
        res.on('data', (c) => (body += c))
        res.on('end', () => resolve({ status: res.statusCode, body }))
      })
      .on('error', reject)
  })
}

async function main() {
  const args = process.argv.slice(2)
  const urlIdx = args.indexOf('--url')
  const baseUrl = urlIdx >= 0 ? args[urlIdx + 1] : null
  const tenants = listTenants(args.filter((a, i) => a !== '--url' && (urlIdx < 0 || i !== urlIdx + 1)))

  let issues = 0
  const report = []

  for (const tenant of tenants) {
    const src = path.join(BASE, tenant)
    const pub = path.join(PUBLIC, tenant)
    if (!fs.existsSync(src)) continue

    const routes = findDynamicRoutes(src)
    if (!routes.length) continue

    for (const route of routes) {
      const samples = route.hasStaticParams ? extractStaticParamSamples(route.pageFile, src) : null
      const checkValues = samples || ['1', 'sample']

      for (const sample of checkValues.slice(0, 3)) {
        const dynKeys = route.dynamicSegments.map((s) => s.slice(1, -1))
        const paramMap = {}
        dynKeys.forEach((k, i) => {
          paramMap[k] = sample
        })

        const paramValues = dynKeys.map((k) => paramMap[k])
        const htmlFile = resolvePublishedHtml(pub, route.segments, paramValues)
        const urlPath = '/' + route.segments
          .map((s) => (s.startsWith('[') ? paramMap[s.slice(1, -1)] : s))
          .join('/')

        const entry = {
          tenant,
          route: route.routePath,
          sample: urlPath,
          hasGenerateStaticParams: route.hasStaticParams,
          htmlFile: htmlFile ? path.relative(pub, htmlFile) : null,
          ok: !!htmlFile,
        }

        if (!htmlFile) {
          issues++
          entry.issue = route.hasStaticParams
            ? 'generateStaticParams 있으나 HTML 미생성 — 빌드/배포 확인'
            : 'generateStaticParams 없음 — 동적 경로가 정적 HTML로 빌드되지 않음 (SPA 폴백 시 빈 상세)'
        }

        if (baseUrl && tenant === tenants[0]) {
          try {
            const { status, body } = await fetchUrl(`${baseUrl.replace(/\/$/, '')}${urlPath}`)
            entry.httpStatus = status
            const looksLikeHomeOnly =
              body.includes('app/page-') && !body.includes('cafe/') && urlPath !== '/'
            if (looksLikeHomeOnly) {
              issues++
              entry.issue = (entry.issue || '') + ' HTTP 응답이 홈페이지 번들로 보임 (SPA 폴백)'
              entry.ok = false
            }
          } catch (e) {
            entry.httpError = e.message
          }
        }

        report.push(entry)
      }
    }
  }

  console.log('Dynamic route validation\n')
  for (const r of report) {
    const status = r.ok ? 'OK' : 'FAIL'
    console.log(`[${status}] ${r.tenant} ${r.sample}`)
    console.log(`       route: ${r.route}, generateStaticParams: ${r.hasGenerateStaticParams}`)
    if (r.htmlFile) console.log(`       html: ${r.htmlFile}`)
    if (r.issue) console.log(`       → ${r.issue}`)
    if (r.httpStatus) console.log(`       http: ${r.httpStatus}`)
  }

  console.log(`\n${report.length} checks, ${issues} issue(s)`)
  process.exit(issues > 0 ? 1 : 0)
}

main().catch((e) => {
  console.error(e)
  process.exit(2)
})
