import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./app/globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { Toaster } from "@/components/ui/toaster"
import { AuthProvider } from "@/contexts/auth-context"
import GoogleAnalytics from "@/components/google-analytics"
import { Suspense } from "react"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: {
    default: "AutoBlogger - AI로 만드는 스마트 블로그 자동화 플랫폼",
    template: "%s | AutoBlogger",
  },
  description:
    "AI 기술로 블로그 포스트를 자동 생성하고 네이버 블로그에 직접 발행하는 스마트 블로그 자동화 서비스입니다. GPT-4o를 활용한 고품질 콘텐츠 생성과 스타일 분석 기능을 제공합니다.",
  keywords: [
    "AI 블로그",
    "자동 블로그 생성",
    "네이버 블로그 자동화",
    "GPT-4o",
    "블로그 포스트 생성",
    "콘텐츠 자동화",
    "스마트 블로그",
    "AI 글쓰기",
    "블로그 도구",
    "콘텐츠 마케팅",
  ],
  authors: [{ name: "AutoBlogger Team" }],
  creator: "AutoBlogger",
  publisher: "AutoBlogger",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL(process.env.NEXT_PUBLIC_BASE_URL || "https://autoblogger.vercel.app"),
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    locale: "ko_KR",
    url: "/",
    title: "AutoBlogger - AI로 만드는 스마트 블로그 자동화 플랫폼",
    description:
      "AI 기술로 블로그 포스트를 자동 생성하고 네이버 블로그에 직접 발행하는 스마트 블로그 자동화 서비스입니다.",
    siteName: "AutoBlogger",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "AutoBlogger - AI 블로그 자동화 플랫폼",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "AutoBlogger - AI로 만드는 스마트 블로그 자동화 플랫폼",
    description:
      "AI 기술로 블로그 포스트를 자동 생성하고 네이버 블로그에 직접 발행하는 스마트 블로그 자동화 서비스입니다.",
    images: ["/og-image.jpg"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ko" suppressHydrationWarning>
      <head>
        <link rel="icon" href="/favicon.ico" />
        <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
        <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
        <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
        <link rel="manifest" href="/site.webmanifest" />
        <meta name="theme-color" content="#ffffff" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "WebApplication",
              name: "AutoBlogger",
              description:
                "AI 기술로 블로그 포스트를 자동 생성하고 네이버 블로그에 직접 발행하는 스마트 블로그 자동화 서비스",
              url: process.env.NEXT_PUBLIC_BASE_URL || "https://autoblogger.vercel.app",
              applicationCategory: "ProductivityApplication",
              operatingSystem: "Web",
              offers: {
                "@type": "Offer",
                price: "0",
                priceCurrency: "KRW",
              },
              creator: {
                "@type": "Organization",
                name: "AutoBlogger Team",
              },
            }),
          }}
        />
      </head>
      <body className={inter.className}>
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem disableTransitionOnChange>
          <AuthProvider>
            <Suspense fallback={null}>
              {children}
              <Toaster />
              <GoogleAnalytics />
            </Suspense>
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
