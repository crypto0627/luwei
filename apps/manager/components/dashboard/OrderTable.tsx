import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import OrderStatusBadge from "./OrderStatusBadge"
import OrderActions from "./OrderActions"
import { Order } from "@/types/order"
import clsx from "clsx"

interface OrderTableProps {
  orders: Order[]
  onAction: (orderId: string, action: "complete" | "cancel" | "paid") => void
}

export default function OrderTable({ orders, onAction }: OrderTableProps) {
  return (
    <div className="rounded-2xl border-0 shadow-xl overflow-x-auto bg-gradient-to-br from-yellow-50 via-orange-50 to-yellow-100 p-2">
      <Table className="min-w-[900px]">
        <TableHeader>
          <TableRow className="bg-gradient-to-r from-yellow-200 via-orange-100 to-yellow-100">
            <TableHead className="whitespace-nowrap text-yellow-800 font-bold text-base px-4 py-3 rounded-tl-2xl">訂單編號</TableHead>
            <TableHead className="whitespace-nowrap text-yellow-800 font-bold text-base px-4 py-3">客戶信箱</TableHead>
            <TableHead className="whitespace-nowrap text-yellow-800 font-bold text-base px-4 py-3">商品</TableHead>
            <TableHead className="whitespace-nowrap text-yellow-800 font-bold text-base px-4 py-3">總金額</TableHead>
            <TableHead className="whitespace-nowrap text-yellow-800 font-bold text-base px-4 py-3">狀態</TableHead>
            <TableHead className="whitespace-nowrap text-yellow-800 font-bold text-base px-4 py-3">時間</TableHead>
            <TableHead className="whitespace-nowrap text-yellow-800 font-bold text-base px-4 py-3 rounded-tr-2xl">操作</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {orders.map((order, idx) => (
            <TableRow
              key={order.id}
              className={clsx(
                "transition-all duration-150",
                idx % 2 === 0
                  ? "bg-white/80 hover:bg-yellow-50"
                  : "bg-yellow-50/80 hover:bg-yellow-100"
              )}
              style={{
                boxShadow: "0 1px 0 0 #fcd34d22",
              }}
            >
              <TableCell className="font-extrabold whitespace-nowrap text-yellow-700 px-4 py-3 select-all">
                <span className="bg-gradient-to-r from-yellow-300 to-orange-200 bg-clip-text text-transparent">{order.id}</span>
              </TableCell>
              <TableCell className="whitespace-nowrap text-gray-700 font-medium px-4 py-3 select-all">
                {order.user.email}
              </TableCell>
              <TableCell className="px-4 py-3">
                <div className="space-y-1 min-w-[200px]">
                  {order.items.map((item) => (
                    <div
                      key={item.id}
                      className="flex items-center gap-2 text-sm"
                    >
                      <span className="inline-block px-2 py-0.5 rounded bg-gradient-to-r from-yellow-200 to-orange-100 text-yellow-900 shadow-sm font-semibold">
                        {item.meal.name}
                      </span>
                      <span className="text-xs text-orange-500 font-bold">x{item.quantity}</span>
                    </div>
                  ))}
                </div>
              </TableCell>
              <TableCell className="font-extrabold whitespace-nowrap text-lg px-4 py-3 bg-gradient-to-r from-yellow-100 to-orange-50 bg-clip-text text-transparent">
                NT$ {order.totalAmount.toLocaleString()}
              </TableCell>
              <TableCell className="whitespace-nowrap px-4 py-3">
                <OrderStatusBadge status={order.status} />
              </TableCell>
              <TableCell className="text-sm text-gray-500 whitespace-nowrap px-4 py-3">
                {new Date(order.createdAt).toLocaleString()}
              </TableCell>
              <TableCell className="whitespace-nowrap px-4 py-3">
                <OrderActions orderId={order.id} onAction={onAction} />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}