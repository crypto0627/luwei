import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "大竹小倆口滷味 - 管理後台",
  description: "Admin dashboard for Taiwanese food brand",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="zh-TW">
      <body className={inter.className}>
        <div className="min-h-screen bg-gradient-to-br from-orange-400 via-orange-500 to-orange-600">{children}</div>
      </body>
    </html>
  )
}
