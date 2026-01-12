import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import localFont from "next/font/local"
import "./globals.css"
import { AuthProvider } from "@/lib/auth"

const inter = Inter({ 
  subsets: ["latin"],
  variable: "--font-inter",
})

const paperlogy = localFont({
  src: [
    {
      path: "../paperlogy/Paperlogy-1Thin.ttf",
      weight: "100",
      style: "normal",
    },
    {
      path: "../paperlogy/Paperlogy-2ExtraLight.ttf",
      weight: "200",
      style: "normal",
    },
    {
      path: "../paperlogy/Paperlogy-3Light.ttf",
      weight: "300",
      style: "normal",
    },
    {
      path: "../paperlogy/Paperlogy-4Regular.ttf",
      weight: "400",
      style: "normal",
    },
    {
      path: "../paperlogy/Paperlogy-5Medium.ttf",
      weight: "500",
      style: "normal",
    },
    {
      path: "../paperlogy/Paperlogy-6SemiBold.ttf",
      weight: "600",
      style: "normal",
    },
    {
      path: "../paperlogy/Paperlogy-7Bold.ttf",
      weight: "700",
      style: "normal",
    },
    {
      path: "../paperlogy/Paperlogy-8ExtraBold.ttf",
      weight: "800",
      style: "normal",
    },
    {
      path: "../paperlogy/Paperlogy-9Black.ttf",
      weight: "900",
      style: "normal",
    },
  ],
  variable: "--font-paperlogy",
})

export const metadata: Metadata = {
  title: "비타민 - 대학생 연합 빅데이터 동아리",
  description: "대학생 연합 빅데이터 동아리 비타민 공식 홈페이지",
  generator: 'v0.app',
  icons: {
    icon: [
      { url: '/favicon.png', type: 'image/png' },
      { url: '/images/bitamin-favicon.png', type: 'image/png', sizes: '32x32' },
      { url: '/images/bitamin-favicon.png', type: 'image/png', sizes: '16x16' },
    ],
    shortcut: '/favicon.png',
    apple: [
      { url: '/images/bitamin-favicon.png', sizes: '180x180', type: 'image/png' },
    ],
  },
  openGraph: {
    title: "비타민 - 대학생 연합 빅데이터 동아리",
    description: "대학생 연합 빅데이터 동아리 비타민 공식 홈페이지",
    url: 'https://www.bitamin.ai.kr',
    siteName: '비타민',
    images: [
      {
        url: '/images/bitamin-favicon.png',
        width: 512,
        height: 512,
        alt: '비타민 로고',
      },
    ],
    locale: 'ko_KR',
    type: 'website',
  },
  twitter: {
    card: 'summary',
    title: "비타민 - 대학생 연합 빅데이터 동아리",
    description: "대학생 연합 빅데이터 동아리 비타민 공식 홈페이지",
    images: ['/images/bitamin-favicon.png'],
  },
  metadataBase: new URL('https://www.bitamin.ai.kr'),
}

export const viewport = {
  width: "device-width",
  initialScale: 1,
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ko">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1" />
        <meta name="theme-color" content="#d3431a" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="google-site-verification" content="K4pzINJUzd2IVohaCuHTKGshdOgM0XjyCJLQW1jwPWM" />
        <link rel="icon" href="/favicon.png" type="image/png" />
        <link rel="icon" href="/images/bitamin-favicon.png" type="image/png" sizes="32x32" />
        <link rel="apple-touch-icon" href="/images/bitamin-favicon.png" />
      </head>
      <body className={`${inter.variable} ${paperlogy.variable}`}>
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  )
}
