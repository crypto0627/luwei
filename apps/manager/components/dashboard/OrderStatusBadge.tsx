import { Badge } from "@/components/ui/badge"
import { CheckCircle, Clock, XCircle, DollarSign } from "lucide-react"
import clsx from "clsx"

const statusConfig = {
  completed: {
    label: "已完成",
    bg: "bg-gradient-to-r from-green-200 via-green-100 to-lime-100",
    text: "text-green-800",
    ring: "ring-2 ring-green-300",
    icon: CheckCircle,
    iconBg: "bg-gradient-to-br from-green-400 to-lime-300 text-white",
  },
  pending: {
    label: "處理中",
    bg: "bg-gradient-to-r from-yellow-200 via-yellow-100 to-orange-100",
    text: "text-yellow-900",
    ring: "ring-2 ring-yellow-200",
    icon: Clock,
    iconBg: "bg-gradient-to-br from-yellow-400 to-orange-300 text-white",
  },
  paid: {
    label: "已付款",
    bg: "bg-gradient-to-r from-blue-200 via-blue-100 to-cyan-100",
    text: "text-blue-800",
    ring: "ring-2 ring-blue-200",
    icon: DollarSign,
    iconBg: "bg-gradient-to-br from-blue-400 to-cyan-300 text-white",
  },
  cancelled: {
    label: "已取消",
    bg: "bg-gradient-to-r from-red-200 via-pink-100 to-orange-100",
    text: "text-red-800",
    ring: "ring-2 ring-red-200",
    icon: XCircle,
    iconBg: "bg-gradient-to-br from-red-400 to-orange-300 text-white",
  },
}

interface OrderStatusBadgeProps {
  status: "completed" | "pending" | "paid" | "cancelled"
}

export default function OrderStatusBadge({ status }: OrderStatusBadgeProps) {
  const config = statusConfig[status]
  const StatusIcon = config.icon

  return (
    <Badge
      className={clsx(
        "w-24 px-2 py-1 flex items-center justify-center gap-1.5 rounded-xl font-bold text-sm shadow-md",
        config.bg,
        config.text,
        config.ring,
        "transition-all duration-200"
      )}
      style={{
        letterSpacing: "0.05em",
        minWidth: 90,
      }}
    >
      <span>{config.label}</span>
    </Badge>
  )
}