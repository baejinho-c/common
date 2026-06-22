import { type NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const code = searchParams.get("code")
    const state = searchParams.get("state")

    if (!code || !state) {
      return NextResponse.redirect(`${process.env.NEXT_PUBLIC_BASE_URL}/login?error=invalid_callback`)
    }

    // 네이버 액세스 토큰 요청
    const tokenResponse = await fetch("https://nid.naver.com/oauth2.0/token", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams({
        grant_type: "authorization_code",
        client_id: process.env.NAVER_CLIENT_ID!,
        client_secret: process.env.NAVER_CLIENT_SECRET!,
        code,
        state,
      }),
    })

    const tokenData = await tokenResponse.json()

    if (tokenData.error) {
      return NextResponse.redirect(`${process.env.NEXT_PUBLIC_BASE_URL}/login?error=token_failed`)
    }

    // 사용자 정보 조회
    const userResponse = await fetch("https://openapi.naver.com/v1/nid/me", {
      headers: {
        Authorization: `Bearer ${tokenData.access_token}`,
      },
    })

    const userData = await userResponse.json()

    if (userData.resultcode !== "00") {
      return NextResponse.redirect(`${process.env.NEXT_PUBLIC_BASE_URL}/login?error=user_info_failed`)
    }

    // 로그인 성공 - 세션 생성
    const response = NextResponse.redirect(`${process.env.NEXT_PUBLIC_BASE_URL}/dashboard`)

    // 인증 토큰 설정
    response.cookies.set("auth_token", `naver_${userData.response.id}`, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 60 * 60 * 24 * 7, // 7일
    })

    return response
  } catch (error) {
    console.error("네이버 로그인 콜백 오류:", error)
    return NextResponse.redirect(`${process.env.NEXT_PUBLIC_BASE_URL}/login?error=login_failed`)
  }
}
