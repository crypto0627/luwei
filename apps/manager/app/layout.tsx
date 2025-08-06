import type React from "react"
import type { Metadata, Viewport } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import Script from "next/script"

const inter = Inter({ 
  subsets: ["latin"],
  display: "swap",
  preload: true,
  fallback: ["system-ui", "sans-serif"],
  adjustFontFallback: true,
  weight: ["400", "500", "600", "700"],
})

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  themeColor: "#a237b0",
}

export const metadata: Metadata = {
  title: "大竹小倆口滷味 - 管理後台",
  description: "純手工無添加防腐劑，週一至週五下訂，隔週一即可取貨",
  manifest: "/manifest.json",
  icons: {
    icon: "/images/logo.webp",
    apple: [
      { url: "/ios/180.png", sizes: "180x180", type: "image/png" }
    ],
  },
  openGraph: {
    title: "大竹小倆口滷味 - 管理後台",
    description: "純手工無添加防腐劑，週一至週五下訂，隔週一即可取貨",
    type: "website",
    locale: "zh_TW",
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "大竹小倆口滷味",
  },
  formatDetection: {
    telephone: true,
  },
  other: {
    "apple-mobile-web-app-capable": "yes",
    "apple-mobile-web-app-status-bar-style": "default",
    "format-detection": "telephone=no",
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="zh-TW" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link rel="preconnect" href="https://www.googletagmanager.com" />
        
        <link rel="dns-prefetch" href="https://fonts.googleapis.com" />
        <link rel="dns-prefetch" href="https://www.googletagmanager.com" />
        
        <meta httpEquiv="x-dns-prefetch-control" content="on" />
        
        {/* Google Identity Services script */}
        <Script
          src="https://accounts.google.com/gsi/client"
          async
          defer
          strategy="beforeInteractive"
        />
      </head>
      <body className={inter.className}>
        {/* 背景裝飾 */}
        <div
          aria-hidden="true"
          className="fixed inset-0 z-0"
          style={{
            background:
              "radial-gradient(ellipse 80% 60% at 60% 20%, #fbbf24cc 0%, #f59e42bb 40%, #f472b6aa 80%, #f59e42 100%), linear-gradient(120deg, #f59e42 0%, #fbbf24 50%, #f472b6 100%)",
            opacity: 0.95,
          }}
        />
        
        {/* 裝飾性圓形光斑 */}
        <div
          aria-hidden="true"
          className="fixed top-[-120px] left-[-80px] w-[320px] h-[320px] rounded-full opacity-40 blur-3xl z-0"
          style={{
            background: "radial-gradient(circle, #f472b6 0%, #fbbf24 100%)",
          }}
        />
        <div
          aria-hidden="true"
          className="fixed bottom-[-100px] right-[-100px] w-[300px] h-[300px] rounded-full opacity-30 blur-2xl z-0"
          style={{
            background: "radial-gradient(circle, #fbbf24 0%, #f59e42 100%)",
          }}
        />
        
        {/* 主要內容 */}
        <div className="relative z-10 min-h-screen">
          {children}
        </div>
      </body>
    </html>
  )
}
