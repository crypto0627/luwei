"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useOrderStore } from "@/stores/useOrderStore"
import Swal from "sweetalert2"
import Loading from "@/components/loading"
import StatsCards from "@/components/dashboard/StatsCards"
import OrderCard from "@/components/dashboard/OrderCard"
import OrderTable from "@/components/dashboard/OrderTable"
import { useIsMobile } from "@/hooks/use-mobile"

export default function DashboardPage() {
  const isMobile = useIsMobile()
  const [activeTab, setActiveTab] = useState("all")
  const { orders, isLoading, error, fetchOrders, deleteOrder, completeOrder } = useOrderStore()

  useEffect(() => {
    fetchOrders()
  }, [fetchOrders])

  const handleOrderAction = async (orderId: string, action: "complete" | "cancel" | "paid") => {
    const result = await Swal.fire({
      title: action === "complete" ? "完成訂單" : action === "paid" ? "標記已付款" : "取消訂單",
      text: `確定要${action === "complete" ? "完成" : action === "paid" ? "標記為已付款" : "取消"}這個訂單嗎？`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "確定",
      cancelButtonText: "取消",
      confirmButtonColor: action === "complete" ? "#22c55e" : action === "paid" ? "#3b82f6" : "#ef4444",
      cancelButtonColor: "#6b7280",
    })

    if (result.isConfirmed) {
      try {
        if (action === "complete") {
          await completeOrder(orderId)
        } else if (action === "paid") {
          await completeOrder(orderId, "paid")
        } else {
          await deleteOrder(orderId)
        }
        
        await Swal.fire({
          title: "成功",
          text: `訂單已${action === "complete" ? "完成" : action === "paid" ? "標記為已付款" : "取消"}`,
          icon: "success",
          confirmButtonColor: action === "complete" ? "#22c55e" : action === "paid" ? "#3b82f6" : "#ef4444",
        })
      } catch (error) {
        await Swal.fire({
          title: "錯誤",
          text: "操作失敗，請稍後再試",
          icon: "error",
          confirmButtonColor: "#ef4444",
        })
      }
    }
  }

  const filteredOrders = orders.filter((order) => {
    if (activeTab === "all") return true
    if (activeTab === "completed") return order.status === "completed"
    if (activeTab === "uncompleted") return order.status !== "completed"
    return true
  }).sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())

  const stats = {
    total: orders.length,
    completed: orders.filter((o) => o.status === "completed").length,
    pending: orders.filter((o) => o.status === "pending").length,
    paid: orders.filter((o) => o.status === "paid").length,
    revenue: orders.filter((o) => o.status === "paid").reduce((sum, o) => sum + o.totalAmount, 0),
  }

  if (isLoading) {
    return <Loading />
  }

  if (error) {
    return <div>Error: {error.message}</div>
  }

  return (
    <div className="flex-1 p-4 md:p-8 space-y-8">
      {/* Header */}
      <div className="space-y-2">
        <h1 className="text-2xl md:text-3xl font-bold text-foreground">訂單管理</h1>
        <p className="text-sm md:text-base text-muted-foreground">管理所有訂單狀態與詳細資訊</p>
      </div>

      {/* Stats Cards */}
      <StatsCards stats={stats} />

      {/* Orders List */}
      <Card className="border-0 shadow-none bg-background/50">
        <CardContent className="p-4">
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-3 p-1 rounded-xl">
              <TabsTrigger value="all" className="text-sm md:text-base">全部訂單</TabsTrigger>
              <TabsTrigger value="completed" className="text-sm md:text-base">已完成</TabsTrigger>
              <TabsTrigger value="uncompleted" className="text-sm md:text-base">未完成</TabsTrigger>
            </TabsList>

            <TabsContent value={activeTab} className="space-y-4 mt-4">
              {isMobile ? (
                <div className="space-y-4">
                  {filteredOrders.map((order) => (
                    <OrderCard key={order.id} order={order} onAction={handleOrderAction} />
                  ))}
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-1 gap-4">
                  {filteredOrders.map((order) => (
                    <OrderCard key={order.id} order={order} onAction={handleOrderAction} />
                  ))}
                </div>
              )}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  )
}
