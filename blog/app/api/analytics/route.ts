import { NextResponse } from "next/server"
import { cookies } from "next/headers"

export async function GET() {
  try {
    const cookieStore = cookies()
    const token = cookieStore.get("auth_token")?.value

    if (!token) {
      return NextResponse.json({ success: false, message: "인증이 필요합니다." }, { status: 401 })
    }

    // 임시 분석 데이터
    const analytics = {
      overview: {
        totalPosts: 15,
        totalViews: 12450,
        totalLikes: 234,
        totalComments: 89,
      },
      monthlyStats: [
        { month: "2024-01", posts: 5, views: 3200, likes: 45 },
        { month: "2024-02", posts: 7, views: 4800, likes: 78 },
        { month: "2024-03", posts: 3, views: 4450, likes: 111 },
      ],
      topPosts: [
        { title: "AI와 블로그 자동화의 미래", views: 1250, likes: 45 },
        { title: "효율적인 콘텐츠 제작 전략", views: 980, likes: 32 },
        { title: "네이버 블로그 SEO 최적화", views: 756, likes: 28 },
      ],
      categoryStats: [
        { category: "기술", count: 8, percentage: 53 },
        { category: "마케팅", count: 4, percentage: 27 },
        { category: "SEO", count: 3, percentage: 20 },
      ],
    }

    return NextResponse.json({
      success: true,
      analytics,
    })
  } catch (error) {
    console.error("분석 데이터 조회 오류:", error)
    return NextResponse.json({ success: false, message: "분석 데이터를 불러올 수 없습니다." }, { status: 500 })
  }
}
