import { type NextRequest, NextResponse } from "next/server"
import { cookies } from "next/headers"

export async function POST(request: NextRequest) {
  try {
    console.log("Login API called")
    const { email, password } = await request.json()
    console.log("Login attempt:", { email, password: password ? "***" : "empty" })

    // 테스트 계정 확인
    if (email === "test@example.com" && password === "password123") {
      console.log("Test account login detected")
      const cookieStore = await cookies()

      const sessionData = {
        user: {
          id: "1",
          email: "test@example.com",
          name: "테스트 사용자",
          naverConnected: false,
          plan: "free" as const,
        },
        expires: new Date(Date.now() + 24 * 60 * 60 * 1000), // 24시간
      }

      // 세션 쿠키 설정
      cookieStore.set("session", JSON.stringify(sessionData), {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        maxAge: 24 * 60 * 60, // 24시간
        path: "/",
      })

      console.log("Test login successful, session set")

      return NextResponse.json(
        {
          success: true,
          message: "로그인 성공",
          user: sessionData.user,
        },
        {
          status: 200,
          headers: {
            "Content-Type": "application/json",
          },
        },
      )
    }

    // 실제 인증 로직 (여기서는 간단한 예시)
    if (email && password) {
      const cookieStore = await cookies()

      const sessionData = {
        user: {
          id: "2",
          email: email,
          name: email.split("@")[0],
          naverConnected: false,
          plan: "free" as const,
        },
        expires: new Date(Date.now() + 24 * 60 * 60 * 1000),
      }

      // 세션 쿠키 설정
      cookieStore.set("session", JSON.stringify(sessionData), {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        maxAge: 24 * 60 * 60,
        path: "/",
      })

      console.log("Real login successful, session set")

      return NextResponse.json(
        {
          success: true,
          message: "로그인 성공",
          user: sessionData.user,
        },
        {
          status: 200,
          headers: {
            "Content-Type": "application/json",
          },
        },
      )
    }

    console.log("Invalid credentials provided")
    return NextResponse.json(
      { success: false, message: "이메일 또는 비밀번호가 올바르지 않습니다." },
      {
        status: 401,
        headers: {
          "Content-Type": "application/json",
        },
      },
    )
  } catch (error) {
    console.error("Login API error:", error)
    return NextResponse.json(
      { success: false, message: "서버 오류가 발생했습니다." },
      {
        status: 500,
        headers: {
          "Content-Type": "application/json",
        },
      },
    )
  }
}
