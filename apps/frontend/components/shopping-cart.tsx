"use client";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Badge } from "@/components/ui/badge";
import { useCart } from "@/contexts/cart-context";
import { ShoppingCart, Minus, Plus, Trash2 } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useUserStore } from "@/stores/useUserStore";

export function ShoppingCartPreview() {
  const {
    items,
    getTotalPrice,
    getTotalItems,
    updateQuantity,
    removeFromCart,
  } = useCart();
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();
  const { user } = useUserStore();

  const handleCheckout = () => {
    setIsOpen(false);
    if (user) {
      router.push("/checkout");
    } else {
      router.push("/auth/signin");
    }
  };

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        <Button
          variant="outline"
          size="lg"
          className="fixed bottom-6 right-6 z-50 rounded-full shadow-lg bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700 text-white border-0 px-6 py-3"
        >
          <ShoppingCart className="w-5 h-5 mr-2" />
          購物車
          {getTotalItems() > 0 && (
            <Badge className="ml-2 bg-orange-500 text-white">
              {getTotalItems()}
            </Badge>
          )}
        </Button>
      </SheetTrigger>

      <SheetContent className="w-full sm:max-w-lg">
        <SheetHeader>
          <SheetTitle className="text-2xl font-bold text-amber-700">
            您的購物車 ({getTotalItems()} 項商品)
          </SheetTitle>
        </SheetHeader>

        <div className="mt-6 space-y-4">
          {items.length === 0 ? (
            <div className="text-center py-12">
              <ShoppingCart className="w-16 h-16 mx-auto text-amber-300 mb-4" />
              <p className="text-amber-500">您的購物車是空的</p>
              <p className="text-amber-400 text-sm mt-2">
                快去選擇您喜歡的餐點吧！
              </p>
            </div>
          ) : (
            <>
              <div className="space-y-4 max-h-96 overflow-y-auto">
                {items.map((item) => (
                  <div
                    key={item.meal.id}
                    className="flex items-center space-x-4 bg-amber-50 p-4 rounded-lg border border-amber-100 hover:bg-amber-100 transition-colors"
                  >
                    <Image
                      src={item.meal.image || "/placeholder.svg"}
                      alt={item.meal.name}
                      width={60}
                      height={60}
                      className="rounded-lg object-cover"
                    />
                    <div className="flex-1">
                      <h4 className="font-medium text-amber-900">
                        {item.meal.name}
                      </h4>
                      <p className="text-amber-600 font-semibold">
                        NT${item.meal.price.toFixed(0)}
                      </p>
                      <p className="text-amber-500 text-xs">
                        {item.meal.description}
                      </p>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() =>
                          updateQuantity(item.meal.id, item.quantity - 1)
                        }
                        className="w-8 h-8 p-0 border-amber-300 text-amber-600 hover:bg-amber-50"
                      >
                        <Minus className="w-3 h-3" />
                      </Button>
                      <span className="w-8 text-center font-medium text-amber-800">
                        {item.quantity}
                      </span>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() =>
                          updateQuantity(item.meal.id, item.quantity + 1)
                        }
                        className="w-8 h-8 p-0 border-amber-300 text-amber-600 hover:bg-amber-50"
                      >
                        <Plus className="w-3 h-3" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => removeFromCart(item.meal.id)}
                        className="w-8 h-8 p-0 text-red-500 hover:text-red-700 border-red-300 hover:bg-red-50"
                      >
                        <Trash2 className="w-3 h-3" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>

              <div className="border-t border-amber-200 pt-4 space-y-4">
                <div className="flex justify-between items-center text-xl font-bold">
                  <span className="text-amber-800">總計：</span>
                  <span className="text-amber-700">
                    NT${getTotalPrice().toFixed(0)}
                  </span>
                </div>
                <Button
                  onClick={handleCheckout}
                  className="w-full bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white py-3 rounded-full text-lg font-semibold transition-all duration-300 hover:scale-105"
                >
                  {user ? "前往結帳" : "登入後結帳"}
                </Button>
              </div>
            </>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
}
