import { cn } from "@/lib/utils";
import { ReactNode } from "react";

// 基礎 Loading Spinner 組件
interface LoadingSpinnerProps {
  className?: string;
  size?: "xs" | "sm" | "md" | "lg" | "xl";
  color?: "amber" | "blue" | "gray" | "white";
}

export function LoadingSpinner({ 
  className, 
  size = "md", 
  color = "amber" 
}: LoadingSpinnerProps) {
  const sizeClasses = {
    xs: "w-3 h-3 border-2",
    sm: "w-4 h-4 border-2",
    md: "w-8 h-8 border-4",
    lg: "w-12 h-12 border-4",
    xl: "w-16 h-16 border-4",
  };

  const colorClasses = {
    amber: "border-amber-200 border-t-amber-600",
    blue: "border-blue-200 border-t-blue-600",
    gray: "border-gray-200 border-t-gray-600",
    white: "border-white/30 border-t-white",
  };

  return (
    <div
      className={cn(
        "animate-spin rounded-full",
        sizeClasses[size],
        colorClasses[color],
        className
      )}
    />
  );
}

// 頁面 Loading 組件
interface PageLoadingProps {
  message?: string;
  size?: "sm" | "md" | "lg";
  fullScreen?: boolean;
  className?: string;
}

export function PageLoading({ 
  message = "載入中...", 
  size = "lg",
  fullScreen = false,
  className 
}: PageLoadingProps) {
  const containerClass = fullScreen 
    ? "fixed inset-0 bg-white/80 backdrop-blur-sm z-50" 
    : "w-full py-12";

  return (
    <div className={cn(
      "flex flex-col items-center justify-center space-y-4",
      containerClass,
      className
    )}>
      <LoadingSpinner size={size} />
      {message && (
        <div className="text-amber-600 font-medium animate-pulse">
          {message}
        </div>
      )}
    </div>
  );
}

// Button Loading 組件
interface ButtonLoadingProps {
  loading?: boolean;
  children: ReactNode;
  loadingText?: string;
  className?: string;
  disabled?: boolean;
  onClick?: () => void;
  type?: "button" | "submit" | "reset";
  variant?: "default" | "outline" | "ghost";
  size?: "sm" | "md" | "lg";
}

export function ButtonLoading({
  loading = false,
  children,
  loadingText,
  className,
  disabled,
  onClick,
  type = "button",
  variant = "default",
  size = "md",
  ...props
}: ButtonLoadingProps) {
  const baseClasses = "inline-flex items-center justify-center gap-2 rounded-lg font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed";
  
  const variantClasses = {
    default: "bg-amber-600 hover:bg-amber-700 text-white focus:ring-amber-500",
    outline: "border-2 border-amber-600 text-amber-600 hover:bg-amber-50 focus:ring-amber-500",
    ghost: "text-amber-600 hover:bg-amber-50 focus:ring-amber-500",
  };

  const sizeClasses = {
    sm: "px-3 py-1.5 text-sm",
    md: "px-4 py-2 text-base",
    lg: "px-6 py-3 text-lg",
  };

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled || loading}
      className={cn(
        baseClasses,
        variantClasses[variant],
        sizeClasses[size],
        className
      )}
      {...props}
    >
      {loading && (
        <LoadingSpinner 
          size="xs" 
          color={variant === "default" ? "white" : "amber"} 
        />
      )}
      {loading ? (loadingText || "處理中...") : children}
    </button>
  );
}

// 向後兼容的 Loading 組件
interface LoadingProps {
  className?: string;
  size?: "sm" | "md" | "lg";
}

export function Loading({ className, size = "md" }: LoadingProps) {
  return (
    <div className={cn("flex items-center justify-center", className)}>
      <LoadingSpinner size={size} />
    </div>
  );
}
