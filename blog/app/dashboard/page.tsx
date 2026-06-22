"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { BarChart3, FileText, TrendingUp, Users, Calendar, Zap, AlertTriangle, Crown } from "lucide-react"
import Link from "next/link"
import ProtectedRoute from "@/components/protected-route"

interface UsageStats {
  current: {
    requests: number
    tokens: number
  }
  limits: {
    maxRequests: number
    maxTokens: number
  }
  plan: string
  percentages: {
    requests: number
    tokens: number
  }
}

export default function Dashboard() {
  const [usageStats, setUsageStats] = useState<UsageStats | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchUsageStats()
  }, [])

  const fetchUsageStats = async () => {
    try {
      setError(null)
      const response = await fetch("/api/usage")
      if (response.ok) {
        const data = await response.json()
        setUsageStats(data.data)
      } else {
        setUsageStats({
          current: { requests: 0, tokens: 0 },
          limits: { maxRequests: 100, maxTokens: 10000 },
          plan: "free",
          percentages: { requests: 0, tokens: 0 },
        })
      }
    } catch (error) {
      console.error("사용량 조회 오류:", error)
      setError("사용량 정보를 불러올 수 없습니다.")
      setUsageStats({
        current: { requests: 0, tokens: 0 },
        limits: { maxRequests: 100, maxTokens: 10000 },
        plan: "free",
        percentages: { requests: 0, tokens: 0 },
      })
    } finally {
      setLoading(false)
    }
  }

  const getUsageColor = (percentage: number) => {
    if (percentage >= 90) return "text-red-600"
    if (percentage >= 70) return "text-yellow-600"
    return "text-green-600"
  }

  const getProgressColor = (percentage: number) => {
    if (percentage >= 90) return "bg-red-500"
    if (percentage >= 70) return "bg-yellow-500"
    return "bg-green-500"
  }

  if (loading) {
    return (
      <ProtectedRoute>
        <div className="container mx-auto p-6">
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
              <p className="text-gray-600">대시보드를 불러오는 중...</p>
            </div>
          </div>
        </div>
      </ProtectedRoute>
    )
  }

  return (
    <ProtectedRoute>
      <div className="container mx-auto p-6 space-y-8">
        {/* 헤더 */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">대시보드</h1>
            <p className="text-gray-600 mt-1">AI 자동 블로깅 현황을 확인하세요</p>
          </div>
          <Link href="/create">
            <Button className="bg-blue-600 hover:bg-blue-700">
              <FileText className="w-4 h-4 mr-2" />새 글 작성
            </Button>
          </Link>
        </div>

        {error && (
          <Card className="border-l-4 border-l-yellow-500 bg-yellow-50">
            <CardContent className="pt-6">
              <div className="flex items-center">
                <AlertTriangle className="w-5 h-5 text-yellow-600 mr-2" />
                <span className="text-yellow-800">{error}</span>
              </div>
            </CardContent>
          </Card>
        )}

        {/* AI 사용량 카드 */}
        {usageStats && (
          <Card className="border-l-4 border-l-blue-500">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Zap className="w-5 h-5 text-blue-600" />
                  <CardTitle>AI 사용량</CardTitle>
                  <Badge variant="outline" className="capitalize">
                    {usageStats.plan} 플랜
                  </Badge>
                </div>
                <Link href="/billing">
                  <Button variant="outline" size="sm">
                    <Crown className="w-4 h-4 mr-1" />
                    업그레이드
                  </Button>
                </Link>
              </div>
              <CardDescription>이번 달 AI API 사용 현황</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* 요청 수 */}
              <div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-medium">API 요청</span>
                  <span className={`text-sm font-bold ${getUsageColor(usageStats.percentages.requests)}`}>
                    {usageStats.current.requests} / {usageStats.limits.maxRequests}
                  </span>
                </div>
                <Progress value={usageStats.percentages.requests} className="h-2" />
                {usageStats.percentages.requests >= 80 && (
                  <div className="flex items-center mt-2 text-sm text-yellow-600">
                    <AlertTriangle className="w-4 h-4 mr-1" />
                    사용량이 {usageStats.percentages.requests}%에 도달했습니다
                  </div>
                )}
              </div>

              {/* 토큰 수 */}
              <div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-medium">토큰 사용량</span>
                  <span className={`text-sm font-bold ${getUsageColor(usageStats.percentages.tokens)}`}>
                    {usageStats.current.tokens.toLocaleString()} / {usageStats.limits.maxTokens.toLocaleString()}
                  </span>
                </div>
                <Progress value={usageStats.percentages.tokens} className="h-2" />
              </div>
            </CardContent>
          </Card>
        )}

        {/* 통계 카드들 */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">총 게시물</CardTitle>
              <FileText className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">24</div>
              <p className="text-xs text-muted-foreground">+2 지난 주 대비</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">총 조회수</CardTitle>
              <BarChart3 className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">1,234</div>
              <p className="text-xs text-muted-foreground">+15% 지난 주 대비</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">월간 방문자</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">456</div>
              <p className="text-xs text-muted-foreground">+8% 지난 달 대비</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">성장률</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">+12%</div>
              <p className="text-xs text-muted-foreground">지난 달 대비</p>
            </CardContent>
          </Card>
        </div>

        {/* 최근 활동 */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>최근 게시물</CardTitle>
              <CardDescription>최근에 생성된 블로그 글들</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[
                  { title: "React 훅 완벽 가이드", date: "2024-01-15", views: 234 },
                  { title: "Next.js 14 새로운 기능들", date: "2024-01-14", views: 189 },
                  { title: "TypeScript 고급 패턴", date: "2024-01-13", views: 156 },
                  { title: "웹 성능 최적화 팁", date: "2024-01-12", views: 203 },
                ].map((post, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div>
                      <h4 className="font-medium text-sm">{post.title}</h4>
                      <p className="text-xs text-gray-500">{post.date}</p>
                    </div>
                    <div className="text-sm text-gray-600">{post.views} 조회</div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>예정된 발행</CardTitle>
              <CardDescription>자동 발행 예정인 글들</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[
                  { title: "AI와 웹 개발의 미래", date: "2024-01-16 09:00", status: "대기중" },
                  { title: "모바일 앱 개발 트렌드", date: "2024-01-17 14:00", status: "대기중" },
                  { title: "클라우드 서비스 비교", date: "2024-01-18 10:00", status: "대기중" },
                ].map((post, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                    <div>
                      <h4 className="font-medium text-sm">{post.title}</h4>
                      <p className="text-xs text-blue-600 flex items-center">
                        <Calendar className="w-3 h-3 mr-1" />
                        {post.date}
                      </p>
                    </div>
                    <Badge variant="secondary" className="text-xs">
                      {post.status}
                    </Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* 빠른 액션 */}
        <Card>
          <CardHeader>
            <CardTitle>빠른 액션</CardTitle>
            <CardDescription>자주 사용하는 기능들에 빠르게 접근하세요</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <Link href="/create">
                <Button variant="outline" className="w-full h-20 flex flex-col bg-transparent">
                  <FileText className="w-6 h-6 mb-2" />새 글 작성
                </Button>
              </Link>
              <Link href="/posts">
                <Button variant="outline" className="w-full h-20 flex flex-col bg-transparent">
                  <BarChart3 className="w-6 h-6 mb-2" />
                  게시물 관리
                </Button>
              </Link>
              <Link href="/analytics">
                <Button variant="outline" className="w-full h-20 flex flex-col bg-transparent">
                  <TrendingUp className="w-6 h-6 mb-2" />
                  분석 보기
                </Button>
              </Link>
              <Link href="/settings">
                <Button variant="outline" className="w-full h-20 flex flex-col bg-transparent">
                  <Users className="w-6 h-6 mb-2" />
                  설정
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </ProtectedRoute>
  )
}
