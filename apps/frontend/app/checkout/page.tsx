"use client";

import { useEffect, useState } from "react";
import { ButtonLoading } from "@/components/ui/loading";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { CartItem } from "@/types/cart-types";
import { AlertTriangle } from "lucide-react";
import orderService from "@/services/order-service";
import Swal from 'sweetalert2';

export default function CheckoutPage() {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [totalAmount, setTotalAmount] = useState(0);
  const [pickupDate, setPickupDate] = useState("");
  const [phone, setPhone] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const cart = localStorage.getItem("shopping-cart");
    if (cart) {
      const items = JSON.parse(cart);
      setCartItems(items);
      const total = items.reduce((sum: number, item: CartItem) => 
        sum + (item.meal.price * item.quantity), 0);
      setTotalAmount(total);
    }

    // Calculate pickup date based on current day
    const today = new Date();
    const dayOfWeek = today.getDay(); // 0 is Sunday, 1-5 is Monday-Friday, 6 is Saturday
    const nextMonday = new Date(today);
    
    if (dayOfWeek >= 1 && dayOfWeek <= 5) {
      // If today is Monday-Friday, set pickup to next Monday
      nextMonday.setDate(today.getDate() + (8 - dayOfWeek));
    } else {
      // If today is Saturday or Sunday, set pickup to next next Monday
      nextMonday.setDate(today.getDate() + (15 - dayOfWeek));
    }
    
    setPickupDate(nextMonday.toLocaleDateString('zh-TW', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric',
      weekday: 'long'
    }));
  }, []);

  const handleCheckout = async () => {
    // 驗證電話號碼
    if (!phone.trim()) {
      await Swal.fire({
        title: '請輸入電話號碼',
        text: '電話號碼為必填項目',
        icon: 'warning',
        confirmButtonText: '確定',
        confirmButtonColor: '#d97706'
      });
      return;
    }

    // 驗證電話號碼格式（台灣手機或市話）
    const phoneRegex = /^[0-9]{8,9}$/;
    if (!phoneRegex.test(phone)) {
      await Swal.fire({
        title: '電話號碼格式錯誤',
        text: '請輸入正確的台灣電話號碼（8-9位數字）',
        icon: 'warning',
        confirmButtonText: '確定',
        confirmButtonColor: '#d97706'
      });
      return;
    }

    try {
      setIsLoading(true);
      await orderService.checkout(cartItems, `+886${phone}`);
      await Swal.fire({
        title: '訂單已送出！',
        text: '感謝您的訂購',
        icon: 'success',
        confirmButtonText: '確定',
        confirmButtonColor: '#d97706'
      });
      localStorage.removeItem("shopping-cart");
      router.push("/monitor");
    } catch (error) {
      await Swal.fire({
        title: '訂單送出失敗',
        text: '請稍後再試',
        icon: 'error',
        confirmButtonText: '確定',
        confirmButtonColor: '#d97706'
      });
      console.error("Checkout error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-400 via-orange-200 to-white pt-24 pb-12">
      <div className="container mx-auto max-w-4xl px-4">
        <h1 className="text-3xl font-bold text-amber-800 mb-8 text-center">確認訂單</h1>
        
        <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
          <h2 className="text-xl font-semibold text-amber-700 mb-4">訂單明細</h2>
          
          {cartItems.map((item, index) => (
            <div key={index} className="flex items-center gap-4 py-4 border-b border-amber-100">
              <div className="relative w-20 h-20 rounded-lg overflow-hidden">
                <Image
                  src={item.meal.image}
                  alt={item.meal.name}
                  fill
                  className="object-cover"
                />
              </div>
              <div className="flex-1">
                <h3 className="font-medium text-amber-800">{item.meal.name}</h3>
                <p className="text-sm text-amber-600">數量: {item.quantity}</p>
                <p className="text-amber-700">NT$ {item.meal.price * item.quantity}</p>
              </div>
            </div>
          ))}

          <div className="mt-6 pt-4 border-t border-amber-200">
            <div className="flex justify-between items-center text-lg font-semibold text-amber-800">
              <span>總計</span>
              <span>NT$ {totalAmount}</span>
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-amber-200">
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-amber-700">取貨日期</span>
                <span className="font-medium">{pickupDate}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-amber-700">取貨地點</span>
                <a 
                  href="https://maps.app.goo.gl/Ao4XE8KkccgKY2Nk7"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:underline"
                >
                  查看地圖
                </a>
              </div>
              <div className="space-y-2">
                <label className="text-amber-700 font-medium">聯絡電話 *</label>
                <div className="flex items-center gap-2">
                  <span className="bg-gray-100 px-3 py-2 rounded-lg text-gray-700 font-medium">+886</span>
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => {
                      // 只允許數字輸入
                      const value = e.target.value.replace(/\D/g, '');
                      setPhone(value);
                    }}
                    placeholder="請輸入電話號碼（例：912345678 或 0223456789）"
                    className="flex-1 px-3 py-2 border border-amber-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                    maxLength={10}
                  />
                </div>
                <p className="text-sm text-amber-600">
                  請輸入手機號碼（9開頭）或市話號碼（02、03等開頭）
                </p>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-amber-700">支付方式</span>
                <span className="font-medium">到店現金支付</span>
              </div>
              <div className="flex items-center gap-2 text-amber-700 text-sm">
                <AlertTriangle className="w-4 h-4" />
                <span>非常抱歉，目前僅支援到店現金支付</span>
              </div>
            </div>
          </div>
        </div>

        <div className="flex justify-center">
          <ButtonLoading
            loading={isLoading}
            loadingText="處理訂單中..."
            onClick={handleCheckout}
            size="lg"
            className="px-8 py-3 transition-all duration-300 hover:scale-105"
          >
            確認結帳
          </ButtonLoading>
        </div>
      </div>
    </div>
  );
}