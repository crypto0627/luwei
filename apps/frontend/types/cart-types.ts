export interface Meal {
    id: string;
    name: string;
    description: string;
    price: number;
    image: string;
  }
  
  export interface CartItem {
    meal: Meal;
    quantity: number;
  }
  
  export interface CartContextType {
    items: CartItem[];
    addToCart: (meal: Meal) => void;
    addMultipleToCart: (meal: Meal, quantity: number) => void;
    removeFromCart: (mealId: string) => void;
    updateQuantity: (mealId: string, quantity: number) => void;
    getTotalPrice: () => number;
    getTotalItems: () => number;
    clearCart: () => void;
  }
  