import { NextResponse } from "next/server"

// 임시 사용자 저장소 (실제로는 데이터베이스 사용)
const users: Array<{
  id: string
  email: string
  password: string
  name: string
  plan: string
  naverConnected: boolean
}> = [
  {
    id: "1",
    email: "test@example.com",
    password: "password123",
    name: "테스트 사용자",
    plan: "free",
    naverConnected: false,
  },
]

export async function POST(request: Request) {
  try {
    const { name, email, password } = await request.json()

    // 입력 검증
    if (!name || !email || !password) {
      return NextResponse.json({ success: false, message: "모든 필드를 입력해주세요." }, { status: 400 })
    }

    if (password.length < 6) {
      return NextResponse.json({ success: false, message: "비밀번호는 6자 이상이어야 합니다." }, { status: 400 })
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return NextResponse.json({ success: false, message: "올바른 이메일 형식이 아닙니다." }, { status: 400 })
    }

    // 중복 이메일 확인
    const existingUser = users.find((u) => u.email === email)
    if (existingUser) {
      return NextResponse.json({ success: false, message: "이미 가입된 이메일입니다." }, { status: 409 })
    }

    // 새 사용자 생성
    const newUser = {
      id: (users.length + 1).toString(),
      email,
      password, // 실제로는 해시화 필요
      name,
      plan: "free",
      naverConnected: false,
    }

    users.push(newUser)

    // 자동 로그인을 위한 토큰 생성
    const token = Buffer.from(`${newUser.id}:${newUser.email}:${Date.now()}`).toString("base64")

    const response = NextResponse.json({
      success: true,
      message: "회원가입이 완료되었습니다.",
      user: {
        id: newUser.id,
        email: newUser.email,
        name: newUser.name,
        plan: newUser.plan,
        naverConnected: newUser.naverConnected,
      },
    })

    // 쿠키 설정
    response.cookies.set("auth_token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 7, // 7일
    })

    return response
  } catch (error) {
    console.error("회원가입 오류:", error)
    return NextResponse.json({ success: false, message: "회원가입 처리 중 오류가 발생했습니다." }, { status: 500 })
  }
}
