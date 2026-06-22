import { type NextRequest, NextResponse } from "next/server"
import { cookies } from "next/headers"

export async function GET(request: NextRequest) {
  try {
    console.log("Auth check API called")
    const cookieStore = await cookies()
    const sessionCookie = cookieStore.get("session")

    if (!sessionCookie) {
      console.log("No session cookie found")
      return NextResponse.json(
        { success: false, message: "인증되지 않은 사용자입니다." },
        {
          status: 401,
          headers: {
            "Content-Type": "application/json",
          },
        },
      )
    }

    console.log("Session cookie found, parsing...")
    try {
      const session = JSON.parse(sessionCookie.value)
      console.log("Session parsed successfully:", { user: session.user?.email, expires: session.expires })

      // 세션 만료 확인
      if (new Date() > new Date(session.expires)) {
        console.log("Session expired, deleting cookie")
        cookieStore.delete("session")
        return NextResponse.json(
          { success: false, message: "세션이 만료되었습니다." },
          {
            status: 401,
            headers: {
              "Content-Type": "application/json",
            },
          },
        )
      }

      console.log("Session valid, returning user data")
      return NextResponse.json(
        {
          success: true,
          user: session.user,
        },
        {
          status: 200,
          headers: {
            "Content-Type": "application/json",
          },
        },
      )
    } catch (parseError) {
      console.error("Session parse error:", parseError)
      cookieStore.delete("session")
      return NextResponse.json(
        { success: false, message: "잘못된 세션 데이터입니다." },
        {
          status: 401,
          headers: {
            "Content-Type": "application/json",
          },
        },
      )
    }
  } catch (error) {
    console.error("Auth check error:", error)
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
