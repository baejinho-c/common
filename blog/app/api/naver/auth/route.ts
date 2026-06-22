import { NextResponse } from "next/server"

export async function GET() {
  try {
    const clientId = process.env.NAVER_CLIENT_ID
    const redirectUri = encodeURIComponent(`${process.env.NEXT_PUBLIC_BASE_URL}/api/naver/callback`)
    const state = Math.random().toString(36).substring(2, 15)

    if (!clientId) {
      return NextResponse.json({ error: "네이버 클라이언트 ID가 설정되지 않았습니다." }, { status: 500 })
    }

    const naverAuthUrl = `https://nid.naver.com/oauth2.0/authorize?response_type=code&client_id=${clientId}&redirect_uri=${redirectUri}&state=${state}`

    return NextResponse.json({
      success: true,
      authUrl: naverAuthUrl,
      state,
    })
  } catch (error) {
    console.error("네이버 인증 URL 생성 오류:", error)
    return NextResponse.json({ error: "네이버 인증 URL 생성에 실패했습니다." }, { status: 500 })
  }
}
