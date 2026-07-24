#!/usr/bin/env node
/**
 * nginx server 블록 → JSON 인벤토리 (읽기 전용)
 *
 * - nginx 설정은 파싱만 함 (reload/restart/수정/삭제 없음)
 * - 입력: `nginx -T` (실패 시 sudo 안내) 또는 stdin / NGINX_T_FILE
 * - 출력: /var/www/mcp/inventory.json (INVENTORY_OUT 으로 변경 가능)
 *
 * 사용:
 *   node common/scripts/nginx-inventory.js
 *   sudo nginx -T 2>/dev/null | node common/scripts/nginx-inventory.js
 *   NGINX_T_FILE=/tmp/nginx-T.txt node common/scripts/nginx-inventory.js
 */

'use strict'

const fs = require('fs')
const path = require('path')
const { spawnSync } = require('child_process')

const DEFAULT_OUT = process.env.INVENTORY_OUT || '/var/www/mcp/inventory.json'

function main() {
  const result = {
    generatedAt: new Date().toISOString(),
    source: null,
    servers: [],
    unparsed: [],
    errors: [],
  }

  try {
    const { text, source } = loadNginxT()
    result.source = source
    if (!text || !String(text).trim()) {
      result.errors.push('nginx -T 출력이 비어 있습니다.')
      writeInventorySafe(result)
      printReport(result)
      process.exitCode = 1
      return
    }

    const { servers, unparsed } = parseNginxT(text)
    result.servers = servers
    result.unparsed = unparsed
  } catch (e) {
    result.errors.push(String(e && e.stack ? e.stack : e))
  }

  try {
    writeInventorySafe(result)
  } catch (e) {
    result.errors.push(`inventory 쓰기 실패: ${e.message || e}`)
    console.error(`[error] inventory 쓰기 실패: ${e.message || e}`)
  }

  try {
    printReport(result)
  } catch (e) {
    console.error(`[error] 리포트 출력 실패: ${e.message || e}`)
  }

  if (result.errors.length) process.exitCode = 1
}

function loadNginxT() {
  // 1) 파일 / 파이프
  try {
    if (process.env.NGINX_T_FILE) {
      const p = process.env.NGINX_T_FILE
      return { text: fs.readFileSync(p, 'utf8'), source: `file:${p}` }
    }
  } catch (e) {
    console.error(`[warn] NGINX_T_FILE 읽기 실패: ${e.message || e}`)
  }

  try {
    if (!process.stdin.isTTY) {
      const text = fs.readFileSync(0, 'utf8')
      if (text && text.trim()) return { text, source: 'stdin' }
    }
  } catch (e) {
    console.error(`[warn] stdin 읽기 실패: ${e.message || e}`)
  }

  // 2) nginx -T
  const attempts = [
    { cmd: 'nginx', args: ['-T'], label: 'nginx -T' },
    { cmd: 'sudo', args: ['nginx', '-T'], label: 'sudo nginx -T' },
  ]

  const failures = []
  for (const a of attempts) {
    try {
      const r = spawnSync(a.cmd, a.args, {
        encoding: 'utf8',
        maxBuffer: 64 * 1024 * 1024,
      })
      const text = `${r.stdout || ''}${r.stderr || ''}`
      // nginx -T 는 설정을 stdout, 진단 메시지를 stderr에 섞을 수 있음
      if (r.status === 0 && /server\s*\{/.test(text)) {
        return { text, source: a.label }
      }
      failures.push({
        label: a.label,
        status: r.status,
        error: r.error ? String(r.error.message || r.error) : null,
        hint: (r.stderr || '').split('\n').slice(0, 5).join(' | '),
      })
    } catch (e) {
      failures.push({ label: a.label, error: String(e.message || e) })
    }
  }

  console.error('')
  console.error('════════════════════════════════════════════════════════')
  console.error('  nginx -T 를 실행할 수 없습니다.')
  console.error('  sudo 가 필요하면 아래처럼 실행하세요:')
  console.error('')
  console.error('    sudo nginx -T 2>/tmp/nginx-T.err | tee /tmp/nginx-T.txt \\')
  console.error('      | node common/scripts/nginx-inventory.js')
  console.error('')
  console.error('  또는:')
  console.error('    sudo nginx -T > /tmp/nginx-T.txt 2>&1')
  console.error('    NGINX_T_FILE=/tmp/nginx-T.txt node common/scripts/nginx-inventory.js')
  console.error('════════════════════════════════════════════════════════')
  for (const f of failures) {
    console.error(`  - ${f.label}: status=${f.status} ${f.error || ''} ${f.hint || ''}`)
  }
  console.error('')

  return { text: '', source: 'unavailable' }
}

/**
 * nginx -T 전체 텍스트에서 server { ... } 블록 추출
 * # configuration file PATH: 주석으로 파일 경로 추적
 */
function parseNginxT(text) {
  const servers = []
  const unparsed = []
  const lines = String(text).split(/\r?\n/)

  let currentFile = null
  let i = 0

  while (i < lines.length) {
    try {
      const line = lines[i]
      const fileMark = line.match(/^#\s*configuration file\s+(.+?):\s*$/i)
      if (fileMark) {
        currentFile = fileMark[1].trim()
        i += 1
        continue
      }

      // server { 시작 (같은 줄에 내용이 더 있을 수 있음)
      const serverOpen = line.match(/^(\s*)server\s*\{(.*)$/)
      if (!serverOpen) {
        i += 1
        continue
      }

      const startLine = i + 1 // 1-based
      const startFile = currentFile
      const collected = [line]
      let depth = 1
      // 같은 줄에 server { ... } 가 닫히는 경우
      const sameRest = serverOpen[2] || ''
      depth += (sameRest.match(/\{/g) || []).length
      depth -= (sameRest.match(/\}/g) || []).length

      i += 1
      while (i < lines.length && depth > 0) {
        const l = lines[i]
        collected.push(l)
        // 주석 제거 후 브레이스 카운트 (단순화: # 이후 무시)
        const code = l.replace(/(^|[^\\])#.*$/, '$1')
        depth += (code.match(/\{/g) || []).length
        depth -= (code.match(/\}/g) || []).length
        i += 1
      }

      const raw = collected.join('\n')
      if (depth !== 0) {
        unparsed.push({
          reason: 'unbalanced_braces',
          configFile: startFile,
          line: startLine,
          raw,
        })
        continue
      }

      try {
        const entries = parseServerBlock(raw, startFile, startLine)
        if (!entries.length) {
          unparsed.push({
            reason: 'empty_parse',
            configFile: startFile,
            line: startLine,
            raw,
          })
        } else {
          for (const e of entries) servers.push(e)
        }
      } catch (e) {
        unparsed.push({
          reason: `parse_error: ${e.message || e}`,
          configFile: startFile,
          line: startLine,
          raw,
        })
      }
    } catch (e) {
      unparsed.push({
        reason: `loop_error: ${e.message || e}`,
        configFile: currentFile,
        line: i + 1,
        raw: lines[i] || '',
      })
      i += 1
    }
  }

  return { servers, unparsed }
}

function stripComment(line) {
  // "..." 또는 '...' 안의 # 은 유지 (단순 스캐너)
  let out = ''
  let quote = null
  for (let i = 0; i < line.length; i++) {
    const ch = line[i]
    if (quote) {
      out += ch
      if (ch === quote && line[i - 1] !== '\\') quote = null
      continue
    }
    if (ch === '"' || ch === "'") {
      quote = ch
      out += ch
      continue
    }
    if (ch === '#') break
    out += ch
  }
  return out.trim()
}

function parseServerBlock(raw, configFile, line) {
  const bodyLines = raw.split(/\r?\n/)
  // 최상위 server 직티브만 모으기 (location 내부 제외)
  const topDirectives = []
  let depth = 0
  for (let idx = 0; idx < bodyLines.length; idx++) {
    const code = stripComment(bodyLines[idx])
    if (!code) continue
    const opens = (code.match(/\{/g) || []).length
    const closes = (code.match(/\}/g) || []).length

    if (depth === 1) {
      // server 블록 직속 한 줄 디렉티브 (location { 시작 줄 제외하고 이름만)
      const loc = code.match(/^location\b/)
      if (!loc && !code.startsWith('server') && !/^\s*\{/.test(code)) {
        // `listen 443 ssl;` 형태
        const m = code.match(/^([a-zA-Z_][\w-]*)\s+(.+?);?\s*$/)
        if (m && !code.includes('{')) {
          topDirectives.push({ name: m[1], value: m[2].replace(/;\s*$/, '').trim(), lineOffset: idx })
        } else if (m && code.includes('{') && m[1] !== 'location' && m[1] !== 'if') {
          // rare: something { on same line at depth 1 — skip body
        }
      }
    }

    // proxy_pass / root 는 location 안에도 있을 수 있음 → 전체에서 별도 수집
    depth += opens
    depth -= closes
  }

  // 전체 raw에서 proxy_pass / root (첫 유효 값)
  const allProxy = []
  const allRoot = []
  const allListen = []
  const allServerNames = []
  let isDefault = false
  let hasSslListen = false

  depth = 0
  for (let idx = 0; idx < bodyLines.length; idx++) {
    const code = stripComment(bodyLines[idx])
    if (!code) continue
    const opens = (code.match(/\{/g) || []).length
    const closes = (code.match(/\}/g) || []).length

    const listenM = code.match(/^listen\s+(.+?);?\s*$/)
    if (listenM && depth === 1) {
      const v = listenM[1].replace(/;\s*$/, '').trim()
      allListen.push(v)
      if (/\bssl\b/i.test(v) || /\b443\b/.test(v)) hasSslListen = true
      if (/\bdefault_server\b/i.test(v)) isDefault = true
    }

    const snM = code.match(/^server_name\s+(.+?);?\s*$/)
    if (snM && depth === 1) {
      const names = tokenizeServerNames(snM[1].replace(/;\s*$/, '').trim())
      allServerNames.push(...names)
    }

    const rootM = code.match(/^root\s+(.+?);?\s*$/)
    if (rootM) {
      allRoot.push(rootM[1].replace(/;\s*$/, '').trim().replace(/^"|"$/g, ''))
    }

    const ppM = code.match(/^proxy_pass\s+(.+?);?\s*$/)
    if (ppM) {
      allProxy.push(ppM[1].replace(/;\s*$/, '').trim().replace(/;$/, ''))
    }

    // ssl on; (구형)
    if (depth === 1 && /^ssl\s+on\b/i.test(code)) hasSslListen = true

    depth += opens
    depth -= closes
  }

  // topDirectives 보강 (위에서 location 제외하고 모은 것)
  for (const d of topDirectives) {
    if (d.name === 'listen' && !allListen.includes(d.value)) allListen.push(d.value)
    if (d.name === 'server_name') {
      for (const n of tokenizeServerNames(d.value)) {
        if (!allServerNames.includes(n)) allServerNames.push(n)
      }
    }
  }

  const serverNames = unique(allServerNames.filter(Boolean))
  const root = allRoot[0] || null
  const upstream = allProxy[0] || null
  const ssl = hasSslListen || allListen.some((l) => /\bssl\b/i.test(l))
  const type = classifyType(upstream, root)
  const listen = allListen.map((v) => ({
    raw: v,
    port: extractPort(v),
    ssl: /\bssl\b/i.test(v) || /\b443\b/.test(v),
    default_server: /\bdefault_server\b/i.test(v),
  }))

  const hasWildcard = serverNames.some((n) => n.includes('*'))
  const hasRegex = serverNames.some((n) => n.startsWith('~'))
  const rootExists =
    root && !root.includes('$')
      ? (() => {
          try {
            return fs.existsSync(root)
          } catch {
            return null
          }
        })()
      : root
        ? null
        : null

  // 도메인별 엔트리 (예시 스키마는 domain 단수 — 멀티 server_name 은 각각 펼침)
  // "_" / 빈 값은 하나의 블록으로 유지
  const domains =
    serverNames.length > 0
      ? serverNames
      : ['_unnamed_']

  return domains.map((domain) => ({
    domain,
    serverNames,
    type,
    upstream,
    root,
    rootExists,
    ssl,
    isDefault,
    listen,
    hasWildcardServerName: hasWildcard || domain.includes('*'),
    hasRegexServerName: hasRegex || domain.startsWith('~'),
    isWildcard: domain.includes('*'),
    isRegex: domain.startsWith('~'),
    configFile: configFile || null,
    line,
    // 디버그/충돌 분석용
    listenRaw: allListen,
  }))
}

function tokenizeServerNames(value) {
  // 공백 구분. 따옴표 토큰 지원
  const out = []
  const re = /"([^"]+)"|'([^']+)'|(\S+)/g
  let m
  while ((m = re.exec(value))) {
    out.push(m[1] || m[2] || m[3])
  }
  return out.filter((n) => n && n !== ';')
}

function extractPort(listenValue) {
  try {
    // listen 443 ssl; listen [::]:443 ssl; listen 80 default_server;
    const v = listenValue.trim()
    const br = v.match(/\[:[^\]]*\]:(\d+)/)
    if (br) return Number(br[1])
    const m = v.match(/(?:^|\s)(\d{1,5})\b/)
    if (m) return Number(m[1])
    if (/\bhttps\b/i.test(v)) return 443
    if (/\bhttp\b/i.test(v) && !/\bhttps\b/i.test(v)) return 80
  } catch (_) {}
  return null
}

function classifyType(upstream, root) {
  if (upstream) return 'proxy'
  if (root) return 'static'
  return 'unknown'
}

function unique(arr) {
  const seen = new Set()
  const out = []
  for (const x of arr) {
    if (seen.has(x)) continue
    seen.add(x)
    out.push(x)
  }
  return out
}

function writeInventorySafe(result) {
  const outPath = DEFAULT_OUT
  // 요청 스키마: 최상위 배열. 캐치올 분석용 필드는 항목에 포함.
  const flat = (result.servers || []).map((s) => ({
    domain: s.domain,
    type: s.type,
    upstream: s.upstream,
    root: s.root,
    ssl: s.ssl,
    isDefault: s.isDefault,
    configFile: s.configFile,
    line: s.line,
    // 추가 (충돌 판단용)
    serverNames: s.serverNames,
    listen: s.listen,
    hasWildcardServerName: !!s.hasWildcardServerName,
    hasRegexServerName: !!s.hasRegexServerName,
    isWildcard: !!s.isWildcard,
    isRegex: !!s.isRegex,
    rootExists: s.rootExists,
  }))

  try {
    fs.mkdirSync(path.dirname(outPath), { recursive: true })
  } catch (e) {
    console.error(`[warn] mkdir ${path.dirname(outPath)}: ${e.message || e}`)
  }

  fs.writeFileSync(outPath, JSON.stringify(flat, null, 2) + '\n', 'utf8')

  // unparsed / 메타는 사이드카 (본문 배열 스키마 유지)
  const side = outPath.replace(/\.json$/i, '') + '.meta.json'
  try {
    fs.writeFileSync(
      side,
      JSON.stringify(
        {
          generatedAt: result.generatedAt,
          source: result.source,
          unparsed: result.unparsed || [],
          errors: result.errors || [],
          counts: {
            domains: flat.length,
            unparsed: (result.unparsed || []).length,
          },
        },
        null,
        2,
      ) + '\n',
      'utf8',
    )
  } catch (e) {
    console.error(`[warn] meta 쓰기 실패: ${e.message || e}`)
  }

  console.log(
    `[ok] wrote ${outPath} (${flat.length} domain entries) + ${side} (unparsed=${(result.unparsed || []).length})`,
  )
}

function printReport(result) {
  const servers = result.servers || []
  const unparsed = result.unparsed || []

  // 서버 블록 수 = (configFile, line) 유니크
  const blockKeys = new Set(servers.map((s) => `${s.configFile || '?'}::${s.line}`))
  const blockCount = blockKeys.size
  const domainCount = servers.length

  const byType = { proxy: 0, static: 0, unknown: 0 }
  for (const s of servers) {
    byType[s.type] = (byType[s.type] || 0) + 1
  }

  // default_server 블록 (블록 단위)
  const defaultBlocks = []
  const seenDef = new Set()
  for (const s of servers) {
    if (!s.isDefault) continue
    const k = `${s.configFile}::${s.line}`
    if (seenDef.has(k)) continue
    seenDef.add(k)
    defaultBlocks.push({
      configFile: s.configFile,
      line: s.line,
      serverNames: s.serverNames,
      domains: servers.filter((x) => x.configFile === s.configFile && x.line === s.line).map((x) => x.domain),
    })
  }

  // 정규식 server_name (~)
  const regexBlocks = []
  const seenRe = new Set()
  for (const s of servers) {
    if (!s.hasRegexServerName && !s.isRegex) continue
    const k = `${s.configFile}::${s.line}`
    if (seenRe.has(k)) continue
    seenRe.add(k)
    regexBlocks.push({
      configFile: s.configFile,
      line: s.line,
      regexNames: (s.serverNames || []).filter((n) => n.startsWith('~')),
      allNames: s.serverNames,
    })
  }

  // 와일드카드 (*)
  const wildcardBlocks = []
  const seenWc = new Set()
  for (const s of servers) {
    if (!s.hasWildcardServerName && !s.isWildcard) continue
    const k = `${s.configFile}::${s.line}`
    if (seenWc.has(k)) continue
    seenWc.add(k)
    wildcardBlocks.push({
      configFile: s.configFile,
      line: s.line,
      wildcardNames: (s.serverNames || []).filter((n) => n.includes('*')),
      allNames: s.serverNames,
    })
  }

  // root 미존재
  const missingRoot = []
  const seenRoot = new Set()
  for (const s of servers) {
    if (!s.root || s.rootExists !== false) continue
    const k = `${s.configFile}::${s.line}::${s.root}`
    if (seenRoot.has(k)) continue
    seenRoot.add(k)
    missingRoot.push({
      domain: s.domain,
      root: s.root,
      configFile: s.configFile,
      line: s.line,
    })
  }

  // 도메인 중복
  const domainMap = new Map()
  for (const s of servers) {
    if (!domainMap.has(s.domain)) domainMap.set(s.domain, [])
    domainMap.get(s.domain).push({
      configFile: s.configFile,
      line: s.line,
      type: s.type,
      ssl: s.ssl,
    })
  }
  const dupes = [...domainMap.entries()].filter(([, locs]) => locs.length > 1)

  console.log('')
  console.log('═══════════════ nginx inventory report ═══════════════')
  console.log(`source: ${result.source || 'n/a'}`)
  console.log(`1) 총 서버 블록 수: ${blockCount}  /  총 도메인 수: ${domainCount}`)
  console.log(`2) type별 집계: proxy=${byType.proxy}  static=${byType.static}  unknown=${byType.unknown}`)
  console.log(`   unparsed 블록: ${unparsed.length}`)
  if (result.errors && result.errors.length) {
    console.log(`   errors: ${result.errors.length}`)
    for (const err of result.errors.slice(0, 5)) console.log(`     - ${String(err).split('\n')[0]}`)
  }

  console.log('')
  console.log('3) default_server 블록:')
  if (!defaultBlocks.length) console.log('   (없음)')
  else {
    for (const b of defaultBlocks) {
      console.log(`   - ${b.configFile}:${b.line}  names=${JSON.stringify(b.serverNames)}`)
    }
  }

  console.log('')
  console.log('4) 정규식 server_name (~) 블록:  ← 캐치올 충돌 주의')
  if (!regexBlocks.length) console.log('   (없음)')
  else {
    for (const b of regexBlocks) {
      console.log(`   - ${b.configFile}:${b.line}`)
      console.log(`     regex: ${JSON.stringify(b.regexNames)}`)
    }
  }

  console.log('')
  console.log('4b) 와일드카드 server_name (*) 블록:  ← 캐치올 충돌 주의')
  if (!wildcardBlocks.length) console.log('   (없음)')
  else {
    for (const b of wildcardBlocks) {
      console.log(`   - ${b.configFile}:${b.line}`)
      console.log(`     wildcards: ${JSON.stringify(b.wildcardNames)}`)
    }
  }

  console.log('')
  console.log('5) root 경로가 존재하지 않는 블록:')
  if (!missingRoot.length) console.log('   (없음)')
  else {
    for (const b of missingRoot.slice(0, 50)) {
      console.log(`   - ${b.domain}  root=${b.root}  @ ${b.configFile}:${b.line}`)
    }
    if (missingRoot.length > 50) console.log(`   ... 외 ${missingRoot.length - 50}건`)
  }

  console.log('')
  console.log('6) 같은 도메인 중복 정의:')
  if (!dupes.length) console.log('   (없음)')
  else {
    for (const [domain, locs] of dupes.slice(0, 50)) {
      console.log(`   - ${domain}  (${locs.length}곳)`)
      for (const loc of locs) {
        console.log(`       ${loc.configFile}:${loc.line}  type=${loc.type} ssl=${loc.ssl}`)
      }
    }
    if (dupes.length > 50) console.log(`   ... 외 ${dupes.length - 50}개 도메인`)
  }

  console.log('════════════════════════════════════════════════════')
  console.log('')
}

if (require.main === module) {
  try {
    main()
  } catch (e) {
    console.error('[fatal]', e && e.stack ? e.stack : e)
    process.exitCode = 1
  }
}

module.exports = {
  parseNginxT,
  parseServerBlock,
  loadNginxT,
}
