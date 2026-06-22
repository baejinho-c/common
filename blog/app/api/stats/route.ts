import { NextResponse } from "next/server"

export async function GET() {
  try {
    // 실제 통계 데이터 (임시)
    const stats = {
      totalPosts: 42,
      totalViews: 15420,
      totalLikes: 892,
      totalComments: 156,
      monthlyGrowth: 23.5,
      topPosts: [
        { title: "React 성능 최적화 가이드", views: 2340, likes: 89 },
        { title: "Next.js 14 새로운 기능들", views: 1890, likes: 67 },
        { title: "TypeScript 고급 패턴", views: 1560, likes: 45 },
      ],
      recentActivity: [
        { action: "포스트 발행", title: "AI와 함께하는 개발", time: "2시간 전" },
        { action: "댓글 작성", title: "React 훅 사용법", time: "4시간 전" },
        { action: "포스트 수정", title: "JavaScript ES2024", time: "1일 전" },
      ],
    }

    return NextResponse.json({ success: true, data: stats })
  } catch (error) {
    console.error("통계 조회 오류:", error)
    return NextResponse.json({ success: false, message: "통계 조회에 실패했습니다." }, { status: 500 })
  }
}
