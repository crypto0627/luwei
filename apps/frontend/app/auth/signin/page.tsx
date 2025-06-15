"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useRouter } from "next/navigation";
import authService from "@/services/auth-service";
import Link from "next/link";
import { useEffect } from "react";

export default function SignInPage() {
  const router = useRouter();

  useEffect(() => {
    // Load Google Identity Services script
    const script = document.createElement('script');
    script.src = 'https://accounts.google.com/gsi/client';
    script.async = true;
    script.defer = true;
    document.head.appendChild(script);

    // 添加全局回調函數
    // @ts-ignore
    window.handleCredentialResponse = async (response: any) => {
      try {
        const result = await authService.signInWithGoogle();
        console.log('Login result:', result);
        if (result && result.user) {
          router.push("/");
          router.refresh();
        }
      } catch (error) {
        console.error("Google 登入失敗:", error);
        alert("Google 登入失敗，請稍後再試。");
      }
    };

    return () => {
      // Cleanup script on component unmount
      document.head.removeChild(script);
      // @ts-ignore
      delete window.handleCredentialResponse;
    };
  }, [router]);

  const handleGoogleSignIn = async () => {
    try {
      const result = await authService.signInWithGoogle();
      console.log('Login result:', result);
      if (result && result.user) {
        router.push("/");
        router.refresh(); // 強制刷新頁面以更新用戶狀態
      }
    } catch (error) {
      console.error("Google 登入失敗:", error);
      alert("Google 登入失敗，請稍後再試。");
    }
  };

  // const handleLineSignIn = async () => {
  //   try {
  //     await authService.signInWithLine();
  //     router.push("/");
  //   } catch (error) {
  //     console.error("LINE 登入失敗:", error);
  //     alert("LINE 登入失敗，請稍後再試。");
  //   }
  // };

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
            <div id="g_id_onload"
              data-client_id={process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID}
              data-context="signin"
              data-ux_mode="popup"
              data-callback="handleCredentialResponse"
              data-auto_prompt="false">
            </div>

            <div className="g_id_signin"
              data-type="standard"
              data-shape="rectangular"
              data-theme="outline"
              data-text="signin_with"
              data-size="large"
              data-logo_alignment="left"
              data-width="100%">
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
