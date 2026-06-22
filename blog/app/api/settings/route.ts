import { NextResponse } from "next/server"
import { cookies } from "next/headers"

export async function GET() {
  try {
    const cookieStore = cookies()
    const token = cookieStore.get("auth_token")?.value

    if (!token) {
      return NextResponse.json({ success: false, message: "인증이 필요합니다." }, { status: 401 })
    }

    // 임시 설정 데이터
    const settings = {
      naverBlogId: "example_blog",
      autoPublish: true,
      publishTime: "09:00",
      categories: ["기술", "일상", "리뷰"],
      defaultCategory: "기술",
      seoOptimization: true,
      notifications: {
        email: true,
        push: false,
      },
    }

    return NextResponse.json({
      success: true,
      settings,
    })
  } catch (error) {
    console.error("설정 조회 오류:", error)
    return NextResponse.json({ success: false, message: "설정을 불러올 수 없습니다." }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const cookieStore = cookies()
    const token = cookieStore.get("auth_token")?.value

    if (!token) {
      return NextResponse.json({ success: false, message: "인증이 필요합니다." }, { status: 401 })
    }

    const settings = await request.json()

    // 실제로는 데이터베이스에 저장
    console.log("설정 저장:", settings)

    return NextResponse.json({
      success: true,
      message: "설정이 저장되었습니다.",
      settings,
    })
  } catch (error) {
    console.error("설정 저장 오류:", error)
    return NextResponse.json({ success: false, message: "설정 저장에 실패했습니다." }, { status: 500 })
  }
}
