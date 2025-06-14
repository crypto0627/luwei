import type React from "react";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { Montserrat, Noto_Sans_TC } from "next/font/google";
import "./globals.css";
import { CartProvider } from "@/contexts/cart-context";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { AuthProvider } from "@/contexts/auth-context";

const inter = Inter({ subsets: ["latin"] });

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

export const metadata: Metadata = {
  title: "大竹小倆口滷味 - 重新定義滷味的美味",
  description: "純手工無添加防腐劑，週一至週五下訂，格週一即可取貨",
  icons: { icon: "/images/logo.jpg" },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="zh-TW" suppressHydrationWarning>
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