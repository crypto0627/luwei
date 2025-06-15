"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Clock, CheckCircle, XCircle, DollarSign, MoreVertical } from "lucide-react"
import { useOrderStore } from "@/stores/useOrderStore"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import Swal from "sweetalert2"

const statusConfig = {
  completed: { label: "已完成", color: "bg-green-100 text-green-800", icon: CheckCircle },
  pending: { label: "處理中", color: "bg-yellow-100 text-yellow-800", icon: Clock },
  paid: { label: "已付款", color: "bg-blue-100 text-blue-800", icon: DollarSign },
  cancelled: { label: "已取消", color: "bg-red-100 text-red-800", icon: XCircle },
}

interface Meal {
  id: string
  name: string
  description: string
  price: number
  image: string
  isAvailable: boolean
}

interface OrderItem {
  id: string
  mealId: string
  quantity: number
  price: number
  meal: Meal
}

interface User {
  id: string
  email: string
  name: string
  provider: string
  emailVerified: boolean
}

interface Order {
  id: string
  userId: string
  status: "completed" | "pending" | "paid" | "cancelled"
  totalAmount: number
  createdAt: string
  updatedAt: string
  items: OrderItem[]
  user: User
}

export default function DashboardPage() {
  const [activeTab, setActiveTab] = useState("all")
  const { orders, isLoading, error, fetchOrders, deleteOrder, completeOrder } = useOrderStore()

  useEffect(() => {
    fetchOrders()
  }, [fetchOrders])

  const handleOrderAction = async (orderId: string, action: "complete" | "cancel") => {
    const result = await Swal.fire({
      title: action === "complete" ? "完成訂單" : "取消訂單",
      text: `確定要${action === "complete" ? "完成" : "取消"}這個訂單嗎？`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "確定",
      cancelButtonText: "取消",
      confirmButtonColor: action === "complete" ? "#22c55e" : "#ef4444",
      cancelButtonColor: "#6b7280",
    })

    if (result.isConfirmed) {
      try {
        if (action === "complete") {
          await completeOrder(orderId)
        } else {
          await deleteOrder(orderId)
        }
        
        await Swal.fire({
          title: "成功",
          text: `訂單已${action === "complete" ? "完成" : "取消"}`,
          icon: "success",
          confirmButtonColor: "#22c55e",
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
    revenue: orders.filter((o) => o.status === "completed").reduce((sum, o) => sum + o.totalAmount, 0),
  }

  if (isLoading) {
    return <div>Loading...</div>
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
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="bg-white/95 backdrop-blur-sm border-0 shadow-lg">
          <CardContent className="p-4 md:p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">總訂單數</p>
                <p className="text-xl md:text-2xl font-bold text-gray-900">{stats.total}</p>
              </div>
              <div className="w-10 h-10 md:w-12 md:h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <DollarSign className="h-5 w-5 md:h-6 md:w-6 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white/95 backdrop-blur-sm border-0 shadow-lg">
          <CardContent className="p-4 md:p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">已完成</p>
                <p className="text-xl md:text-2xl font-bold text-green-600">{stats.completed}</p>
              </div>
              <div className="w-10 h-10 md:w-12 md:h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <CheckCircle className="h-5 w-5 md:h-6 md:w-6 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white/95 backdrop-blur-sm border-0 shadow-lg">
          <CardContent className="p-4 md:p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">處理中</p>
                <p className="text-xl md:text-2xl font-bold text-yellow-600">{stats.pending}</p>
              </div>
              <div className="w-10 h-10 md:w-12 md:h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
                <Clock className="h-5 w-5 md:h-6 md:w-6 text-yellow-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white/95 backdrop-blur-sm border-0 shadow-lg">
          <CardContent className="p-4 md:p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">總營收</p>
                <p className="text-xl md:text-2xl font-bold text-orange-600">NT$ {stats.revenue}</p>
              </div>
              <div className="w-10 h-10 md:w-12 md:h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                <DollarSign className="h-5 w-5 md:h-6 md:w-6 text-orange-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

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
                {filteredOrders.map((order) => {
                  const StatusIcon = statusConfig[order.status].icon
                  return (
                    <Card key={order.id} className="bg-white">
                      <CardContent className="p-4 space-y-3">
                        <div className="flex justify-between items-start">
                          <div className="space-y-1">
                            <p className="text-sm font-medium text-gray-500">訂單編號</p>
                            <p className="text-sm">{order.id}</p>
                          </div>
                          <Badge className={`${statusConfig[order.status].color} w-20 flex items-center justify-center`}>
                            <StatusIcon className="h-3 w-3 mr-1" />
                            {statusConfig[order.status].label}
                          </Badge>
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
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="outline" size="sm" className="w-full">
                                操作訂單
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="center" className="w-40">
                              <DropdownMenuItem
                                onClick={() => handleOrderAction(order.id, "complete")}
                                className="text-green-600"
                              >
                                <CheckCircle className="mr-2 h-4 w-4" />
                                完成訂單
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                onClick={() => handleOrderAction(order.id, "cancel")}
                                className="text-red-600"
                              >
                                <XCircle className="mr-2 h-4 w-4" />
                                取消訂單
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                      </CardContent>
                    </Card>
                  )
                })}
              </div>

              {/* Tablet View */}
              <div className="hidden lg:block 2xl:hidden">
                <div className="grid grid-cols-2 gap-4">
                  {filteredOrders.map((order) => {
                    const StatusIcon = statusConfig[order.status].icon
                    return (
                      <Card key={order.id} className="bg-white">
                        <CardContent className="p-4 space-y-3">
                          <div className="flex justify-between items-start">
                            <div className="space-y-1">
                              <p className="text-sm font-medium text-gray-500">訂單編號</p>
                              <p className="text-sm">{order.id}</p>
                            </div>
                            <Badge className={`${statusConfig[order.status].color} w-20 flex items-center justify-center`}>
                              <StatusIcon className="h-3 w-3 mr-1" />
                              {statusConfig[order.status].label}
                            </Badge>
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
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="outline" size="sm" className="w-full">
                                  操作訂單
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="center" className="w-40">
                                <DropdownMenuItem
                                  onClick={() => handleOrderAction(order.id, "complete")}
                                  className="text-green-600"
                                >
                                  <CheckCircle className="mr-2 h-4 w-4" />
                                  完成訂單
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                  onClick={() => handleOrderAction(order.id, "cancel")}
                                  className="text-red-600"
                                >
                                  <XCircle className="mr-2 h-4 w-4" />
                                  取消訂單
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </div>
                        </CardContent>
                      </Card>
                    )
                  })}
                </div>
              </div>

              {/* Desktop View */}
              <div className="hidden 2xl:block">
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
                      {filteredOrders.map((order) => {
                        const StatusIcon = statusConfig[order.status].icon
                        return (
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
                              <Badge className={`${statusConfig[order.status].color} w-20 flex items-center justify-center`}>
                                <StatusIcon className="h-3 w-3 mr-1" />
                                {statusConfig[order.status].label}
                              </Badge>
                            </TableCell>
                            <TableCell className="text-sm text-gray-600 whitespace-nowrap">
                              {new Date(order.createdAt).toLocaleString()}
                            </TableCell>
                            <TableCell className="whitespace-nowrap">
                              <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                  <Button variant="outline" size="sm">
                                    操作訂單
                                  </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="center" className="w-40">
                                  <DropdownMenuItem
                                    onClick={() => handleOrderAction(order.id, "complete")}
                                    className="text-green-600"
                                  >
                                    <CheckCircle className="mr-2 h-4 w-4" />
                                    完成訂單
                                  </DropdownMenuItem>
                                  <DropdownMenuItem
                                    onClick={() => handleOrderAction(order.id, "cancel")}
                                    className="text-red-600"
                                  >
                                    <XCircle className="mr-2 h-4 w-4" />
                                    取消訂單
                                  </DropdownMenuItem>
                                </DropdownMenuContent>
                              </DropdownMenu>
                            </TableCell>
                          </TableRow>
                        )
                      })}
                    </TableBody>
                  </Table>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  )
}
