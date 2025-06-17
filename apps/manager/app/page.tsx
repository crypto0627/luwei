"use client"

import { useEffect, useRef } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent } from "@/components/ui/card"
import { useUserStore } from "@/stores/useUserStore"
import authService from "@/services/auth-service"

// Add type declaration for Google Identity Services
declare global {
  interface Window {
    google: {
      accounts: {
        id: {
          initialize: (config: {
            client_id: string;
            callback: (response: any) => void;
            ux_mode?: string;
          }) => void;
          renderButton: (
            element: HTMLElement | null,
            config: {
              type?: string;
              theme?: string;
              size?: string;
              width?: string;
            }
          ) => void;
        };
      };
    };
  }
}

export default function HomePage() {
  const router = useRouter()
  const { user, isLoading, fetchUser } = useUserStore()
  const googleInitialized = useRef(false)
  const googleSignInContainerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const checkAuth = async () => {
      await fetchUser()
      if (user) {
        router.push("/main/dashboard")
      }
    }

    checkAuth()
  }, [router, user, fetchUser])

  useEffect(() => {
    let interval: NodeJS.Timeout;

    const tryRenderGoogleButton = () => {
      // 確保 Google Identity Services 已加載，容器 ref 可用，且尚未初始化
      if (window.google && googleSignInContainerRef.current && !googleInitialized.current) {
        clearInterval(interval); // 條件滿足後停止檢查
        googleInitialized.current = true; // 標記為已初始化

        window.google.accounts.id.initialize({
          client_id: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID!,
          callback: async (response: any) => {
            try {
              const result = await authService.handleCredentialResponse(response);
              if (result && result.user) {
                await fetchUser();
                router.push("/main/dashboard");
              }
            } catch (error) {
              console.error("Google 登入失敗:", error);
              alert("Google 登入失敗，請稍後再試。");
            }
          },
          ux_mode: 'popup'
        });

        window.google.accounts.id.renderButton(
          googleSignInContainerRef.current,
          { 
            type: 'standard', 
            theme: 'outline', 
            size: 'large',
            width: '100%'
          }
        );
      }
    };

    // 每 100ms 開始檢查 window.google 和 ref 的可用性
    interval = setInterval(tryRenderGoogleButton, 100);

    return () => {
      clearInterval(interval); // 在組件卸載時清除 interval
    };
  }, [router, fetchUser]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-white"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-400 via-orange-500 to-orange-600 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <Card className="border-0 shadow-2xl bg-white">
          <div className="flex flex-col p-6 text-center space-y-4">
            <div className="mx-auto w-20 h-20 bg-gradient-to-br from-orange-400 to-orange-600 rounded-full flex items-center justify-center">
              <span className="text-2xl font-bold text-white">滷</span>
            </div>
            <div className="tracking-tight text-2xl font-bold text-gray-800">
              大竹小倆口滷味
            </div>
            <div className="text-sm text-gray-600">
              管理後台登入
            </div>
          </div>
          <CardContent className="p-6 pt-0 space-y-4">
            <div ref={googleSignInContainerRef} className="w-full">
              {/* Google Sign-In button will be rendered here */}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
