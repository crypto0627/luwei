"use client";

import Image from "next/image";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export function Menu() {
  return (
    <div className="">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-amber-900 mb-4 font-tc">
            美味菜單
          </h1>
          <p className="text-lg text-amber-700 max-w-2xl mx-auto font-tc">
            使用最優質在地食材手工製作的滷味。每道菜都訴說著我們對美食的堅持。
          </p>
        </div>

        <div className="flex flex-col md:flex-row gap-8 max-w-6xl mx-auto">
          <div className="relative aspect-[3/4] overflow-hidden md:w-1/2">
            <Image
              src="/images/menu.jpg"
              alt="大竹小倆口滷味菜單"
              fill
              className="object-contain rounded-2xl border-4 border-white bg-white/70"
              priority
            />
          </div>

          <div className="flex flex-col justify-center space-y-6 p-6 bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg h-fit my-auto md:w-1/2">
            <div>
              <h2 className="text-2xl font-bold text-amber-800 mb-4 font-tc">
                訂購須知
              </h2>
              <ul className="space-y-3 text-amber-700 font-tc">
                <li className="flex items-start gap-2">
                  <span className="text-amber-500">•</span>
                  <span>週一至週五下訂，隔週一即可取貨</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-amber-500">•</span>
                  <span>純手工無添加防腐劑</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-amber-500">•</span>
                  <span>請於取貨前24小時完成訂購</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-amber-500">•</span>
                  <span>如需大量訂購請提前聯繫</span>
                </li>
              </ul>
            </div>

            <Button
              asChild
              className="w-full h-16 text-lg bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700 text-white"
            >
              <Link href="#meals">立即訂購美味滷味</Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
