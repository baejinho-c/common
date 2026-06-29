import { NextResponse } from "next/server"
import OpenAI from "openai"

export async function POST(request: Request) {
  try {
    const { topic, targetAudience, contentType } = await request.json()

    if (!topic) {
      return NextResponse.json({ success: false, message: "주제가 필요합니다." }, { status: 400 })
    }

    if (!process.env.OPENAI_API_KEY) {
      return NextResponse.json({ success: false, message: "OpenAI API 키가 설정되지 않았습니다." }, { status: 500 })
    }

    const openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    })

    const prompt = `
다음 조건에 맞는 SEO 키워드를 추천해주세요:

주제: ${topic}
${targetAudience ? `타겟 독자: ${targetAudience}` : ""}
${contentType ? `콘텐츠 유형: ${contentType}` : ""}

다음 형식으로 키워드를 분류해서 제안해주세요:

1. 주요 키워드 (Primary Keywords) - 3-5개
   - 검색량이 높고 경쟁도가 적당한 키워드

2. 롱테일 키워드 (Long-tail Keywords) - 5-8개
   - 구체적이고 의도가 명확한 키워드

3. 관련 키워드 (Related Keywords) - 5-7개
   - 주제와 관련된 보조 키워드

4. 질문형 키워드 (Question Keywords) - 3-5개
   - 사용자가 검색할 만한 질문들

각 키워드에 대해 예상 검색량과 경쟁도를 상/중/하로 표시해주세요.
JSON 형식으로 응답해주세요.
`

    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "user",
          content: prompt,
        },
      ],
      max_tokens: 1200,
    })

    const text = completion.choices[0]?.message?.content || ""

    // AI 응답을 JSON으로 파싱 시도
    let keywords
    try {
      keywords = JSON.parse(text)
    } catch {
      // JSON 파싱 실패 시 기본 구조로 래핑
      keywords = {
        primary: [topic],
        longTail: [`${topic} 방법`, `${topic} 가이드`],
        related: [`${topic} 팁`, `${topic} 전략`],
        questions: [`${topic}이란?`, `${topic} 어떻게?`],
      }
    }

    return NextResponse.json({
      success: true,
      keywords,
    })
  } catch (error) {
    console.error("키워드 추천 오류:", error)
    return NextResponse.json({ success: false, message: "키워드 추천에 실패했습니다." }, { status: 500 })
  }
}
