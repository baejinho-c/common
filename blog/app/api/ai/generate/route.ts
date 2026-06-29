import { NextResponse } from "next/server"
import OpenAI from "openai"
import { cookies } from "next/headers"
import { UsageTracker } from "@/lib/usage-tracker"

export async function POST(request: Request) {
  try {
    const { prompt, type } = (await request.json()) as { prompt: string; type: "outline" | "content" }

    if (!prompt?.trim()) {
      return NextResponse.json({ success: false, message: "프롬프트를 입력해주세요." }, { status: 400 })
    }

    console.log(`AI 생성 요청: 타입=${type}, 프롬프트="${prompt}"`)

    // 개발 환경에서는 인증 검증 우회, 하지만 실제 API는 호출
    const isDevMode = process.env.NODE_ENV === "development"
    let userId = "test-user"

    if (!isDevMode) {
      // 프로덕션에서만 실제 인증 확인
      const token = (await cookies()).get("auth_token")?.value
      if (!token) {
        return NextResponse.json({ success: false, message: "로그인이 필요합니다." }, { status: 401 })
      }
      userId = "authenticated-user"
    }

    // 사용량 체크 (개발 환경에서는 관대하게)
    const usageCheck = UsageTracker.canMakeRequest(userId)
    if (!usageCheck.allowed && !isDevMode) {
      return NextResponse.json({ success: false, message: usageCheck.reason, limitExceeded: true }, { status: 429 })
    }

    // OpenAI API 키 확인
    const apiKey = process.env.OPENAI_API_KEY
    console.log("OpenAI API 키 확인:", apiKey ? "설정됨" : "설정되지 않음")

    if (!apiKey || apiKey.includes("sk-your") || apiKey.length < 20) {
      // 개발 환경에서 더 자세한 에러 메시지 제공
      const errorMessage = isDevMode
        ? `OPENAI_API_KEY가 설정되지 않았습니다. Vercel 프로젝트 설정에서 환경변수를 추가해주세요. 현재 키: ${apiKey ? apiKey.substring(0, 10) + "..." : "없음"}`
        : "유효한 OPENAI_API_KEY를 설정해주세요."

      return NextResponse.json({ success: false, message: errorMessage }, { status: 500 })
    }

    const openai = new OpenAI({
      apiKey: apiKey,
    })

    // 실제 OpenAI API 호출 (테스트 계정이라도 실제 API 사용)
    let systemPrompt = ""
    let userPrompt = ""

    if (type === "outline") {
      systemPrompt = `당신은 전문적인 블로그 작성자입니다. 주어진 주제에 대해 체계적이고 논리적인 블로그 포스트 아웃라인을 작성해주세요.

아웃라인 형식:
1. 서론 (독자의 관심을 끄는 내용)
2. 본론 (3-5개의 주요 포인트)
3. 결론 (요약 및 행동 유도)

각 섹션에 대해 간단한 설명도 포함해주세요. 한국어로 작성해주세요.`

      userPrompt = `다음 주제에 대한 블로그 포스트 아웃라인을 작성해주세요: "${prompt}"`
    } else {
      systemPrompt = `당신은 전문적인 블로그 작성자입니다. 주어진 주제에 대해 흥미롭고 유익한 블로그 포스트를 작성해주세요.

작성 가이드라인:
- 독자의 관심을 끄는 서론으로 시작
- 명확하고 구체적인 정보 제공
- 실용적인 팁이나 조언 포함
- 자연스러운 한국어 사용
- 적절한 길이 (1000-1500자 정도)
- SEO를 고려한 키워드 자연스럽게 포함
- 단락을 적절히 나누어 가독성 향상`

      userPrompt = `다음 주제에 대한 완전한 블로그 포스트를 작성해주세요: "${prompt}"`
    }

    console.log("OpenAI API 호출 시작...")

    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userPrompt },
      ],
      max_tokens: type === "outline" ? 800 : 2000,
      temperature: 0.7,
    })

    const generatedText = completion.choices[0]?.message?.content || ""
    console.log("OpenAI API 호출 완료, 생성된 텍스트 길이:", generatedText.length)

    // 사용량 기록
    const estimatedTokens = Math.ceil(generatedText.length / 4)
    UsageTracker.recordUsage(userId, estimatedTokens)

    return NextResponse.json({
      success: true,
      content: generatedText,
      devMode: isDevMode,
      usage: { tokens: estimatedTokens, requests: 1 },
    })
  } catch (error) {
    console.error("AI 생성 오류:", error)

    if (error instanceof Error) {
      if (error.message.includes("API key") || error.message.includes("401")) {
        return NextResponse.json({ success: false, message: "OpenAI API 키가 유효하지 않습니다." }, { status: 401 })
      }

      if (error.message.includes("rate limit")) {
        return NextResponse.json(
          { success: false, message: "API 요청 한도를 초과했습니다. 잠시 후 다시 시도해주세요." },
          { status: 429 },
        )
      }

      if (error.message.includes("quota")) {
        return NextResponse.json(
          { success: false, message: "OpenAI API 사용량 한도를 초과했습니다. 결제 정보를 확인해주세요." },
          { status: 429 },
        )
      }

      return NextResponse.json({ success: false, message: error.message }, { status: 500 })
    }

    return NextResponse.json({ success: false, message: "AI 콘텐츠 생성 중 오류가 발생했습니다." }, { status: 500 })
  }
}
