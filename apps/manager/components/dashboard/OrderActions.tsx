import { Button } from "@/components/ui/button"
import { CheckCircle, XCircle, DollarSign } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import clsx from "clsx"

interface OrderActionsProps {
  orderId: string
  onAction: (orderId: string, action: "complete" | "cancel" | "paid") => void
}

const menuItems = [
  {
    key: "paid",
    label: "標記已付款",
    icon: DollarSign,
    gradient: "from-blue-400 via-blue-500 to-cyan-400",
    text: "text-blue-700",
    hover: "hover:bg-gradient-to-r hover:from-blue-50 hover:to-cyan-50",
    iconBg: "bg-gradient-to-br from-blue-100 to-cyan-100 group-hover:from-blue-200 group-hover:to-cyan-200",
  },
  {
    key: "complete",
    label: "完成訂單",
    icon: CheckCircle,
    gradient: "from-green-400 via-green-500 to-lime-400",
    text: "text-green-700",
    hover: "hover:bg-gradient-to-r hover:from-green-50 hover:to-lime-50",
    iconBg: "bg-gradient-to-br from-green-100 to-lime-100 group-hover:from-green-200 group-hover:to-lime-200",
  },
  {
    key: "cancel",
    label: "取消訂單",
    icon: XCircle,
    gradient: "from-pink-400 via-red-400 to-orange-300",
    text: "text-pink-700",
    hover: "hover:bg-gradient-to-r hover:from-pink-50 hover:to-orange-50",
    iconBg: "bg-gradient-to-br from-pink-100 to-orange-100 group-hover:from-pink-200 group-hover:to-orange-200",
  },
] as const

export default function OrderActions({ orderId, onAction }: OrderActionsProps) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className={clsx(
            "w-full flex items-center gap-2 font-semibold border-0 shadow-md transition",
            "bg-gradient-to-r from-yellow-300 via-orange-200 to-yellow-400",
            "text-gray-800 tracking-wide text-base rounded-xl py-2"
          )}
        >
          <span className="inline-block bg-gradient-to-r from-yellow-400 to-orange-400 text-white rounded-full px-3 py-1 text-xs font-bold shadow-sm mr-2 tracking-wider">
            管理
          </span>
          <span className="drop-shadow-sm">操作訂單</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="center"
        className={clsx(
          "w-52 rounded-2xl shadow-2xl border-0 p-2 bg-white/90 backdrop-blur-md",
          "ring-1 ring-yellow-100"
        )}
        style={{ minWidth: 200 }}
      >
        {menuItems.map(({ key, label, icon: Icon, gradient, text, hover, iconBg }) => (
          <DropdownMenuItem
            key={key}
            onClick={() => onAction(orderId, key)}
            className={clsx(
              "flex items-center gap-3 px-4 py-3 rounded-xl font-semibold transition-all cursor-pointer group",
              text,
              hover,
              "text-base tracking-wide",
              "focus:bg-gradient-to-r focus:from-yellow-100 focus:to-orange-100"
            )}
            style={{
              fontFamily: "'Noto Sans TC', 'Microsoft JhengHei', Arial, sans-serif",
              letterSpacing: "0.02em",
            }}
          >
            <span
              className={clsx(
                "rounded-full p-2 shadow-sm transition-transform duration-200",
                iconBg
              )}
            >
              <Icon className="h-5 w-5" />
            </span>
            <span
              className={clsx(
                "font-bold",
                "bg-clip-text text-transparent",
                `bg-gradient-to-r ${gradient}`
              )}
              style={{
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
            >
              {label}
            </span>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}