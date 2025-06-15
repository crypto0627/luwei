import type React from "react";
import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import { Montserrat, Noto_Sans_TC } from "next/font/google";
import "./globals.css";
import { CartProvider } from "@/contexts/cart-context";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { AuthProvider } from "@/contexts/auth-context";
import Script from "next/script";

const inter = Inter({ 
  subsets: ["latin"],
  display: "swap",
  preload: true,
  fallback: ["system-ui", "sans-serif"],
  adjustFontFallback: true,
  weight: ["400", "500", "600", "700"],
});

const montserrat = Montserrat({
  subsets: ["latin"],
  variable: "--font-montserrat",
  display: "swap",
});

const notoSansTC = Noto_Sans_TC({
  subsets: ["latin"],
  variable: "--font-noto-sans-tc",
  display: "swap",
});

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  themeColor: "#a237b0",
};

export const metadata: Metadata = {
  title: "大竹小倆口滷味 - 重新定義滷味的美味",
  description: "純手工無添加防腐劑，週一至週五下訂，隔週一即可取貨",
  manifest: "/manifest.json",
  icons: {
    icon: "/images/logo.jpg",
    apple: [
      { url: "/ios/180.png", sizes: "180x180", type: "image/png" }
    ],
  },
  openGraph: {
    title: "大竹小倆口滷味 - 重新定義滷味的美味",
    description: "純手工無添加防腐劑，週一至週五下訂，隔週一即可取貨",
    type: "website",
    locale: "zh_TW",
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "大竹小倆口滷味",
  },
  formatDetection: {
    telephone: true,
  },
  other: {
    "apple-mobile-web-app-capable": "yes",
    "apple-mobile-web-app-status-bar-style": "default",
    "format-detection": "telephone=no",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="zh-TW" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link rel="preconnect" href="https://www.googletagmanager.com" />
        
        <link rel="dns-prefetch" href="https://fonts.googleapis.com" />
        <link rel="dns-prefetch" href="https://www.googletagmanager.com" />
        
        <meta httpEquiv="x-dns-prefetch-control" content="on" />
        
        {/* Google Identity Services script */}
        <Script
          src="https://accounts.google.com/gsi/client"
          async
          defer
          strategy="beforeInteractive"
        />
      </head>
      <body
        className={`${inter.className} ${montserrat.variable} ${notoSansTC.variable}`}
      >
        <AuthProvider>
          <CartProvider>
            <Navbar />
            {children}
            <Footer />
          </CartProvider>
        </AuthProvider>
      </body>
    </html>
  );
}