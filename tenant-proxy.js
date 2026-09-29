const fs = require('fs')
const path = require('path')
const http = require('http')
const https = require('https')
const crypto = require('crypto')
const {
  injectLegalHtml,
  stripLegalHtml,
  shouldSkipLegalInjection,
  LEGAL_SKIP_TENANTS,
  tenantUsesServiceFooter,
} = require('./legal-info')

const HOME_NAV_LOADER = '<script src="https://edugame.restyart.com/edugame-home-nav.js?v=20260821e"></script>'
const HOME_NAV_MARKER = 'edugame-home-nav.js'
const EDUGAME_HOME_NAV_TENANTS = (() => {
  try {
    return new Set(
      fs.readFileSync(path.join(__dirname, 'edugame-home-nav-hosts.txt'), 'utf8')
        .split(/\r?\n/)
        .map((host) => host.trim().toLowerCase().split('.')[0])
        .filter(Boolean),
    )
  } catch (_) {
    return new Set()
  }
})()

function injectEdugameHomeNav(html, name) {
  if (!EDUGAME_HOME_NAV_TENANTS.has(String(name || '').toLowerCase()) || html.includes(HOME_NAV_MARKER)) return html
  if (/<\/head\s*>/i.test(html)) return html.replace(/<\/head\s*>/i, `\n${HOME_NAV_LOADER}\n</head>`)
  return `${html}\n${HOME_NAV_LOADER}\n`
}

function maybeInjectLegal(html, name, fileHint) {
  if (LEGAL_SKIP_TENANTS.has(name) || tenantUsesServiceFooter(name)) {
    return stripLegalHtml(html)
  }
  const base = String(fileHint || '')
    .split(/[\\/]/)
    .pop()
    .toLowerCase()
  // iframe/임베드·풀스크린 맵은 부모와 푸터가 겹치므로 주입하지 않음
  if (
    base === 'gonchung-nara.html' ||
    base === 'game.html' ||
    ((base === 'map.html' || base === 'explore.html') && name === 'insect') ||
    /data-resty-embed=["']1["']/i.test(html || '')
  ) {
    return stripLegalHtml(html)
  }
  const stripped = stripLegalHtml(html)
  if (shouldSkipLegalInjection(stripped)) return stripped
  return injectLegalHtml(stripped, name)
}

function tenantPathPrefix(name) {
  return `/${encodeURIComponent(name)}`
}

const SUBDOMAIN_HOST_SKIP = new Set(['app', 'www', 'dashboard'])

function isDashboardHost(host) {
  const h = (host || '').split(':')[0].toLowerCase()
  return h === 'dashboard.restyart.com'
}

/** light.restyart.com → light */
function tenantSlugFromHost(host) {
  const h = (host || '').split(':')[0].toLowerCase()
  const m = h.match(/^([a-z0-9_-]+)\.restyart\.com$/)
  if (!m) return null
  const slug = m[1]
  if (SUBDOMAIN_HOST_SKIP.has(slug)) return null
  return slug
}

/** 서브도메인(light.restyart.com) 배포 HTML의 /{tenant}/ 경로를 루트(/)로 변환 */
function stripPathPrefixForSubdomain(html, name) {
  if (!html || !name) return html
  const p = `/${name}`
  const esc = p.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
  html = html.replace(new RegExp(`(["'(])${esc}/`, 'g'), '$1/')
  html = html.replace(new RegExp(`"assetPrefix":"${esc}"`, 'g'), '"assetPrefix":""')
  html = html.replace(new RegExp(`'assetPrefix':'${esc}'`, 'g'), "'assetPrefix':''")
  return html
}

function resolvePrefix(name, prefixStyle) {
  if (prefixStyle === 'subdomain') return '/'
  if (prefixStyle === 'legacy') return `/r/${encodeURIComponent(name)}`
  return tenantPathPrefix(name)
}

function shouldPrefixUrl(url, prefix) {
  if (!url || typeof url !== 'string') return false
  if (url.indexOf(prefix) === 0) return false
  if (url.indexOf('http:') === 0 || url.indexOf('https:') === 0 || url.indexOf('//') === 0) return false
  if (url.indexOf('/api/') === 0) return false
  if (url.charAt(0) !== '/') return false
  return true
}

function rewriteAbsolutePaths(html, name, prefixStyle) {
  if (!html) return html
  const prefix = prefixStyle === 'legacy'
    ? `/r/${encodeURIComponent(name)}`
    : tenantPathPrefix(name)

  html = html.replace(/(src|href)=(["'])\/(?!\/|https?:)([^"']*)\2/gi, (m, attr, q, p) => {
    const fullPath = '/' + p
    if (!shouldPrefixUrl(fullPath, prefix)) return m
    return `${attr}=${q}${prefix}/${p}${q}`
  })
  html = html.replace(/url\((['"]?)\/(?!\/|https?:)([^)"']*)\1\)/gi, (m, q, p) => {
    const fullPath = '/' + p
    if (!shouldPrefixUrl(fullPath, prefix)) return m
    return `url(${q}${prefix}/${p}${q})`
  })
  return html
}

function injectClientPrefixScript(html, name, prefixStyle) {
  if (!html || html.indexOf('data-dashboard-prefix-script') !== -1) return html
  const prefix = prefixStyle === 'legacy'
    ? `/r/${encodeURIComponent(name)}`
    : tenantPathPrefix(name)
  const script = `\n<script data-dashboard-prefix-script>\n(function(){\n  try{\n    var prefix = '${prefix}';\n    function shouldPrefix(u){\n      try{ if(!u || typeof u !== 'string') return false; if(u.indexOf(prefix) === 0) return false; if(u.indexOf('http:') === 0 || u.indexOf('https:') === 0 || u.indexOf('//') === 0) return false; if(u.indexOf('/api/') === 0) return false; return u.charAt(0) === '/'; }catch(e){return false}\n    }\n    function withPrefix(u){ return prefix + (u.charAt(0) === '/' ? u : '/' + u); }\n    function rewriteAnchors(root){\n      try{ (root||document).querySelectorAll && Array.prototype.forEach.call((root||document).querySelectorAll('a[href]'), function(a){ try{ var h = a.getAttribute('href'); if(shouldPrefix(h)) a.setAttribute('href', withPrefix(h)); }catch(e){} }); }catch(e){}\n    }\n    function patchHistory(){\n      try{\n        var nativePush = history.pushState.bind(history);\n        var nativeReplace = history.replaceState.bind(history);\n        history.pushState = function(s,t,u){ try{ if(typeof u === 'string' && shouldPrefix(u)) u = withPrefix(u); }catch(e){} return nativePush(s,t,u); };\n        history.replaceState = function(s,t,u){ try{ if(typeof u === 'string' && shouldPrefix(u)) u = withPrefix(u); }catch(e){} return nativeReplace(s,t,u); };\n      }catch(e){}\n    }\n    function interceptClicks(e){\n      try{\n        var a = e.target && e.target.closest && e.target.closest('a[href]');\n        if(!a) return;\n        var h = a.getAttribute('href');\n        if(!shouldPrefix(h)) return;\n        e.preventDefault();\n        e.stopPropagation();\n        e.stopImmediatePropagation();\n        window.location.assign(withPrefix(h));\n        return false;\n      }catch(e){}\n    }\n    function boot(){\n      rewriteAnchors();\n      patchHistory();\n      document.addEventListener('click', interceptClicks, true);\n    }\n    if(document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot); else boot();\n    try{ var n=0,t=setInterval(function(){ patchHistory(); rewriteAnchors(); }, 250); window.addEventListener('beforeunload', function(){ try{ clearInterval(t); }catch(e){} }); }catch(e){}\n    try{ var mo = new MutationObserver(function(recs){ for(var i=0;i<recs.length;i++){ var r = recs[i]; for(var j=0;j<r.addedNodes.length;j++){ var nd = r.addedNodes[j]; if(nd && nd.querySelectorAll) rewriteAnchors(nd); } } }); mo.observe(document, { childList:true, subtree:true }); }catch(e){}\n    window.addEventListener('popstate', function(){ try{ if(shouldPrefix(location.pathname)) location.replace(withPrefix(location.pathname)+location.search+location.hash); }catch(e){} });\n    try{ if(window.fetch){ const _fetch = window.fetch.bind(window); window.fetch = function(input, init){ try{ if(typeof input === 'string'){ if(shouldPrefix(input)) input = withPrefix(input) } else if(input && input.url && typeof input.url === 'string'){ if(shouldPrefix(input.url)) input = new Request(withPrefix(input.url), input) } }catch(e){} return _fetch(input, init); } } }catch(e){}\n    try{ var XH = window.XMLHttpRequest && window.XMLHttpRequest.prototype; if(XH && XH.open){ const _open = XH.open; XH.open = function(method, url){ try{ if(typeof url === 'string' && shouldPrefix(url)) arguments[1] = withPrefix(url) }catch(e){} return _open.apply(this, arguments); } } }catch(e){}\n  }catch(e){}\n})();\n</script>\n`
  return html.replace(/<\/head>/i, script + '</head>')
}

/** light: 구절 셸(john/3/16.html)을 다른 절 URL에 재사용할 때 canonical/title을 URL에 맞춤 */
function injectBibleVerseRouteMeta(html, reqPath) {
  if (!html) return html
  const clean = (reqPath || '').split('?')[0].replace(/\/$/, '')
  const match = clean.match(/^\/bible\/([^/]+)\/(\d+)\/(\d+)$/)
  if (!match) return html
  const [, book, chapter, verse] = match
  const pathUrl = `/bible/${book}/${chapter}/${verse}`
  html = html.replace(
    /(rel=["']canonical["'][^>]*href=["'])([^"']+)(["'])/i,
    (_, a, href, c) => {
      try {
        const u = new URL(href, 'https://light.restyart.com')
        u.pathname = pathUrl
        return `${a}${u.toString()}${c}`
      } catch {
        return `${a}${pathUrl}${c}`
      }
    },
  )
  html = html.replace(
    /(property=["']og:url["'][^>]*content=["'])([^"']+)(["'])/i,
    (_, a, href, c) => {
      try {
        const u = new URL(href, 'https://light.restyart.com')
        u.pathname = pathUrl
        return `${a}${u.toString()}${c}`
      } catch {
        return `${a}${pathUrl}${c}`
      }
    },
  )
  // "요한복음 3:16" / "3장 16절" → URL 절 번호 (셸 잔여 텍스트)
  html = html.replace(/(\d+)장\s*16절/g, `$1장 ${verse}절`)
  html = html.replace(/(\d+):16\b/g, `$1:${verse}`)
  html = html.replace(/\/bible\/([^/]+)\/(\d+)\/16(?=["'/])/g, `/bible/$1/$2/${verse}`)
  const script = `<script data-light-verse-route>window.__LIGHT_VERSE__=${JSON.stringify({
    book,
    chapter: Number(chapter),
    verse: Number(verse),
  })};</script>`
  if (html.indexOf('data-light-verse-route') !== -1) {
    return html.replace(/<script data-light-verse-route>[\s\S]*?<\/script>/, script)
  }
  return html.replace(/<\/head>/i, `\n${script}\n</head>`)
}

/** qbox: URL 질문 ID를 주입. 셸에 다른 질문 데이터가 있으면 ID만 맞추고 stale blob 제거 */
function injectQuestionRouteId(html, reqPath) {
  if (!html) return html
  const clean = (reqPath || '').split('?')[0].replace(/\/$/, '')
  const match = clean.match(/^\/question\/([^/]+)$/)
  if (!match) return html
  const questionId = match[1]
  const script = `<script data-qbox-question-id>window.__QBOX_QUESTION_ID__=${JSON.stringify(questionId)};try{delete window.__QBOX_INITIAL_QUESTION__}catch(e){window.__QBOX_INITIAL_QUESTION__=undefined}</script>`

  if (html.indexOf('data-qbox-question-id') !== -1) {
    return html.replace(/<script data-qbox-question-id>[\s\S]*?<\/script>/, script)
  }
  return html.replace(/<\/head>/i, `\n${script}\n</head>`)
}

/** arc: /insights/2 → 정적 셸에도 URL의 글 ID 주입 */
function injectInsightRouteId(html, reqPath) {
  if (!html || html.indexOf('data-arc-insight-id') !== -1) return html
  const clean = (reqPath || '').split('?')[0].replace(/\/$/, '')
  const match = clean.match(/^\/insights\/(\d+)$/)
  if (!match) return html
  const insightId = match[1]
  const script = `\n<script data-arc-insight-id>window.__ARC_INSIGHT_ID__=${JSON.stringify(insightId)};</script>\n`
  return html.replace(/<\/head>/i, script + '</head>')
}

/** arc: /admin/books/10 → 정적 셸에도 URL의 도서 ID 주입 */
function injectAdminBookRouteId(html, reqPath) {
  if (!html || html.indexOf('data-arc-admin-book-id') !== -1) return html
  const clean = (reqPath || '').split('?')[0].replace(/\/$/, '')
  const match = clean.match(/^\/admin\/books\/(\d+)$/)
  if (!match) return html
  const bookId = match[1]
  const script = `\n<script data-arc-admin-book-id>window.__ARC_ADMIN_BOOK_ID__=${JSON.stringify(bookId)};</script>\n`
  return html.replace(/<\/head>/i, script + '</head>')
}

/** arc: /book/10 → 정적 셸에도 URL의 도서 ID 주입 */
function injectBookRouteId(html, reqPath) {
  if (!html || html.indexOf('data-arc-book-id') !== -1) return html
  const clean = (reqPath || '').split('?')[0].replace(/\/$/, '')
  const match = clean.match(/^\/book\/(\d+)$/)
  if (!match) return html
  const bookId = match[1]
  const script = `\n<script data-arc-book-id>window.__ARC_BOOK_ID__=${JSON.stringify(bookId)};</script>\n`
  return html.replace(/<\/head>/i, script + '</head>')
}

/** arc: /viewer/10 → 정적 셸에도 URL의 도서 ID 주입 */
function injectViewerRouteId(html, reqPath) {
  if (!html || html.indexOf('data-arc-viewer-id') !== -1) return html
  const clean = (reqPath || '').split('?')[0].replace(/\/$/, '')
  const match = clean.match(/^\/viewer\/(\d+)$/)
  if (!match) return html
  const bookId = match[1]
  const script = `\n<script data-arc-viewer-id>window.__ARC_VIEWER_ID__=${JSON.stringify(bookId)};</script>\n`
  return html.replace(/<\/head>/i, script + '</head>')
}

function escapeHtmlAttr(value) {
  return String(value ?? '')
    .replace(/&/g, '&amp;')
    .replace(/"/g, '&quot;')
    .replace(/</g, '&lt;')
}

function arcSiteBase(name, prefixStyle) {
  if (prefixStyle === 'subdomain') {
    return (process.env.PUBLISH_SITE_URL || `https://${name}.restyart.com`).replace(/\/$/, '')
  }
  const gateway = (process.env.PUBLISH_GATEWAY_URL || 'https://app.restyart.com').replace(/\/$/, '')
  return `${gateway}/${encodeURIComponent(name)}`
}

function absoluteArcAsset(siteBase, url) {
  if (!url) return `${siteBase}/og-image.jpg`
  if (/^https?:\/\//i.test(url)) return url
  return `${siteBase}${url.startsWith('/') ? url : `/${url}`}`
}

function fetchArcBookMeta(bookId, tenantName) {
  const backend = (process.env.RESTY_API_BACKEND || 'http://127.0.0.1:5001').replace(/\/$/, '')
  let targetUrl
  try {
    targetUrl = new URL(`/api/arc/books/${bookId}`, backend)
  } catch (_) {
    return Promise.resolve(null)
  }
  const lib = targetUrl.protocol === 'https:' ? https : http
  return new Promise((resolve) => {
    const req = lib.request(
      {
        hostname: targetUrl.hostname,
        port: targetUrl.port || (targetUrl.protocol === 'https:' ? 443 : 80),
        path: targetUrl.pathname,
        method: 'GET',
        headers: { 'x-subdomain': tenantName },
      },
      (res) => {
        let data = ''
        res.on('data', (chunk) => { data += chunk })
        res.on('end', () => {
          try {
            const json = JSON.parse(data)
            resolve(json.book || null)
          } catch (_) {
            resolve(null)
          }
        })
      },
    )
    req.on('error', () => resolve(null))
    req.setTimeout(3000, () => {
      req.destroy()
      resolve(null)
    })
    req.end()
  })
}

function injectViewerSeoMeta(html, book, bookId, name, prefixStyle) {
  if (!html || !book || html.indexOf('data-arc-viewer-seo') !== -1) return html
  const siteBase = arcSiteBase(name, prefixStyle)
  const viewerUrl = `${siteBase}/viewer/${bookId}`
  const pageTitle = `${book.title} | 인사이트 아크`
  const description = (
    book.subtitle ||
    (book.description || '').replace(/\s+/g, ' ').trim() ||
    `${book.title} — 인사이트 아크 전자책 웹 뷰어`
  ).slice(0, 200)
  const image = absoluteArcAsset(siteBase, book.coverUrl)

  html = html.replace(/<title>[^<]*<\/title>/i, `<title>${escapeHtmlAttr(pageTitle)}</title>`)
  html = html.replace(/<meta[^>]+name=["']description["'][^>]*>/gi, '')
  html = html.replace(/<meta[^>]+property=["']og:title["'][^>]*>/gi, '')
  html = html.replace(/<meta[^>]+property=["']og:description["'][^>]*>/gi, '')
  html = html.replace(/<meta[^>]+property=["']og:url["'][^>]*>/gi, '')
  html = html.replace(/<meta[^>]+property=["']og:image["'][^>]*>/gi, '')
  html = html.replace(/<meta[^>]+name=["']twitter:title["'][^>]*>/gi, '')
  html = html.replace(/<meta[^>]+name=["']twitter:description["'][^>]*>/gi, '')
  html = html.replace(/<meta[^>]+name=["']twitter:image["'][^>]*>/gi, '')
  html = html.replace(/<link[^>]+rel=["']canonical["'][^>]*>/gi, '')

  const metaBlock = `
<meta data-arc-viewer-seo="1" />
<meta name="description" content="${escapeHtmlAttr(description)}" />
<meta property="og:title" content="${escapeHtmlAttr(book.title)}" />
<meta property="og:description" content="${escapeHtmlAttr(description)}" />
<meta property="og:url" content="${escapeHtmlAttr(viewerUrl)}" />
<meta property="og:site_name" content="인사이트 아크" />
<meta property="og:type" content="article" />
<meta property="og:image" content="${escapeHtmlAttr(image)}" />
<meta name="twitter:card" content="summary_large_image" />
<meta name="twitter:title" content="${escapeHtmlAttr(book.title)}" />
<meta name="twitter:description" content="${escapeHtmlAttr(description)}" />
<meta name="twitter:image" content="${escapeHtmlAttr(image)}" />
<link rel="canonical" href="${escapeHtmlAttr(viewerUrl)}" />
`
  return html.replace(/<\/head>/i, `${metaBlock}</head>`)
}

function injectBookSeoMeta(html, book, bookId, name, prefixStyle) {
  if (!html || !book || html.indexOf('data-arc-book-seo') !== -1) return html
  const siteBase = arcSiteBase(name, prefixStyle)
  const bookUrl = `${siteBase}/book/${bookId}`
  const pageTitle = `${book.title} | 인사이트 아크`
  const description = (
    book.subtitle ||
    (book.description || '').replace(/\s+/g, ' ').trim() ||
    `${book.title} — 인사이트 아크 전자책`
  ).slice(0, 200)
  const image = absoluteArcAsset(siteBase, book.coverUrl)

  html = html.replace(/<title>[^<]*<\/title>/i, `<title>${escapeHtmlAttr(pageTitle)}</title>`)
  html = html.replace(/<meta[^>]+name=["']description["'][^>]*>/gi, '')
  html = html.replace(/<meta[^>]+property=["']og:title["'][^>]*>/gi, '')
  html = html.replace(/<meta[^>]+property=["']og:description["'][^>]*>/gi, '')
  html = html.replace(/<meta[^>]+property=["']og:url["'][^>]*>/gi, '')
  html = html.replace(/<meta[^>]+property=["']og:image["'][^>]*>/gi, '')
  html = html.replace(/<meta[^>]+name=["']twitter:title["'][^>]*>/gi, '')
  html = html.replace(/<meta[^>]+name=["']twitter:description["'][^>]*>/gi, '')
  html = html.replace(/<meta[^>]+name=["']twitter:image["'][^>]*>/gi, '')
  html = html.replace(/<link[^>]+rel=["']canonical["'][^>]*>/gi, '')

  const metaBlock = `
<meta data-arc-book-seo="1" />
<meta name="description" content="${escapeHtmlAttr(description)}" />
<meta property="og:title" content="${escapeHtmlAttr(book.title)}" />
<meta property="og:description" content="${escapeHtmlAttr(description)}" />
<meta property="og:url" content="${escapeHtmlAttr(bookUrl)}" />
<meta property="og:site_name" content="인사이트 아크" />
<meta property="og:type" content="book" />
<meta property="og:image" content="${escapeHtmlAttr(image)}" />
<meta name="twitter:card" content="summary_large_image" />
<meta name="twitter:title" content="${escapeHtmlAttr(book.title)}" />
<meta name="twitter:description" content="${escapeHtmlAttr(description)}" />
<meta name="twitter:image" content="${escapeHtmlAttr(image)}" />
<link rel="canonical" href="${escapeHtmlAttr(bookUrl)}" />
`
  return html.replace(/<\/head>/i, `${metaBlock}</head>`)
}

/** wonder: /story/my-story-id → 정적 셸에도 URL의 동화 ID 주입 */
function injectWonderStoryRouteId(html, reqPath) {
  if (!html || html.indexOf('data-wonder-story-id') !== -1) return html
  const clean = (reqPath || '').split('?')[0].replace(/\/$/, '')
  const match = clean.match(/^\/story\/([^/]+)$/)
  if (!match) return html
  const storyId = decodeURIComponent(match[1])
  const script = `\n<script data-wonder-story-id>window.__WONDER_STORY_ID__=${JSON.stringify(storyId)};</script>\n`
  return html.replace(/<\/head>/i, script + '</head>')
}

/** career: /schools/school-id → 정적 셸에도 URL의 학교 ID 주입 */
function injectCareerSchoolRouteId(html, reqPath) {
  if (!html || html.indexOf('data-career-school-id') !== -1) return html
  const clean = (reqPath || '').split('?')[0].replace(/\/$/, '')
  const match = clean.match(/^\/schools\/([^/]+)$/)
  if (!match) return html
  const schoolId = decodeURIComponent(match[1])
  const script = `\n<script data-career-school-id>window.__CAREER_SCHOOL_ID__=${JSON.stringify(schoolId)};</script>\n`
  return html.replace(/<\/head>/i, script + '</head>')
}

/** career: /community/444 → 목록 community.html 폴백 방지용 셸에 게시글 ID 주입 */
function injectCareerCommunityPostRouteId(html, reqPath) {
  if (!html || html.indexOf('data-career-community-post-id') !== -1) return html
  const clean = (reqPath || '').split('?')[0].replace(/\/$/, '')
  const match = clean.match(/^\/community\/(\d+)$/)
  if (!match) return html
  const postId = match[1]
  const script = `\n<script data-career-community-post-id>window.__CAREER_COMMUNITY_POST_ID__=${JSON.stringify(postId)};</script>\n`
  return html.replace(/<\/head>/i, script + '</head>')
}

/** growup: /community/posts/425 → 정적 셸에도 URL의 게시글 ID 주입 */
function injectGrowupCommunityPostRouteId(html, reqPath) {
  if (!html || html.indexOf('data-growup-community-post-id') !== -1) return html
  const clean = (reqPath || '').split('?')[0].replace(/\/$/, '')
  const match = clean.match(/^\/community\/posts\/(\d+)$/)
  if (!match) return html
  const postId = match[1]
  const script = `\n<script data-growup-community-post-id>window.__GROWUP_COMMUNITY_POST_ID__=${JSON.stringify(postId)};</script>\n`
  return html.replace(/<\/head>/i, script + '</head>')
}

/**
 * vibecommunity/hotfeel 등: /post/671 → 없는 정적 HTML일 때 최신 셸(예: 614.html)로 폴백됨.
 * 셸에 박힌 post id / flight tree / canonical 을 URL id 로 맞추고 클라이언트가 읽을 수 있게 주입.
 */
function injectPostRouteId(html, reqPath) {
  if (!html) return html
  const clean = (reqPath || '').split('?')[0].replace(/\/$/, '')
  const match = clean.match(/^\/post\/(\d+)$/)
  if (!match) return html
  const postId = match[1]

  const shellMatch =
    html.match(/urlParts\\":\[\\"\\"\s*,\s*\\"post\\"\s*,\s*\\"(\d+)\\"\]/) ||
    html.match(/"urlParts":\["","post","(\d+)"\]/) ||
    html.match(/\/post\/(\d+)/)
  const shellId = shellMatch && shellMatch[1]
  if (shellId && shellId !== postId) {
    html = html
      .split(`/post/${shellId}`).join(`/post/${postId}`)
      .split(`\\"post\\",\\"${shellId}\\"`).join(`\\"post\\",\\"${postId}\\"`)
      .split(`"post","${shellId}"`).join(`"post","${postId}"`)
      .split(`[\\"id\\",\\"${shellId}\\",\\"d\\"]`).join(`[\\"id\\",\\"${postId}\\",\\"d\\"]`)
      .split(`["id","${shellId}","d"]`).join(`["id","${postId}","d"]`)
  }

  const script = `<script data-resty-post-id>window.__RESTY_POST_ID__=${JSON.stringify(postId)};</script>`
  if (html.indexOf('data-resty-post-id') !== -1) {
    return html.replace(/<script data-resty-post-id>[\s\S]*?<\/script>/, script)
  }
  return html.replace(/<\/head>/i, `\n${script}\n</head>`)
}

function finalizeHtml(html, reqPath, name, prefixStyle, fileHint) {
  html = prepareHtml(html, name, prefixStyle, fileHint)
  html = injectBibleVerseRouteMeta(html, reqPath)
  html = injectQuestionRouteId(html, reqPath)
  html = injectBookRouteId(html, reqPath)
  html = injectInsightRouteId(html, reqPath)
  html = injectAdminBookRouteId(html, reqPath)
  html = injectViewerRouteId(html, reqPath)
  html = injectWonderStoryRouteId(html, reqPath)
  html = injectCareerSchoolRouteId(html, reqPath)
  html = injectCareerCommunityPostRouteId(html, reqPath)
  html = injectGrowupCommunityPostRouteId(html, reqPath)
  html = injectPostRouteId(html, reqPath)
  return html
}

function serveArcViewerHtml(html, reqPath, res, name, prefixStyle, bookId) {
  const base = finalizeHtml(html, reqPath, name, prefixStyle)
  fetchArcBookMeta(bookId, name)
    .then((book) => {
      let out = base
      if (book) out = injectViewerSeoMeta(out, book, bookId, name, prefixStyle)
      sendHtml(res, out, name)
    })
    .catch(() => sendHtml(res, base, name))
}

function serveArcBookHtml(html, reqPath, res, name, prefixStyle, bookId) {
  const base = finalizeHtml(html, reqPath, name, prefixStyle)
  fetchArcBookMeta(bookId, name)
    .then((book) => {
      let out = base
      if (book) out = injectBookSeoMeta(out, book, bookId, name, prefixStyle)
      sendHtml(res, out, name)
    })
    .catch(() => sendHtml(res, base, name))
}

function prepareHtml(html, name, prefixStyle, fileHint) {
  if (prefixStyle === 'subdomain') {
    html = stripPathPrefixForSubdomain(html, name)
    if (/<base[^>]*href=/i.test(html)) {
      html = html.replace(/<base[^>]*>/i, '<base href="/">')
    } else {
      html = html.replace(/<head([^>]*)>/i, `<head$1>\n<base href="/">`)
    }
    html = injectEdugameHomeNav(html, name)
    html = maybeInjectLegal(html, name, fileHint)
    return html
  }

  const prefix = prefixStyle === 'legacy'
    ? `/r/${encodeURIComponent(name)}`
    : tenantPathPrefix(name)
  const baseHref = `${prefix}/`

  const published = new RegExp(`data-resty-tenant=["']${name}["']`, 'i').test(html)
  if (!published) {
    if (html.indexOf(`href="${prefix}/`) === -1 && html.indexOf(`href='${prefix}/`) === -1) {
      html = rewriteAbsolutePaths(html, name, prefixStyle)
    }
    if (!/<base[^>]*href=/i.test(html)) {
      html = html.replace(/<head([^>]*)>/i, `<head$1>\n<base href="${baseHref}">`)
    } else {
      html = html.replace(/<base[^>]*>/i, `<base href="${baseHref}">`)
    }
  }

  html = injectClientPrefixScript(html, name, prefixStyle)
  html = injectEdugameHomeNav(html, name)
  html = maybeInjectLegal(html, name, fileHint)
  return html
}

function buildLightCsp(nonce) {
  return [
    "default-src 'self'",
    `script-src 'self' 'nonce-${nonce}' https://edugame.restyart.com https://www.googletagmanager.com https://www.google-analytics.com`,
    "style-src 'self' 'unsafe-inline'",
    "img-src 'self' data: blob: https:",
    "font-src 'self' data:",
    "connect-src 'self' https://app.restyart.com https://www.google-analytics.com https://region1.google-analytics.com https://stats.g.doubleclick.net",
    "frame-src 'self'",
    "object-src 'none'",
    "base-uri 'self'",
    "form-action 'self'",
    "frame-ancestors 'self'",
    'upgrade-insecure-requests',
  ].join('; ')
}

function applyTenantSecurityHeaders(res, html, name) {
  if (name !== 'light') return String(html || '')

  const nonce = crypto.randomBytes(16).toString('base64')
  res.setHeader('content-security-policy', buildLightCsp(nonce))

  return String(html || '').replace(/<script\b(?![^>]*\bnonce=)/gi, `<script nonce="${nonce}"`)
}

function sendHtml(res, html, name) {
  const securedHtml = applyTenantSecurityHeaders(res, html, name)
  res.setHeader('content-type', 'text/html; charset=utf-8')
  res.send(securedHtml)
}

/** 서브도메인에서 /{tenant}/bible/... 중복 prefix 제거 */
function normalizeTenantReqPath(reqPath, name, prefixStyle) {
  let clean = (reqPath || '/').split('?')[0]
  if (prefixStyle === 'subdomain' && name) {
    const tenantPrefix = `/${name}`
    if (clean === tenantPrefix || clean === `${tenantPrefix}/`) {
      clean = '/'
    } else if (clean.startsWith(`${tenantPrefix}/`)) {
      clean = clean.slice(tenantPrefix.length) || '/'
    }
  }
  return clean
}

function findBibleVerseShell(staticRoot, book, chapter) {
  const verseDir = path.join(staticRoot, 'bible', book, chapter)
  if (fs.existsSync(verseDir) && fs.statSync(verseDir).isDirectory()) {
    const shells = fs.readdirSync(verseDir).filter((f) => /^\d+\.html$/.test(f))
    if (shells.length > 0) {
      return path.join(verseDir, shells[0])
    }
  }
  const fallback = path.join(staticRoot, 'bible', 'john', '3', '16.html')
  if (fs.existsSync(fallback) && fs.statSync(fallback).isFile()) {
    return fallback
  }
  return null
}

/** Next.js redirect-only index (static export) → dashboard.html 폴백 */
function resolveBrokenIndexFallback(staticRoot, filePath) {
  if (!filePath || !filePath.endsWith(`${path.sep}index.html`)) return filePath
  try {
    const html = fs.readFileSync(filePath, 'utf8')
    if (html.includes('__next_error__') && html.includes('NEXT_REDIRECT')) {
      const dash = path.join(staticRoot, 'dashboard.html')
      if (fs.existsSync(dash) && fs.statSync(dash).isFile()) return dash
    }
  } catch (_) {}
  return filePath
}

/** Resolve Next.js flat export: /store -> store.html */
function resolveStaticPath(staticRoot, reqPath) {
  const clean = (reqPath || '/').split('?')[0]
  if (!clean || clean === '/') {
    const file = resolveBrokenIndexFallback(staticRoot, path.join(staticRoot, 'index.html'))
    return { file, isHtml: true }
  }

  const rel = clean.replace(/^\//, '').replace(/\/$/, '')

  const direct = path.join(staticRoot, rel)
  if (fs.existsSync(direct) && fs.statSync(direct).isFile()) {
    return { file: direct, isHtml: /\.html?$/i.test(clean) }
  }

  const asHtml = path.join(staticRoot, `${rel}.html`)
  if (fs.existsSync(asHtml) && fs.statSync(asHtml).isFile()) {
    return { file: asHtml, isHtml: true }
  }

  // Next.js may emit %XX filenames while HTTP paths arrive decoded (e.g. church/은총교회)
  const encodedRel = rel.split('/').map((seg) => {
    try {
      return encodeURIComponent(decodeURIComponent(seg))
    } catch (_) {
      return seg
    }
  }).join('/')
  if (encodedRel !== rel) {
    const asHtmlEncoded = path.join(staticRoot, `${encodedRel}.html`)
    if (fs.existsSync(asHtmlEncoded) && fs.statSync(asHtmlEncoded).isFile()) {
      return { file: asHtmlEncoded, isHtml: true }
    }
  }

  const indexInDir = path.join(staticRoot, rel, 'index.html')
  if (fs.existsSync(indexInDir) && fs.statSync(indexInDir).isFile()) {
    return { file: indexInDir, isHtml: true }
  }

  // /bible/john/3/16 — 구절 HTML 또는 셸
  const bibleVerseMatch = clean.match(/^\/bible\/([^/]+)\/(\d+)\/(\d+)$/)
  if (bibleVerseMatch) {
    const [, book, chapter, verse] = bibleVerseMatch
    const specific = path.join(staticRoot, 'bible', book, chapter, `${verse}.html`)
    if (fs.existsSync(specific) && fs.statSync(specific).isFile()) {
      return { file: specific, isHtml: true }
    }
    const shell = findBibleVerseShell(staticRoot, book, chapter)
    if (shell) return { file: shell, isHtml: true }
    const chapterHtml = path.join(staticRoot, 'bible', book, `${chapter}.html`)
    if (fs.existsSync(chapterHtml) && fs.statSync(chapterHtml).isFile()) {
      return { file: chapterHtml, isHtml: true }
    }
  }

  // /manage/123 — 전자책 관리 (arc)
  const manageMatch = clean.replace(/\/$/, '').match(/^\/manage\/(\d+)$/)
  if (manageMatch) {
    const manageId = manageMatch[1]
    const specific = path.join(staticRoot, 'manage', `${manageId}.html`)
    if (fs.existsSync(specific) && fs.statSync(specific).isFile()) {
      return { file: specific, isHtml: true }
    }
    const manageDir = path.join(staticRoot, 'manage')
    if (fs.existsSync(manageDir) && fs.statSync(manageDir).isDirectory()) {
      const shells = fs.readdirSync(manageDir).filter((f) => /^\d+\.html$/.test(f))
      if (shells.length > 0) {
        return { file: path.join(manageDir, shells.sort((a, b) => Number(b) - Number(a))[0]), isHtml: true }
      }
    }
    const viewerShell = path.join(staticRoot, 'viewer', '1.html')
    if (fs.existsSync(viewerShell)) {
      return { file: viewerShell, isHtml: true }
    }
  }

  // /viewer/123 — 전자책 웹 뷰어 (arc)
  const viewerMatch = clean.replace(/\/$/, '').match(/^\/viewer\/(\d+)$/)
  if (viewerMatch) {
    const viewerId = viewerMatch[1]
    const specific = path.join(staticRoot, 'viewer', `${viewerId}.html`)
    if (fs.existsSync(specific) && fs.statSync(specific).isFile()) {
      return { file: specific, isHtml: true }
    }
    const viewerDir = path.join(staticRoot, 'viewer')
    if (fs.existsSync(viewerDir) && fs.statSync(viewerDir).isDirectory()) {
      const shells = fs.readdirSync(viewerDir).filter((f) => /^\d+\.html$/.test(f))
      if (shells.length > 0) {
        return { file: path.join(viewerDir, shells.sort((a, b) => Number(b) - Number(a))[0]), isHtml: true }
      }
    }
    const createShell = path.join(staticRoot, 'create.html')
    if (fs.existsSync(createShell)) {
      return { file: createShell, isHtml: true }
    }
  }

  // /insights/123 — 인사이트 상세 (arc)
  const insightMatch = clean.replace(/\/$/, '').match(/^\/insights\/(\d+)$/)
  if (insightMatch) {
    const insightId = insightMatch[1]
    const specific = path.join(staticRoot, 'insights', `${insightId}.html`)
    if (fs.existsSync(specific) && fs.statSync(specific).isFile()) {
      return { file: specific, isHtml: true }
    }
    const insightsShell = path.join(staticRoot, 'insights.html')
    if (fs.existsSync(insightsShell) && fs.statSync(insightsShell).isFile()) {
      return { file: insightsShell, isHtml: true }
    }
  }

  // /admin/books/123 — 관리자 도서 편집 (arc)
  const adminBookMatch = clean.replace(/\/$/, '').match(/^\/admin\/books\/(\d+)$/)
  if (adminBookMatch) {
    const bookId = adminBookMatch[1]
    const specific = path.join(staticRoot, 'admin', 'books', `${bookId}.html`)
    if (fs.existsSync(specific) && fs.statSync(specific).isFile()) {
      return { file: specific, isHtml: true }
    }
    const adminBooksShell = path.join(staticRoot, 'admin', 'books.html')
    if (fs.existsSync(adminBooksShell) && fs.statSync(adminBooksShell).isFile()) {
      return { file: adminBooksShell, isHtml: true }
    }
  }

  // /book/123 — 전자책 상세 (arc). 정적 HTML 없을 때 book/*.html 셸 사용
  const bookMatch = clean.replace(/\/$/, '').match(/^\/book\/(\d+)$/)
  if (bookMatch) {
    const bookId = bookMatch[1]
    const specific = path.join(staticRoot, 'book', `${bookId}.html`)
    if (fs.existsSync(specific) && fs.statSync(specific).isFile()) {
      return { file: specific, isHtml: true }
    }
    const bookDir = path.join(staticRoot, 'book')
    if (fs.existsSync(bookDir) && fs.statSync(bookDir).isDirectory()) {
      const shells = fs.readdirSync(bookDir).filter((f) => /^\d+\.html$/.test(f))
      if (shells.length > 0) {
        return { file: path.join(bookDir, shells.sort((a, b) => Number(b) - Number(a))[0]), isHtml: true }
      }
    }
  }

  // /community/posts/425 — growup 커뮤니티 게시글 상세. community.html 목록 폴백 방지
  const growupPostMatch = clean.replace(/\/$/, '').match(/^\/community\/posts\/(\d+)$/)
  if (growupPostMatch) {
    const postId = growupPostMatch[1]
    const specific = path.join(staticRoot, 'community', 'posts', `${postId}.html`)
    if (fs.existsSync(specific) && fs.statSync(specific).isFile()) {
      return { file: specific, isHtml: true }
    }
    const postsDir = path.join(staticRoot, 'community', 'posts')
    if (fs.existsSync(postsDir) && fs.statSync(postsDir).isDirectory()) {
      const shells = fs.readdirSync(postsDir)
        .filter((f) => /^\d+\.html$/.test(f))
      if (shells.length > 0) {
        return { file: path.join(postsDir, shells.sort((a, b) => Number(b) - Number(a))[0]), isHtml: true }
      }
    }
  }

  // /community/category/general — sports 포럼 카테고리. community.html 목록 폴백 방지
  const sportsCategoryMatch = clean.replace(/\/$/, '').match(/^\/community\/category\/([^/]+)$/)
  if (sportsCategoryMatch) {
    const categoryId = sportsCategoryMatch[1]
    const specific = path.join(staticRoot, 'community', 'category', `${categoryId}.html`)
    if (fs.existsSync(specific) && fs.statSync(specific).isFile()) {
      return { file: specific, isHtml: true }
    }
    const categoryDir = path.join(staticRoot, 'community', 'category')
    if (fs.existsSync(categoryDir) && fs.statSync(categoryDir).isDirectory()) {
      const shells = fs.readdirSync(categoryDir).filter((f) => f.endsWith('.html'))
      if (shells.length > 0) {
        return { file: path.join(categoryDir, shells[0]), isHtml: true }
      }
    }
  }

  // /schools/slug — 학교 상세 (career). schools.html 목록 폴백 방지
  const careerSchoolMatch = clean.replace(/\/$/, '').match(/^\/schools\/([^/]+)$/)
  if (careerSchoolMatch) {
    const schoolId = careerSchoolMatch[1]
    const specific = path.join(staticRoot, 'schools', `${schoolId}.html`)
    if (fs.existsSync(specific) && fs.statSync(specific).isFile()) {
      return { file: specific, isHtml: true }
    }
    const schoolDir = path.join(staticRoot, 'schools')
    if (fs.existsSync(schoolDir) && fs.statSync(schoolDir).isDirectory()) {
      const shells = fs.readdirSync(schoolDir)
        .filter((f) => f.endsWith('.html') && f !== 'page.html')
      if (shells.length > 0) {
        return { file: path.join(schoolDir, shells[0]), isHtml: true }
      }
    }
  }

  // /community/444 — career 커뮤니티 상세. community.html 목록 폴백 방지 (new 제외)
  const careerCommunityMatch = clean.replace(/\/$/, '').match(/^\/community\/(\d+)$/)
  if (careerCommunityMatch) {
    const postId = careerCommunityMatch[1]
    const specific = path.join(staticRoot, 'community', `${postId}.html`)
    if (fs.existsSync(specific) && fs.statSync(specific).isFile()) {
      return { file: specific, isHtml: true }
    }
    const communityDir = path.join(staticRoot, 'community')
    if (fs.existsSync(communityDir) && fs.statSync(communityDir).isDirectory()) {
      const shells = fs.readdirSync(communityDir)
        .filter((f) => /^\d+\.html$/.test(f))
        .sort((a, b) => Number(b.replace('.html', '')) - Number(a.replace('.html', '')))
      if (shells.length > 0) {
        return { file: path.join(communityDir, shells[0]), isHtml: true }
      }
    }
  }

  // /story/slug — 동화 상세 (wonder). 개별 HTML 없을 때 story/*.html 셸 사용
  const storyMatch = clean.replace(/\/$/, '').match(/^\/story\/([^/]+)$/)
  if (storyMatch) {
    const storyId = storyMatch[1]
    const specific = path.join(staticRoot, 'story', `${storyId}.html`)
    if (fs.existsSync(specific) && fs.statSync(specific).isFile()) {
      return { file: specific, isHtml: true }
    }
    const storyDir = path.join(staticRoot, 'story')
    if (fs.existsSync(storyDir) && fs.statSync(storyDir).isDirectory()) {
      const shells = fs.readdirSync(storyDir)
        .filter((f) => f.endsWith('.html') && f !== 'page.html')
      if (shells.length > 0) {
        return { file: path.join(storyDir, shells[0]), isHtml: true }
      }
    }
  }

  // /post/420 — 게시글 상세 (hotfeel 등). 목록 HTML 폴백 방지
  const postMatch = clean.match(/^\/post\/(\d+)$/)
  if (postMatch) {
    const specific = path.join(staticRoot, `post/${postMatch[1]}.html`)
    if (fs.existsSync(specific) && fs.statSync(specific).isFile()) {
      return { file: specific, isHtml: true }
    }
    const postDir = path.join(staticRoot, 'post')
    if (fs.existsSync(postDir) && fs.statSync(postDir).isDirectory()) {
      const shells = fs.readdirSync(postDir)
        .filter((f) => /^\d+\.html$/.test(f))
        .sort((a, b) => Number(b.replace('.html', '')) - Number(a.replace('.html', '')))
      if (shells.length > 0) {
        return { file: path.join(postDir, shells[0]), isHtml: true }
      }
    }
  }

  // /content/slug — 콘텐츠 상세 (mind 등). content.html 목록 폴백 방지
  const contentSlugMatch = clean.match(/^\/content\/([^/]+)$/)
  if (contentSlugMatch) {
    const slug = contentSlugMatch[1]
    const specific = path.join(staticRoot, 'content', `${slug}.html`)
    if (fs.existsSync(specific) && fs.statSync(specific).isFile()) {
      return { file: specific, isHtml: true }
    }
    const contentDir = path.join(staticRoot, 'content')
    if (fs.existsSync(contentDir) && fs.statSync(contentDir).isDirectory()) {
      const shells = fs.readdirSync(contentDir)
        .filter((f) => f.endsWith('.html') && f !== 'page.html')
      if (shells.length > 0) {
        return { file: path.join(contentDir, shells[0]), isHtml: true }
      }
    }
  }

  // /company/3 — 기업 상세 (linker 등). index.html 홈 폴백 방지
  const companyMatch = clean.replace(/\/$/, '').match(/^\/company\/([^/]+)$/)
  if (companyMatch) {
    const companyId = companyMatch[1]
    const specific = path.join(staticRoot, 'company', `${companyId}.html`)
    if (fs.existsSync(specific) && fs.statSync(specific).isFile()) {
      return { file: specific, isHtml: true }
    }
    const companyDir = path.join(staticRoot, 'company')
    if (fs.existsSync(companyDir) && fs.statSync(companyDir).isDirectory()) {
      const shells = fs.readdirSync(companyDir)
        .filter((f) => /^\d+\.html$/.test(f))
        .sort((a, b) => Number(b.replace('.html', '')) - Number(a.replace('.html', '')))
      if (shells.length > 0) {
        return { file: path.join(companyDir, shells[0]), isHtml: true }
      }
    }
  }

  // /question/q_1 — 질문 상세 (qbox 등). questions.html 목록 폴백 방지
  const questionMatch = clean.replace(/\/$/, '').match(/^\/question\/([^/]+)$/)
  if (questionMatch) {
    const questionId = questionMatch[1]
    const specific = path.join(staticRoot, 'question', `${questionId}.html`)
    if (fs.existsSync(specific) && fs.statSync(specific).isFile()) {
      return { file: specific, isHtml: true }
    }
    const questionDir = path.join(staticRoot, 'question')
    if (fs.existsSync(questionDir) && fs.statSync(questionDir).isDirectory()) {
      const shells = fs.readdirSync(questionDir)
        .filter((f) => f.endsWith('.html') && f !== 'page.html')
      if (shells.length > 0) {
        return { file: path.join(questionDir, shells[0]), isHtml: true }
      }
    }
  }

  // /article/241 등 — 개별 HTML 없을 때 article/*.html 셸 사용 (index.html 홈 폴백 방지)
  const articleMatch = clean.match(/^\/article\/(\d+)$/)
  if (articleMatch) {
    const specific = path.join(staticRoot, `article/${articleMatch[1]}.html`)
    if (fs.existsSync(specific) && fs.statSync(specific).isFile()) {
      return { file: specific, isHtml: true }
    }
    const articleDir = path.join(staticRoot, 'article')
    if (fs.existsSync(articleDir) && fs.statSync(articleDir).isDirectory()) {
      const shells = fs.readdirSync(articleDir)
        .filter((f) => /^\d+\.html$/.test(f))
        .sort((a, b) => Number(b.replace('.html', '')) - Number(a.replace('.html', '')))
      if (shells.length > 0) {
        return { file: path.join(articleDir, shells[0]), isHtml: true }
      }
    }
  }

  // 중첩 경로 — 상위 .html 탐색 (/foo/bar/baz -> foo/bar.html, foo/bar/baz.html)
  if (rel.includes('/')) {
    const parts = rel.split('/')
    for (let i = parts.length; i >= 1; i--) {
      const candidate = path.join(staticRoot, ...parts.slice(0, i)) + '.html'
      if (fs.existsSync(candidate) && fs.statSync(candidate).isFile()) {
        return { file: candidate, isHtml: true }
      }
    }
  }

  // 동적 라우트(qt/[id] 등) — HTML 없을 때 SPA 셸로 클라이언트 라우팅
  if (!/\.[a-z0-9]+$/i.test(clean) && !clean.includes('_next') && !clean.startsWith('/api/')) {
    const idx = path.join(staticRoot, 'index.html')
    if (fs.existsSync(idx)) return { file: idx, isHtml: true }
  }

  return null
}

function tryServeStaticFile(staticRoot, reqPath, res, name, prefixStyle) {
  const resolved = resolveStaticPath(staticRoot, reqPath)
  if (!resolved) return false

  if (resolved.isHtml) {
    const html = fs.readFileSync(resolved.file, 'utf8')
    const viewerMatch = (reqPath || '').split('?')[0].replace(/\/$/, '').match(/^\/viewer\/(\d+)$/)
    if (name === 'arc' && viewerMatch) {
      serveArcViewerHtml(html, reqPath, res, name, prefixStyle, viewerMatch[1])
      return true
    }
    const bookMatch = (reqPath || '').split('?')[0].replace(/\/$/, '').match(/^\/book\/(\d+)$/)
    if (name === 'arc' && bookMatch) {
      serveArcBookHtml(html, reqPath, res, name, prefixStyle, bookMatch[1])
      return true
    }
    sendHtml(res, finalizeHtml(html, reqPath, name, prefixStyle, resolved.file), name)
    return true
  }

  res.sendFile(resolved.file)
  return true
}

function tryServeIndexHtml(staticRoot, name, prefixStyle, res, reqPath, accepts) {
  const p = reqPath || '/'
  if (p !== '/' && p !== '') return false
  const idx = resolveBrokenIndexFallback(staticRoot, path.join(staticRoot, 'index.html'))
  if (!fs.existsSync(idx)) return false
  let html = fs.readFileSync(idx, 'utf8')
  html = prepareHtml(html, name, prefixStyle)
  sendHtml(res, html, name)
  return true
}

function findAssembledIndex(root) {
  return [
    path.join(root, 'public', 'index.html'),
    path.join(root, 'out', 'index.html'),
    path.join(root, 'index.html'),
    path.join(root, 'app', 'index.html'),
    path.join(root, 'pages', 'index.html'),
  ]
}

function handleTenantRequest(opts) {
  const {
    req, res, name, prefixStyle, publicDir, copiesDir, procMap, proxy,
  } = opts

  const rawPath = decodeURIComponent((req.url || '/').split('?')[0])
  const reqPath = normalizeTenantReqPath(rawPath, name, prefixStyle)
  const accepts = req.headers.accept || ''

  const staticRoot = path.join(publicDir, name)
  if (fs.existsSync(staticRoot) && fs.statSync(staticRoot).isDirectory()) {
    try {
      if (tryServeStaticFile(staticRoot, reqPath, res, name, prefixStyle)) return
      if (tryServeIndexHtml(staticRoot, name, prefixStyle, res, reqPath, accepts)) return
    } catch (e) {
      return res.status(500).send('Server error')
    }
  }

  const assembledPublic = path.join(copiesDir, name, 'public')
  if (fs.existsSync(assembledPublic) && fs.statSync(assembledPublic).isDirectory()) {
    try {
      if (tryServeStaticFile(assembledPublic, reqPath, res, name, prefixStyle)) return
      if (tryServeIndexHtml(assembledPublic, name, prefixStyle, res, reqPath, accepts)) return
    } catch (e) {
      return res.status(500).send('Server error')
    }
  }

  try {
    const root = path.join(copiesDir, name)
    for (const c of findAssembledIndex(root)) {
      if (fs.existsSync(c) && fs.statSync(c).isFile()) {
        let html = fs.readFileSync(c, 'utf8')
        html = prepareHtml(html, name, prefixStyle)
        return sendHtml(res, html, name)
      }
    }
  } catch (_) {}

  const info = procMap && procMap[name]
  if (!info) {
    return res.status(404).send(
      `프론트가 배포되지 않았습니다. common/public/${name}/ 에 빌드 결과가 없습니다.\n` +
      `배포: cd common && ./publish.sh ${name}`
    )
  }

  try {
    const urlPrefix = prefixStyle === 'legacy'
      ? `/r/${name}`
      : tenantPathPrefix(name)
    const originalUrl = req.url || ''
    if (originalUrl.startsWith(urlPrefix)) {
      req.url = originalUrl.slice(urlPrefix.length) || '/'
    }
  } catch (_) {}

  const target = `http://127.0.0.1:${info.port}`
  try { req._dashboard_name = name } catch (_) {}
  try { req._dashboard_prefix_style = prefixStyle } catch (_) {}
  try {
    req.headers = req.headers || {}
    req.headers['x-dashboard-name'] = name
    req.headers['x-tenant'] = name
    req.headers['x-subdomain'] = name
  } catch (_) {}

  proxy.web(req, res, { target, selfHandleResponse: true }, (err) => {
    console.error('proxy error', err)
    res.status(502).send('Bad gateway')
  })
}

module.exports = {
  tenantPathPrefix,
  tenantSlugFromHost,
  isDashboardHost,
  stripPathPrefixForSubdomain,
  normalizeTenantReqPath,
  resolvePrefix,
  rewriteAbsolutePaths,
  injectClientPrefixScript,
  prepareHtml,
  resolveStaticPath,
  handleTenantRequest,
}
