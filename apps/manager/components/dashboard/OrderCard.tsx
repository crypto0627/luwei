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
    <Card className="bg-gradient-to-br from-yellow-100 via-orange-50 to-yellow-200 shadow-lg rounded-2xl border-0">
      <CardContent className="p-5 space-y-5">
        <div className="flex justify-between items-start">
          <div className="space-y-1">
            <p className="text-xs font-semibold text-yellow-700 tracking-wide">訂單編號</p>
            <p className="text-base font-bold bg-gradient-to-r from-yellow-400 to-orange-400 bg-clip-text text-transparent select-all">
              {order.id}
            </p>
          </div>
          <div
            className="ml-4"
            style={{
              minWidth: 90,
              display: "flex",
              justifyContent: "flex-end",
            }}
          >
            <OrderStatusBadge status={order.status} />
          </div>
        </div>
        
        <div className="space-y-1">
          <p className="text-xs font-semibold text-yellow-700 tracking-wide">客戶信箱</p>
          <p className="text-sm font-medium text-gray-700 select-all">{order.user.email}</p>
        </div>

        <div className="space-y-1">
          <p className="text-xs font-semibold text-yellow-700 tracking-wide">客戶電話</p>
          <p className="text-sm font-medium text-gray-700 select-all">{order.user.phone}</p>
        </div>

        <div className="space-y-1">
          <p className="text-xs font-semibold text-yellow-700 tracking-wide">商品</p>
          <div className="space-y-1">
            {order.items.map((item) => (
              <div
                key={item.id}
                className="flex items-center gap-2 text-sm font-medium"
              >
                <span className="inline-block px-2 py-0.5 rounded bg-gradient-to-r from-yellow-200 to-orange-100 text-yellow-900 shadow-sm">
                  {item.meal.name}
                </span>
                <span className="text-xs text-orange-500 font-bold">x{item.quantity}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="flex justify-between items-center">
          <div className="space-y-1">
            <p className="text-xs font-semibold text-yellow-700 tracking-wide">總金額</p>
            <p className="text-lg font-extrabold bg-gradient-to-r from-yellow-400 to-orange-400 bg-clip-text text-transparent">
              NT$ {order.totalAmount.toLocaleString()}
            </p>
          </div>
          <div className="space-y-1 text-right">
            <p className="text-xs font-semibold text-yellow-700 tracking-wide">時間</p>
            <p className="text-xs text-gray-500">
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