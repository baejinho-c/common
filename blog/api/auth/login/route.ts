import { NextResponse } from "next/server"
import { cookies } from "next/headers"

// 임시 사용자 데이터 (실제로는 데이터베이스에서 가져와야 함)
const users = [
  {
    id: "1",
    email: "test@example.com",
    password: "password123",
    name: "테스트 사용자",
    profileImage: "/placeholder-user.jpg",
    naverConnected: true,
    plan: "free" as const,
  },
  {
    id: "2",
    email: "user@example.com",
    password: "password123",
    name: "일반 사용자",
    profileImage: "/placeholder-user.jpg",
    naverConnected: false,
    plan: "free" as const,
  },
]

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json()

    if (!email || !password) {
      return NextResponse.json(
        {
          success: false,
          message: "이메일과 비밀번호를 입력해주세요.",
        },
        { status: 400 },
      )
    }

    // 사용자 찾기
    const user = users.find((u) => u.email === email && u.password === password)

    if (!user) {
      return NextResponse.json(
        {
          success: false,
          message: "이메일 또는 비밀번호가 일치하지 않습니다.",
        },
        { status: 401 },
      )
    }

    // 간단한 토큰 생성 (실제로는 JWT 사용)
    const token = Buffer.from(`${user.id}:${Date.now()}`).toString("base64")

    // 사용자 정보에서 비밀번호 제외
    const { password: _, ...userWithoutPassword } = user

    // 쿠키 설정
    cookies().set({
      name: "auth_token",
      value: token,
      httpOnly: true,
      path: "/",
      maxAge: 60 * 60 * 24 * 7, // 7일
      sameSite: "lax",
    })

    // 사용자 정보 쿠키 설정 (클라이언트에서 접근 가능)
    cookies().set({
      name: "user_info",
      value: JSON.stringify(userWithoutPassword),
      path: "/",
      maxAge: 60 * 60 * 24 * 7, // 7일
      sameSite: "lax",
    })

    return NextResponse.json({
      success: true,
      user: userWithoutPassword,
    })
  } catch (error) {
    console.error("로그인 오류:", error)
    return NextResponse.json(
      {
        success: false,
        message: "로그인 처리 중 오류가 발생했습니다.",
      },
      { status: 500 },
    )
  }
}
