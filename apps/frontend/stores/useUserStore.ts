import { create } from 'zustand'
import authService from '@/services/auth-service'
import { User } from '@/types/auth-types'

interface UserState {
  user: User | null
  isLoading: boolean
  error: string | null
  setUser: (user: User | null) => void
  setLoading: (isLoading: boolean) => void
  setError: (error: string | null) => void
  fetchUser: () => Promise<void>
  clearUser: () => void
  logout: () => Promise<void>
}

export const useUserStore = create<UserState>((set) => ({
  user: null,
  isLoading: false,
  error: null,
  
  setUser: (user) => set({ user }),
  setLoading: (isLoading) => set({ isLoading }),
  setError: (error) => set({ error }),
  
  fetchUser: async () => {
    try {
      set({ isLoading: true, error: null })
      const user = await authService.getCurrentUser()
      set({ user, isLoading: false })
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : 'An error occurred', 
        isLoading: false 
      })
    }
  },
  
  clearUser: () => set({ user: null, error: null }),

  logout: async () => {
    try {
      set({ isLoading: true, error: null })
      await authService.logout()
      set({ user: null, isLoading: false })
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : 'An error occurred', 
        isLoading: false 
      })
    }
  }
}))