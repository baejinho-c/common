import { NextResponse } from "next/server"
import { cookies } from "next/headers"
import { UsageTracker } from "@/lib/usage-tracker"

export async function GET() {
  try {
    const isDevMode = process.env.NODE_ENV === "development"
    let userId = "test-user"

    if (!isDevMode) {
      const token = cookies().get("auth_token")?.value
      if (!token) {
        return NextResponse.json({ error: "로그인이 필요합니다." }, { status: 401 })
      }
      userId = "authenticated-user"
    }

    const stats = UsageTracker.getUsageStats(userId)

    return NextResponse.json({
      success: true,
      data: stats,
      devMode: isDevMode,
    })
  } catch (error) {
    console.error("사용량 조회 오류:", error)
    return NextResponse.json({ error: "사용량 조회 중 오류가 발생했습니다." }, { status: 500 })
  }
}

export async function DELETE() {
  try {
    const isDevMode = process.env.NODE_ENV === "development"
    let userId = "test-user"

    if (!isDevMode) {
      const token = cookies().get("auth_token")?.value
      if (!token) {
        return NextResponse.json({ error: "로그인이 필요합니다." }, { status: 401 })
      }
      userId = "authenticated-user"
    }

    UsageTracker.resetUsage(userId)

    return NextResponse.json({
      success: true,
      message: "사용량이 초기화되었습니다.",
    })
  } catch (error) {
    console.error("사용량 초기화 오류:", error)
    return NextResponse.json({ error: "사용량 초기화 중 오류가 발생했습니다." }, { status: 500 })
  }
}
