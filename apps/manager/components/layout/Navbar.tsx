"use client";
import { Button } from "@/components/ui/button";
import { Menu } from "lucide-react";

export default function Navbar({ onMenuClick }: { onMenuClick?: () => void }) {
  return (
    <header className="sticky top-0 left-0 w-full flex items-center justify-between px-6 py-3 bg-gradient-to-r from-[#fbbf24]/30 via-[#f472b6]/20 to-[#a237b0]/30 backdrop-blur-2xl border-b border-[#ffb86c]/30 z-40 shadow-md shadow-orange-200/10 h-20">
      <div className="flex items-center gap-3">
        {onMenuClick && (
          <Button
            variant="ghost"
            size="icon"
            onClick={onMenuClick}
            aria-label="開啟選單"
            className="text-cyan-200 mr-2 lg:hidden"
          >
            <Menu className="h-6 w-6" />
          </Button>
        )}
        <span className="text-2xl font-extrabold tracking-widest text-transparent bg-clip-text bg-gradient-to-r from-orange-400 via-pink-500 to-purple-600 drop-shadow-glow">
          訂單管理系統
        </span>
      </div>
    </header>
  );
}