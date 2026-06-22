"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { useToast } from "@/hooks/use-toast"
import { Loader2, FileText, Wand2, Globe, Sparkles } from "lucide-react"
import ProtectedRoute from "@/components/protected-route"

export default function CreatePage() {
  const [topic, setTopic] = useState("")
  const [outline, setOutline] = useState("")
  const [content, setContent] = useState("")
  const [blogUrl, setBlogUrl] = useState("")
  const [styleAnalysis, setStyleAnalysis] = useState("")
  const [isGeneratingOutline, setIsGeneratingOutline] = useState(false)
  const [isGeneratingContent, setIsGeneratingContent] = useState(false)
  const [isAnalyzingStyle, setIsAnalyzingStyle] = useState(false)
  const [isPublishing, setIsPublishing] = useState(false)
  const { toast } = useToast()

  const generateOutline = async () => {
    if (!topic.trim()) {
      toast({
        title: "주제를 입력해주세요",
        description: "블로그 포스트 주제를 먼저 입력해주세요.",
        variant: "destructive",
      })
      return
    }

    setIsGeneratingOutline(true)
    try {
      const response = await fetch("/api/outline", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ topic }),
      })

      if (!response.ok) throw new Error("아웃라인 생성에 실패했습니다")

      const data = await response.json()
      setOutline(data.outline)
      toast({
        title: "아웃라인 생성 완료",
        description: "생성된 아웃라인을 확인하고 필요시 수정해주세요.",
      })
    } catch (error) {
      toast({
        title: "오류 발생",
        description: "아웃라인 생성 중 오류가 발생했습니다.",
        variant: "destructive",
      })
    } finally {
      setIsGeneratingOutline(false)
    }
  }

  const generateContent = async () => {
    if (!outline.trim()) {
      toast({
        title: "아웃라인이 필요합니다",
        description: "먼저 아웃라인을 생성하거나 입력해주세요.",
        variant: "destructive",
      })
      return
    }

    setIsGeneratingContent(true)
    try {
      const response = await fetch("/api/full-content", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          topic,
          outline,
          styleGuide: styleAnalysis || undefined,
        }),
      })

      if (!response.ok) throw new Error("콘텐츠 생성에 실패했습니다")

      const data = await response.json()
      setContent(data.content)
      toast({
        title: "전체 글 생성 완료",
        description: "생성된 콘텐츠를 확인해주세요.",
      })
    } catch (error) {
      toast({
        title: "오류 발생",
        description: "콘텐츠 생성 중 오류가 발생했습니다.",
        variant: "destructive",
      })
    } finally {
      setIsGeneratingContent(false)
    }
  }

  const analyzeStyle = async () => {
    if (!blogUrl.trim()) {
      toast({
        title: "URL을 입력해주세요",
        description: "분석할 블로그 URL을 입력해주세요.",
        variant: "destructive",
      })
      return
    }

    setIsAnalyzingStyle(true)
    try {
      const response = await fetch("/api/blog-analysis", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url: blogUrl }),
      })

      if (!response.ok) throw new Error("스타일 분석에 실패했습니다")

      const data = await response.json()
      setStyleAnalysis(data.analysis)
      toast({
        title: "스타일 분석 완료",
        description: "블로그 스타일이 분석되었습니다.",
      })
    } catch (error) {
      toast({
        title: "오류 발생",
        description: "스타일 분석 중 오류가 발생했습니다.",
        variant: "destructive",
      })
    } finally {
      setIsAnalyzingStyle(false)
    }
  }

  const publishToNaver = async () => {
    if (!content.trim()) {
      toast({
        title: "콘텐츠가 필요합니다",
        description: "먼저 콘텐츠를 생성해주세요.",
        variant: "destructive",
      })
      return
    }

    setIsPublishing(true)
    try {
      const response = await fetch("/api/naver/publish", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: topic,
          content: content,
        }),
      })

      if (!response.ok) throw new Error("발행에 실패했습니다")

      toast({
        title: "발행 완료",
        description: "네이버 블로그에 성공적으로 발행되었습니다.",
      })
    } catch (error) {
      toast({
        title: "발행 실패",
        description: "네이버 블로그 발행 중 오류가 발생했습니다.",
        variant: "destructive",
      })
    } finally {
      setIsPublishing(false)
    }
  }

  return (
    <ProtectedRoute>
      <div className="container mx-auto py-8 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-2">AI 블로그 포스트 생성</h1>
            <p className="text-muted-foreground">
              AI를 활용해 고품질 블로그 포스트를 생성하고 네이버 블로그에 직접 발행하세요.
            </p>
          </div>

          <Tabs defaultValue="create" className="space-y-6">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="create" className="flex items-center gap-2">
                <Wand2 className="h-4 w-4" />
                기본 생성
              </TabsTrigger>
              <TabsTrigger value="style" className="flex items-center gap-2">
                <Globe className="h-4 w-4" />
                스타일 분석
              </TabsTrigger>
            </TabsList>

            <TabsContent value="create" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <FileText className="h-5 w-5" />
                    1단계: 주제 입력
                  </CardTitle>
                  <CardDescription>블로그 포스트의 주제나 키워드를 입력해주세요.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="topic">주제</Label>
                    <Input
                      id="topic"
                      placeholder="예: 건강한 다이어트 방법"
                      value={topic}
                      onChange={(e) => setTopic(e.target.value)}
                    />
                  </div>
                  <Button onClick={generateOutline} disabled={isGeneratingOutline} className="w-full">
                    {isGeneratingOutline ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        아웃라인 생성 중...
                      </>
                    ) : (
                      <>
                        <Sparkles className="mr-2 h-4 w-4" />
                        아웃라인 생성
                      </>
                    )}
                  </Button>
                </CardContent>
              </Card>

              {outline && (
                <Card>
                  <CardHeader>
                    <CardTitle>2단계: 아웃라인 확인 및 수정</CardTitle>
                    <CardDescription>생성된 아웃라인을 확인하고 필요시 수정해주세요.</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <Label htmlFor="outline">아웃라인</Label>
                      <Textarea
                        id="outline"
                        rows={10}
                        value={outline}
                        onChange={(e) => setOutline(e.target.value)}
                        placeholder="아웃라인이 여기에 표시됩니다..."
                      />
                    </div>
                    <Button onClick={generateContent} disabled={isGeneratingContent} className="w-full">
                      {isGeneratingContent ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          전체 글 생성 중...
                        </>
                      ) : (
                        <>
                          <FileText className="mr-2 h-4 w-4" />
                          전체 글 생성
                        </>
                      )}
                    </Button>
                  </CardContent>
                </Card>
              )}

              {content && (
                <Card>
                  <CardHeader>
                    <CardTitle>3단계: 생성된 콘텐츠</CardTitle>
                    <CardDescription>생성된 블로그 포스트를 확인하고 네이버 블로그에 발행하세요.</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <Label htmlFor="content">생성된 콘텐츠</Label>
                      <Textarea
                        id="content"
                        rows={20}
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                        placeholder="생성된 콘텐츠가 여기에 표시됩니다..."
                      />
                    </div>
                    <div className="flex gap-2">
                      <Button onClick={publishToNaver} disabled={isPublishing} className="flex-1">
                        {isPublishing ? (
                          <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            발행 중...
                          </>
                        ) : (
                          "네이버 블로그에 발행"
                        )}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              )}
            </TabsContent>

            <TabsContent value="style" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Globe className="h-5 w-5" />
                    블로그 스타일 분석
                  </CardTitle>
                  <CardDescription>
                    기존 블로그 URL을 입력하면 해당 블로그의 글쓰기 스타일을 분석하여 비슷한 톤으로 글을 작성합니다.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="blogUrl">블로그 URL</Label>
                    <Input
                      id="blogUrl"
                      placeholder="https://blog.naver.com/example"
                      value={blogUrl}
                      onChange={(e) => setBlogUrl(e.target.value)}
                    />
                  </div>
                  <Button onClick={analyzeStyle} disabled={isAnalyzingStyle} className="w-full">
                    {isAnalyzingStyle ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        스타일 분석 중...
                      </>
                    ) : (
                      <>
                        <Globe className="mr-2 h-4 w-4" />
                        스타일 분석
                      </>
                    )}
                  </Button>
                </CardContent>
              </Card>

              {styleAnalysis && (
                <Card>
                  <CardHeader>
                    <CardTitle>분석된 스타일 가이드</CardTitle>
                    <CardDescription>이 스타일 가이드가 적용되어 글이 생성됩니다.</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="bg-muted p-4 rounded-lg">
                      <pre className="whitespace-pre-wrap text-sm">{styleAnalysis}</pre>
                    </div>
                    <Separator className="my-4" />
                    <Badge variant="secondary" className="mb-4">
                      스타일 분석 완료 - 이제 기본 생성 탭에서 글을 작성하면 이 스타일이 적용됩니다
                    </Badge>
                  </CardContent>
                </Card>
              )}
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </ProtectedRoute>
  )
}
