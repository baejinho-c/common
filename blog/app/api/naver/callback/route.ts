import { type NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const code = searchParams.get("code")
    const state = searchParams.get("state")
    const error = searchParams.get("error")

    if (error) {
      return NextResponse.redirect(`${process.env.NEXT_PUBLIC_BASE_URL}/dashboard?error=naver_auth_failed`)
    }

    if (!code || !state) {
      return NextResponse.redirect(`${process.env.NEXT_PUBLIC_BASE_URL}/dashboard?error=invalid_callback`)
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
      return NextResponse.redirect(`${process.env.NEXT_PUBLIC_BASE_URL}/dashboard?error=token_failed`)
    }

    // 사용자 정보 조회
    const userResponse = await fetch("https://openapi.naver.com/v1/nid/me", {
      headers: {
        Authorization: `Bearer ${tokenData.access_token}`,
      },
    })

    const userData = await userResponse.json()

    if (userData.resultcode !== "00") {
      return NextResponse.redirect(`${process.env.NEXT_PUBLIC_BASE_URL}/dashboard?error=user_info_failed`)
    }

    // 성공적으로 연동 완료
    const response = NextResponse.redirect(`${process.env.NEXT_PUBLIC_BASE_URL}/dashboard?success=naver_connected`)

    // 네이버 토큰을 쿠키에 저장 (실제로는 데이터베이스에 저장해야 함)
    response.cookies.set("naver_token", tokenData.access_token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: tokenData.expires_in,
    })

    return response
  } catch (error) {
    console.error("네이버 콜백 처리 오류:", error)
    return NextResponse.redirect(`${process.env.NEXT_PUBLIC_BASE_URL}/dashboard?error=callback_failed`)
  }
}
