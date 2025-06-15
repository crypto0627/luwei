import { create } from 'zustand'
import orderService from '@/services/order-service'

interface Meal {
  id: string
  name: string
  description: string
  price: number
  image: string
  isAvailable: boolean
}

interface OrderItem {
  id: string
  mealId: string
  quantity: number
  price: number
  meal: Meal
}

interface User {
  id: string
  email: string
  name: string
  provider: string
  emailVerified: boolean
}

interface Order {
  id: string
  userId: string
  status: 'pending' | 'paid' | 'completed' | 'cancelled'
  totalAmount: number
  createdAt: string
  updatedAt: string
  items: OrderItem[]
  user: User
}

interface OrderStore {
  orders: Order[]
  isLoading: boolean
  error: Error | null
  fetchOrders: () => Promise<void>
  deleteOrder: (orderId: string) => Promise<void>
  completeOrder: (orderId: string, status?: "completed" | "paid") => Promise<void>
}

export const useOrderStore = create<OrderStore>((set) => ({
  orders: [],
  isLoading: false,
  error: null,

  fetchOrders: async () => {
    set({ isLoading: true, error: null })
    try {
      const orders = await orderService.getAllOrders()
      set({ orders, isLoading: false })
    } catch (error) {
      set({ error: error as Error, isLoading: false })
    }
  },

  deleteOrder: async (orderId: string) => {
    set({ isLoading: true, error: null })
    try {
      await orderService.deleteOrder(orderId)
      set((state) => ({
        orders: state.orders.map(order => 
          order.id === orderId 
            ? { ...order, status: 'cancelled' }
            : order
        ),
        isLoading: false
      }))
    } catch (error) {
      set({ error: error as Error, isLoading: false })
    }
  },

  completeOrder: async (orderId: string, status: "completed" | "paid" = "completed") => {
    set({ isLoading: true, error: null })
    try {
      await orderService.completeOrder(orderId, status)
      set((state) => ({
        orders: state.orders.map(order => 
          order.id === orderId 
            ? { ...order, status }
            : order
        ),
        isLoading: false
      }))
    } catch (error) {
      set({ error: error as Error, isLoading: false })
    }
  },
}))
