import { NextResponse } from "next/server"
import OpenAI from "openai"

export async function POST(request: Request) {
  try {
    const { content, targetKeywords } = await request.json()

    if (!content) {
      return NextResponse.json({ success: false, message: "분석할 콘텐츠가 필요합니다." }, { status: 400 })
    }

    if (!process.env.OPENAI_API_KEY) {
      return NextResponse.json({ success: false, message: "OpenAI API 키가 설정되지 않았습니다." }, { status: 500 })
    }

    const openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    })

    const prompt = `
다음 블로그 콘텐츠의 SEO를 분석하고 개선 방안을 제시해주세요:

콘텐츠:
${content}

${targetKeywords ? `타겟 키워드: ${targetKeywords.join(", ")}` : ""}

다음 항목들을 분석해주세요:
1. 키워드 밀도 및 분포
2. 제목 및 소제목 최적화
3. 메타 설명 제안
4. 내부/외부 링크 기회
5. 콘텐츠 구조 개선점
6. 검색 의도 부합성
7. 전체 SEO 점수 (100점 만점)

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
      max_tokens: 1500,
    })

    const text = completion.choices[0]?.message?.content || ""

    // AI 응답을 JSON으로 파싱 시도
    let analysis
    try {
      analysis = JSON.parse(text)
    } catch {
      // JSON 파싱 실패 시 기본 구조로 래핑
      analysis = {
        score: 75,
        summary: text,
        recommendations: ["AI 분석 결과를 확인하세요."],
      }
    }

    return NextResponse.json({
      success: true,
      analysis,
    })
  } catch (error) {
    console.error("SEO 분석 오류:", error)
    return NextResponse.json({ success: false, message: "SEO 분석에 실패했습니다." }, { status: 500 })
  }
}
