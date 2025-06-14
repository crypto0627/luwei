"use client";

import type React from "react";
import { useState } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import type { Meal } from "@/lib/types";
import { useCart } from "@/contexts/cart-context";
import { Minus, Plus, ShoppingCart } from "lucide-react";
import { Input } from "@/components/ui/input";

interface MealCardProps {
  meal: Meal;
}

export function MealCard({ meal }: MealCardProps) {
  const { addMultipleToCart } = useCart();
  const [quantity, setQuantity] = useState(1);

  const handleQuantityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = Number.parseInt(e.target.value);
    if (isNaN(value)) {
      setQuantity(0);
    } else {
      setQuantity(Math.min(Math.max(0, value), 20)); // Limit between 0-20
    }
  };

  const increaseQuantity = () => {
    if (quantity < 20) {
      setQuantity(quantity + 1);
    }
  };

  const decreaseQuantity = () => {
    if (quantity > 0) {
      setQuantity(quantity - 1);
    }
  };

  const handleAddToCart = () => {
    if (quantity > 0) {
      addMultipleToCart(meal, quantity);

      // Add visual feedback
      const button = document.activeElement as HTMLElement;
      button?.classList.add("animate-pulse-soft");
      setTimeout(() => button?.classList.remove("animate-pulse-soft"), 600);
    }
  };

  return (
    <Card className="group overflow-hidden rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-1 bg-white border-amber-100 hover-lift w-[300px]">
      <div className="relative overflow-hidden aspect-square">
        <Image
          src={meal.image || "/placeholder.svg"}
          alt={meal.name}
          fill
          sizes="(max-width: 300px) 100vw, 300px"
          className="object-cover group-hover:scale-105 transition-transform duration-300"
          priority
        />
        <div className="absolute top-3 right-3">
          <span className="bg-gradient-to-r from-amber-600 to-orange-600 text-white px-3 py-1 rounded-full text-sm font-medium">
            NT${meal.price}
          </span>
        </div>
      </div>

      <CardContent className="p-6">
        <div className="mb-4">
          <h3 className="text-xl font-semibold text-amber-900 mb-2 group-hover:text-amber-700 transition-colors">
            {meal.name}
          </h3>
          <p className="text-amber-600 text-sm leading-relaxed">
            {meal.description}
          </p>
        </div>

        <div className="flex flex-col space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-2xl font-bold text-amber-700">
              NT${meal.price.toFixed(0)}
            </span>
          </div>

          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="icon"
              onClick={decreaseQuantity}
              className="h-8 w-8 rounded-full border-amber-300 text-amber-600 hover:bg-amber-50"
            >
              <Minus className="h-3 w-3" />
            </Button>

            <Input
              type="number"
              min="0"
              max="20"
              value={quantity}
              onChange={handleQuantityChange}
              className="h-8 w-16 text-center border-amber-300 focus:border-amber-500"
            />

            <Button
              variant="outline"
              size="icon"
              onClick={increaseQuantity}
              className="h-8 w-8 rounded-full border-amber-300 text-amber-600 hover:bg-amber-50"
            >
              <Plus className="h-3 w-3" />
            </Button>

            <Button
              onClick={handleAddToCart}
              disabled={quantity === 0}
              className="flex-1 bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white rounded-full py-1 flex items-center justify-center gap-2 transition-all duration-200 hover:scale-105 disabled:opacity-50 disabled:hover:scale-100"
            >
              <ShoppingCart className="w-4 h-4" />
              Add to Cart
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
