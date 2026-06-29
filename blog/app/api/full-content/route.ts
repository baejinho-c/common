import { NextResponse } from "next/server"
import OpenAI from "openai"

export async function POST(request: Request) {
  try {
    const { outline, tone, length } = await request.json()

    if (!process.env.OPENAI_API_KEY) {
      return NextResponse.json({ success: false, message: "OpenAI API 키가 설정되지 않았습니다." }, { status: 500 })
    }

    const openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    })

    const prompt = `
다음 개요를 바탕으로 완전한 블로그 포스트를 작성해주세요:

개요:
${outline}

작성 조건:
- 톤: ${tone || "친근하고 전문적인"}
- 길이: ${length || "중간"} (약 1000-1500자)
- 네이버 블로그에 적합한 형식
- SEO를 고려한 키워드 자연스러운 배치
- 읽기 쉬운 문단 구성

HTML 태그 없이 순수 텍스트로 작성해주세요.
`

    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [{ role: "user", content: prompt }],
      max_tokens: 2000,
    })

    const content = completion.choices[0]?.message?.content || ""

    return NextResponse.json({
      success: true,
      content,
    })
  } catch (error) {
    console.error("콘텐츠 생성 오류:", error)
    return NextResponse.json({ success: false, message: "콘텐츠 생성에 실패했습니다." }, { status: 500 })
  }
}
