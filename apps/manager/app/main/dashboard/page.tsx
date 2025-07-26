"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useOrderStore } from "@/stores/useOrderStore"
import Swal from "sweetalert2"
import Loading from "@/components/loading"
import StatsCards from "@/components/dashboard/StatsCards"
import OrderCard from "@/components/dashboard/OrderCard"
import OrderTable from "@/components/dashboard/OrderTable"
import { Order } from "@/types/order"

export default function DashboardPage() {
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
  })

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
    <div className="space-y-6 p-4 md:p-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl md:text-3xl font-bold text-white mb-2">訂單管理</h1>
        <p className="text-sm md:text-base text-orange-100">管理所有訂單狀態與詳細資訊</p>
      </div>

      {/* Stats Cards */}
      <StatsCards stats={stats} />

      {/* Orders List */}
      <Card className="bg-white/95 backdrop-blur-sm border-0 shadow-lg">
        <CardHeader className="p-4 md:p-6">
          <CardTitle className="text-lg md:text-xl">訂單列表</CardTitle>
          <CardDescription className="text-sm md:text-base">查看和管理所有訂單</CardDescription>
        </CardHeader>
        <CardContent className="p-4 md:p-6">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
            <TabsList className="grid w-full grid-cols-3 p-1">
              <TabsTrigger value="all" className="text-sm md:text-base">全部訂單</TabsTrigger>
              <TabsTrigger value="completed" className="text-sm md:text-base">已完成</TabsTrigger>
              <TabsTrigger value="uncompleted" className="text-sm md:text-base">未完成</TabsTrigger>
            </TabsList>

            <TabsContent value={activeTab} className="space-y-4">
              {/* Mobile View */}
              <div className="lg:hidden space-y-4">
                {filteredOrders.map((order) => (
                  <OrderCard key={order.id} order={order} onAction={handleOrderAction} />
                ))}
              </div>

              {/* Tablet View */}
              <div className="hidden lg:block 2xl:hidden">
                <div className="grid grid-cols-2 gap-4">
                  {filteredOrders.map((order) => (
                    <OrderCard key={order.id} order={order} onAction={handleOrderAction} />
                  ))}
                </div>
              </div>

              {/* Desktop View */}
              <div className="hidden 2xl:block">
                <OrderTable orders={filteredOrders} onAction={handleOrderAction} />
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  )
}
