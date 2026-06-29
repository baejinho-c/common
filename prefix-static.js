#!/usr/bin/env node
/**
 * Post-process published static HTML: prefix absolute paths with /{tenant}/
 * Usage: node prefix-static.js <publicDir> <tenant>
 */
const fs = require('fs')
const path = require('path')

const publicDir = process.argv[2]
const tenant = process.argv[3]
if (!publicDir || !tenant) {
  console.error('Usage: node prefix-static.js <publicDir> <tenant>')
  process.exit(1)
}

const prefix = `/${tenant}`
const SKIP_PREFIX = [`${prefix}/`, '/api/', '//', 'http:', 'https:', 'mailto:', 'tel:', '#']

function shouldPrefix(url) {
  if (!url || typeof url !== 'string') return false
  if (url.charAt(0) !== '/') return false
  // Next.js basePath 출력 등 이미 /{tenant} 로 시작하는 경로는 중복 prefix 방지
  if (url === prefix || url.indexOf(`${prefix}/`) === 0) return false
  for (const s of SKIP_PREFIX) {
    if (url.indexOf(s) === 0) return false
  }
  return true
}

function prefixUrl(url) {
  if (!shouldPrefix(url)) return url
  return prefix + url
}

function rewriteHtml(html) {
  html = html.replace(/(src|href)=(["'])\/(?!\/|https?:)([^"']*)\2/gi, (m, attr, q, p) => {
    const fullPath = '/' + p
    if (!shouldPrefix(fullPath)) return m
    return `${attr}=${q}${prefix}/${p}${q}`
  })

  html = html.replace(/url\((['"]?)\/(?!\/|https?:)([^)"']*)\1\)/gi, (m, q, p) => {
    const fullPath = '/' + p
    if (!shouldPrefix(fullPath)) return m
    return `url(${q}${prefix}/${p}${q})`
  })

  const baseHref = `${prefix}/`
  if (!/<base[^>]*href=/i.test(html)) {
    html = html.replace(/<head([^>]*)>/i, `<head$1>\n<base href="${baseHref}">`)
  } else {
    html = html.replace(/<base[^>]*>/i, `<base href="${baseHref}">`)
  }

  if (!/data-resty-tenant=/i.test(html)) {
    html = html.replace(/<html([^>]*)>/i, `<html$1 data-resty-tenant="${tenant}">`)
  }

  return html
}

function walk(dir) {
  let count = 0
  for (const ent of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, ent.name)
    if (ent.isDirectory()) {
      count += walk(full)
    } else if (ent.name.endsWith('.html') || ent.name.endsWith('.htm')) {
      const raw = fs.readFileSync(full, 'utf8')
      fs.writeFileSync(full, rewriteHtml(raw), 'utf8')
      count += 1
    }
  }
  return count
}

const n = walk(publicDir)
console.log(`[prefix-static] ${tenant}: rewrote ${n} html files in ${publicDir}`)
