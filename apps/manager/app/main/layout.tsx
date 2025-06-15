"use client"

import type React from "react"
import { useEffect, useState } from "react"
import { useRouter, usePathname } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { LayoutDashboard, BarChart3, LogOut, Menu, X } from "lucide-react"
import { useUserStore } from "@/stores/useUserStore"

const navigation = [
  { name: "訂單管理", href: "/main/dashboard", icon: LayoutDashboard },
  { name: "營收報表", href: "/main/reports", icon: BarChart3 }
]

export default function MainLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const router = useRouter()
  const pathname = usePathname()
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  const { user, isLoading, fetchUser, logout } = useUserStore()

  useEffect(() => {
    fetchUser()
  }, [fetchUser])

  const handleLogout = async () => {
    try {
      await logout()
      router.push("/")
    } catch (error) {
      console.error("Logout failed:", error)
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-16 w-16 sm:h-24 sm:w-24 md:h-32 md:w-32 border-t-2 border-b-2 border-white"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex">
      {/* Mobile sidebar overlay */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden" 
          onClick={() => setIsSidebarOpen(false)}
          aria-hidden="true"
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
          fixed top-0 left-0 z-50 h-screen w-[280px] transform transition-transform duration-300 ease-in-out
          lg:translate-x-0 lg:sticky lg:top-0
          ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"}
        `}
      >
        <Card className="h-full rounded-none border-r border-orange-200 bg-white/95 backdrop-blur-sm">
          <div className="flex flex-col h-full">
            {/* Header */}
            <div className="flex-none p-4 sm:p-6 border-b border-orange-200">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-br from-orange-400 to-orange-600 rounded-lg flex items-center justify-center">
                    <span className="text-base sm:text-lg font-bold text-white">滷</span>
                  </div>
                  <div>
                    <h1 className="text-base sm:text-lg font-bold text-gray-800">大竹小倆口</h1>
                    <p className="text-xs sm:text-sm text-gray-600">管理後台</p>
                  </div>
                </div>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="lg:hidden" 
                  onClick={() => setIsSidebarOpen(false)}
                  aria-label="關閉選單"
                >
                  <X className="h-5 w-5" />
                </Button>
              </div>
            </div>

            {/* Navigation */}
            <nav className="flex-1 overflow-y-auto p-3 sm:p-4 space-y-1 sm:space-y-2">
              {navigation.map((item) => {
                const isActive = pathname === item.href
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={`
                      flex items-center space-x-3 px-3 sm:px-4 py-2 sm:py-3 rounded-lg transition-colors
                      ${
                        isActive
                          ? "bg-gradient-to-r from-orange-500 to-orange-600 text-white shadow-lg"
                          : "text-gray-700 hover:bg-orange-50 hover:text-orange-600"
                      }
                    `}
                    onClick={() => setIsSidebarOpen(false)}
                  >
                    <item.icon className="h-4 w-4 sm:h-5 sm:w-5" />
                    <span className="text-sm sm:text-base font-medium">{item.name}</span>
                  </Link>
                )
              })}
            </nav>

            {/* User info and logout - Fixed at bottom */}
            <div className="flex-none p-3 sm:p-4 border-t border-orange-200 bg-white/95 backdrop-blur-sm">
              <div className="mb-2 sm:mb-3">
                <p className="text-xs sm:text-sm font-medium text-gray-800">{user?.name}</p>
                <p className="text-[10px] sm:text-xs text-gray-600">{user?.email}</p>
              </div>
              <Button
                onClick={handleLogout}
                variant="outline"
                size="sm"
                className="w-full border-orange-200 text-gray-700 hover:bg-orange-50 hover:text-orange-600"
              >
                <LogOut className="h-3 w-3 sm:h-4 sm:w-4 mr-2" />
                <span className="text-xs sm:text-sm">登出</span>
              </Button>
            </div>
          </div>
        </Card>
      </aside>

      {/* Main content */}
      <div className="flex-1 min-h-screen flex flex-col">
        {/* Mobile header */}
        <div className="lg:hidden fixed top-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-sm border-b border-orange-200 p-3 sm:p-4">
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={() => setIsSidebarOpen(true)}
            aria-label="開啟選單"
          >
            <Menu className="h-5 w-5" />
          </Button>
        </div>

        {/* Page content */}
        <main className="flex-1 p-4 sm:p-6 overflow-y-auto mt-14 lg:mt-0">{children}</main>
      </div>
    </div>
  )
}
