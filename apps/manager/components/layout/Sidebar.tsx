"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, BarChart3, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useUserStore } from "@/stores/useUserStore";
import { cn } from "@/lib/utils";
import { useState } from "react";

const menuItems = [
  { title: "訂單管理", url: "/main/dashboard", icon: LayoutDashboard },
  { title: "營收報表", url: "/main/reports", icon: BarChart3 },
];

interface SidebarProps {
  onMenuItemClick?: () => void;
}

export default function Sidebar({ onMenuItemClick }: SidebarProps) {
  const pathname = usePathname();
  const { user, logout } = useUserStore();
  const [loggingOut, setLoggingOut] = useState(false);

  const handleLogout = async () => {
    setLoggingOut(true);
    try {
      await logout();
      window.location.href = "/";
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error("Logout failed:", error);
    } finally {
      setLoggingOut(false);
    }
  };

  const handleMenuItemClick = () => {
    if (onMenuItemClick) {
      onMenuItemClick();
    }
  };

  // Sidebar 結構調整，讓 footer 永遠固定在最下方且不超出範圍
  return (
    <aside className="w-full min-h-0 h-full max-h-screen bg-gradient-to-b from-[#1a1a2e] via-[#16213e] to-[#0f3460] border-r border-[#ffb86c]/30 shadow-2xl shadow-orange-400/10 flex flex-col">
      {/* Logo & Brand */}
      <div className="flex flex-col items-center gap-3 p-8 border-b border-[#ffb86c]/30 flex-shrink-0">
        <div className="w-16 h-16 bg-gradient-to-br from-orange-400 via-pink-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-xl shadow-orange-400/30 border-4 border-white/20">
          <span className="text-3xl font-extrabold text-white drop-shadow-glow tracking-widest">滷</span>
        </div>
        <div className="text-center">
          <h1 className="text-2xl font-extrabold text-white tracking-widest drop-shadow-glow">大竹小倆口</h1>
          <p className="text-sm text-cyan-200/90 tracking-wide mt-1">管理後台</p>
        </div>
      </div>

      {/* Navigation & Main Content */}
      <div className="flex-1 min-h-0 flex flex-col">
        <nav className="flex-1 min-h-0 overflow-y-auto px-4 py-6 space-y-2">
          <div>
            <div className="text-xs font-bold text-cyan-200/70 px-3 mb-2 tracking-widest">主選單</div>
            <ul className="space-y-1">
              {menuItems.map((item) => {
                const isActive = pathname === item.url;
                return (
                  <li key={item.title}>
                    <Link
                      href={item.url}
                      onClick={handleMenuItemClick}
                      className={cn(
                        "flex items-center gap-4 px-5 py-3 rounded-2xl transition-all duration-200 group font-semibold text-base",
                        isActive
                          ? "bg-gradient-to-r from-orange-400 via-pink-500 to-purple-600 text-white shadow-lg shadow-orange-400/20 border border-white/10 scale-105"
                          : "text-cyan-100/90 hover:bg-white/10 hover:text-orange-300"
                      )}
                    >
                      <item.icon
                        className={cn(
                          "h-5 w-5 transition-all duration-200",
                          isActive
                            ? "text-white drop-shadow-glow"
                            : "text-cyan-200 group-hover:text-orange-300"
                        )}
                      />
                      <span className="tracking-wide">{item.title}</span>
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>
        </nav>

        {/* User Info & Logout */}
        {user && (
          <div className="flex flex-row p-2 border-t border-[#ffb86c]/30 flex-shrink-0">
            <div className="flex items-center gap-4 px-5 rounded-2xl text-cyan-100/90">
              <span className="truncate text-xs" title={user.email}>{user.email}</span>
            </div>
            <Button
              onClick={handleLogout}
              variant="ghost"
              size="sm"
              className="w-full flex items-center justify-center gap-2 text-cyan-100 hover:bg-gradient-to-r hover:from-orange-500 hover:to-pink-500 hover:text-white hover:shadow-lg transition-all font-semibold"
              disabled={loggingOut}
            >
              <LogOut className="h-4 w-4 text-cyan-200 group-hover:text-white" />
              <span className="text-sm">登出</span>
            </Button>
          </div>
        )}
      </div>

      {/* Footer - always at the bottom, never overflows */}
      <div className="py-4 px-6 text-center text-xs text-cyan-200/60 tracking-wide flex-shrink-0">
        &copy; {new Date().getFullYear()} 大竹小倆口滷味．All Rights Reserved
      </div>
    </aside>
  );
}