(() => {
  const API = 'https://app.restyart.com/api/brush'
  const $ = (selector) => document.querySelector(selector)
  let allGames = []
  let todayGame = null
  let session = null

  const css = `
    .brush-home-action{font-family:'Jua',sans-serif;border:0;border-radius:14px;padding:10px 12px;color:#fff;box-shadow:0 3px 0 rgba(0,0,0,.14);font-size:13px}
    .brush-home-action.today{background:#C23B3B}.brush-home-action.list{background:#6A4EE8}
    .brush-modal{position:fixed;inset:0;z-index:80;background:rgba(58,46,34,.64);display:flex;align-items:center;justify-content:center;padding:18px}
    .brush-modal-card{width:min(100%,430px);max-height:82vh;overflow:auto;border-radius:22px;background:#FBF4E4;border:3px solid #8A5A3A;padding:20px;box-shadow:0 14px 40px rgba(0,0,0,.35)}
    .brush-modal-title{font-family:'Jua',sans-serif;color:#6A4228;font-size:24px;text-align:center;margin:0 0 8px}.brush-modal-sub{text-align:center;font-size:14px;color:#7A6A50;margin:0 0 14px}
    .brush-game-list{display:grid;grid-template-columns:repeat(4,1fr);gap:9px}.brush-game-card{min-height:76px;border:2px solid #D8C8A0;border-radius:13px;background:#fff;display:flex;flex-direction:column;align-items:center;justify-content:center;color:#3A2E22}.brush-game-card strong{font:28px 'Gowun Batang',serif}.brush-game-card span{font-size:11px;color:#7A6A50;margin-top:2px}
    .brush-rank-row{display:grid;grid-template-columns:34px 1fr auto;gap:8px;align-items:center;padding:9px 2px;border-bottom:1px dashed #D8C8A0}.brush-rank-row:last-child{border-bottom:0}.brush-rank-num{font-weight:900;color:#C23B3B;text-align:center}.brush-rank-name{font-weight:700}.brush-rank-meta{display:block;font-size:11px;color:#8A7A60;font-weight:400;margin-top:2px}.brush-rank-score{font-family:'Jua',sans-serif;color:#6A4228;font-size:17px}
    .brush-close{width:100%;margin-top:14px;border:0;border-radius:13px;padding:12px;background:#B7A99A;color:#fff;font:16px 'Jua',sans-serif}.brush-start{width:100%;margin-top:12px;border:0;border-radius:13px;padding:12px;background:#5FC08A;color:#fff;font:16px 'Jua',sans-serif}
    .brush-score-card{margin:8px 0 12px;padding:12px;border:2px solid #D8C8A0;border-radius:14px;background:#fff}.brush-score-card .score-title{font:16px 'Jua',sans-serif;color:#6A4228;margin-bottom:8px}.brush-score-form{display:flex;gap:6px}.brush-score-form input,.brush-score-form select{min-width:0;border:2px solid #C9A24B;border-radius:9px;padding:8px;background:#FBF4E4;font:14px 'Gaegu',sans-serif}.brush-score-form input{flex:1}.brush-score-form select{width:65px}.brush-score-form button{border:0;border-radius:9px;padding:0 11px;background:#5A7A5A;color:#fff;font:14px 'Jua',sans-serif}.brush-score-result{font-family:'Jua',sans-serif;color:#5A7A5A;padding:5px 0}.brush-score-help{font-size:12px;color:#7A6A50;margin:0 0 8px}
  `
  const style = document.createElement('style')
  style.textContent = css
  document.head.appendChild(style)

  function escapeHtml(value) {
    return String(value || '').replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]))
  }
  function formatAge(age) { return age === '10+' ? '10세+' : `${age}세` }
  function formatDate(value) {
    try { return new Date(value).toLocaleDateString('ko-KR', { month: 'numeric', day: 'numeric' }) } catch { return '' }
  }
  function typeFor(game) { return game.type === 'hanja' ? 'hanja' : 'hangul' }
  function charFromGame(game) {
    return { c: game.character, key: game.key, type: typeFor(game), title: game.title, desc: game.description, strokes: game.strokes }
  }
  function showModal(markup) {
    const modal = document.createElement('div')
    modal.className = 'brush-modal'
    modal.innerHTML = `<div class="brush-modal-card">${markup}</div>`
    modal.addEventListener('click', (event) => { if (event.target === modal) modal.remove() })
    document.body.appendChild(modal)
    modal.querySelectorAll('[data-close-modal]').forEach((button) => button.addEventListener('click', () => modal.remove()))
    return modal
  }

  function mergeGames(remoteGames) {
    allGames = remoteGames || []
    const grouped = { hangul_consonant: [], hangul_vowel: [], hanja: [] }
    allGames.forEach((game) => {
      const key = game.series
      if (grouped[key]) grouped[key].push(charFromGame(game))
    })
    if (grouped.hangul_consonant.length) CHARS.hangul_consonant = grouped.hangul_consonant
    if (grouped.hangul_vowel.length) CHARS.hangul_vowel = grouped.hangul_vowel
    if (grouped.hanja.length) CHARS.hanja = grouped.hanja
    const supportedSeries = new Set(['hangul_consonant', 'hangul_vowel'])
    for (let i = HANGUL_SERIES.length - 1; i >= 0; i -= 1) {
      if (!supportedSeries.has(HANGUL_SERIES[i].id)) HANGUL_SERIES.splice(i, 1)
    }
  }

  function startGame(game) {
    session = { gameKey: game.key, startedAt: performance.now(), mistakes: 0, forcedStrokes: 0 }
    curMode = typeFor(game)
    curHangulSeries = game.series === 'hanja' ? null : game.series
    startWorkshop(charFromGame(game))
  }

  function openAllGames() {
    if (!allGames.length) return showModal('<h2 class="brush-modal-title">게임을 준비 중이에요</h2><p class="brush-modal-sub">잠시 뒤 다시 시도해 주세요.</p><button class="brush-close" data-close-modal>닫기</button>')
    const cards = allGames.map((game) => `<button class="brush-game-card" data-game-key="${escapeHtml(game.key)}"><strong>${escapeHtml(game.character)}</strong><span>${escapeHtml(game.title)}</span></button>`).join('')
    const modal = showModal(`<h2 class="brush-modal-title">📚 전체 획순 게임</h2><p class="brush-modal-sub">활성화된 글자만 보여요.</p><div class="brush-game-list">${cards}</div><button class="brush-close" data-close-modal>닫기</button>`)
    modal.querySelectorAll('[data-game-key]').forEach((button) => button.addEventListener('click', () => {
      const game = allGames.find((item) => item.key === button.dataset.gameKey)
      if (!game) return
      modal.remove()
      startGame(game)
    }))
  }

  async function loadToday() {
    const response = await fetch(`${API}/today`)
    if (!response.ok) throw new Error('today load failed')
    const data = await response.json()
    todayGame = data.game || null
    return data
  }

  async function openToday() {
    try {
      const data = await loadToday()
      if (!data.game) return showModal('<h2 class="brush-modal-title">오늘의 게임</h2><p class="brush-modal-sub">아직 오늘의 게임이 설정되지 않았어요.</p><button class="brush-close" data-close-modal>닫기</button>')
      const leader = data.leader
      const leaderMarkup = leader ? `<div class="brush-rank-row"><div class="brush-rank-num">🥇</div><div class="brush-rank-name">${escapeHtml(leader.nickname)}<span class="brush-rank-meta">${formatAge(leader.age_bucket)} · ${formatDate(leader.created_at)}</span></div><div class="brush-rank-score">${leader.score}</div></div>` : '<p class="brush-modal-sub">아직 1등 기록이 없어요. 첫 번째 주인공이 되어 보세요!</p>'
      const modal = showModal(`<h2 class="brush-modal-title">🌸 오늘의 게임</h2><p class="brush-modal-sub"><strong style="font-size:28px;color:#6A4228">${escapeHtml(data.game.character)}</strong><br>${escapeHtml(data.game.title)} · ${escapeHtml(data.game.description)}</p>${leaderMarkup}<button class="brush-start" id="todayStart">오늘의 글자 연습하기</button><button class="brush-close" data-close-modal>닫기</button>`)
      modal.querySelector('#todayStart').addEventListener('click', () => { modal.remove(); startGame(data.game) })
    } catch {
      showModal('<h2 class="brush-modal-title">오늘의 게임</h2><p class="brush-modal-sub">정보를 불러오지 못했어요.</p><button class="brush-close" data-close-modal>닫기</button>')
    }
  }

  async function openLeaderboard(gameKey, title = '리더보드') {
    try {
      const response = await fetch(`${API}/leaderboard?gameKey=${encodeURIComponent(gameKey)}&limit=10`)
      const data = await response.json()
      if (!response.ok) throw new Error(data.error || 'load failed')
      const rows = (data.entries || []).map((row, index) => `<div class="brush-rank-row"><div class="brush-rank-num">${['🥇', '🥈', '🥉'][index] || index + 1}</div><div class="brush-rank-name">${escapeHtml(row.nickname)}<span class="brush-rank-meta">${formatAge(row.age_bucket)} · ${formatDate(row.created_at)}</span></div><div class="brush-rank-score">${row.score}</div></div>`).join('') || '<p class="brush-modal-sub">아직 기록이 없어요.</p>'
      showModal(`<h2 class="brush-modal-title">🏆 ${escapeHtml(title)}</h2>${rows}<button class="brush-close" data-close-modal>닫기</button>`)
    } catch {
      showModal('<h2 class="brush-modal-title">리더보드</h2><p class="brush-modal-sub">랭킹을 불러오지 못했어요.</p><button class="brush-close" data-close-modal>닫기</button>')
    }
  }

  function scoreForSession() {
    if (!session) return 0
    const seconds = Math.max(0, Math.round((performance.now() - session.startedAt) / 1000))
    return Math.max(100, 1000 - seconds * 2 - session.mistakes * 45 - session.forcedStrokes * 120)
  }

  function renderScoreForm() {
    const overlay = $('#done-overlay')
    if (!overlay || !session || !curChar?.key) return
    overlay.querySelector('.brush-score-card')?.remove()
    const score = scoreForSession()
    const card = document.createElement('div')
    card.className = 'brush-score-card'
    card.innerHTML = `<div class="score-title">오늘의 점수 ${score}점</div><p class="brush-score-help">별명과 연령대를 남기면 ${escapeHtml(curChar.c)} 리더보드에 저장돼요.</p><div class="brush-score-form"><input id="brushRankName" maxlength="12" placeholder="별명" autocomplete="off"><select id="brushRankAge" aria-label="연령대"><option value="4">4세</option><option value="5">5세</option><option value="6">6세</option><option value="7">7세</option><option value="8">8세</option><option value="9">9세</option><option value="10+">10세+</option></select><button id="brushRankSave">저장</button></div><button class="brush-start" id="brushRankView" style="margin-top:8px">🏆 이 글자 랭킹 보기</button>`
    const buttons = overlay.querySelector('.done-btns')
    if (buttons) overlay.insertBefore(card, buttons)
    else overlay.appendChild(card)
    const name = card.querySelector('#brushRankName')
    const age = card.querySelector('#brushRankAge')
    name.value = localStorage.getItem('brush_rank_nickname') || ''
    age.value = localStorage.getItem('brush_rank_age') || '7'
    card.querySelector('#brushRankSave').addEventListener('click', async () => {
      const button = card.querySelector('#brushRankSave')
      const nickname = name.value.trim().slice(0, 12) || '익명'
      localStorage.setItem('brush_rank_nickname', nickname)
      localStorage.setItem('brush_rank_age', age.value)
      button.disabled = true
      button.textContent = '저장 중'
      try {
        const response = await fetch(`${API}/leaderboard`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ gameKey: curChar.key, nickname, ageBucket: age.value, score, durationMs: Math.round(performance.now() - session.startedAt), mistakes: session.mistakes, forcedStrokes: session.forcedStrokes }) })
        const data = await response.json()
        if (!response.ok) throw new Error(data.error || 'save failed')
        card.innerHTML = `<div class="brush-score-result">✅ ${escapeHtml(nickname)} 님은 ${data.rank}등이에요!</div><button class="brush-start" id="brushRankView">🏆 이 글자 랭킹 보기</button>`
        card.querySelector('#brushRankView').addEventListener('click', () => openLeaderboard(curChar.key, `${curChar.c} 랭킹`))
      } catch {
        button.disabled = false
        button.textContent = '저장'
        card.querySelector('.brush-score-help').textContent = '저장에 실패했어요. 다시 시도해 주세요.'
      }
    })
    card.querySelector('#brushRankView').addEventListener('click', () => openLeaderboard(curChar.key, `${curChar.c} 랭킹`))
  }

  function addHomeActions() {
    const row = $('#home .mode-btn-row')
    if (!row || row.querySelector('[data-brush-home]')) return
    const listButton = document.createElement('button')
    listButton.className = 'brush-home-action list'
    listButton.dataset.brushHome = 'list'
    listButton.textContent = '📚 전체 획순 게임'
    const todayButton = document.createElement('button')
    todayButton.className = 'brush-home-action today'
    todayButton.dataset.brushHome = 'today'
    todayButton.textContent = '🏆 오늘의 게임'
    row.after(listButton, todayButton)
    listButton.addEventListener('click', openAllGames)
    todayButton.addEventListener('click', openToday)
  }

  function patchGameplay() {
    const originalStartWorkshop = startWorkshop
    startWorkshop = function patchedStartWorkshop(character) {
      if (character?.key && (!session || session.gameKey !== character.key)) {
        session = { gameKey: character.key, startedAt: performance.now(), mistakes: 0, forcedStrokes: 0 }
      }
      return originalStartWorkshop(character)
    }
    const originalJudgeStroke = judgeStroke
    judgeStroke = function patchedJudgeStroke(points) {
      if (session && curChar && points?.length > 1) {
        const size = $('#paper-canvas')._logicalW
        const expected = curChar.strokes[curStrokeIdx].map((point) => toPx(point, size))
        const start = points[0], end = points[points.length - 1]
        const bad = Math.hypot(start.x - expected[0].x, start.y - expected[0].y) >= size * 0.28 || Math.hypot(end.x - expected[expected.length - 1].x, end.y - expected[expected.length - 1].y) >= size * 0.28
        if (bad) session.mistakes += 1
      }
      return originalJudgeStroke(points)
    }
    const originalAdvanceStroke = advanceStroke
    advanceStroke = function patchedAdvanceStroke(wasForced) {
      if (wasForced && session) session.forcedStrokes += 1
      return originalAdvanceStroke(wasForced)
    }
    const originalFinishArtwork = finishArtwork
    finishArtwork = function patchedFinishArtwork() {
      const result = originalFinishArtwork()
      if (curChar?.key) renderScoreForm()
      return result
    }
  }

  async function bootstrap() {
    addHomeActions()
    patchGameplay()
    try {
      const response = await fetch(`${API}/games`)
      const data = await response.json()
      if (response.ok) mergeGames(data.games)
      renderHome()
    } catch {
      renderHome()
    }
  }
  bootstrap()
})()
