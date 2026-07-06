let allServices = []
let selectedSlug = null
let usageByTenant = {}
let usageTotals = null
let tenantAuditCache = {}
let myIp = localStorage.getItem('dashboard_my_ip') || ''

function usageQuery() {
  const days = document.getElementById('usage-days')?.value || '7'
  const exclude = document.getElementById('usage-exclude-me')?.checked && myIp
  const qs = new URLSearchParams({ days })
  if (exclude) qs.set('excludeIp', myIp)
  return qs.toString()
}

function tenantUsage(slug) {
  return usageByTenant[slug] || null
}

function compareByUsage(a, b) {
  const ua = tenantUsage(a.slug)?.totalCalls ?? 0
  const ub = tenantUsage(b.slug)?.totalCalls ?? 0
  if (ub !== ua) return ub - ua
  return a.slug.localeCompare(b.slug)
}

function renderUsageSummary() {
  const el = document.getElementById('usage-stats')
  const note = document.getElementById('usage-note')
  if (!el) return
  el.innerHTML = ''
  if (!usageTotals) {
    el.innerHTML = '<p style="color:var(--muted);margin:0">사용량 데이터 없음 (API 연결 대기 중)</p>'
    return
  }
  const t = usageTotals
  const items = [
    ['총 호출', t.totalCalls, ''],
    ['AI 호출', t.aiCalls, ''],
    ['API 호출', t.apiCalls, ''],
    ['활성 테넌트', t.activeTenants, ''],
    ['활성 유저', t.activeUsers, 'user_id 기준'],
    ['고유 IP', t.uniqueIps, ''],
    ['평균 응답', t.avgDurationMs ? `${t.avgDurationMs}ms` : '—', ''],
  ]
  for (const [label, val, sub] of items) {
    const d = document.createElement('div')
    d.className = 'usage-item'
    d.innerHTML = `<span>${label}</span><b>${val}</b>${sub ? `<small style="color:var(--muted)">${sub}</small>` : ''}`
    el.appendChild(d)
  }
  const topEl = document.getElementById('usage-top-endpoints')
  if (topEl && window.__topEndpoints?.length) {
    topEl.innerHTML = `<table class="usage-table"><thead><tr><th>엔드포인트</th><th>유형</th><th>호출</th></tr></thead><tbody>${window.__topEndpoints
      .slice(0, 10)
      .map((r) => `<tr><td>${escapeHtml(r.endpoint)}</td><td>${escapeHtml(r.category)}</td><td>${r.calls}</td></tr>`)
      .join('')}</tbody></table>`
  }
  if (note) {
    const ex = document.getElementById('usage-exclude-me')?.checked && myIp
    note.textContent = ex
      ? `최근 ${document.getElementById('usage-days')?.value || 7}일 집계 · ${myIp} 제외됨`
      : `최근 ${document.getElementById('usage-days')?.value || 7}일 집계 · 전체 IP 포함`
  }
}

async function loadWhoami() {
  try {
    const res = await fetch('/api/dashboard/usage/whoami')
    if (!res.ok) return
    const data = await res.json()
    if (data.ip) {
      myIp = data.ip
      localStorage.setItem('dashboard_my_ip', myIp)
      const ipEl = document.getElementById('usage-my-ip')
      if (ipEl) ipEl.textContent = `내 IP: ${myIp}`
    }
  } catch (_) {}
}

async function loadUsage() {
  try {
    const res = await fetch(`/api/dashboard/usage/summary?${usageQuery()}`)
    if (!res.ok) throw new Error('usage ' + res.status)
    const data = await res.json()
    usageTotals = data.totals || null
    usageByTenant = {}
    for (const row of data.byTenant || []) usageByTenant[row.subdomain] = row
    window.__topEndpoints = data.topEndpoints || []
    renderUsageSummary()
    applyFilter()
    if (selectedSlug) renderDetail(allServices.find((s) => s.slug === selectedSlug))
  } catch (err) {
    const el = document.getElementById('usage-stats')
    if (el) el.innerHTML = `<p style="color:var(--bad);margin:0">사용량 로드 실패: ${escapeHtml(err.message)}</p>`
  }
}

async function loadTenantUsageDetail(slug) {
  try {
    const res = await fetch(`/api/dashboard/usage/tenant/${encodeURIComponent(slug)}?${usageQuery()}`)
    if (!res.ok) return null
    return await res.json()
  } catch {
    return null
  }
}

function badge(cls, text) {
  const s = document.createElement('span')
  s.className = 'badge ' + (cls || '')
  s.textContent = text
  return s
}

function faviconSrc(svc) {
  if (svc.branding?.faviconUrl) return svc.branding.faviconUrl
  return `/${svc.slug}/favicon.svg`
}

function tenantIconEl(svc, size) {
  const cls = size === 'lg' ? 'tenant-icon' : 'tenant-icon'
  const img = document.createElement('img')
  img.className = cls
  img.width = size === 'lg' ? 48 : 28
  img.height = size === 'lg' ? 48 : 28
  img.alt = ''
  img.loading = 'lazy'
  img.src = faviconSrc(svc)
  img.onerror = () => {
    const ph = document.createElement('span')
    ph.className = 'tenant-icon placeholder'
    ph.textContent = svc.slug.slice(0, 2).toUpperCase()
    img.replaceWith(ph)
  }
  return img
}

function renderStats(summary) {
  const el = document.getElementById('stats')
  el.innerHTML = ''
  const items = [
    ['서비스', summary.total, ''],
    ['온라인', `${summary.livePct}%`, `${summary.live}/${summary.total}`],
    ['SEO 효율', `${summary.seoEfficiencyPct ?? summary.seoPct ?? 0}%`, '평균 점수'],
    ['파비콘', `${summary.faviconPct ?? 0}%`, `${summary.faviconComplete ?? 0} 파일`],
    ['og:image', `${summary.ogImagePct ?? 0}%`, `${summary.ogImageComplete ?? 0}개`],
    ['API 연동', summary.apiIntegrationPct != null ? `${summary.apiIntegrationPct}%` : '—', `Resty auth ${summary.withRestyAuth}`],
  ]
  for (const [label, val, sub] of items) {
    const d = document.createElement('div')
    d.className = 'stat'
    d.innerHTML = `<span>${label}</span><b>${val}</b>${sub ? `<small style="color:var(--muted);font-size:0.7rem">${sub}</small>` : ''}`
    el.appendChild(d)
  }
}

function pageLevelLabel(level) {
  if (level === 'ok') return '정상'
  if (level === 'warn') return '주의'
  if (level === 'error') return '오류'
  return level
}

function renderApiActivations(activations) {
  if (!activations?.integrations?.length) return '<span style="color:var(--muted)">—</span>'
  const items = activations.integrations
    .map(
      (i) =>
        `<div class="api-activation-item ${i.usedInCode ? 'on' : 'off'}">${i.usedInCode ? '✓' : '·'} ${escapeHtml(i.label)}</div>`,
    )
    .join('')
  return `<div class="api-activation-grid">${items}</div>`
}

function renderPageList(pages, problemsOnly) {
  const list = problemsOnly ? pages.filter((p) => p.level !== 'ok') : pages
  if (!list.length) {
    return `<p style="color:var(--muted);margin:0;padding:10px">${problemsOnly ? '문제 페이지 없음' : 'sitemap 페이지 없음'}</p>`
  }
  return `<ul class="page-list">${list
    .map((p) => {
      const live = p.live ? (p.live.ok ? ` · live ${p.live.status}` : ` · live ✗ ${p.live.status || p.live.error}`) : ''
      return `<li>
        <span class="page-status ${p.level}">${pageLevelLabel(p.level)}</span>
        <div>
          <a href="${escapeHtml(p.url)}" target="_blank" rel="noopener">${escapeHtml(p.path)}</a>
          <div style="color:var(--muted);font-size:0.7rem;margin-top:2px">${escapeHtml(p.label || p.code || '')}${live}</div>
        </div>
      </li>`
    })
    .join('')}</ul>`
}

function bindDetailToggles() {
  document.querySelectorAll('[data-toggle]').forEach((btn) => {
    btn.addEventListener('click', () => {
      const id = btn.getAttribute('data-toggle')
      const body = document.getElementById(id)
      if (!body) return
      const open = body.classList.toggle('open')
      btn.setAttribute('aria-expanded', open ? 'true' : 'false')
    })
  })
}

async function loadTenantAudit(slug) {
  if (tenantAuditCache[slug]) return tenantAuditCache[slug]
  const res = await fetch(`/api/dashboard/tenant/${encodeURIComponent(slug)}/audit?live=1`)
  if (!res.ok) throw new Error('audit ' + res.status)
  const data = await res.json()
  tenantAuditCache[slug] = data
  return data
}

async function runApiTest(slug) {
  const btn = document.getElementById('api-test-btn')
  const box = document.getElementById('api-test-result')
  if (!btn || !box) return
  btn.disabled = true
  box.className = 'api-test-result'
  box.textContent = 'API 테스트 중…'
  try {
    const res = await fetch(`/api/dashboard/tenant/${encodeURIComponent(slug)}/test-api`, { method: 'POST' })
    if (!res.ok) throw new Error('test ' + res.status)
    const data = await res.json()
    if (!data.tested) {
      box.textContent = data.message || '테스트할 API 없음'
      return
    }
    const ok = data.passed === data.tested
    box.className = 'api-test-result ' + (ok ? 'ok' : 'bad')
    box.innerHTML = `<strong>${data.passed}/${data.tested} 통과</strong><ul style="margin:6px 0 0;padding-left:18px">${data.results
      .map(
        (r) =>
          `<li>${r.ok ? '✓' : '✗'} ${escapeHtml(r.label)} <code>${escapeHtml(r.endpoint)}</code> — ${r.status || '—'} ${escapeHtml(r.message || '')}</li>`,
      )
      .join('')}</ul>`
  } catch (err) {
    box.className = 'api-test-result bad'
    box.textContent = 'API 테스트 실패: ' + err.message
  } finally {
    btn.disabled = false
  }
}

function renderDetail(svc) {
  const panel = document.getElementById('detail-content')
  if (!svc) {
    panel.innerHTML = '<p style="color:var(--muted)">카드를 클릭하면 상세 정보가 표시됩니다.</p>'
    return
  }

  const liveOk = svc.live?.home?.ok
  const seoEff = svc.seo.efficiency ?? 0
  const score = svc.api.score
  const favOk = svc.branding?.hasFaviconFile
  const ogOk = svc.branding?.hasOgImage
  const u = tenantUsage(svc.slug)
  const act = svc.api.activations
  const actLabel = act ? `${act.activated}/${act.total} 활성` : '—'

  panel.innerHTML = `
    <div style="display:flex;align-items:center;gap:10px;margin-bottom:8px">
      <span id="detail-icon-slot"></span>
      <div>
        <h3 style="margin:0">${escapeHtml(svc.slug)}</h3>
        <p style="color:var(--muted);font-size:0.85rem;margin:4px 0 0">${escapeHtml(svc.title || '')}</p>
      </div>
    </div>
    <div class="detail-row">
      <label>상태</label>
      <span style="color:${liveOk ? 'var(--ok)' : 'var(--bad)'}">${liveOk ? `온라인 (${svc.live.home.status})` : '오프라인'}</span>
    </div>
    <div class="detail-row">
      <label>사용량 (최근)</label>
      <span id="detail-usage-slot">${u ? `${u.totalCalls}회 · AI ${u.aiCalls} · 유저 ${u.activeUsers} · IP ${u.uniqueIps}` : '집계 없음'}</span>
    </div>
    <div id="detail-usage-breakdown"></div>
    <div class="detail-row">
      <label>SEO 효율</label>
      ${seoEff}% · sitemap ${svc.seo.sitemap ? '✓' : '✗'} · robots ${svc.seo.robots ? '✓' : '✗'}
      <div class="seo-meter"><i style="width:${seoEff}%"></i></div>
    </div>
    <div class="detail-row">
      <label>브랜딩</label>
      파비콘 ${favOk ? '✓ 파일' : svc.branding?.hasFavicon ? '△ 링크만' : '✗ 없음'} · og:image ${ogOk ? '✓' : '✗'}
    </div>
    <div class="detail-branding">
      <figure>
        <img src="${escapeHtml(faviconSrc(svc))}" alt="favicon" width="48" height="48"/>
        <figcaption>favicon</figcaption>
      </figure>
      ${svc.branding?.ogImageUrl ? `<figure><img class="og-thumb" src="${escapeHtml(svc.branding.ogImageUrl)}" alt="og"/><figcaption>og:image</figcaption></figure>` : ''}
    </div>
    <div class="detail-row">
      <label>API 연동</label>
      ${score != null ? `${score}% · ${svc.api.authPattern}` : '—'}
      ${svc.api.priority !== 'unknown' ? ` · ${svc.api.priority}` : ''}
      <div style="margin-top:4px;font-size:0.8rem">코드 활성화: <strong>${actLabel}</strong></div>
      ${renderApiActivations(act)}
      <div style="margin-top:8px;display:flex;gap:8px;flex-wrap:wrap">
        <button type="button" class="btn-secondary" id="api-test-btn">API 테스트</button>
      </div>
      <div id="api-test-result" class="api-test-result" style="display:none"></div>
    </div>
    <div class="detail-row">
      <label>인증 / 크레딧</label>
      ${svc.api.usesRestyAuth ? 'Resty auth' : '—'} · ${svc.api.usesCredits ? 'credits' : 'no credits'}
    </div>
    <div id="detail-audit-slot">
      <button type="button" class="detail-toggle" data-toggle="pages-all-body" aria-expanded="false">
        <span>📄 sitemap 페이지</span>
        <span class="count" id="pages-all-count">로딩…</span>
        <span>▾</span>
      </button>
      <div id="pages-all-body" class="detail-toggle-body"></div>
      <button type="button" class="detail-toggle" data-toggle="pages-problems-body" aria-expanded="false">
        <span>⚠ 문제·미완성 페이지</span>
        <span class="count" id="pages-problems-count">로딩…</span>
        <span>▾</span>
      </button>
      <div id="pages-problems-body" class="detail-toggle-body"></div>
    </div>
    <div class="detail-links">
      <a href="${svc.siteUrl}" target="_blank" rel="noopener">사이트 열기 ↗</a>
      ${svc.seo.sitemapUrl ? `<a href="${svc.seo.sitemapUrl}" target="_blank" rel="noopener">sitemap</a>` : ''}
      ${svc.seo.robotsUrl ? `<a href="${svc.seo.robotsUrl}" target="_blank" rel="noopener">robots</a>` : ''}
      ${svc.branding?.faviconUrl ? `<a href="${svc.branding.faviconUrl}" target="_blank" rel="noopener">favicon</a>` : ''}
      ${svc.branding?.ogImageUrl ? `<a href="${svc.branding.ogImageUrl}" target="_blank" rel="noopener">og:image</a>` : ''}
    </div>
    ${svc.seo.issues?.length ? `<div class="detail-issues">SEO 이슈: ${escapeHtml(svc.seo.issues.join(', '))}</div>` : ''}
    ${svc.api.issues?.length ? `<div class="detail-issues">API 이슈: ${escapeHtml(svc.api.issues.join(', '))}</div>` : ''}
    <div class="detail-preview">
      <iframe loading="lazy" title="${escapeHtml(svc.slug)} preview" src="${svc.previewUrl}" sandbox="allow-scripts allow-same-origin"></iframe>
    </div>
  `
  const iconSlot = panel.querySelector('#detail-icon-slot')
  if (iconSlot) iconSlot.appendChild(tenantIconEl(svc, 'lg'))

  loadTenantUsageDetail(svc.slug).then((detail) => {
    const slot = document.getElementById('detail-usage-slot')
    const box = document.getElementById('detail-usage-breakdown')
    if (!detail?.success || !slot || !box) return
    const s = detail.summary
    slot.textContent = `${s.totalCalls}회 · AI ${s.aiCalls} · 유저 ${s.activeUsers} · IP ${s.uniqueIps}`
    let html = ''
    if (detail.byUser?.length) {
      html += `<div class="detail-row"><label>유저별</label><table class="usage-table"><thead><tr><th>userId</th><th>호출</th><th>AI</th></tr></thead><tbody>${detail.byUser
        .slice(0, 8)
        .map((r) => `<tr><td>${r.userId}</td><td>${r.calls}</td><td>${r.aiCalls}</td></tr>`)
        .join('')}</tbody></table></div>`
    }
    if (detail.byEndpoint?.length) {
      html += `<div class="detail-row"><label>엔드포인트</label><table class="usage-table"><thead><tr><th>path</th><th>호출</th></tr></thead><tbody>${detail.byEndpoint
        .slice(0, 6)
        .map((r) => `<tr><td>${escapeHtml(r.endpoint)}</td><td>${r.calls}</td></tr>`)
        .join('')}</tbody></table></div>`
    }
    box.innerHTML = html
  })

  bindDetailToggles()
  const apiTestBtn = document.getElementById('api-test-btn')
  const apiTestBox = document.getElementById('api-test-result')
  if (apiTestBtn && apiTestBox) {
    apiTestBox.style.display = 'block'
    apiTestBtn.addEventListener('click', () => runApiTest(svc.slug))
  }

  loadTenantAudit(svc.slug)
    .then((audit) => {
      const pages = audit.pages?.pages || []
      const problems = pages.filter((p) => p.level !== 'ok')
      const allCount = document.getElementById('pages-all-count')
      const probCount = document.getElementById('pages-problems-count')
      const allBody = document.getElementById('pages-all-body')
      const probBody = document.getElementById('pages-problems-body')
      if (allCount) allCount.textContent = `${audit.pages?.summary?.ok || 0}/${audit.pages?.summary?.total || 0} 정상`
      if (probCount) probCount.textContent = `${problems.length}건`
      if (allBody) allBody.innerHTML = renderPageList(pages, false)
      if (probBody) probBody.innerHTML = renderPageList(pages, true)
      svc._pageProblems = problems.length
      svc._auditSummary = audit.pages?.summary
    })
    .catch((err) => {
      const slot = document.getElementById('detail-audit-slot')
      if (slot) {
        const errEl = document.createElement('p')
        errEl.className = 'detail-issues'
        errEl.textContent = '페이지 감사 로드 실패: ' + err.message
        slot.appendChild(errEl)
      }
    })
}

function setSelected(slug) {
  selectedSlug = slug
  const layout = document.getElementById('layout')
  const svc = allServices.find((s) => s.slug === slug)
  layout.classList.toggle('has-detail', !!slug)
  document.querySelectorAll('.card').forEach((el) => {
    el.classList.toggle('selected', el.dataset.slug === slug)
  })
  renderDetail(svc || null)
}

function renderCard(svc) {
  const card = document.createElement('article')
  card.className = 'card'
  card.dataset.slug = svc.slug

  const liveOk = svc.live?.home?.ok
  const seoEff = svc.seo.efficiency ?? 0
  const score = svc.api.score

  const head = document.createElement('div')
  head.className = 'card-head'
  const left = document.createElement('div')
  left.className = 'title-row'

  const h2 = document.createElement('h2')
  h2.appendChild(tenantIconEl(svc))
  const link = document.createElement('a')
  link.href = svc.siteUrl
  link.target = '_blank'
  link.rel = 'noopener'
  link.textContent = svc.slug
  h2.appendChild(link)

  const titleDiv = document.createElement('div')
  titleDiv.className = 'card-title'
  titleDiv.textContent = svc.title || ''

  left.appendChild(h2)
  left.appendChild(titleDiv)

  const badges = document.createElement('div')
  badges.className = 'badges'
  badges.appendChild(badge(liveOk ? 'ok' : 'bad', liveOk ? `● ${svc.live.home.status}` : '● offline'))
  badges.appendChild(badge(seoEff >= 70 ? 'ok' : seoEff >= 40 ? 'warn' : 'bad', `SEO ${seoEff}%`))
  badges.appendChild(badge(svc.branding?.hasFaviconFile ? 'ok' : svc.branding?.hasFavicon ? 'warn' : 'bad', svc.branding?.hasFaviconFile ? 'fav ✓' : 'fav ✗'))
  badges.appendChild(badge(svc.branding?.hasOgImage ? 'ok' : 'bad', svc.branding?.hasOgImage ? 'OG ✓' : 'OG ✗'))
  if (svc.api.usesRestyAuth) badges.appendChild(badge('ok', 'auth'))
  if (svc.api.usesCredits) badges.appendChild(badge('ok', 'credits'))
  if (svc.api.activations?.activated) {
    badges.appendChild(badge(svc.api.activations.activated >= 2 ? 'ok' : 'warn', `API ${svc.api.activations.activated}/${svc.api.activations.total}`))
  }
  const u = tenantUsage(svc.slug)
  if (u?.totalCalls) badges.appendChild(badge('usage', `${u.totalCalls} calls`))

  head.appendChild(left)
  head.appendChild(badges)

  const preview = document.createElement('div')
  preview.className = 'preview'
  const iframe = document.createElement('iframe')
  iframe.loading = 'lazy'
  iframe.title = svc.slug + ' preview'
  iframe.src = svc.previewUrl
  iframe.sandbox = 'allow-scripts allow-same-origin'
  const overlay = document.createElement('div')
  overlay.className = 'preview-overlay'
  overlay.innerHTML = `<a href="${svc.siteUrl}" target="_blank" rel="noopener">사이트 열기 ↗</a>`
  preview.appendChild(iframe)
  preview.appendChild(overlay)

  const foot = document.createElement('div')
  foot.className = 'card-foot'
  const apiLabel = score != null ? `API ${score}%` : 'API —'
  const pageProb = svc.seo.pageProblems
  foot.innerHTML = `
    <div>${apiLabel} · ${svc.api.authPattern}${svc.api.priority !== 'unknown' ? ` · ${svc.api.priority}` : ''}</div>
    <div class="meter"><i style="width:${score != null ? score : 0}%"></i></div>
    <div>
      ${svc.seo.sitemapUrl ? `<a href="${svc.seo.sitemapUrl}" target="_blank" rel="noopener" style="color:var(--accent)">sitemap</a>` : 'no sitemap'}
      ·
      ${svc.seo.robotsUrl ? `<a href="${svc.seo.robotsUrl}" target="_blank" rel="noopener" style="color:var(--accent)">robots</a>` : 'no robots'}
      ${pageProb ? ` · <span style="color:var(--warn)">페이지 이슈 ${pageProb}</span>` : ''}
    </div>
  `
  if (svc.api.issues?.length) {
    const iss = document.createElement('div')
    iss.className = 'issues'
    iss.textContent = svc.api.issues.slice(0, 3).join(', ')
    foot.appendChild(iss)
  }

  card.appendChild(head)
  card.appendChild(preview)
  card.appendChild(foot)

  card.addEventListener('click', (e) => {
    if (e.target.closest('a')) return
    setSelected(svc.slug === selectedSlug ? null : svc.slug)
  })

  return card
}

function escapeHtml(s) {
  return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
}

function applyFilter() {
  const q = (document.getElementById('search').value || '').toLowerCase()
  const f = document.getElementById('filter').value
  const grid = document.getElementById('grid')
  grid.innerHTML = ''

  const filtered = allServices
    .filter((svc) => {
    if (q && !svc.slug.includes(q) && !(svc.title || '').toLowerCase().includes(q)) return false
    if (f === 'live' && !svc.live?.home?.ok) return false
    if (f === 'seo-miss' && !(svc.seo.sitemap && svc.seo.robots)) return false
    if (f === 'favicon-miss' && !svc.branding?.hasFaviconFile) return false
    if (f === 'og-miss' && !svc.branding?.hasOgImage) return false
    if (f === 'seo-low' && (svc.seo.efficiency ?? 0) < 70) return false
    if (f === 'api-low' && (svc.api.score == null || svc.api.score < 60)) return false
    if (f === 'usage-high') {
      const u = tenantUsage(svc.slug)
      if (!u || u.totalCalls < 5) return false
    }
    if (f === 'page-problems') {
      if (!svc.seo?.pageProblems) return false
    }
    return true
  })
    .sort(compareByUsage)

  for (const svc of filtered) grid.appendChild(renderCard(svc))
  if (!filtered.length) {
    grid.innerHTML = '<p style="color:var(--muted);grid-column:1/-1">조건에 맞는 서비스가 없습니다.</p>'
    setSelected(null)
    return
  }
  if (selectedSlug && !filtered.some((s) => s.slug === selectedSlug)) {
    setSelected(null)
  } else if (selectedSlug) {
    document.querySelectorAll('.card').forEach((el) => {
      el.classList.toggle('selected', el.dataset.slug === selectedSlug)
    })
    renderDetail(allServices.find((s) => s.slug === selectedSlug))
  }
}

async function load() {
  const loading = document.getElementById('loading')
  const main = document.getElementById('main')
  const errEl = document.getElementById('error')
  errEl.style.display = 'none'

  try {
    const res = await fetch('/api/dashboard/overview?live=1')
    if (!res.ok) throw new Error('API ' + res.status)
    const data = await res.json()
    allServices = data.services || []
    loading.style.display = 'none'
    main.style.display = 'block'
    renderStats(data.summary || { total: 0, live: 0, livePct: 0, seoComplete: 0, seoPct: 0 })
    await Promise.all([loadWhoami(), loadUsage()])
    applyFilter()
  } catch (err) {
    loading.style.display = 'none'
    errEl.style.display = 'block'
    errEl.textContent = '대시보드를 불러오지 못했습니다: ' + err.message
  }
}

document.getElementById('search').addEventListener('input', applyFilter)
document.getElementById('filter').addEventListener('change', applyFilter)
document.getElementById('refresh').addEventListener('click', () => {
  tenantAuditCache = {}
  document.getElementById('loading').style.display = 'block'
  document.getElementById('main').style.display = 'none'
  load()
})
document.getElementById('usage-refresh')?.addEventListener('click', loadUsage)
document.getElementById('usage-days')?.addEventListener('change', loadUsage)
document.getElementById('usage-exclude-me')?.addEventListener('change', loadUsage)
document.getElementById('detail-close').addEventListener('click', () => setSelected(null))

window.addEventListener('load', load)
