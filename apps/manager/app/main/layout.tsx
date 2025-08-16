"use client";
import type { ReactNode } from "react";
import { SidebarProvider } from "@/components/ui/sidebar";
import { useIsMobile } from "@/hooks/use-mobile";
import { cn } from "@/lib/utils";
import { useEffect, useState } from "react";
import Sidebar from "@/components/layout/Sidebar";
import Navbar from "@/components/layout/Navbar";

export default function MainLayout({ children }: { children: ReactNode }) {
  const isMobile = useIsMobile();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Sidebar width CSS variable
  const sidebarWidth = isMobile
    ? "clamp(14rem, 80vw, 18rem)"
    : "clamp(12rem, 15vw, 16rem)";

  // Prevent body scroll when sidebar is open on mobile
  useEffect(() => {
    if (isMobile && sidebarOpen) {
      // 只防止 body 滾動，不影響主內容區域
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    
    return () => {
      document.body.style.overflow = "";
    };
  }, [sidebarOpen, isMobile]);

  return (
    <SidebarProvider
      style={
        {
          "--sidebar-width": sidebarWidth,
          "--sidebar-width-mobile": "clamp(14rem, 80vw, 18rem)",
          "--sidebar-width-icon": "3rem",
        } as React.CSSProperties
      }
    >
      {/* Desktop Sidebar - Fixed */}
      <div className="hidden lg:block fixed top-0 left-0 z-50 h-screen w-[var(--sidebar-width)]">
        <Sidebar />
      </div>

      {/* Mobile Sidebar - Overlay */}
      {isMobile && sidebarOpen && (
        <div className="fixed inset-0 z-[60]">
          <div
            className="absolute inset-0 bg-black/40"
            onClick={() => setSidebarOpen(false)}
          />
          <div className="absolute top-0 left-0 h-full w-[var(--sidebar-width-mobile)]">
            <Sidebar onMenuItemClick={() => setSidebarOpen(false)} />
          </div>
        </div>
      )}

      {/* Main Content */}
      <div
        className={cn(
          "min-h-screen transition-all duration-300 flex-1",
          !isMobile && "lg:ml-[var(--sidebar-width)]"
        )}
      >
        {/* Mobile Navbar */}
        {isMobile && <Navbar onMenuClick={() => setSidebarOpen(true)} />}
        
          {children}
      </div>
    </SidebarProvider>
  );
}