import { Button } from "@/components/ui/button"
import { CheckCircle, XCircle, DollarSign } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

interface OrderActionsProps {
  orderId: string
  onAction: (orderId: string, action: "complete" | "cancel" | "paid") => void
}

export default function OrderActions({ orderId, onAction }: OrderActionsProps) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm" className="w-full">
          操作訂單
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="center" className="w-40">
        <DropdownMenuItem
          onClick={() => onAction(orderId, "paid")}
          className="text-blue-600"
        >
          <DollarSign className="mr-2 h-4 w-4" />
          標記已付款
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => onAction(orderId, "complete")}
          className="text-green-600"
        >
          <CheckCircle className="mr-2 h-4 w-4" />
          完成訂單
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => onAction(orderId, "cancel")}
          className="text-red-600"
        >
          <XCircle className="mr-2 h-4 w-4" />
          取消訂單
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
} 