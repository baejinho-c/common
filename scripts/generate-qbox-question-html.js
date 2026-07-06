#!/usr/bin/env node
/**
 * QBox 질문 상세 HTML 생성 — API 데이터를 셸에 주입
 * Usage: node common/scripts/generate-qbox-question-html.js [destDir]
 */
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const destRoot = path.resolve(process.argv[2] || path.join(__dirname, '../public/qbox'))
const API_BASE = process.env.NEXT_PUBLIC_API_BASE || 'https://app.restyart.com/api'
const SUBDOMAIN = 'qbox'
const SITE = 'https://qbox.restyart.com'

function findShellHtml() {
  const candidates = [
    path.join(destRoot, 'question', 'q_1.html'),
    path.join(destRoot, 'app', 'question', 'q_1.html'),
    path.join(destRoot, 'question', 'q_seo_1.html'),
  ]
  for (const p of candidates) {
    if (fs.existsSync(p)) return p
  }
  throw new Error('No question shell HTML found under ' + destRoot)
}

function escapeHtml(text) {
  return String(text || '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
}

function buildQuestion(post, answers) {
  return {
    id: String(post.id),
    title: post.title,
    content: post.content,
    summary: (() => {
      try {
        const meta = JSON.parse(post.meta_json || '{}')
        return meta.summary || undefined
      } catch {
        return undefined
      }
    })(),
    tags: (post.tags || []).map((t) => (typeof t === 'string' ? t : t.name)).filter(Boolean),
    author: {
      id: 'anonymous',
      name: post.anonymous_name || post.display_author || '익명',
      email: '',
      reputation: 0,
      createdAt: post.published_at || post.created_at,
    },
    createdAt: post.published_at || post.created_at,
    updatedAt: post.updated_at,
    views: (() => {
      try {
        return Number(JSON.parse(post.meta_json || '{}').views) || 0
      } catch {
        return 0
      }
    })(),
    likes: Number(post.likes_count) || 0,
    dislikes: 0,
    aiGenerated: false,
    answers: answers.map((c) => ({
      id: String(c.id),
      content: c.content,
      author: {
        id: 'anonymous',
        name: c.anonymous_name || c.display_author || '익명',
        email: '',
        reputation: 0,
        createdAt: c.created_at,
      },
      createdAt: c.created_at,
      likes: 0,
      dislikes: 0,
      isAccepted: Boolean(c.is_accepted),
      aiGenerated: /ai assistant/i.test(c.anonymous_name || ''),
    })),
  }
}

function buildSsrBlock(question) {
  const answersHtml = question.answers
    .filter((a) => a.content?.trim())
    .map(
      (a) =>
        `<article class="qbox-ssr-answer"><h2>답변</h2><p>${escapeHtml(a.author.name)}</p><div>${escapeHtml(a.content).replace(/\n/g, '<br/>')}</div></article>`,
    )
    .join('')

  return `<div id="qbox-ssr-question" data-qbox-ssr="1" style="max-width:48rem;margin:0 auto;padding:2rem 1rem;font-family:system-ui,sans-serif;line-height:1.6">
  <h1 style="font-size:1.5rem;font-weight:700;margin-bottom:1rem">${escapeHtml(question.title)}</h1>
  <p style="color:#6b7280;margin-bottom:1rem">${escapeHtml(question.author.name)} · ${escapeHtml(question.tags.join(', '))}</p>
  <div style="margin-bottom:2rem;white-space:pre-wrap">${escapeHtml(question.content)}</div>
  ${answersHtml}
</div>`
}

function patchShell(shell, post, answers) {
  const question = buildQuestion(post, answers)
  let html = shell
  const title = `${question.title} | QBox | QBox`
  const desc = (question.summary || question.content).replace(/\n+/g, ' ').slice(0, 160)
  const keywords = question.tags.join(', ') || 'QBox, 개발, Q&A'
  const canonical = `${SITE}/question/${question.id}/`

  html = html.replace(/<title>[^<]*<\/title>/, `<title>${escapeHtml(title)}</title>`)
  html = html.replace(
    /<meta name="description" content="[^"]*"/,
    `<meta name="description" content="${escapeHtml(desc)}"`,
  )
  html = html.replace(
    /<meta name="keywords" content="[^"]*"/,
    `<meta name="keywords" content="${escapeHtml(keywords)}"`,
  )
  html = html.replace(
    /<link rel="canonical" href="[^"]*"/,
    `<link rel="canonical" href="${canonical}"`,
  )
  html = html.replace(
    /<meta property="og:title" content="[^"]*"/,
    `<meta property="og:title" content="${escapeHtml(question.title)} | QBox"`,
  )
  html = html.replace(
    /<meta property="og:description" content="[^"]*"/,
    `<meta property="og:description" content="${escapeHtml(desc)}"`,
  )

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'QAPage',
    mainEntity: {
      '@type': 'Question',
      name: question.title,
      text: question.content,
      dateCreated: question.createdAt,
      author: { '@type': 'Person', name: question.author.name },
      url: `${SITE}/question/${question.id}`,
      suggestedAnswer: question.answers
        .filter((a) => a.content?.trim())
        .map((a) => ({
          '@type': 'Answer',
          text: a.content,
          dateCreated: a.createdAt,
          author: { '@type': 'Person', name: a.author.name },
        })),
    },
  }

  html = html.replace(
    /<script type="application\/ld\+json">[\s\S]*?<\/script>/,
    `<script type="application/ld+json">${JSON.stringify(jsonLd)}</script>`,
  )

  const payload = JSON.stringify(question).replace(/</g, '\\u003c')
  const injectScript = `<script data-qbox-question-id>window.__QBOX_QUESTION_ID__=${JSON.stringify(question.id)};window.__QBOX_INITIAL_QUESTION__=${payload};</script>`

  html = html.replace(/<script data-qbox-question-id>[\s\S]*?<\/script>/, injectScript)
  if (!html.includes('data-qbox-question-id')) {
    html = html.replace(/<\/head>/i, `\n${injectScript}</head>`)
  }

  // RSC payload: replace demo q_1 route + initialQuestion blob when present
  html = html.replace(/"c":\["","question","q_1",""\]/g, `"c":["","question",${JSON.stringify(question.id)},""]`)
  html = html.replace(/\["id","q_1","d"\]/g, `["id",${JSON.stringify(question.id)},"d"]`)
  html = html.replace(
    /"initialQuestion":\{"id":"q_1"[\s\S]*?"aiGenerated":true\}\]\}/,
    `"initialQuestion":${payload}]}`,
  )

  const ssrBlock = buildSsrBlock(question)
  html = html.replace(
    /<div class="min-h-screen bg-\[#f9fafb\]"><div class="animate-pulse">[\s\S]*?<\/div><\/div>/,
    ssrBlock,
  )

  return html
}

async function fetchJson(url) {
  const res = await fetch(url, { headers: { 'x-subdomain': SUBDOMAIN, Accept: 'application/json' } })
  if (!res.ok) throw new Error(`${url} -> ${res.status}`)
  return res.json()
}

async function main() {
  const shellPath = findShellHtml()
  const shell = fs.readFileSync(shellPath, 'utf8')
  const outDir = path.join(destRoot, 'question')
  fs.mkdirSync(outDir, { recursive: true })

  let page = 1
  let written = 0
  while (page <= 20) {
    const qs = new URLSearchParams({
      subdomain: SUBDOMAIN,
      status: 'published',
      page: String(page),
      pageSize: '100',
      isSns: 'true',
    })
    const data = await fetchJson(`${API_BASE}/posts?${qs}`)
    const items = data.items || []
    for (const post of items) {
      if (!post.id) continue
      const comments = await fetchJson(`${API_BASE}/posts/${post.id}/comments?subdomain=${SUBDOMAIN}&pageSize=20`)
      const html = patchShell(shell, post, comments.items || [])
      const out = path.join(outDir, `${post.id}.html`)
      fs.writeFileSync(out, html)
      written += 1
    }
    if (!data.hasMore) break
    page += 1
  }

  console.log(`[generate-qbox-question-html] wrote ${written} files -> ${outDir}`)
}

main().catch((e) => {
  console.error(e)
  process.exit(1)
})
