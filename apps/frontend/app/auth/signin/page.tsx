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

    return () => {
      // Cleanup script on component unmount
      document.head.removeChild(script);
    };
  }, []);

  const handleGoogleSignIn = async () => {
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
            <div id="google-signin-container">
              <Button
                onClick={handleGoogleSignIn}
                variant="outline"
                className="w-full h-12 border-amber-200 hover:bg-amber-50 transition-all duration-300 hover:scale-[1.02] hover:shadow-md bg-white"
              >
                <svg className="w-6 h-6 mr-3" viewBox="0 0 24 24">
                  <path
                    fill="#4285F4"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                  />
                  <path
                    fill="#EA4335"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  />
                </svg>
                <span className="text-base">使用 Google 登入</span>
              </Button>
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
