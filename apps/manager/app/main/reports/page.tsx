"use client"

import { useEffect, useMemo } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  AreaChart,
  Area,
} from "recharts"
import { TrendingUp, DollarSign, ShoppingCart, Users, XCircle } from "lucide-react"
import { useOrderStore } from "@/stores/useOrderStore"

export default function ReportsPage() {
  const { orders, isLoading, error, fetchOrders } = useOrderStore()

  useEffect(() => {
    fetchOrders()
  }, [fetchOrders])

  // 計算每日營收和訂單數
  const dailyRevenue = useMemo(() => {
    const dailyData = new Map()
    
    orders.forEach(order => {
      // 排除已取消的訂單
      if (order.status === "cancelled") return

      const date = new Date(order.createdAt).toLocaleDateString('zh-TW', {
        month: 'numeric',
        day: 'numeric'
      })
      
      if (!dailyData.has(date)) {
        dailyData.set(date, { date, revenue: 0, orders: 0 })
      }
      
      const dayData = dailyData.get(date)
      dayData.revenue += order.totalAmount
      dayData.orders += 1
    })

    return Array.from(dailyData.values()).sort((a, b) => {
      const [aMonth, aDay] = a.date.split('/')
      const [bMonth, bDay] = b.date.split('/')
      return (Number(aMonth) * 31 + Number(aDay)) - (Number(bMonth) * 31 + Number(bDay))
    })
  }, [orders])

  // 計算商品銷售排行
  const productSales = useMemo(() => {
    const productData = new Map()
    
    orders.forEach(order => {
      order.items.forEach(item => {
        const mealName = item.meal.name
        if (!productData.has(mealName)) {
          productData.set(mealName, { name: mealName, sales: 0, revenue: 0 })
        }
        
        const product = productData.get(mealName)
        product.sales += item.quantity
        product.revenue += item.price * item.quantity
      })
    })

    return Array.from(productData.values())
      .sort((a, b) => b.sales - a.sales)
      .slice(0, 4) // 只取前4名
  }, [orders])

  // 計算訂單狀態分布
  const orderStatus = useMemo(() => {
    const statusCount = {
      completed: 0,
      pending: 0,
      cancelled: 0,
      paid: 0
    }
    
    orders.forEach(order => {
      statusCount[order.status]++
    })

    return [
      { name: "已完成", value: statusCount.completed, color: "#10B981" },
      { name: "處理中", value: statusCount.pending, color: "#F59E0B" },
      { name: "已付款", value: statusCount.paid, color: "#3B82F6" },
      { name: "已取消", value: statusCount.cancelled, color: "#EF4444" },
    ]
  }, [orders])

  // 計算總營收和訂單數（排除已取消的訂單）
  const totalRevenue = useMemo(() => 
    orders
      .filter(order => order.status !== "cancelled")
      .reduce((sum, order) => sum + order.totalAmount, 0),
    [orders]
  )

  const totalOrders = orders.length
  const cancelledOrders = orders.filter(order => order.status === "cancelled").length
  const activeOrders = totalOrders - cancelledOrders

  const avgOrderValue = activeOrders > 0 ? totalRevenue / activeOrders : 0

  // 計算歷史營收（按月統計）
  const historicalRevenue = useMemo(() => {
    const monthlyData = new Map()
    
    orders.forEach(order => {
      // 排除已取消的訂單
      if (order.status === "cancelled") return

      const date = new Date(order.createdAt)
      const monthKey = date.toLocaleDateString('zh-TW', {
        year: 'numeric',
        month: 'numeric'
      })
      
      if (!monthlyData.has(monthKey)) {
        monthlyData.set(monthKey, { 
          month: monthKey,
          revenue: 0,
          orders: 0
        })
      }
      
      const monthData = monthlyData.get(monthKey)
      monthData.revenue += order.totalAmount
      monthData.orders += 1
    })

    return Array.from(monthlyData.values())
      .sort((a, b) => {
        const [aYear, aMonth] = a.month.split('/')
        const [bYear, bMonth] = b.month.split('/')
        return (Number(aYear) * 12 + Number(aMonth)) - (Number(bYear) * 12 + Number(bMonth))
      })
  }, [orders])

  if (isLoading) {
    return <div className="flex items-center justify-center h-screen">Loading...</div>
  }

  if (error) {
    return <div className="flex items-center justify-center h-screen text-red-500">Error: {error.message}</div>
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-500 to-orange-600 p-4 md:p-6 lg:p-8">
      <div className="max-w-[1400px] mx-auto space-y-6">
        {/* Header */}
        <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 md:p-6">
          <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold text-white mb-2">營收報表</h1>
          <p className="text-sm md:text-base lg:text-lg text-orange-100">查看營收趨勢與銷售分析</p>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
          <Card className="bg-white/95 backdrop-blur-sm border-0 shadow-lg hover:shadow-xl transition-shadow duration-300">
            <CardContent className="p-4 md:p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm md:text-base font-medium text-gray-600">總營收</p>
                  <p className="text-xl md:text-2xl lg:text-3xl font-bold text-gray-900 mt-1">NT$ {totalRevenue.toLocaleString()}</p>
                </div>
                <div className="w-10 h-10 md:w-12 md:h-12 bg-green-100 rounded-lg flex items-center justify-center">
                  <DollarSign className="h-5 w-5 md:h-6 md:w-6 text-green-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white/95 backdrop-blur-sm border-0 shadow-lg hover:shadow-xl transition-shadow duration-300">
            <CardContent className="p-4 md:p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm md:text-base font-medium text-gray-600">總訂單數</p>
                  <p className="text-xl md:text-2xl lg:text-3xl font-bold text-gray-900 mt-1">{activeOrders}</p>
                </div>
                <div className="w-10 h-10 md:w-12 md:h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                  <ShoppingCart className="h-5 w-5 md:h-6 md:w-6 text-blue-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white/95 backdrop-blur-sm border-0 shadow-lg hover:shadow-xl transition-shadow duration-300">
            <CardContent className="p-4 md:p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm md:text-base font-medium text-gray-600">平均客單價</p>
                  <p className="text-xl md:text-2xl lg:text-3xl font-bold text-gray-900 mt-1">NT$ {Math.round(avgOrderValue)}</p>
                </div>
                <div className="w-10 h-10 md:w-12 md:h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                  <Users className="h-5 w-5 md:h-6 md:w-6 text-orange-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white/95 backdrop-blur-sm border-0 shadow-lg hover:shadow-xl transition-shadow duration-300">
            <CardContent className="p-4 md:p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm md:text-base font-medium text-gray-600">已取消訂單</p>
                  <p className="text-xl md:text-2xl lg:text-3xl font-bold text-red-600 mt-1">{cancelledOrders}</p>
                </div>
                <div className="w-10 h-10 md:w-12 md:h-12 bg-red-100 rounded-lg flex items-center justify-center">
                  <XCircle className="h-5 w-5 md:h-6 md:w-6 text-red-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Daily Revenue Chart */}
          <Card className="bg-white/95 backdrop-blur-sm border-0 shadow-lg hover:shadow-xl transition-shadow duration-300">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg md:text-xl">每日營收趨勢</CardTitle>
              <CardDescription className="text-sm md:text-base">過去7天的營收與訂單數量</CardDescription>
            </CardHeader>
            <CardContent className="w-full h-[400px] md:h-[500px]">
              <div className="w-full h-full">
                <ChartContainer
                  config={{
                    revenue: {
                      label: "營收",
                      color: "hsl(var(--chart-1))",
                    },
                    orders: {
                      label: "訂單數",
                      color: "hsl(var(--chart-2))",
                    },
                  }}
                  className="w-full h-full"
                >
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={dailyRevenue} margin={{ top: 10, right: 30, left: 0, bottom: 30 }}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis 
                        dataKey="date" 
                        label={{ value: '日期', position: 'insideBottom', offset: -5 }}
                        tick={{ fontSize: 12 }}
                      />
                      <YAxis 
                        yAxisId="left"
                        label={{ value: '營收 (NT$)', angle: -90, position: 'insideLeft' }}
                        tick={{ fontSize: 12 }}
                      />
                      <YAxis 
                        yAxisId="right" 
                        orientation="right"
                        label={{ value: '訂單數', angle: 90, position: 'insideRight' }}
                        tick={{ fontSize: 12 }}
                      />
                      <ChartTooltip content={<ChartTooltipContent />} />
                      <Area
                        yAxisId="left"
                        type="monotone"
                        dataKey="revenue"
                        stroke="var(--color-revenue)"
                        fill="var(--color-revenue)"
                        fillOpacity={0.3}
                        strokeWidth={2}
                      />
                      <Area
                        yAxisId="right"
                        type="monotone"
                        dataKey="orders"
                        stroke="var(--color-orders)"
                        fill="var(--color-orders)"
                        fillOpacity={0.3}
                        strokeWidth={2}
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </ChartContainer>
              </div>
            </CardContent>
          </Card>

          {/* Product Sales Chart */}
          <Card className="bg-white/95 backdrop-blur-sm border-0 shadow-lg hover:shadow-xl transition-shadow duration-300">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg md:text-xl">商品銷售排行</CardTitle>
              <CardDescription className="text-sm md:text-base">各商品的銷售數量</CardDescription>
            </CardHeader>
            <CardContent className="w-full h-[400px] md:h-[500px]">
              <div className="w-full h-full">
                <ChartContainer
                  config={{
                    sales: {
                      label: "銷售數量",
                      color: "hsl(var(--chart-3))",
                    },
                  }}
                  className="w-full h-full"
                >
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={productSales} margin={{ top: 10, right: 30, left: 0, bottom: 80 }}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis 
                        dataKey="name" 
                        angle={-45} 
                        textAnchor="end" 
                        height={80}
                        tick={{ fontSize: 12 }}
                      />
                      <YAxis tick={{ fontSize: 12 }} />
                      <ChartTooltip content={<ChartTooltipContent />} />
                      <Bar dataKey="sales" fill="var(--color-sales)" />
                    </BarChart>
                  </ResponsiveContainer>
                </ChartContainer>
              </div>
            </CardContent>
          </Card>

          {/* Order Status Pie Chart */}
          <Card className="bg-white/95 backdrop-blur-sm border-0 shadow-lg hover:shadow-xl transition-shadow duration-300">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg md:text-xl">訂單狀態分布</CardTitle>
              <CardDescription className="text-sm md:text-base">各狀態訂單的比例</CardDescription>
            </CardHeader>
            <CardContent className="w-full h-[400px] md:h-[500px]">
              <div className="w-full h-full">
                <ChartContainer
                  config={{
                    completed: {
                      label: "已完成",
                      color: "#10B981",
                    },
                    pending: {
                      label: "處理中",
                      color: "#F59E0B",
                    },
                    paid: {
                      label: "已付款",
                      color: "#3B82F6",
                    },
                    cancelled: {
                      label: "已取消",
                      color: "#EF4444",
                    },
                  }}
                  className="w-full h-full"
                >
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={orderStatus}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                        outerRadius={120}
                        fill="#8884d8"
                        dataKey="value"
                      >
                        {orderStatus.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <ChartTooltip content={<ChartTooltipContent />} />
                    </PieChart>
                  </ResponsiveContainer>
                </ChartContainer>
              </div>
            </CardContent>
          </Card>

          {/* Historical Revenue Chart */}
          <Card className="bg-white/95 backdrop-blur-sm border-0 shadow-lg hover:shadow-xl transition-shadow duration-300">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg md:text-xl">歷史營收趨勢</CardTitle>
              <CardDescription className="text-sm md:text-base">各月份的營收表現</CardDescription>
            </CardHeader>
            <CardContent className="w-full h-[400px] md:h-[500px]">
              <div className="w-full h-full">
                <ChartContainer
                  config={{
                    revenue: {
                      label: "營收",
                      color: "hsl(var(--chart-4))",
                    },
                    orders: {
                      label: "訂單數",
                      color: "hsl(var(--chart-2))",
                    },
                  }}
                  className="w-full h-full"
                >
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={historicalRevenue} margin={{ top: 10, right: 30, left: 0, bottom: 30 }}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis 
                        dataKey="month" 
                        label={{ value: '月份', position: 'insideBottom', offset: -5 }}
                        tick={{ fontSize: 12 }}
                      />
                      <YAxis 
                        yAxisId="left"
                        label={{ value: '營收 (NT$)', angle: -90, position: 'insideLeft' }}
                        tick={{ fontSize: 12 }}
                      />
                      <YAxis 
                        yAxisId="right" 
                        orientation="right"
                        label={{ value: '訂單數', angle: 90, position: 'insideRight' }}
                        tick={{ fontSize: 12 }}
                      />
                      <ChartTooltip content={<ChartTooltipContent />} />
                      <Area
                        yAxisId="left"
                        type="monotone"
                        dataKey="revenue"
                        stroke="var(--color-revenue)"
                        fill="var(--color-revenue)"
                        fillOpacity={0.3}
                        strokeWidth={2}
                      />
                      <Area
                        yAxisId="right"
                        type="monotone"
                        dataKey="orders"
                        stroke="var(--color-orders)"
                        fill="var(--color-orders)"
                        fillOpacity={0.3}
                        strokeWidth={2}
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </ChartContainer>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
