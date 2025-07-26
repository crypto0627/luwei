import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import OrderStatusBadge from "./OrderStatusBadge"
import OrderActions from "./OrderActions"
import { Order } from "@/types/order"

interface OrderTableProps {
  orders: Order[]
  onAction: (orderId: string, action: "complete" | "cancel" | "paid") => void
}

export default function OrderTable({ orders, onAction }: OrderTableProps) {
  return (
    <div className="rounded-md border overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="whitespace-nowrap">訂單編號</TableHead>
            <TableHead className="whitespace-nowrap">客戶信箱</TableHead>
            <TableHead className="whitespace-nowrap">商品</TableHead>
            <TableHead className="whitespace-nowrap">總金額</TableHead>
            <TableHead className="whitespace-nowrap">狀態</TableHead>
            <TableHead className="whitespace-nowrap">時間</TableHead>
            <TableHead className="whitespace-nowrap">操作</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {orders.map((order) => (
            <TableRow key={order.id}>
              <TableCell className="font-medium whitespace-nowrap">{order.id}</TableCell>
              <TableCell className="whitespace-nowrap">{order.user.email}</TableCell>
              <TableCell>
                <div className="space-y-1 min-w-[200px]">
                  {order.items.map((item) => (
                    <div key={item.id} className="text-sm">
                      {item.meal.name} x{item.quantity}
                    </div>
                  ))}
                </div>
              </TableCell>
              <TableCell className="font-medium whitespace-nowrap">NT$ {order.totalAmount}</TableCell>
              <TableCell className="whitespace-nowrap">
                <OrderStatusBadge status={order.status} />
              </TableCell>
              <TableCell className="text-sm text-gray-600 whitespace-nowrap">
                {new Date(order.createdAt).toLocaleString()}
              </TableCell>
              <TableCell className="whitespace-nowrap">
                <OrderActions orderId={order.id} onAction={onAction} />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
} 