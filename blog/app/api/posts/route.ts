import { NextResponse } from "next/server"
import { cookies } from "next/headers"

// 임시 포스트 데이터
const posts = [
  {
    id: "1",
    title: "AI와 블로그 자동화의 미래",
    content: "인공지능 기술의 발전으로 블로그 작성이 더욱 쉬워지고 있습니다...",
    status: "published",
    publishedAt: "2024-01-15T09:00:00Z",
    views: 1250,
    likes: 45,
    category: "기술",
    tags: ["AI", "블로그", "자동화"],
  },
  {
    id: "2",
    title: "효율적인 콘텐츠 제작 전략",
    content: "좋은 콘텐츠를 만들기 위한 체계적인 접근 방법을 알아보겠습니다...",
    status: "draft",
    createdAt: "2024-01-14T14:30:00Z",
    category: "마케팅",
    tags: ["콘텐츠", "전략", "마케팅"],
  },
  {
    id: "3",
    title: "네이버 블로그 SEO 최적화 가이드",
    content: "네이버 블로그에서 검색 노출을 높이는 방법들을 정리했습니다...",
    status: "scheduled",
    scheduledAt: "2024-01-16T10:00:00Z",
    category: "SEO",
    tags: ["네이버", "SEO", "최적화"],
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
      posts,
      total: posts.length,
    })
  } catch (error) {
    console.error("포스트 조회 오류:", error)
    return NextResponse.json({ success: false, message: "포스트를 불러올 수 없습니다." }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const cookieStore = cookies()
    const token = cookieStore.get("auth_token")?.value

    if (!token) {
      return NextResponse.json({ success: false, message: "인증이 필요합니다." }, { status: 401 })
    }

    const { title, content, category, tags, status } = await request.json()

    const newPost = {
      id: String(posts.length + 1),
      title,
      content,
      category,
      tags,
      status: status || "draft",
      createdAt: new Date().toISOString(),
    }

    posts.push(newPost)

    return NextResponse.json({
      success: true,
      message: "포스트가 생성되었습니다.",
      post: newPost,
    })
  } catch (error) {
    console.error("포스트 생성 오류:", error)
    return NextResponse.json({ success: false, message: "포스트 생성에 실패했습니다." }, { status: 500 })
  }
}
