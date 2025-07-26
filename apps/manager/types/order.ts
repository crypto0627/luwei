export interface Meal {
  id: string
  name: string
  description: string
  price: number
  image: string
  isAvailable: boolean
}

export interface OrderItem {
  id: string
  mealId: string
  quantity: number
  price: number
  meal: Meal
}

export interface User {
  id: string
  email: string
  name: string
  provider: string
  emailVerified: boolean
}

export interface Order {
  id: string
  userId: string
  status: "completed" | "pending" | "paid" | "cancelled"
  totalAmount: number
  createdAt: string
  updatedAt: string
  items: OrderItem[]
  user: User
}

export interface Stats {
  total: number
  completed: number
  pending: number
  paid: number
  revenue: number
} 