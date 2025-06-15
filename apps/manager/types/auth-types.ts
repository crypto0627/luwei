export interface User {
    id: string
    email: string
    name: string
    provider: 'google' | 'line'
    emailVerified: boolean
    createdAt: number
    updatedAt: number
  }