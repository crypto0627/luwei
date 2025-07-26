import { Card, CardContent } from "@/components/ui/card"
import OrderStatusBadge from "./OrderStatusBadge"
import OrderActions from "./OrderActions"
import { Order } from "@/types/order"

interface OrderCardProps {
  order: Order
  onAction: (orderId: string, action: "complete" | "cancel" | "paid") => void
}

export default function OrderCard({ order, onAction }: OrderCardProps) {
  return (
    <Card className="bg-white">
      <CardContent className="p-4 space-y-3">
        <div className="flex justify-between items-start">
          <div className="space-y-1">
            <p className="text-sm font-medium text-gray-500">訂單編號</p>
            <p className="text-sm">{order.id}</p>
          </div>
          <OrderStatusBadge status={order.status} />
        </div>
        
        <div className="space-y-1">
          <p className="text-sm font-medium text-gray-500">客戶信箱</p>
          <p className="text-sm">{order.user.email}</p>
        </div>

        <div className="space-y-1">
          <p className="text-sm font-medium text-gray-500">商品</p>
          <div className="space-y-1">
            {order.items.map((item) => (
              <div key={item.id} className="text-sm">
                {item.meal.name} x{item.quantity}
              </div>
            ))}
          </div>
        </div>

        <div className="flex justify-between items-center">
          <div className="space-y-1">
            <p className="text-sm font-medium text-gray-500">總金額</p>
            <p className="text-sm font-medium">NT$ {order.totalAmount}</p>
          </div>
          <div className="space-y-1">
            <p className="text-sm font-medium text-gray-500">時間</p>
            <p className="text-sm text-gray-600">
              {new Date(order.createdAt).toLocaleString()}
            </p>
          </div>
        </div>

        <div className="pt-2">
          <OrderActions orderId={order.id} onAction={onAction} />
        </div>
      </CardContent>
    </Card>
  )
} 