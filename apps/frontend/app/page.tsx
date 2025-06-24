"use client";

import { HeroSection } from "@/components/hero-section";
import { MealCard } from "@/components/meal-card";
import { ShoppingCartPreview } from "@/components/shopping-cart";
import { sampleMeals } from "@/lib/data";
import { Menu } from "@/components/menu";

export default function HomePage() {

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-400 via-orange-200 to-white">
      {/* Hero Section */}
      <section id="home">
        <HeroSection />
      </section>
      {/* Menu */}
      <section id="menu">
        <Menu />
      </section>
      {/* Meals Section */}
      <section id="meals" className="py-16 px-4">
        <div className="container mx-auto max-w-7xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-amber-800 mb-4">
              今日新鮮精選
            </h2>
            <p className="text-lg text-amber-600 max-w-2xl mx-auto">
              使用最優質在地食材手工製作的餐點。每道菜都訴說著我們社區農夫和工匠的故事。
            </p>
          </div>

          {/* Meal Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 justify-items-center">
            {sampleMeals.map((meal) => (
              <MealCard key={meal.id} meal={meal} />
            ))}
          </div>
        </div>
      </section>

      {/* Shopping Cart */}
      <ShoppingCartPreview />
    </div>
  );
}
