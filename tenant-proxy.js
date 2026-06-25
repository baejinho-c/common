const fs = require('fs')
const path = require('path')
const { injectLegalHtml } = require('./legal-info')

/** 독립 사이트(교회 등) — 리스티아트 사업자 푸터 미주입 */
const LEGAL_SKIP_TENANTS = new Set(['wookwang', 'portfolio', 'goodprice'])

function maybeInjectLegal(html, name) {
  if (LEGAL_SKIP_TENANTS.has(name)) return html
  return injectLegalHtml(html, name)
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
  const script = `\n<script data-dashboard-prefix-script>\n(function(){\n  try{\n    var prefix = '${prefix}';\n    function shouldPrefix(u){\n      try{ if(!u || typeof u !== 'string') return false; if(u.indexOf(prefix) === 0) return false; if(u.indexOf('http:') === 0 || u.indexOf('https:') === 0 || u.indexOf('//') === 0) return false; if(u.indexOf('/api/') === 0) return false; return u.charAt(0) === '/'; }catch(e){return false}\n    }\n    function withPrefix(u){ return prefix + (u.charAt(0) === '/' ? u : '/' + u); }\n    function rewriteAnchors(root){\n      try{ (root||document).querySelectorAll && Array.prototype.forEach.call((root||document).querySelectorAll('a[href]'), function(a){ try{ var h = a.getAttribute('href'); if(shouldPrefix(h)) a.setAttribute('href', withPrefix(h)); }catch(e){} }); }catch(e){}\n    }\n    function patchHistory(){\n      try{\n        var nativePush = history.pushState.bind(history);\n        var nativeReplace = history.replaceState.bind(history);\n        history.pushState = function(s,t,u){ try{ if(typeof u === 'string' && shouldPrefix(u)) u = withPrefix(u); }catch(e){} return nativePush(s,t,u); };\n        history.replaceState = function(s,t,u){ try{ if(typeof u === 'string' && shouldPrefix(u)) u = withPrefix(u); }catch(e){} return nativeReplace(s,t,u); };\n      }catch(e){}\n    }\n    function interceptClicks(e){\n      try{\n        var a = e.target && e.target.closest && e.target.closest('a[href]');\n        if(!a) return;\n        var h = a.getAttribute('href');\n        if(!shouldPrefix(h)) return;\n        e.preventDefault();\n        e.stopPropagation();\n        e.stopImmediatePropagation();\n        window.location.assign(withPrefix(h));\n        return false;\n      }catch(e){}\n    }\n    function boot(){\n      rewriteAnchors();\n      patchHistory();\n      document.addEventListener('click', interceptClicks, true);\n    }\n    if(document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot); else boot();\n    try{ var n=0,t=setInterval(function(){ patchHistory(); rewriteAnchors(); if(++n>100) clearInterval(t); }, 50); }catch(e){}\n    try{ var mo = new MutationObserver(function(recs){ for(var i=0;i<recs.length;i++){ var r = recs[i]; for(var j=0;j<r.addedNodes.length;j++){ var nd = r.addedNodes[j]; if(nd && nd.querySelectorAll) rewriteAnchors(nd); } } }); mo.observe(document, { childList:true, subtree:true }); }catch(e){}\n    window.addEventListener('popstate', function(){ try{ if(shouldPrefix(location.pathname)) location.replace(withPrefix(location.pathname)+location.search+location.hash); }catch(e){} });\n    try{ if(window.fetch){ const _fetch = window.fetch.bind(window); window.fetch = function(input, init){ try{ if(typeof input === 'string'){ if(shouldPrefix(input)) input = withPrefix(input) } else if(input && input.url && typeof input.url === 'string'){ if(shouldPrefix(input.url)) input = new Request(withPrefix(input.url), input) } }catch(e){} return _fetch(input, init); } } }catch(e){}\n    try{ var XH = window.XMLHttpRequest && window.XMLHttpRequest.prototype; if(XH && XH.open){ const _open = XH.open; XH.open = function(method, url){ try{ if(typeof url === 'string' && shouldPrefix(url)) arguments[1] = withPrefix(url) }catch(e){} return _open.apply(this, arguments); } } }catch(e){}\n  }catch(e){}\n})();\n</script>\n`
  return html.replace(/<\/head>/i, script + '</head>')
}

function prepareHtml(html, name, prefixStyle) {
  if (prefixStyle === 'subdomain') {
    html = stripPathPrefixForSubdomain(html, name)
    if (/<base[^>]*href=/i.test(html)) {
      html = html.replace(/<base[^>]*>/i, '<base href="/">')
    } else {
      html = html.replace(/<head([^>]*)>/i, `<head$1>\n<base href="/">`)
    }
    html = maybeInjectLegal(html, name)
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
  html = maybeInjectLegal(html, name)
  return html
}

function sendHtml(res, html) {
  res.setHeader('content-type', 'text/html; charset=utf-8')
  res.send(html)
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

/** Resolve Next.js flat export: /store -> store.html */
function resolveStaticPath(staticRoot, reqPath) {
  const clean = (reqPath || '/').split('?')[0]
  if (!clean || clean === '/') return { file: path.join(staticRoot, 'index.html'), isHtml: true }

  const rel = clean.replace(/^\//, '').replace(/\/$/, '')

  const direct = path.join(staticRoot, rel)
  if (fs.existsSync(direct) && fs.statSync(direct).isFile()) {
    return { file: direct, isHtml: /\.html?$/i.test(clean) }
  }

  const asHtml = path.join(staticRoot, `${rel}.html`)
  if (fs.existsSync(asHtml) && fs.statSync(asHtml).isFile()) {
    return { file: asHtml, isHtml: true }
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

  // /question/q_1 — 질문 상세 (qbox 등). questions.html 목록 폴백 방지
  const questionMatch = clean.match(/^\/question\/([^/]+)$/)
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
    let html = fs.readFileSync(resolved.file, 'utf8')
    html = prepareHtml(html, name, prefixStyle)
    sendHtml(res, html)
    return true
  }

  res.sendFile(resolved.file)
  return true
}

function tryServeIndexHtml(staticRoot, name, prefixStyle, res, reqPath, accepts) {
  const p = reqPath || '/'
  if (p !== '/' && p !== '') return false
  const idx = path.join(staticRoot, 'index.html')
  if (!fs.existsSync(idx)) return false
  let html = fs.readFileSync(idx, 'utf8')
  html = prepareHtml(html, name, prefixStyle)
  sendHtml(res, html)
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
        return sendHtml(res, html)
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
