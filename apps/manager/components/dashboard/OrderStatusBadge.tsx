import { Badge } from "@/components/ui/badge"
import { CheckCircle, Clock, XCircle, DollarSign } from "lucide-react"

const statusConfig = {
  completed: { label: "已完成", color: "bg-green-100 text-green-800", icon: CheckCircle },
  pending: { label: "處理中", color: "bg-yellow-100 text-yellow-800", icon: Clock },
  paid: { label: "已付款", color: "bg-blue-100 text-blue-800", icon: DollarSign },
  cancelled: { label: "已取消", color: "bg-red-100 text-red-800", icon: XCircle },
}

interface OrderStatusBadgeProps {
  status: "completed" | "pending" | "paid" | "cancelled"
}

export default function OrderStatusBadge({ status }: OrderStatusBadgeProps) {
  const config = statusConfig[status]
  const StatusIcon = config.icon

  return (
    <Badge className={`${config.color} w-20 flex items-center justify-center`}>
      <StatusIcon className="h-3 w-3 mr-1" />
      {config.label}
    </Badge>
  )
} 