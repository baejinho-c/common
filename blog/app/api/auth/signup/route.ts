import { NextRequest, NextResponse } from 'next/server'
import { cookies } from 'next/headers'

export async function POST(request: NextRequest) {
  try {
    const { name, email, password } = await request.json()

    // 입력 유효성 검사
    if (!name || !email || !password) {
      return NextResponse.json(
        { success: false, message: '모든 필드를 입력해주세요.' },
        { 
          status: 400,
          headers: {
            'Content-Type': 'application/json'
          }
        }
      )
    }

    // 이메일 형식 검사
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { success: false, message: '올바른 이메일 형식을 입력해주세요.' },
        { 
          status: 400,
          headers: {
            'Content-Type': 'application/json'
          }
        }
      )
    }

    // 비밀번호 길이 검사
    if (password.length < 6) {
      return NextResponse.json(
        { success: false, message: '비밀번호는 최소 6자 이상이어야 합니다.' },
        { 
          status: 400,
          headers: {
            'Content-Type': 'application/json'
          }
        }
      )
    }

    // 실제로는 데이터베이스에 사용자를 저장해야 함
    // 여기서는 간단한 예시로 바로 로그인 처리
    const cookieStore = await cookies()
    
    const userId = Date.now().toString() // 임시 ID 생성
    
    cookieStore.set('session', JSON.stringify({
      user: {
        id: userId,
        email: email,
        name: name
      },
      expires: new Date(Date.now() + 24 * 60 * 60 * 1000) // 24시간
    }), {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 24 * 60 * 60 // 24시간
    })

    return NextResponse.json(
      { 
        success: true, 
        message: '회원가입이 완료되었습니다.',
        user: {
          id: userId,
          email: email,
          name: name
        }
      },
      { 
        status: 201,
        headers: {
          'Content-Type': 'application/json'
        }
      }
    )
  } catch (error) {
    console.error('Signup error:', error)
    return NextResponse.json(
      { success: false, message: '회원가입 중 오류가 발생했습니다.' },
      { 
        status: 500,
        headers: {
          'Content-Type': 'application/json'
        }
      }
    )
  }
}
