export interface User {
    id: string
    email: string
    name: string
    phone: string
    provider: 'google' | 'line'
    emailVerified: boolean
    createdAt: number
    updatedAt: number
  }