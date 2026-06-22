import { NextRequest, NextResponse } from 'next/server'
import { cookies } from 'next/headers'

export async function POST(request: NextRequest) {
  try {
    const cookieStore = await cookies()
    
    // 세션 쿠키 삭제
    cookieStore.delete('session')

    return NextResponse.json(
      { success: true, message: '로그아웃되었습니다.' },
      { 
        status: 200,
        headers: {
          'Content-Type': 'application/json'
        }
      }
    )
  } catch (error) {
    console.error('Logout error:', error)
    return NextResponse.json(
      { success: false, message: '로그아웃 중 오류가 발생했습니다.' },
      { 
        status: 500,
        headers: {
          'Content-Type': 'application/json'
        }
      }
    )
  }
}
