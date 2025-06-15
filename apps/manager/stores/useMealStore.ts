import { create } from 'zustand'
import mealsService from '@/services/meals-service'

interface Meal {
  id: string
  name: string
  description: string
  price: number
  image: string
  isAvailable: boolean
}

interface MealState {
  meals: Meal[]
  isLoading: boolean
  error: string | null
  setMeals: (meals: Meal[]) => void
  setLoading: (isLoading: boolean) => void
  setError: (error: string | null) => void
  fetchMeals: () => Promise<void>
  addMeal: (meal: Meal) => Promise<void>
  editMeal: (meal: Meal) => Promise<void>
  deleteMeal: (meal: Meal) => Promise<void>
}

export const useMealStore = create<MealState>((set) => ({
  meals: [],
  isLoading: false,
  error: null,

  setMeals: (meals) => set({ meals }),
  setLoading: (isLoading) => set({ isLoading }),
  setError: (error) => set({ error }),

  fetchMeals: async () => {
    try {
      set({ isLoading: true, error: null })
      const response = await mealsService.fetchMeals()
      set({ meals: response.meals, isLoading: false })
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : 'An error occurred', 
        isLoading: false 
      })
    }
  },

  addMeal: async (meal) => {
    try {
      set({ isLoading: true, error: null })
      await mealsService.addMeal(meal)
      const response = await mealsService.fetchMeals()
      set({ meals: response.meals, isLoading: false })
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : 'An error occurred', 
        isLoading: false 
      })
    }
  },

  editMeal: async (meal) => {
    try {
      set({ isLoading: true, error: null })
      await mealsService.editMeal(meal)
      const response = await mealsService.fetchMeals()
      set({ meals: response.meals, isLoading: false })
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : 'An error occurred', 
        isLoading: false 
      })
    }
  },

  deleteMeal: async (meal) => {
    try {
      set({ isLoading: true, error: null })
      await mealsService.deleteMeal(meal)
      const response = await mealsService.fetchMeals()
      set({ meals: response.meals, isLoading: false })
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : 'An error occurred', 
        isLoading: false 
      })
    }
  }
}))
