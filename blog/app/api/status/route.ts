import { NextResponse } from "next/server"

export async function GET() {
  try {
    // OpenAI API 키 확인
    const openaiKey = process.env.OPENAI_API_KEY
    const hasOpenAI = !!openaiKey && openaiKey.length > 0

    // 네이버 API 키 확인
    const naverClientId = process.env.NAVER_CLIENT_ID
    const naverClientSecret = process.env.NAVER_CLIENT_SECRET
    const hasNaver = !!naverClientId && !!naverClientSecret

    return NextResponse.json(
      {
        success: true,
        status: {
          openai: hasOpenAI,
          naver: hasNaver,
          overall: hasOpenAI && hasNaver,
        },
      },
      {
        headers: {
          "Content-Type": "application/json",
        },
      },
    )
  } catch (error) {
    console.error("[v0] API status check error:", error)
    return NextResponse.json(
      {
        success: false,
        status: {
          openai: false,
          naver: false,
          overall: false,
        },
      },
      {
        status: 500,
        headers: {
          "Content-Type": "application/json",
        },
      },
    )
  }
}
