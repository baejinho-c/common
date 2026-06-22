import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { AuthProvider } from "@/contexts/auth-context"
import { ThemeProvider } from "@/components/theme-provider"
import { Toaster } from "@/components/ui/toaster"
import GoogleAnalytics from "@/components/google-analytics"
import { Suspense } from "react"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "AutoBlogger - AI 기반 자동 블로그 포스팅",
  description: "AI를 활용한 자동 블로그 콘텐츠 생성 및 네이버 블로그 자동 포스팅 서비스",
  keywords: "AI 블로그, 자동 포스팅, 네이버 블로그, 콘텐츠 생성, SEO",
  authors: [{ name: "AutoBlogger Team" }],
  openGraph: {
    title: "AutoBlogger - AI 기반 자동 블로그 포스팅",
    description: "AI를 활용한 자동 블로그 콘텐츠 생성 및 네이버 블로그 자동 포스팅 서비스",
    type: "website",
    locale: "ko_KR",
  },
  twitter: {
    card: "summary_large_image",
    title: "AutoBlogger - AI 기반 자동 블로그 포스팅",
    description: "AI를 활용한 자동 블로그 콘텐츠 생성 및 네이버 블로그 자동 포스팅 서비스",
  },
  robots: {
    index: true,
    follow: true,
  },
  verification: {
    other: {
      "naver-site-verification": "be1ba7c13d646f56cfb6fb4bac381db4b726ceea",
    },
  },
  generator: "v0.dev",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ko" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
          <Suspense fallback={null}>
            <AuthProvider>
              {children}
              <Toaster />
            </AuthProvider>
          </Suspense>
        </ThemeProvider>
        <GoogleAnalytics />
      </body>
    </html>
  )
}
