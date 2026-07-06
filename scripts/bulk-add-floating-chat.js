#!/usr/bin/env node
/**
 * 미적용 테넌트에 floating-chat.tsx 생성 + layout/_app 마운트
 */
const fs = require('fs')
const path = require('path')

const ROOT = path.join(__dirname, '../..')

const TENANTS = [
  'blog', 'book-review', 'brochure', 'bucket', 'care', 'chemistry', 'clef',
  'english', 'flower', 'goodprice', 'gpt', 'growup', 'hvalue', 'idea', 'korean',
  'library', 'lifefood', 'mindmap', 'mypage', 'plot', 'portfolio', 'research',
  'save', 'search', 'seo-foundry', 'sight', 'sim', 'smart', 'sports', 'tech',
  'trace', 'tripsim', 'vibe', 'vibecommunity', 'video', 'vtest', 'wish',
  'wonder', 'wookwang', 'youtube',
]

const TITLES = {
  blog: 'AutoBlogger',
  'book-review': '책갈피',
  brochure: 'Brochure Maker',
  bucket: '버킷리스트',
  care: '케어브릿지',
  chemistry: '김 박사의 초등 화학 연구소',
  clef: 'CLEF',
  english: 'AI 영어 회화',
  flower: 'BloomInfo',
  goodprice: '농부장부',
  gpt: 'SmartGPT Guide',
  growup: 'GrowUp',
  hvalue: 'HValue',
  idea: 'Idea',
  korean: 'Hello Hangul',
  library: 'AI 백과사전',
  lifefood: '인생맛집',
  mindmap: 'MindMap',
  mypage: 'OnePage.AI',
  plot: 'PlotCraft',
  portfolio: 'Portfolio',
  research: 'Research',
  save: 'SavePlay',
  search: 'AIDA',
  'seo-foundry': 'SEO Foundry',
  sight: 'Sight',
  sim: 'CareerSim AI',
  smart: '스마트 러닝',
  sports: '스포츠 커뮤니티',
  tech: 'Tech Blog',
  trace: 'GoTrace',
  tripsim: 'TripSim',
  vibe: 'Vibe',
  vibecommunity: 'Vibe Coding Community',
  video: '링크사면',
  vtest: 'AI 모의면접',
  wish: 'Wish',
  wonder: 'WonderTale',
  wookwang: '우광교회',
  youtube: 'CommentCraft',
}

function hasLucide(tenantDir) {
  try {
    const pkg = JSON.parse(fs.readFileSync(path.join(tenantDir, 'package.json'), 'utf8'))
    return !!(pkg.dependencies?.['lucide-react'] || pkg.devDependencies?.['lucide-react'])
  } catch {
    return false
  }
}

function hasUi(tenantDir, name) {
  return fs.existsSync(path.join(tenantDir, 'components/ui', `${name}.tsx`))
}

function makeComponent(tenant, title, useLucide, useShadcn) {
  const iconImports = useLucide
    ? `import { MessageCircle, X, Send, Bot, User } from "lucide-react"\n`
    : ''
  const openIcon = useLucide ? '<MessageCircle className="h-6 w-6" />' : '💬'
  const closeIcon = useLucide ? '<X className="h-4 w-4" />' : '✕'
  const sendIcon = useLucide ? '<Send className="h-4 w-4" />' : '↑'
  const botIcon = useLucide ? '<Bot className="mt-0.5 h-4 w-4 shrink-0 text-blue-600" />' : null
  const userIcon = useLucide ? '<User className="mt-0.5 h-4 w-4 shrink-0 text-white/80" />' : null

  const btnOpen = useShadcn
    ? `<Button onClick={() => setIsOpen(true)} className="fixed bottom-6 right-6 z-50 h-14 w-14 rounded-full bg-blue-600 shadow-lg hover:bg-blue-700" size="icon" aria-label="문의 채팅 열기">${openIcon}</Button>`
    : `<button type="button" onClick={() => setIsOpen(true)} className="fixed bottom-6 right-6 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-blue-600 text-white shadow-lg hover:bg-blue-700" aria-label="문의 채팅">${openIcon}</button>`

  const btnClose = useShadcn
    ? `<Button variant="ghost" size="icon" onClick={() => setIsOpen(false)} className="h-8 w-8 text-white hover:bg-white/20">${closeIcon}</Button>`
    : `<button type="button" onClick={() => setIsOpen(false)} className="rounded p-1 text-white hover:bg-white/20">${closeIcon}</button>`

  const btnSend = useShadcn
    ? `<Button onClick={handleSendMessage} disabled={!inputMessage.trim() || isLoading} size="icon" className="bg-blue-600 hover:bg-blue-700">${sendIcon}</Button>`
    : `<button type="button" onClick={handleSendMessage} disabled={!inputMessage.trim() || isLoading} className="rounded-lg bg-blue-600 px-3 py-2 text-white disabled:opacity-50">${sendIcon}</button>`

  const inputEl = useShadcn
    ? `<Input value={inputMessage} onChange={(e) => setInputMessage(e.target.value)} onKeyDown={handleKeyDown} placeholder="메시지를 입력하세요..." disabled={isLoading} className="flex-1" />`
    : `<input value={inputMessage} onChange={(e) => setInputMessage(e.target.value)} onKeyDown={handleKeyDown} placeholder="메시지를 입력하세요..." disabled={isLoading} className="flex-1 rounded-lg border px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-500/40" />`

  const shadcnImports = useShadcn
    ? `import { Button } from "@/components/ui/button"\n${hasUi(path.join(ROOT, tenant), 'input') ? 'import { Input } from "@/components/ui/input"\n' : ''}`
    : ''

  return `"use client"

import { useState, useRef, useEffect } from "react"
${shadcnImports}${iconImports}
const TENANT = "${tenant}"
const SERVICE_NAME = "${title.replace(/"/g, '\\"')}"

const WELCOME =
  \`안녕하세요, \${SERVICE_NAME}입니다.\\n\\n서비스 이용법, 기능 문의, 건의사항이 있으시면 편하게 남겨 주세요.\`

interface Message {
  id: string
  type: "user" | "ai"
  content: string
  timestamp: Date
}

export default function FloatingChat() {
  const [isOpen, setIsOpen] = useState(false)
  const [messages, setMessages] = useState<Message[]>([
    { id: "welcome", type: "ai", content: WELCOME, timestamp: new Date() },
  ])
  const [inputMessage, setInputMessage] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages, isLoading])

  const handleSendMessage = async () => {
    if (!inputMessage.trim() || isLoading) return
    const messageText = inputMessage.trim()
    setMessages((prev) => [
      ...prev,
      { id: Date.now().toString(), type: "user", content: messageText, timestamp: new Date() },
    ])
    setInputMessage("")
    setIsLoading(true)

    let aiContent = "문의해 주셔서 감사합니다. 확인 후 안내해 드리겠습니다."

    try {
      const response = await fetch("/api/ask", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type: TENANT, message: messageText }),
      })
      if (response.ok) {
        const data = await response.json()
        aiContent = data.response || aiContent
      }
    } catch (error) {
      console.error("문의 전송 오류:", error)
    }

    setMessages((prev) => [
      ...prev,
      { id: (Date.now() + 1).toString(), type: "ai", content: aiContent, timestamp: new Date() },
    ])
    setIsLoading(false)
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  return (
    <>
      {!isOpen && ${btnOpen}}

      {isOpen && (
        <div className="fixed bottom-6 right-6 z-50 flex h-[480px] w-96 max-w-[calc(100vw-2rem)] flex-col overflow-hidden rounded-xl border bg-white shadow-2xl">
          <div className="flex shrink-0 items-center justify-between bg-blue-600 px-4 py-3 text-white">
            <div>
              <h2 className="font-semibold">문의 · 건의</h2>
              <p className="text-sm text-blue-100">{SERVICE_NAME} AI 도우미</p>
            </div>
            ${btnClose}
          </div>

          <div className="min-h-0 flex-1 overflow-y-auto p-4">
            <div className="space-y-3">
              {messages.map((message) => (
                <div key={message.id} className={\`flex \${message.type === "user" ? "justify-end" : "justify-start"}\`}>
                  <div className={\`max-w-[85%] rounded-2xl px-3 py-2 text-sm \${message.type === "user" ? "bg-blue-600 text-white" : "bg-gray-100 text-gray-900"}\`}>
                    <div className="flex items-start gap-2">
                      ${botIcon ? `{message.type === "ai" && ${botIcon}}` : ''}
                      ${userIcon ? `{message.type === "user" && ${userIcon}}` : ''}
                      <div className="whitespace-pre-wrap leading-relaxed">{message.content}</div>
                    </div>
                  </div>
                </div>
              ))}
              {isLoading && (
                <div className="flex justify-start">
                  <div className="rounded-2xl bg-gray-100 px-4 py-3">
                    <div className="flex gap-1">
                      <span className="h-2 w-2 animate-bounce rounded-full bg-gray-400" />
                      <span className="h-2 w-2 animate-bounce rounded-full bg-gray-400" style={{ animationDelay: "0.1s" }} />
                      <span className="h-2 w-2 animate-bounce rounded-full bg-gray-400" style={{ animationDelay: "0.2s" }} />
                    </div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>
          </div>

          <div className="shrink-0 border-t p-3">
            <div className="flex gap-2">
              ${inputEl}
              ${btnSend}
            </div>
            <p className="mt-2 text-center text-xs text-gray-400">문의하신 내용은 빠르게 확인해 답변드립니다.</p>
          </div>
        </div>
      )}
    </>
  )
}
`
}

function patchAppLayout(tenantDir) {
  for (const rel of ['app/layout.tsx', 'app/layout.jsx']) {
    const layoutPath = path.join(tenantDir, rel)
    if (!fs.existsSync(layoutPath)) continue
    let content = fs.readFileSync(layoutPath, 'utf8')
    if (/FloatingChat|floating-chat/i.test(content)) return 'skip-layout'
    if (!content.includes('floating-chat')) {
      const importLine = 'import FloatingChat from "@/components/floating-chat"\n'
      const lastImport = content.lastIndexOf('\nimport ')
      if (lastImport >= 0) {
        const end = content.indexOf('\n', lastImport + 1)
        content = content.slice(0, end + 1) + importLine + content.slice(end + 1)
      } else {
        content = importLine + content
      }
    }
    if (!content.includes('<FloatingChat')) {
      content = content.replace(/(\s*)<\/body>/, '$1        <FloatingChat />\n$1</body>')
    }
    fs.writeFileSync(layoutPath, content)
    return 'layout'
  }
  return null
}

function patchPagesApp(tenantDir) {
  const appPath = path.join(tenantDir, 'pages/_app.tsx')
  if (!fs.existsSync(appPath)) return null
  let content = fs.readFileSync(appPath, 'utf8')
  if (/FloatingChat|floating-chat/i.test(content)) return 'skip-app'
  if (!content.includes('floating-chat')) {
    content = `import FloatingChat from '../components/floating-chat'\n${content}`
  }
  content = content.replace(
    /return\s+<Component\s+pageProps=\{pageProps\}\s*\/>/,
    'return (\n    <>\n      <Component pageProps={pageProps} />\n      <FloatingChat />\n    </>\n  )',
  )
  fs.writeFileSync(appPath, content)
  return 'pages-app'
}

let created = 0
let patched = 0

for (const tenant of TENANTS) {
  const tenantDir = path.join(ROOT, tenant)
  if (!fs.existsSync(tenantDir)) {
    console.log(`[SKIP] ${tenant} — no dir`)
    continue
  }

  const chatPath = path.join(tenantDir, 'components/floating-chat.tsx')
  const title = TITLES[tenant] || tenant
  const useLucide = hasLucide(tenantDir)
  const useShadcn = hasUi(tenantDir, 'button')

  fs.mkdirSync(path.dirname(chatPath), { recursive: true })
  fs.writeFileSync(chatPath, makeComponent(tenant, title, useLucide, useShadcn))
  created++

  const result = patchAppLayout(tenantDir) || patchPagesApp(tenantDir)
  if (result && !result.startsWith('skip')) patched++
  console.log(`[OK] ${tenant} — component + ${result || 'NO_LAYOUT'}`)
}

console.log(`\nDone: ${created} components, ${patched} layouts patched`)
