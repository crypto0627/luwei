"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { User } from "lucide-react";

const slogans = [
  "週一至週五下單，隔週一即可取貨",
  "傳承郭爸爸的老滷汁配方",
  "嚴選新鮮食材，現滷最美味",
];

const particlePositions = [
  { left: "10%", top: "20%" },
  { left: "30%", top: "10%" },
  { left: "50%", top: "30%" },
  { left: "70%", top: "15%" },
  { left: "90%", top: "25%" },
  { left: "20%", top: "40%" },
  { left: "45%", top: "55%" },
  { left: "60%", top: "48%" },
  { left: "85%", top: "60%" },
  { left: "5%", top: "75%" },
];

const customerReviews = [
  {
    iconColor: "text-blue-500",
    name: "Alex Chen",
    review: "滷味超入味，雞翅真的很推！每次聚餐都會訂。",
  },
  {
    iconColor: "text-pink-500",
    name: "Bella Lin",
    review: "食材新鮮，口味多元，家人都很喜歡。",
  },
  {
    iconColor: "text-green-500",
    name: "Chris Wang",
    review: "價格實惠，份量足夠，CP值超高！",
  },
  {
    iconColor: "text-purple-500",
    name: "Diana Huang",
    review: "滷汁香氣十足，吃過就回不去了。",
  },
  {
    iconColor: "text-red-500",
    name: "Ethan Liu",
    review: "晚餐一定要配這家的滷味，超下飯！",
  },
  {
    iconColor: "text-indigo-500",
    name: "Fiona Wu",
    review: "每次朋友來家裡都指定要吃這家滷味。",
  },
];

export function HeroSection() {
  const [currentSlogan, setCurrentSlogan] = useState(0);
  const [displayedText, setDisplayedText] = useState("");
  const [isTyping, setIsTyping] = useState(true);
  const [charIndex, setCharIndex] = useState(0);
  const [particleAnimations, setParticleAnimations] = useState<
    {
      animationDelay: string;
      animationDuration: string;
    }[]
  >([]);

  useEffect(() => {
    const generatedAnimations = particlePositions.map(() => ({
      animationDelay: `${Math.random() * 3}s`,
      animationDuration: `${2 + Math.random() * 3}s`,
    }));
    setParticleAnimations(generatedAnimations);
  }, []);

  useEffect(() => {
    const currentText = slogans[currentSlogan];

    if (isTyping) {
      if (charIndex < currentText.length) {
        const timer = setTimeout(() => {
          setDisplayedText(currentText.slice(0, charIndex + 1));
          setCharIndex(charIndex + 1);
        }, 100);
        return () => clearTimeout(timer);
      } else {
        const timer = setTimeout(() => {
          setIsTyping(false);
        }, 2000);
        return () => clearTimeout(timer);
      }
    } else {
      if (charIndex > 0) {
        const timer = setTimeout(() => {
          setDisplayedText(currentText.slice(0, charIndex - 1));
          setCharIndex(charIndex - 1);
        }, 50);
        return () => clearTimeout(timer);
      } else {
        const timer = setTimeout(() => {
          setCurrentSlogan((prev) => (prev + 1) % slogans.length);
          setIsTyping(true);
        }, 500);
        return () => clearTimeout(timer);
      }
    }
  }, [charIndex, isTyping, currentSlogan]);

  return (
    <section className="relative min-h-[600px] flex flex-col overflow-hidden pt-24 pb-12 md:pt-28 md:pb-20">
      {/* Background Effects - Removed to use parent background */}

      {/* Floating Particles */}
      <div className="absolute inset-0">
        {particlePositions.map((pos, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-amber-400/30 rounded-full animate-pulse"
            style={{
              left: pos.left,
              top: pos.top,
              ...particleAnimations[i],
            }}
          />
        ))}
      </div>

      <div className="relative z-10 text-center px-4 max-w-4xl mx-auto flex-grow mb-12">
        {/* Badge */}
        <Badge className="mb-8 bg-gradient-to-r from-amber-500/20 to-orange-500/20 text-amber-700 border-amber-500/30 px-8 py-2.5 text-sm font-semibold hover:from-amber-500/30 hover:to-orange-500/30 transition-all duration-300 shadow-sm hover:shadow-md">
          <span className="flex items-center gap-2">
            <span className="text-amber-500 animate-pulse">🔥</span>
            <span>招牌雞翅6隻</span>
            <span className="text-amber-600 font-bold">NT$100</span>
            <span className="text-amber-500">起</span>
          </span>
        </Badge>

        {/* Main Headline */}
        <h1 className="text-4xl md:text-6xl font-bold mb-8 leading-tight">
          <span className="text-amber-900">正宗台式滷味</span>
          <br />
          <span className="bg-gradient-to-r from-amber-600 via-orange-500 to-amber-400 bg-clip-text text-transparent">
            傳承郭爸爸的老滷汁配方
          </span>
        </h1>

        {/* Animated Subtitle with Typing Effect */}
        <div className="h-16 flex items-center justify-center mb-12">
          <p className="text-lg md:text-xl text-amber-700 max-w-2xl mx-auto leading-relaxed">
            {displayedText}
            <span className="animate-pulse text-amber-400">|</span>
          </p>
        </div>

        {/* CTA Button */}
        <Button
          size="lg"
          className="bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700 text-white px-8 py-3 text-lg rounded-full shadow-lg transition-all duration-300 hover:shadow-xl hover:scale-105 transform group"
          asChild
        >
          <Link href="#menu">
            查看菜單{" "}
            <span className="inline-block transition-transform duration-300 group-hover:translate-x-1">
              →
            </span>
          </Link>
        </Button>
      </div>

      {/* 客戶留言輪播 - 獨立於主內容區塊外，以實現全寬顯示 */}
      <div className="w-full pt-16">
        <p className="text-amber-600 text-base mb-8 uppercase tracking-wider font-bold text-center">
          客戶留言
        </p>
        <div className="relative w-full overflow-x-hidden">
          <div className="logo-carousel-track flex gap-x-6 md:gap-x-8">
            {[...customerReviews, ...customerReviews].map((item, index) => (
              <div
                key={index}
                className="w-[300px] md:w-[450px] flex-shrink-0 bg-white/95 border border-amber-100 rounded-2xl shadow-lg px-6 py-3 flex items-center text-left hover:shadow-xl transition-all duration-300 cursor-pointer group relative"
              >
                <div className="flex-shrink-0 mr-4">
                  <div className="relative mb-1">
                    <User
                      className={`w-12 h-12 rounded-full border-3 border-amber-200 shadow-sm object-cover group-hover:scale-105 transition-transform bg-white p-2 ${item.iconColor}`}
                    />
                    <span className="absolute bottom-0 right-0 bg-amber-400 text-white text-[8px] px-1.5 py-0.5 rounded-full shadow font-semibold border border-white transform translate-x-1/2 translate-y-1/2">
                      好評
                    </span>
                  </div>
                </div>
                <div className="flex-1 flex flex-col justify-center">
                  <div className="font-bold text-amber-800 text-sm flex items-center gap-1 mb-1">
                    <span className="inline-block w-1 h-1 bg-amber-400 rounded-full"></span>
                    {item.name}
                  </div>
                  <div className="text-amber-700 text-[14px] leading-snug font-normal">
                    <span className="text-[14px] text-amber-300 mr-0.5">“</span>
                    <span>{item.review}</span>
                    <span className="text-[14px] text-amber-300 ml-0.5">”</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
          {/* 左右漸層遮罩，讓輪播更有層次 */}
          <div className="pointer-events-none absolute left-0 top-0 h-full w-10 md:w-16 bg-gradient-to-r from-white/90 to-transparent z-10"></div>
          <div className="pointer-events-none absolute right-0 top-0 h-full w-10 md:w-16 bg-gradient-to-l from-white/90 to-transparent z-10"></div>
        </div>
      </div>
    </section>
  );
}
