"use client"

import { useEffect, useRef } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent } from "@/components/ui/card"
import { useUserStore } from "@/stores/useUserStore"
import authService from "@/services/auth-service"

// Google Identity Services type declaration
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
              logo_alignment?: string;
              text?: string;
              shape?: string;
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

  // Reset scroll and any global state if needed
  useEffect(() => {
    window.scrollTo(0, 0)
    // Add more reset logic here if needed
  }, [])

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
    // Load Google Identity Services script
    const script = document.createElement('script');
    script.src = 'https://accounts.google.com/gsi/client';
    script.async = true;
    script.defer = true;
    document.head.appendChild(script);

    // Initialize Google Sign-In when script is loaded
    const initializeGoogle = () => {
      if (googleInitialized.current) return;

      const interval = setInterval(() => {
        if (window.google && googleSignInContainerRef.current) {
          clearInterval(interval);
          googleInitialized.current = true;

          window.google.accounts.id.initialize({
            client_id: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID!,
            callback: async (response: any) => {
              try {
                await authService.handleCredentialResponse(response);
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
              theme: 'filled_blue',
              size: 'large',
              width: '100%',
              logo_alignment: 'center',
              text: 'signin_with',
              shape: 'pill'
            }
          );
        }
      }, 100);
    };

    script.onload = initializeGoogle;

    return () => {
      document.head.removeChild(script);
      googleInitialized.current = false;
    };
  }, [router, fetchUser]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-orange-400 via-orange-500 to-orange-600">
        <div className="flex flex-col items-center gap-4">
          <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-white/80"></div>
          <span className="text-white text-lg font-semibold tracking-wide drop-shadow">載入中...</span>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-400 via-orange-500 to-orange-600 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <Card className="border-0 shadow-2xl bg-white/80 backdrop-blur-md">
          <div className="flex flex-col p-8 text-center space-y-6">
            <div className="mx-auto w-24 h-24 bg-gradient-to-br from-orange-500 to-orange-700 rounded-full flex items-center justify-center shadow-lg">
              <span className="text-4xl font-extrabold text-white drop-shadow-lg">滷</span>
            </div>
            <div className="tracking-tight text-3xl font-extrabold text-gray-800 drop-shadow-sm">
              大竹小倆口滷味
            </div>
            <div className="text-base text-gray-600 font-medium">
              <span className="block mb-1">管理後台登入</span>
              <span className="text-sm text-gray-500">請先至官網登入您的 Google 帳號</span>
            </div>
          </div>
          <CardContent className="p-8 pt-0 space-y-4">
            <div ref={googleSignInContainerRef} className="w-full flex justify-center" />
          </CardContent>
        </Card>
        <div className="mt-8 text-center text-xs text-white/80 tracking-wide">
          &copy; {new Date().getFullYear()} 大竹小倆口滷味．All Rights Reserved
        </div>
      </div>
    </div>
  )
}
