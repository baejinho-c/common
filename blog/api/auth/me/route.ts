import { NextResponse } from "next/server"
import { cookies } from "next/headers"

// 임시 사용자 데이터
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

export async function GET() {
  try {
    const cookieStore = cookies()
    const token = cookieStore.get("auth_token")?.value

    if (!token) {
      return NextResponse.json({ success: false, message: "인증이 필요합니다." }, { status: 401 })
    }

    // 토큰에서 사용자 ID 추출
    try {
      const decoded = Buffer.from(token, "base64").toString()
      const [userId] = decoded.split(":")

      const user = users.find((u) => u.id === userId)

      if (!user) {
        return NextResponse.json({ success: false, message: "사용자를 찾을 수 없습니다." }, { status: 404 })
      }

      // 비밀번호 제외
      const { password: _, ...userWithoutPassword } = user

      return NextResponse.json({
        success: true,
        user: userWithoutPassword,
      })
    } catch (error) {
      console.error("토큰 디코딩 오류:", error)
      return NextResponse.json({ success: false, message: "유효하지 않은 인증 토큰입니다." }, { status: 401 })
    }
  } catch (error) {
    console.error("사용자 정보 조회 오류:", error)
    return NextResponse.json({ success: false, message: "사용자 정보 조회 중 오류가 발생했습니다." }, { status: 500 })
  }
}
