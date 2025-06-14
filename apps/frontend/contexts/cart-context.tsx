"use client";

import {
  createContext,
  useContext,
  useReducer,
  useEffect,
  type ReactNode,
} from "react";
import type { Meal, CartItem, CartContextType } from "@/types/cart-types";

const CartContext = createContext<CartContextType | undefined>(undefined);

type CartAction =
  | { type: "ADD_TO_CART"; meal: Meal }
  | { type: "ADD_MULTIPLE_TO_CART"; meal: Meal; quantity: number }
  | { type: "REMOVE_FROM_CART"; mealId: string }
  | { type: "UPDATE_QUANTITY"; mealId: string; quantity: number }
  | { type: "CLEAR_CART" }
  | { type: "LOAD_CART"; items: CartItem[] };

function cartReducer(state: CartItem[], action: CartAction): CartItem[] {
  switch (action.type) {
    case "ADD_TO_CART":
      const existingItem = state.find(
        (item) => item.meal.id === action.meal.id,
      );
      if (existingItem) {
        return state.map((item) =>
          item.meal.id === action.meal.id
            ? { ...item, quantity: item.quantity + 1 }
            : item,
        );
      }
      return [...state, { meal: action.meal, quantity: 1 }];

    case "ADD_MULTIPLE_TO_CART":
      const existingMultiItem = state.find(
        (item) => item.meal.id === action.meal.id,
      );
      if (existingMultiItem) {
        return state.map((item) =>
          item.meal.id === action.meal.id
            ? { ...item, quantity: item.quantity + action.quantity }
            : item,
        );
      }
      return [...state, { meal: action.meal, quantity: action.quantity }];

    case "REMOVE_FROM_CART":
      return state.filter((item) => item.meal.id !== action.mealId);

    case "UPDATE_QUANTITY":
      if (action.quantity <= 0) {
        return state.filter((item) => item.meal.id !== action.mealId);
      }
      return state.map((item) =>
        item.meal.id === action.mealId
          ? { ...item, quantity: action.quantity }
          : item,
      );

    case "CLEAR_CART":
      return [];

    case "LOAD_CART":
      return Array.isArray(action.items) ? action.items : [];

    default:
      return state;
  }
}

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, dispatch] = useReducer(cartReducer, []);

  // 從localStorage載入購物車資料
  useEffect(() => {
    try {
      const savedCart = localStorage.getItem("shopping-cart");
      if (savedCart) {
        const parsedCart = JSON.parse(savedCart);
        if (Array.isArray(parsedCart)) {
          dispatch({ type: "LOAD_CART", items: parsedCart });
        }
      }
    } catch (error) {
      console.error("Error loading cart from localStorage:", error);
      // 如果載入失敗，確保購物車是空的
      dispatch({ type: "CLEAR_CART" });
    }
  }, []);

  // 當購物車變更時保存到localStorage
  useEffect(() => {
    try {
      if (Array.isArray(items)) {
        localStorage.setItem("shopping-cart", JSON.stringify(items));
      }
    } catch (error) {
      console.error("Error saving cart to localStorage:", error);
    }
  }, [items]);

  const addToCart = (meal: Meal) => {
    dispatch({ type: "ADD_TO_CART", meal });
  };

  const addMultipleToCart = (meal: Meal, quantity: number) => {
    if (quantity > 0) {
      dispatch({ type: "ADD_MULTIPLE_TO_CART", meal, quantity });
    }
  };

  const removeFromCart = (mealId: string) => {
    dispatch({ type: "REMOVE_FROM_CART", mealId });
  };

  const updateQuantity = (mealId: string, quantity: number) => {
    dispatch({ type: "UPDATE_QUANTITY", mealId, quantity });
  };

  const clearCart = () => {
    dispatch({ type: "CLEAR_CART" });
    try {
      localStorage.removeItem("shopping-cart");
    } catch (error) {
      console.error("Error clearing cart from localStorage:", error);
    }
  };

  const getTotalPrice = () => {
    if (!Array.isArray(items)) return 0;
    return items.reduce(
      (total, item) => total + (item.meal.price || 0) * (item.quantity || 0),
      0,
    );
  };

  const getTotalItems = () => {
    if (!Array.isArray(items)) return 0;
    return items.reduce((total, item) => total + (item.quantity || 0), 0);
  };

  const value: CartContextType = {
    items: Array.isArray(items) ? items : [],
    addToCart,
    addMultipleToCart,
    removeFromCart,
    updateQuantity,
    getTotalPrice,
    getTotalItems,
    clearCart,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
}
