import { type NextRequest, NextResponse } from "next/server"
import OpenAI from "openai"

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

export async function POST(request: NextRequest) {
  try {
    const { url } = await request.json()

    if (!url) {
      return NextResponse.json({ error: "URL이 필요합니다" }, { status: 400 })
    }

    if (!process.env.OPENAI_API_KEY) {
      return NextResponse.json({ error: "OpenAI API 키가 설정되지 않았습니다" }, { status: 500 })
    }

    const completion = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "user",
          content: `다음 블로그 URL을 분석하여 글쓰기 스타일 가이드를 작성해주세요: ${url}

블로그 URL을 보고 다음 요소들을 분석해주세요:
1. 예상되는 톤앤매너 (친근함, 전문성, 격식 수준)
2. 문체 특징 (문장 길이, 어투, 표현 방식)
3. 구조적 특징 (제목 스타일, 단락 구성)
4. 키워드 사용 패턴
5. 독자와의 소통 방식

분석 결과를 바탕으로 해당 블로그와 유사한 스타일로 글을 작성하기 위한 구체적인 가이드라인을 제시해주세요.`,
        },
      ],
      temperature: 0.7,
      max_tokens: 2000,
    })

    const analysis = completion.choices[0]?.message?.content || "분석 결과를 생성할 수 없습니다."

    return NextResponse.json({ analysis })
  } catch (error) {
    console.error("블로그 분석 오류:", error)
    return NextResponse.json({ error: "블로그 분석 중 오류가 발생했습니다" }, { status: 500 })
  }
}
