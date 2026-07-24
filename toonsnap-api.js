/**
 * ToonSnap gateway APIs — synced from server weekend work (2026-07-17~20)
 * Must be registered BEFORE the catch-all /api/resty proxy.
 */
function requestJson(urlString, options = {}) {
  return new Promise((resolve, reject) => {
    const url = new URL(urlString)
    const lib = url.protocol === 'https:' ? require('https') : require('http')
    const req = lib.request(
      {
        method: options.method || 'GET',
        hostname: url.hostname,
        port: url.port || (url.protocol === 'https:' ? 443 : 80),
        path: `${url.pathname}${url.search}`,
        headers: options.headers || {},
      },
      (res) => {
        let data = ''
        res.setEncoding('utf8')
        res.on('data', (chunk) => {
          data += chunk
        })
        res.on('end', () => {
          let parsed = {}
          try {
            parsed = data ? JSON.parse(data) : {}
          } catch {
            parsed = { raw: data }
          }
          resolve({
            ok: (res.statusCode || 500) >= 200 && (res.statusCode || 500) < 300,
            status: res.statusCode || 500,
            json: parsed,
          })
        })
      },
    )
    req.on('error', reject)
    if (options.body) req.write(options.body)
    req.end()
  })
}

function toonsnapStorySchema(count) {
  return {
    title: { type: "string" },
    structure: { type: "string" },
    characterSheet: { type: "string" },
    panels: {
      type: "array",
      minItems: count,
      maxItems: count,
      items: {
        type: "object",
        required: ["index", "narration", "dialogue", "sound", "emotion", "imagePrompt"],
        properties: {
          index: { type: "number" },
          narration: { type: "string" },
          dialogue: { type: "string" },
          sound: { type: "string" },
          emotion: { type: "string" },
          imagePrompt: { type: "string" },
        },
        additionalProperties: false,
      },
    },
    hashtags: { type: "array", items: { type: "string" } },
    threadsBody: { type: "string" },
    analysis: {
      type: "object",
      required: ["empathyScore", "viralScore", "viewsEstimate", "tips"],
      properties: {
        empathyScore: { type: "number" },
        viralScore: { type: "number" },
        viewsEstimate: { type: "string" },
        tips: { type: "array", items: { type: "string" } },
      },
      additionalProperties: false,
    },
  }
}

function getGeminiApiKey() {
  return (
    process.env.GOOGLE_GENERATIVE_AI_API_KEY ||
    process.env.GEMINI_API_KEY ||
    process.env.GOOGLE_AI_API_KEY ||
    ''
  ).trim()
}

async function callGeminiJson({ system, prompt, schemaName, schema, max_tokens = 2500 }) {
  const apiKey = getGeminiApiKey()
  if (!apiKey) {
    return { ok: false, status: 500, json: { error: 'GEMINI_API_KEY is not configured.' } }
  }
  const model = process.env.TOONSNAP_GEMINI_MODEL || 'gemini-2.5-flash'
  const generationConfig = {
    temperature: 0.8,
    maxOutputTokens: max_tokens,
    responseMimeType: 'application/json',
  }
  const response = await requestJson(`https://generativelanguage.googleapis.com/v1beta/models/${encodeURIComponent(model)}:generateContent?key=${encodeURIComponent(apiKey)}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      systemInstruction: { parts: [{ text: system }] },
      generationConfig,
      contents: [{ role: 'user', parts: [{ text: prompt }] }],
    }),
  })
  if (!response.ok) {
    return {
      ok: false,
      status: response.status,
      json: { error: response.json?.error?.message || response.json?.raw || `Gemini API error (${response.status})` },
    }
  }
  let content =
    response.json?.candidates?.[0]?.content?.parts
      ?.map((part) => part?.text || '')
      .join('') || '{}'
  // strip markdown fences if model wrapped JSON
  const fence = content.match(/```(?:json)?\s*([\s\S]*?)```/i)
  if (fence) content = fence[1].trim()
  try {
    return { ok: true, status: 200, json: JSON.parse(content) }
  } catch (e) {
    return { ok: false, status: 500, json: { error: 'Failed to parse Gemini JSON response.' } }
  }
}

async function callOpenAIJson({ system, prompt, schemaName, schema, max_tokens = 2500 }) {
  const apiKey = process.env.OPENAI_API_KEY
  if (!apiKey) {
    return { ok: false, status: 500, json: { error: 'OPENAI_API_KEY가 설정되지 않았습니다.' } }
  }
  const response = await requestJson('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: process.env.TOONSNAP_OPENAI_MODEL || 'gpt-4o-mini',
      temperature: 0.8,
      max_tokens,
      response_format: {
        type: 'json_schema',
        json_schema: {
          name: schemaName,
          schema,
          strict: true,
        },
      },
      messages: [
        { role: 'system', content: system },
        { role: 'user', content: prompt },
      ],
    }),
  })
  if (!response.ok) {
    return {
      ok: false,
      status: response.status,
      json: { error: response.json?.error?.message || response.json?.raw || `OpenAI API error (${response.status})` },
    }
  }
  const content = response.json?.choices?.[0]?.message?.content || '{}'
  try {
    return { ok: true, status: 200, json: JSON.parse(content) }
  } catch (e) {
    return { ok: false, status: 500, json: { error: 'Failed to parse OpenAI JSON response.' } }
  }
}


function normalizeToonsnapStory(result, situation, count) {
  const source = result && typeof result === 'object' ? result : {}

  // Accept alternate keys Gemini sometimes returns
  const rawPanels = Array.isArray(source.panels)
    ? source.panels
    : Array.isArray(source.cuts)
      ? source.cuts
      : Array.isArray(source.scenes)
        ? source.scenes
        : []

  let panels = rawPanels.slice(0, count).map((panel, index) => ({
    index: index + 1,
    narration: String(panel?.narration || panel?.caption || ''),
    dialogue: String(panel?.dialogue || panel?.speech || panel?.line || ''),
    sound: String(panel?.sound || panel?.sfx || ''),
    emotion: String(panel?.emotion || panel?.emoji || ''),
    imagePrompt: String(panel?.imagePrompt || panel?.prompt || panel?.scene || ''),
  }))

  // If AI returned no usable panels, synthesize a minimal story so the UI can continue
  if (panels.length === 0) {
    panels = Array.from({ length: count }, (_, i) => ({
      index: i + 1,
      narration: i === 0 ? '평범한 하루가 시작됐다.' : i === count - 1 ? '결국 웃음으로 마무리됐다.' : '',
      dialogue:
        i === 0
          ? String(situation).slice(0, 40)
          : i === count - 1
            ? '이래서 인생은 예상 밖이야!'
            : '',
      sound: i === 1 ? '두근두근' : '',
      emotion: ['🙂', '😮', '😅', '✨', '🤣', '🥹', '👏', '🎉'][i % 8],
      imagePrompt: `A single comic panel for a social media webtoon. A relatable Korean everyday scene inspired by: ${situation}. Clean composition, expressive faces, no text, no speech bubbles.`,
    }))
  }

  const fallbackThreadsBody = panels
    .map((panel) => panel.dialogue)
    .filter(Boolean)
    .join('\n\n')

  return {
    title: String(source.title || '오늘의 인스타툰'),
    structure: String(source.structure || '기승전결'),
    characterSheet: String(
      source.characterSheet ||
        'Korean young adult, casual everyday outfit, expressive face, consistent short black hair',
    ),
    panels,
    hashtags: Array.isArray(source.hashtags)
      ? source.hashtags.map(String).filter(Boolean)
      : ['#인스타툰', '#일상툰', '#AI툰', '#공감툰'],
    threadsBody: String(
      source.threadsBody ||
      fallbackThreadsBody ||
      situation ||
      ''
    ),
    analysis: {
      empathyScore: Number.isFinite(Number(source.analysis?.empathyScore))
        ? Number(source.analysis.empathyScore)
        : 70,
      viralScore: Number.isFinite(Number(source.analysis?.viralScore))
        ? Number(source.analysis.viralScore)
        : 55,
      viewsEstimate: String(
        source.analysis?.viewsEstimate || '1천~5천'
      ),
      tips: Array.isArray(source.analysis?.tips)
        ? source.analysis.tips.map(String).filter(Boolean)
        : [
            '상황을 조금 더 구체적으로 쓰면 공감도가 높아져요.',
            '마지막 컷에 반전이나 한 줄 펀치라인을 넣어보세요.',
          ],
    },
  }
}


function registerToonsnapApiRoutes(app) {
  app.post('/api/resty/toonsnap/story', async (req, res) => {
    try {
      const {
        situation,
        toonStyle,
        panelCount,
        characterStyle,
        characterSheet: lockedSheetRaw,
        characterName,
      } = req.body || {}
      if (!situation || String(situation).trim().length < 2) {
        return res.status(400).json({ error: '상황을 입력해 주세요.' })
      }
      const count = [4, 6, 8].includes(Number(panelCount)) ? Number(panelCount) : 4
      const lockedSheet = String(lockedSheetRaw || '').trim()
      const geminiApiKey = getGeminiApiKey()
      if (!geminiApiKey) {
        const fallback = buildFallbackStory(situation, toonStyle, count, lockedSheet)
        return res.json(
          normalizeToonsnapStory(fallback, situation, count)
        )
      }
      const styleHints = {
        empathy: '따뜻하고 귀엽고 공감 가는 분위기',
        gag: '에너지 있고 표정이 풍부한 코믹·병맛 분위기',
        emotional: '부드럽고 감성적인 분위기',
        experience: '여행·후기처럼 현장감 있는 분위기',
        cute: '따뜻하고 귀엽고 공감 가는 분위기',
        clean: '단정하고 미니멀한 분위기',
        comic: '에너지 있고 표정이 풍부한 코믹 분위기',
        soft: '부드럽고 감성적인 분위기',
      }
      const charArtHints = {
        cute: 'cute rounded Korean webtoon / chibi-friendly',
        sd: 'super-deformed SD, big head, small body',
        line: 'minimal line drawing',
        animal: 'cute anthropomorphic animal',
      }
      const schema = toonsnapStorySchema(count)
      const lockBlock = lockedSheet
        ? `\n\n[고정 캐릭터 — 절대 변경 금지]\n이름 힌트: ${characterName || '주인공'}\n${lockedSheet}\n\ncharacterSheet 필드에는 위 고정 캐릭터 문장을 한 글자도 바꾸지 말고 그대로 넣어라.\n모든 컷의 imagePrompt는 헤어/의상/체형/색을 재정의하지 말고, 같은 캐릭터의 포즈·표정·배경·카메라만 영어로 묘사해라.`
        : `\n\n[캐릭터 디자인 바이블]\ncharacterSheet는 영어 한 문단으로 LOCK 한다: 성별·나이대, 헤어(색+스타일), 얼굴 특징, 의상(색), 체형, 시그니처 소품.\n아트 방향: ${charArtHints[characterStyle] || charArtHints.cute}.\n이후 모든 컷에서 외형은 동일하고 포즈/표정/배경만 바뀌게 imagePrompt를 써라.`
      const prompt = `다음 상황을 ${count}컷 인스타툰으로 만들어줘.\n\n[상황]\n${situation}\n\n[요청 스타일] ${styleHints[toonStyle] || styleHints.empathy}${lockBlock}\n\n반드시 정확히 ${count}개의 컷을 만들고, 각 컷의 index는 1부터 ${count}까지 순서대로 매겨줘.\n대사는 짧고 자연스러운 한국어 구어체. 각 컷의 emotion·dialogue는 그 컷 표정과 몸짓이 맞도록 짝지어라.\n장면 안에 글자나 말풍선은 그리지 않도록 imagePrompt는 영어로만 묘사해줘.`
      const result = await callGeminiJson({
        system: '당신은 인스타툰(SNS 4컷 만화) 전문 작가입니다. 사용자의 일상 경험을 분석해 등장인물, 장소, 감정, 사건, 반전 요소를 뽑아내고, 기승전결이 살아있는 공감되는 짧은 만화 스토리로 재구성합니다. 캐릭터 외형 일관성이 최우선입니다. 대사는 짧고 자연스러운 한국어 구어체로 쓰고, 마지막 컷에는 여운이나 펀치라인을 넣습니다. Always return valid JSON matching the schema with a non-empty panels array.',
        prompt,
        schemaName: 'toonsnap_story',
        schema,
        max_tokens: 8192,
      })
      if (!result.ok) {
        // fall back to local story so the make button never hard-fails on AI outage
        console.error('[toonsnap] story AI failed, using fallback', result.json)
        return res.json(normalizeToonsnapStory(buildFallbackStory(situation, toonStyle, count, lockedSheet), situation, count))
      }
      const normalized = normalizeToonsnapStory(result.json, situation, count)
      if (lockedSheet) normalized.characterSheet = lockedSheet
      return res.json(normalized)
    } catch (err) {
      console.error('[toonsnap] story api error', err)
      return res.status(500).json({ error: '스토리 생성에 실패했어요.' })
    }
  })

  app.post('/api/resty/toonsnap/image', async (req, res) => {
    try {
      const { imagePrompt, characterSheet, characterStyle, dialogue, emotion } = req.body || {}
      if (!imagePrompt || !characterSheet) {
        return res.status(400).json({ error: '이미지 생성 정보가 부족합니다.' })
      }
      const styleHints = {
        cute: 'cute, cozy, expressive, colorful chibi character',
        sd: 'super-deformed SD character, big head, small body, cute',
        line: 'clean line drawing, simple black outlines, minimal color',
        animal: 'cute anthropomorphic animal character, expressive',
        clean: 'clean, minimal, modern, soft shadows',
        comic: 'dynamic comic, expressive, bold outlines',
        soft: 'soft, dreamy, pastel, gentle lighting',
      }
      const dialogueHint = String(dialogue || '').trim()
        ? `Acting direction from dialogue (DO NOT draw any text or speech bubbles): the character is reacting as if saying "${String(dialogue).trim().slice(0, 120)}"${emotion ? ` with emotion ${emotion}` : ''}. Match facial expression, eyes, mouth, and body language to that line.`
        : emotion
          ? `Expression cue: ${emotion}. Match face and body language.`
          : 'Keep expressive body language that fits the scene.'
      const prompt = `A single comic panel illustration. Art style: ${styleHints[characterStyle] || styleHints.cute}.
LOCKED main character design (must match exactly across panels — same hair, outfit, colors, proportions): ${characterSheet}.
Scene action / camera: ${imagePrompt}.
${dialogueHint}
Square 1:1 composition, single panel, no comic borders, no speech bubbles, no text, no letters, no words anywhere in the image. Clean and expressive.`
      const geminiApiKey = getGeminiApiKey()
      if (geminiApiKey) {
        const response = await requestJson(`https://generativelanguage.googleapis.com/v1beta/models/${encodeURIComponent(process.env.TOONSNAP_GEMINI_IMAGE_MODEL || 'gemini-2.5-flash-image')}:generateContent?key=${encodeURIComponent(geminiApiKey)}`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            generationConfig: {
              temperature: 0.4,
            },
            contents: [
              {
                role: 'user',
                parts: [{ text: prompt }],
              },
            ],
          }),
        })
        if (response.ok) {
          const candidate = response.json?.candidates?.[0]
          const parts = candidate?.content?.parts || []
          const imagePart = parts.find((part) => part?.inlineData?.data && part?.inlineData?.mimeType)
          if (imagePart) {
            const mime = imagePart.inlineData.mimeType || 'image/png'
            const b64 = imagePart.inlineData.data
            return res.json({ image: `data:${mime};base64,${b64}` })
          }
          return res.status(502).json({ error: 'Gemini 이미지 응답에서 결과를 찾지 못했어요.' })
        }
        return res.status(response.status).json({
          error: response.json?.error?.message || response.json?.raw || `Gemini image API error (${response.status})`,
        })
      }

      const apiKey = process.env.OPENAI_API_KEY
      if (!apiKey) {
        return res.json({ image: fallbackSvgDataUrl(imagePrompt, characterSheet) })
      }
      const response = await fetch('https://api.openai.com/v1/images/generations', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
          model: process.env.TOONSNAP_IMAGE_MODEL || 'gpt-image-1',
          prompt,
          size: '1024x1024',
        }),
      })
      const data = await response.json().catch(() => ({}))
      if (!response.ok) {
        return res.status(response.status).json({ error: data?.error?.message || `OpenAI image API error (${response.status})` })
      }
      const b64 = data?.data?.[0]?.b64_json
      const mime = data?.data?.[0]?.mime_type || 'image/png'
      if (!b64) return res.status(502).json({ error: '이미지를 생성하지 못했어요.' })
      return res.json({ image: `data:${mime};base64,${b64}` })
    } catch (err) {
      console.error('[toonsnap] image api error', err)
      return res.status(500).json({ error: '이미지 생성에 실패했어요.' })
    }
  })

  function buildFallbackStory(situation, toonStyle, count, lockedSheet) {
    const panels = Array.from({ length: count }, (_, i) => ({
      index: i + 1,
      narration: i === 0 ? '평범한 하루가 시작됐다.' : i === count - 1 ? '결국 웃음으로 마무리됐다.' : '',
      dialogue: i === 0 ? String(situation).slice(0, 40) : i === count - 1 ? '이래서 인생은 예상 밖이야!' : '',
      sound: i === 1 ? '두근두근' : '',
      emotion: ['🙂', '😮', '😅', '✨', '🤣', '🥹', '👏', '🎉'][i % 8],
      imagePrompt: `A single comic panel for a social media webtoon, style ${toonStyle || 'cute'}. A relatable Korean everyday scene inspired by: ${situation}. Clean composition, expressive faces, no text, no speech bubbles.`,
    }))

    return {
      title: '오늘의 한 컷',
      structure: '일상 공감형',
      characterSheet:
        String(lockedSheet || '').trim() ||
        'Korean young adult, casual everyday outfit, expressive face, consistent short black hair',
      panels,
      hashtags: ['#일상툰', '#공감툰', '#웹툰', '#오늘의이야기', '#웃긴일상', '#짤'],
      threadsBody: '오늘 있었던 일을 짧게 웹툰 느낌으로 정리했어요. 공감되면 저장해두고, 비슷한 하루가 떠오르면 한 번씩 다시 봐도 좋아요 🙂',
      analysis: {
        empathyScore: 70,
        viralScore: 55,
        viewsEstimate: '1천~5천',
        tips: ['상황을 조금 더 구체적으로 쓰면 컷 전개가 더 좋아져요.', '마지막 컷에 반전이나 한 줄 펀치라인을 넣어보세요.'],
      },
    }
  }

  function fallbackSvgDataUrl(imagePrompt, characterSheet) {
    const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="1024" height="1024" viewBox="0 0 1024 1024"><rect width="1024" height="1024" fill="#111827"/><text x="88" y="170" fill="#ffffff" font-size="42" font-family="Arial,sans-serif" font-weight="700">ToonSnap Preview</text><text x="88" y="260" fill="#d1d5db" font-size="28" font-family="Arial,sans-serif">AI 키가 없어 미리보기 이미지를 반환합니다.</text><text x="88" y="380" fill="#f3f4f6" font-size="22" font-family="Arial,sans-serif">${escapeXml(String(characterSheet)).slice(0, 120)}</text><text x="88" y="430" fill="#9ca3af" font-size="18" font-family="Arial,sans-serif">${escapeXml(String(imagePrompt)).slice(0, 180)}</text></svg>`
    return `data:image/svg+xml;base64,${Buffer.from(svg).toString('base64')}`
  }

  function escapeXml(text) {
    return String(text)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&apos;')
  }

}

module.exports = { registerToonsnapApiRoutes }
