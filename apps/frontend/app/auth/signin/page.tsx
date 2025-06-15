"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useRouter } from "next/navigation";
import authService from "@/services/auth-service";
import Link from "next/link";
import { useEffect, useRef } from "react";
import { useUserStore } from "@/stores/useUserStore";

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

export default function SignInPage() {
  const router = useRouter();
  const googleInitialized = useRef(false);
  const { fetchUser } = useUserStore();

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
        if (window.google) {
          clearInterval(interval);
          googleInitialized.current = true;
          
          window.google.accounts.id.initialize({
            client_id: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID!,
            callback: async (response: any) => {
              try {
                const result = await authService.handleCredentialResponse(response);
                if (result && result.user) {
                  await fetchUser();
                  router.push("/");
                }
              } catch (error) {
                console.error("Google 登入失敗:", error);
                alert("Google 登入失敗，請稍後再試。");
              }
            },
            ux_mode: 'popup'
          });

          window.google.accounts.id.renderButton(
            document.getElementById('google-signin-container'),
            { 
              type: 'standard', 
              theme: 'outline', 
              size: 'large',
              width: '100%'
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-white flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <Card className="border-amber-200 shadow-xl hover:shadow-2xl transition-all duration-300 bg-white/80 backdrop-blur-sm">
          <CardHeader className="space-y-2">
            <CardTitle className="text-3xl font-bold text-amber-800 text-center">
              歡迎回來
            </CardTitle>
            <p className="text-center text-amber-600 text-sm">
              請選擇您偏好的登入方式
            </p>
          </CardHeader>
          <CardContent className="space-y-4">
            <div id="google-signin-container" className="w-full">
              {/* Google Sign-In button will be rendered here */}
            </div>

            <div className="pt-4 text-center">
              <p className="text-xs text-amber-600">
                登入即表示您同意我們的{" "}
                <Link
                  href="/privacy-policy"
                  className="text-amber-700 hover:text-amber-900 font-medium underline-offset-4 hover:underline transition-colors duration-200"
                >
                  隱私權政策
                </Link>
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
