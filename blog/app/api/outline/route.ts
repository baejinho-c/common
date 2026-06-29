import { NextResponse } from "next/server"
import OpenAI from "openai"

export async function POST(request: Request) {
  console.log("🚀 [Outline API] 개요 생성 요청 시작")

  try {
    const { topic, keywords, targetAudience } = await request.json()

    console.log("📝 [Outline API] 요청 데이터:", {
      topic,
      keywords,
      targetAudience,
      keywordsCount: keywords?.length || 0,
    })

    if (!process.env.OPENAI_API_KEY) {
      console.error("❌ [Outline API] OpenAI API 키가 설정되지 않음")
      return NextResponse.json({ success: false, message: "OpenAI API 키가 설정되지 않았습니다." }, { status: 500 })
    }

    console.log("✅ [Outline API] OpenAI API 키 확인 완료")

    const openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
      dangerouslyAllowBrowser: false,
      baseURL: "https://api.openai.com/v1",
    })

    const prompt = `
다음 주제에 대한 블로그 포스트 개요를 작성해주세요:

주제: ${topic}
키워드: ${keywords?.join(", ") || "없음"}
대상 독자: ${targetAudience || "일반"}

다음 형식으로 작성해주세요:
1. 제목 (SEO 최적화된)
2. 서론 (독자의 관심을 끄는)
3. 본문 구조 (3-5개의 주요 섹션)
4. 결론
5. 추천 태그

한국어로 작성하고, 네이버 블로그에 적합하도록 해주세요.
`

    console.log("🤖 [Outline API] OpenAI API 호출 시작...")
    console.log("📄 [Outline API] 프롬프트 길이:", prompt.length)

    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "user",
          content: prompt,
        },
      ],
      max_tokens: 1000,
    })

    const text = completion.choices[0]?.message?.content || ""

    console.log("✨ [Outline API] OpenAI API 호출 성공")
    console.log("📊 [Outline API] 생성된 개요 길이:", text.length)
    console.log("📝 [Outline API] 생성된 개요 미리보기:", text.substring(0, 100) + "...")

    return NextResponse.json({
      success: true,
      outline: text,
    })
  } catch (error) {
    console.error("💥 [Outline API] 개요 생성 오류:", error)
    console.error("🔍 [Outline API] 에러 상세:", {
      message: error instanceof Error ? error.message : "알 수 없는 오류",
      stack: error instanceof Error ? error.stack : undefined,
    })
    return NextResponse.json({ success: false, message: "개요 생성에 실패했습니다." }, { status: 500 })
  }
}
