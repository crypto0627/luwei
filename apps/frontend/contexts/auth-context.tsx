'use client'

import { createContext, useContext, useEffect, ReactNode } from 'react'
import { useUserStore } from '@/stores/useUserStore'
import { User } from '@/types/auth-types'
import { usePathname, useRouter } from 'next/navigation'

interface AuthContextType {
  user: User | null
  isLoading: boolean
  error: string | null
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const { user, isLoading, error, fetchUser } = useUserStore()
  const pathname = usePathname()
  const router = useRouter()

  useEffect(() => {
    fetchUser()
  }, [fetchUser])

  useEffect(() => {
    if (!isLoading) {
      // 如果用戶已登入，不能訪問登入相關頁面
      if (user && pathname.startsWith('/auth/sign')) {
        router.push('/')
      }
      // 如果用戶未登入，不能訪問需要登入的頁面
      if (!user && (pathname === '/checkout' || pathname === '/monitor')) {
        router.push('/auth/signin')
      }
    }
  }, [user, isLoading, pathname, router])

  return (
    <AuthContext.Provider value={{ user, isLoading, error }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
