import { NextResponse } from "next/server"
import OpenAI from "openai"

export async function POST(request: Request) {
  try {
    const { message, context } = await request.json()

    if (!process.env.OPENAI_API_KEY) {
      return NextResponse.json({ success: false, message: "OpenAI API 키가 설정되지 않았습니다." }, { status: 500 })
    }

    const openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    })

    const systemPrompt = `
당신은 블로그 작성을 도와주는 AI 어시스턴트입니다.
다음과 같은 도움을 제공할 수 있습니다:

1. 블로그 주제 추천
2. 제목 개선 제안
3. 콘텐츠 구조 조언
4. SEO 최적화 팁
5. 네이버 블로그 특화 조언

항상 친근하고 도움이 되는 톤으로 답변하며, 구체적이고 실용적인 조언을 제공하세요.
`

    const completion = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: `사용자 질문: ${message}\n\n${context ? `컨텍스트: ${context}` : ""}` },
      ],
      max_tokens: 1000,
    })

    const text = completion.choices[0]?.message?.content || "응답을 생성할 수 없습니다."

    return NextResponse.json({
      success: true,
      response: text,
    })
  } catch (error) {
    console.error("AI 어시스턴트 오류:", error)
    return NextResponse.json({ success: false, message: "AI 어시스턴트 응답에 실패했습니다." }, { status: 500 })
  }
}
