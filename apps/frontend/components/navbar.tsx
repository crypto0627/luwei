"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Menu, Utensils, User, LogOut, Package } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useUserStore } from "@/stores/useUserStore";

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();
  const { user, logout } = useUserStore();

  const navItems = [
    { name: "關於我們", href: "/about" },
    { name: "美味菜單", href: "/#menu" },
    {
      name: "門店資訊",
      href: "https://maps.app.goo.gl/Ao4XE8KkccgKY2Nk7",
      target: "_blank",
    },
    { name: "常見問題", href: "/question" },
  ];

  const handleLoginClick = () => {
    router.push("/auth/signin");
  };

  const handleLogout = async () => {
    await logout();
    router.push("/");
  };

  const handleTrackOrder = () => {
    router.push("/monitor");
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/90 backdrop-blur-md border-b border-amber-200 shadow-sm">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-20 md:16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 group">
            <div className="relative w-10 h-10 rounded-full overflow-hidden border-2 border-[#f2c147]/20 group-hover:border-[#f2c147]/40 transition-colors duration-300">
              <Image
                src="/images/logo.webp"
                alt="新鮮市場廚房"
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-300"
              />
            </div>
            <div className="flex flex-col">
              <span className="text-xl font-bold text-amber-800 group-hover:text-amber-900 transition-colors duration-300 font-tc tracking-wide">
                大竹小倆口滷味
              </span>
              <span className="text-xs text-red-800/70 font-tc">
                重新定義滷味的美味
              </span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="flex items-center space-x-6">
            {/* Navigation Links */}
            <div className="hidden md:flex items-center space-x-8">
              {navItems.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  target={item.target}
                  className="relative text-amber-700 hover:text-amber-900 font-medium transition-colors duration-300 group py-2 font-tc underline-anim"
                >
                  {item.name}
                </Link>
              ))}
            </div>

            {/* Desktop Login Buttons */}
            <div className="hidden md:flex items-center space-x-4">
              {user ? (
                <div className="flex items-center space-x-2">
                  <Button
                    variant="outline"
                    className="border-amber-200 text-amber-600 hover:bg-amber-50/50 hover:border-amber-300 transition-all duration-300 hover:scale-105 flex items-center gap-2 font-tc"
                  >
                    <User className="w-4 h-4" />
                    <span>{user.email}</span>
                  </Button>
                  <Button
                    onClick={handleTrackOrder}
                    variant="outline"
                    className="border-amber-200 text-amber-600 hover:bg-amber-50/50 hover:border-amber-300 transition-all duration-300 hover:scale-105 flex items-center gap-2 font-tc"
                  >
                    <Package className="w-4 h-4" />
                    <span>追蹤訂單</span>
                  </Button>
                  <Button
                    onClick={handleLogout}
                    variant="outline"
                    className="border-amber-200 text-amber-600 hover:bg-amber-50/50 hover:border-amber-300 transition-all duration-300 hover:scale-105 flex items-center gap-2 font-tc"
                  >
                    <LogOut className="w-4 h-4" />
                    <span>登出</span>
                  </Button>
                </div>
              ) : (
                <Button
                  onClick={handleLoginClick}
                  variant="outline"
                  className="border-amber-200 text-amber-600 hover:bg-amber-50/50 hover:border-amber-300 transition-all duration-300 hover:scale-105 flex items-center gap-2 font-tc"
                >
                  <User className="w-4 h-4" />
                  <span>會員登入</span>
                </Button>
              )}
            </div>
          </div>

          {/* Mobile Menu Button */}
          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild className="md:hidden">
              <Button
                variant="ghost"
                size="icon"
                className="hover:bg-amber-50 transition-colors duration-300"
              >
                <Menu className="w-6 h-6 text-amber-700" />
              </Button>
            </SheetTrigger>
            <SheetContent 
              side="right" 
              className="w-full sm:max-w-[425px]"
              aria-describedby="mobile-menu-description"
            >
              <SheetHeader>
                <SheetTitle className="flex items-center space-x-2">
                  <Utensils className="w-6 h-6 text-amber-600" />
                  <Link href="/" onClick={()=>setIsOpen(false)}>
                    <span className="text-lg font-bold text-amber-800 font-tc">
                      大竹小倆口滷味
                    </span>
                  </Link>
                </SheetTitle>
                <SheetDescription id="mobile-menu-description" className="sr-only">
                  行動裝置選單
                </SheetDescription>
              </SheetHeader>

              <div className="mt-8 space-y-4">
                {navItems.map((item) => (
                  <Link
                    key={item.name}
                    href={item.href}
                    target={item.target}
                    className="block py-3 px-4 text-amber-700 hover:bg-amber-50 rounded-lg transition-all duration-300 hover:translate-x-2 font-tc underline-anim"
                    onClick={() => setIsOpen(false)}
                  >
                    {item.name}
                  </Link>
                ))}
                <div className="pt-4 border-t border-amber-200 space-y-3">
                  {user ? (
                    <>
                      <Button
                        className="w-full bg-amber-600 hover:bg-amber-700 text-white transition-all duration-300 hover:scale-105 font-tc"
                      >
                        <User className="w-4 h-4 mr-2" />
                        {user.email}
                      </Button>
                      <Button
                        onClick={() => {
                          handleTrackOrder();
                          setIsOpen(false);
                        }}
                        className="w-full bg-amber-600 hover:bg-amber-700 text-white transition-all duration-300 hover:scale-105 font-tc"
                      >
                        <Package className="w-4 h-4 mr-2" />
                        追蹤訂單
                      </Button>
                      <Button
                        onClick={() => {
                          handleLogout();
                          setIsOpen(false);
                        }}
                        className="w-full bg-amber-600 hover:bg-amber-700 text-white transition-all duration-300 hover:scale-105 font-tc"
                      >
                        <LogOut className="w-4 h-4 mr-2" />
                        登出
                      </Button>
                    </>
                  ) : (
                    <Button
                      onClick={() => {
                        handleLoginClick();
                        setIsOpen(false);
                      }}
                      className="w-full bg-amber-600 hover:bg-amber-700 text-white transition-all duration-300 hover:scale-105 font-tc"
                    >
                      <User className="w-4 h-4 mr-2" />
                      會員登入
                    </Button>
                  )}
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </nav>
  );
}
