async function load() {
  const el = document.getElementById('list')
  try {
    const [projectsRes, tenantsRes, publishedRes, configRes] = await Promise.all([
      fetch('/api/projects'),
      fetch('/api/tenants').catch(() => null),
      fetch('/api/published'),
      fetch('/api/config').catch(() => null),
    ])
    const data = await projectsRes.json()
    const publishedData = await publishedRes.json()
    const config = configRes?.ok ? await configRes.json() : { devProxy: false }
    const publishedSet = new Set((publishedData.published || []).map((p) => p.slug))

    let tenantMap = {}
    if (tenantsRes && tenantsRes.ok) {
      const td = await tenantsRes.json()
      ;(td.tenants || []).forEach((t) => { tenantMap[t.slug] = t })
    }

    if (!data.projects || !data.projects.length) {
      el.innerText = '프로젝트를 찾을 수 없습니다.'
      return
    }

    function tenantLabel(name) {
      const t = tenantMap[name]
      const pub = publishedSet.has(name) ? ' · published' : ' · not published'
      const users = t && typeof t.userCount === 'number' ? ` · users:${t.userCount}` : ''
      return `${pub}${users}`
    }

    function addProjectRow(container, name) {
      const isPublished = publishedSet.has(name)
      const openUrl = `/${encodeURIComponent(name)}/`

      const div = document.createElement('div')
      div.className = 'proj'
      const left = document.createElement('div')
      left.innerHTML = `<div class="name">${name}</div><div class="meta" style="font-size:12px;color:#666">${tenantLabel(name)}</div>`
      const actions = document.createElement('div')
      actions.className = 'actions'

      const statusSpan = document.createElement('span')
      statusSpan.style.marginRight = '8px'
      statusSpan.innerText = isPublished ? 'published' : 'not published'
      actions.appendChild(statusSpan)

      if (isPublished) {
        const open = document.createElement('a')
        open.href = openUrl
        open.target = '_blank'
        open.innerText = 'Open'
        open.style.marginLeft = '8px'
        actions.appendChild(open)
      } else {
        const hint = document.createElement('span')
        hint.style.fontSize = '12px'
        hint.style.color = '#888'
        hint.innerText = ' → ./publish.sh ' + name
        actions.appendChild(hint)
      }

      if (config.devProxy) {
        const startBtn = document.createElement('button')
        startBtn.innerText = 'Dev'
        startBtn.style.marginLeft = '6px'
        startBtn.title = '개발용: 별도 포트에서 npm run dev (ENABLE_DEV_PROXY=1)'
        startBtn.addEventListener('click', async () => {
          await fetch(`/api/start/${encodeURIComponent(name)}`, { method: 'POST' })
          statusSpan.innerText = 'dev starting...'
        })
        actions.appendChild(startBtn)
      }

      div.appendChild(left)
      div.appendChild(actions)
      container.appendChild(div)
    }

    el.innerHTML = ''

    const note = document.createElement('p')
    note.style.color = '#666'
    note.style.fontSize = '14px'
    note.innerHTML = '모든 프론트는 <code>common/public/{tenant}/</code>에 정적 배포 후 <strong>:4000</strong> 단일 포트로 서빙됩니다. 배포: <code>cd common && ./publish.sh &lt;name&gt;</code>'
    el.appendChild(note)

    const projHeader = document.createElement('h2')
    projHeader.innerText = 'Projects'
    el.appendChild(projHeader)

    const projContainer = document.createElement('div')
    el.appendChild(projContainer)

    data.projects
      .filter((name) => name !== 'common')
      .forEach((name) => addProjectRow(projContainer, name))
  } catch (err) {
    el.innerText = '오류: ' + err.message
  }
}

window.addEventListener('load', load)
