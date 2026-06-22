import { NextResponse } from "next/server"
import { cookies } from "next/headers"

export async function POST(request: Request) {
  try {
    const cookieStore = cookies()
    const authToken = cookieStore.get("auth_token")?.value
    const naverToken = cookieStore.get("naver_token")?.value

    if (!authToken) {
      return NextResponse.json({ success: false, message: "로그인이 필요합니다." }, { status: 401 })
    }

    if (!naverToken) {
      return NextResponse.json({ success: false, message: "네이버 블로그 연동이 필요합니다." }, { status: 400 })
    }

    const { title, content, category } = await request.json()

    if (!title || !content) {
      return NextResponse.json({ success: false, message: "제목과 내용이 필요합니다." }, { status: 400 })
    }

    // 실제 네이버 블로그 API 호출 (현재는 시뮬레이션)
    // const publishResponse = await fetch("https://openapi.naver.com/blog/writePost.json", {
    //   method: "POST",
    //   headers: {
    //     "Authorization": `Bearer ${naverToken}`,
    //     "Content-Type": "application/json",
    //   },
    //   body: JSON.stringify({
    //     title,
    //     contents: content,
    //     categoryNo: category || 0,
    //   }),
    // })

    // 시뮬레이션된 성공 응답
    const simulatedResponse = {
      success: true,
      postId: `post_${Date.now()}`,
      url: `https://blog.naver.com/example/${Date.now()}`,
    }

    return NextResponse.json({
      success: true,
      message: "네이버 블로그에 포스팅되었습니다.",
      data: simulatedResponse,
    })
  } catch (error) {
    console.error("네이버 블로그 포스팅 오류:", error)
    return NextResponse.json({ success: false, message: "포스팅에 실패했습니다." }, { status: 500 })
  }
}
