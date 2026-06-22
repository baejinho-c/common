import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { CheckCircle, Zap, Target, BarChart3, Clock, Shield, Star, ArrowRight } from "lucide-react"
import { ApiStatusIndicator } from "@/components/api-status-indicator"

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Header */}
      <header className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                <Zap className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                AutoBlogger
              </span>
            </div>
            <nav className="hidden md:flex items-center space-x-6">
              <Link href="#features" className="text-gray-600 hover:text-gray-900 transition-colors">
                기능
              </Link>
              <Link href="#pricing" className="text-gray-600 hover:text-gray-900 transition-colors">
                요금제
              </Link>
              <Link href="/help" className="text-gray-600 hover:text-gray-900 transition-colors">
                도움말
              </Link>
              <Link href="/contact" className="text-gray-600 hover:text-gray-900 transition-colors">
                문의
              </Link>
            </nav>
            <div className="flex items-center space-x-3">
              <Link href="/login">
                <Button variant="ghost">로그인</Button>
              </Link>
              <Link href="/signup">
                <Button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
                  무료 시작하기
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto text-center">
          <Badge className="mb-4 bg-blue-100 text-blue-800 hover:bg-blue-100">🚀 AI 기반 자동화 솔루션</Badge>
          <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
            AI가 만드는
            <br />
            완벽한 블로그 콘텐츠
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            GPT-4o를 활용한 고품질 콘텐츠 생성부터 네이버 블로그 자동 포스팅까지, 블로그 운영의 모든 것을 자동화하세요.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/signup">
              <Button
                size="lg"
                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-lg px-8 py-3"
              >
                무료로 시작하기
                <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
            </Link>
            <Link href="/help">
              <Button size="lg" variant="outline" className="text-lg px-8 py-3 bg-transparent">
                데모 보기
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 px-4 bg-white">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">강력한 기능들</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              블로그 운영에 필요한 모든 기능을 하나의 플랫폼에서 제공합니다.
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow">
              <CardHeader>
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                  <Zap className="w-6 h-6 text-blue-600" />
                </div>
                <CardTitle>AI 콘텐츠 생성</CardTitle>
                <CardDescription>GPT-4o를 활용한 고품질 블로그 포스트 자동 생성</CardDescription>
              </CardHeader>
            </Card>
            <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow">
              <CardHeader>
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
                  <Target className="w-6 h-6 text-green-600" />
                </div>
                <CardTitle>네이버 블로그 연동</CardTitle>
                <CardDescription>생성된 콘텐츠를 네이버 블로그에 자동으로 포스팅</CardDescription>
              </CardHeader>
            </Card>
            <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow">
              <CardHeader>
                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
                  <BarChart3 className="w-6 h-6 text-purple-600" />
                </div>
                <CardTitle>SEO 최적화</CardTitle>
                <CardDescription>검색 엔진 최적화된 콘텐츠로 더 많은 방문자 유치</CardDescription>
              </CardHeader>
            </Card>
            <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow">
              <CardHeader>
                <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center mb-4">
                  <Clock className="w-6 h-6 text-orange-600" />
                </div>
                <CardTitle>예약 포스팅</CardTitle>
                <CardDescription>원하는 시간에 자동으로 포스팅되도록 스케줄 설정</CardDescription>
              </CardHeader>
            </Card>
            <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow">
              <CardHeader>
                <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center mb-4">
                  <BarChart3 className="w-6 h-6 text-red-600" />
                </div>
                <CardTitle>성과 분석</CardTitle>
                <CardDescription>포스트 성과를 실시간으로 모니터링하고 분석</CardDescription>
              </CardHeader>
            </Card>
            <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow">
              <CardHeader>
                <div className="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center mb-4">
                  <Shield className="w-6 h-6 text-indigo-600" />
                </div>
                <CardTitle>안전한 관리</CardTitle>
                <CardDescription>보안이 강화된 계정 관리 및 데이터 보호</CardDescription>
              </CardHeader>
            </Card>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 px-4 bg-gray-50">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">사용자 후기</h2>
            <p className="text-xl text-gray-600">이미 많은 블로거들이 AutoBlogger와 함께하고 있습니다.</p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            <Card className="border-0 shadow-lg">
              <CardContent className="pt-6">
                <div className="flex items-center mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                  ))}
                </div>
                <p className="text-gray-600 mb-4">
                  "AutoBlogger 덕분에 블로그 운영이 정말 쉬워졌어요. 매일 고품질 콘텐츠가 자동으로 포스팅되니 너무
                  편해요!"
                </p>
                <div className="flex items-center">
                  <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center text-white font-semibold">
                    김
                  </div>
                  <div className="ml-3">
                    <p className="font-semibold">김블로거</p>
                    <p className="text-sm text-gray-500">여행 블로거</p>
                  </div>
                </div>
                <div className="mt-4">
                  <Link
                    href="/posts/autoblogger-review-kim-blogger"
                    className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                  >
                    전체 후기 보기 →
                  </Link>
                </div>
              </CardContent>
            </Card>
            <Card className="border-0 shadow-lg">
              <CardContent className="pt-6">
                <div className="flex items-center mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                  ))}
                </div>
                <p className="text-gray-600 mb-4">
                  "SEO 최적화 기능이 정말 좋아요. 검색 노출이 확실히 늘어났고 방문자도 많이 증가했습니다."
                </p>
                <div className="flex items-center">
                  <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center text-white font-semibold">
                    이
                  </div>
                  <div className="ml-3">
                    <p className="font-semibold">이마케터</p>
                    <p className="text-sm text-gray-500">마케팅 전문가</p>
                  </div>
                </div>
                <div className="mt-4">
                  <Link
                    href="/posts/seo-optimization-success-story"
                    className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                  >
                    전체 후기 보기 →
                  </Link>
                </div>
              </CardContent>
            </Card>
            <Card className="border-0 shadow-lg">
              <CardContent className="pt-6">
                <div className="flex items-center mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                  ))}
                </div>
                <p className="text-gray-600 mb-4">
                  "시간 절약이 정말 크네요. 이제 콘텐츠 기획에만 집중할 수 있어서 블로그 품질이 더 좋아졌어요."
                </p>
                <div className="flex items-center">
                  <div className="w-10 h-10 bg-purple-500 rounded-full flex items-center justify-center text-white font-semibold">
                    박
                  </div>
                  <div className="ml-3">
                    <p className="font-semibold">박작가</p>
                    <p className="text-sm text-gray-500">콘텐츠 크리에이터</p>
                  </div>
                </div>
                <div className="mt-4">
                  <Link
                    href="/posts/time-saving-content-creation"
                    className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                  >
                    전체 후기 보기 →
                  </Link>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="py-20 px-4 bg-white">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">합리적인 요금제</h2>
            <p className="text-xl text-gray-600">필요에 맞는 요금제를 선택하세요.</p>
          </div>
          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <Card className="border-2 border-gray-200">
              <CardHeader className="text-center">
                <CardTitle className="text-2xl">무료</CardTitle>
                <div className="text-4xl font-bold mt-4">₩0</div>
                <CardDescription>월 5개 포스트</CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  <li className="flex items-center">
                    <CheckCircle className="w-5 h-5 text-green-500 mr-2" />월 5개 AI 포스트 생성
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="w-5 h-5 text-green-500 mr-2" />
                    기본 SEO 최적화
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="w-5 h-5 text-green-500 mr-2" />
                    네이버 블로그 연동
                  </li>
                </ul>
                <Link href="/signup" className="block mt-6">
                  <Button className="w-full bg-transparent" variant="outline">
                    무료 시작하기
                  </Button>
                </Link>
              </CardContent>
            </Card>
            <Card className="border-2 border-blue-500 relative">
              <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                <Badge className="bg-blue-500 text-white">인기</Badge>
              </div>
              <CardHeader className="text-center">
                <CardTitle className="text-2xl">프로</CardTitle>
                <div className="text-4xl font-bold mt-4">₩29,000</div>
                <CardDescription>월 50개 포스트</CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  <li className="flex items-center">
                    <CheckCircle className="w-5 h-5 text-green-500 mr-2" />월 50개 AI 포스트 생성
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="w-5 h-5 text-green-500 mr-2" />
                    고급 SEO 최적화
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="w-5 h-5 text-green-500 mr-2" />
                    예약 포스팅
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="w-5 h-5 text-green-500 mr-2" />
                    성과 분석 대시보드
                  </li>
                </ul>
                <Link href="/signup" className="block mt-6">
                  <Button className="w-full bg-blue-500 hover:bg-blue-600">프로 시작하기</Button>
                </Link>
              </CardContent>
            </Card>
            <Card className="border-2 border-gray-200">
              <CardHeader className="text-center">
                <CardTitle className="text-2xl">팀</CardTitle>
                <div className="text-4xl font-bold mt-4">₩99,000</div>
                <CardDescription>월 200개 포스트</CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  <li className="flex items-center">
                    <CheckCircle className="w-5 h-5 text-green-500 mr-2" />월 200개 AI 포스트 생성
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="w-5 h-5 text-green-500 mr-2" />
                    프리미엄 SEO 최적화
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="w-5 h-5 text-green-500 mr-2" />
                    다중 블로그 관리
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="w-5 h-5 text-green-500 mr-2" />
                    우선 고객 지원
                  </li>
                </ul>
                <Link href="/signup" className="block mt-6">
                  <Button className="w-full bg-transparent" variant="outline">
                    팀 시작하기
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white">
        <div className="container mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">지금 바로 시작하세요</h2>
          <p className="text-xl mb-8 opacity-90">AI가 만드는 완벽한 블로그 콘텐츠를 경험해보세요.</p>
          <Link href="/signup">
            <Button size="lg" className="bg-white text-blue-600 hover:bg-gray-100 text-lg px-8 py-3">
              무료로 시작하기
              <ArrowRight className="ml-2 w-5 h-5" />
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12 px-4">
        <div className="container mx-auto">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                  <Zap className="w-5 h-5 text-white" />
                </div>
                <span className="text-xl font-bold">AutoBlogger</span>
                <ApiStatusIndicator />
              </div>
              <p className="text-gray-400">AI 기반 자동 블로그 포스팅 솔루션</p>
            </div>
            <div>
              <h3 className="font-semibold mb-4">제품</h3>
              <ul className="space-y-2 text-gray-400">
                <li>
                  <Link href="#features" className="hover:text-white transition-colors">
                    기능
                  </Link>
                </li>
                <li>
                  <Link href="#pricing" className="hover:text-white transition-colors">
                    요금제
                  </Link>
                </li>
                <li>
                  <Link href="/help" className="hover:text-white transition-colors">
                    도움말
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4">회사</h3>
              <ul className="space-y-2 text-gray-400">
                <li>
                  <Link href="/contact" className="hover:text-white transition-colors">
                    문의하기
                  </Link>
                </li>
                <li>
                  <Link href="/help" className="hover:text-white transition-colors">
                    지원
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4">계정</h3>
              <ul className="space-y-2 text-gray-400">
                <li>
                  <Link href="/login" className="hover:text-white transition-colors">
                    로그인
                  </Link>
                </li>
                <li>
                  <Link href="/signup" className="hover:text-white transition-colors">
                    회원가입
                  </Link>
                </li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2024 AutoBlogger. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
