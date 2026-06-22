import { NextResponse } from "next/server"
import { cookies } from "next/headers"

// 임시 스케줄 데이터
const schedules = [
  {
    id: "1",
    title: "주간 기술 트렌드 리뷰",
    scheduledAt: "2024-01-16T09:00:00Z",
    status: "pending",
    category: "기술",
  },
  {
    id: "2",
    title: "마케팅 전략 업데이트",
    scheduledAt: "2024-01-17T14:00:00Z",
    status: "pending",
    category: "마케팅",
  },
]

export async function GET() {
  try {
    const cookieStore = cookies()
    const token = cookieStore.get("auth_token")?.value

    if (!token) {
      return NextResponse.json({ success: false, message: "인증이 필요합니다." }, { status: 401 })
    }

    return NextResponse.json({
      success: true,
      schedules,
    })
  } catch (error) {
    console.error("스케줄 조회 오류:", error)
    return NextResponse.json({ success: false, message: "스케줄을 불러올 수 없습니다." }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const cookieStore = cookies()
    const token = cookieStore.get("auth_token")?.value

    if (!token) {
      return NextResponse.json({ success: false, message: "인증이 필요합니다." }, { status: 401 })
    }

    const { title, scheduledAt, category } = await request.json()

    const newSchedule = {
      id: String(schedules.length + 1),
      title,
      scheduledAt,
      category,
      status: "pending",
    }

    schedules.push(newSchedule)

    return NextResponse.json({
      success: true,
      message: "스케줄이 등록되었습니다.",
      schedule: newSchedule,
    })
  } catch (error) {
    console.error("스케줄 등록 오류:", error)
    return NextResponse.json({ success: false, message: "스케줄 등록에 실패했습니다." }, { status: 500 })
  }
}
