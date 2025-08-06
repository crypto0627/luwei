"use client"

import { useEffect, useMemo } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { DollarSign, ShoppingCart, Users, XCircle, Trophy, TrendingUp } from "lucide-react"
import { useOrderStore } from "@/stores/useOrderStore"
import clsx from "clsx"

function formatCurrency(num: number) {
  return "NT$ " + num.toLocaleString()
}

export default function ReportsPage() {
  const { orders, isLoading, error, fetchOrders } = useOrderStore()

  useEffect(() => {
    fetchOrders()
  }, [fetchOrders])

  // 統計數據
  const stats = useMemo(() => {
    let totalRevenue = 0
    let paidOrders = 0
    let cancelledOrders = 0
    let completedOrders = 0
    let pendingOrders = 0
    let productMap = new Map<string, { name: string, sales: number, revenue: number }>()
    let dailyMap = new Map<string, { date: string, revenue: number, orders: number }>()
    let monthlyMap = new Map<string, { month: string, revenue: number, orders: number }>()
    let firstOrderDate: Date | null = null
    let lastOrderDate: Date | null = null

    for (const order of orders) {
      const createdAt = new Date(order.createdAt)
      if (!firstOrderDate || createdAt < firstOrderDate) firstOrderDate = createdAt
      if (!lastOrderDate || createdAt > lastOrderDate) lastOrderDate = createdAt

      if (order.status === "paid") {
        totalRevenue += order.totalAmount
        paidOrders++
        // 商品銷售
        for (const item of order.items) {
          const name = item.meal.name
          if (!productMap.has(name)) {
            productMap.set(name, { name, sales: 0, revenue: 0 })
          }
          const prod = productMap.get(name)!
          prod.sales += item.quantity
          prod.revenue += item.price * item.quantity
        }
        // 每日
        const dateKey = createdAt.toLocaleDateString('zh-TW', { year: 'numeric', month: '2-digit', day: '2-digit' })
        if (!dailyMap.has(dateKey)) dailyMap.set(dateKey, { date: dateKey, revenue: 0, orders: 0 })
        const day = dailyMap.get(dateKey)!
        day.revenue += order.totalAmount
        day.orders += 1
        // 每月
        const monthKey = createdAt.toLocaleDateString('zh-TW', { year: 'numeric', month: '2-digit' })
        if (!monthlyMap.has(monthKey)) monthlyMap.set(monthKey, { month: monthKey, revenue: 0, orders: 0 })
        const month = monthlyMap.get(monthKey)!
        month.revenue += order.totalAmount
        month.orders += 1
      }
      if (order.status === "cancelled") cancelledOrders++
      if (order.status === "completed") completedOrders++
      if (order.status === "pending") pendingOrders++
    }

    // 商品排行
    const productSales = Array.from(productMap.values())
      .sort((a, b) => b.sales - a.sales)
      .slice(0, 5)

    // 每日營收
    const dailyRevenue = Array.from(dailyMap.values())
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
      .slice(-7) // 近7天

    // 每月營收
    const monthlyRevenue = Array.from(monthlyMap.values())
      .sort((a, b) => {
        const [ay, am] = a.month.split('/')
        const [by, bm] = b.month.split('/')
        return (Number(ay) * 12 + Number(am)) - (Number(by) * 12 + Number(bm))
      })

    return {
      totalRevenue,
      paidOrders,
      cancelledOrders,
      completedOrders,
      pendingOrders,
      productSales,
      dailyRevenue,
      monthlyRevenue,
      firstOrderDate,
      lastOrderDate,
      avgOrderValue: paidOrders > 0 ? totalRevenue / paidOrders : 0,
      totalOrders: orders.length,
    }
  }, [orders])

  if (isLoading) {
    return <div className="flex items-center justify-center h-screen text-primary">Loading...</div>
  }

  if (error) {
    return <div className="flex items-center justify-center h-screen text-red-500">Error: {error.message}</div>
  }

  // 半透明背景樣式
  const translucentBg = "bg-white bg-opacity-60 backdrop-blur-sm"

  // 顏色設計
  const textTitle = "text-gray-800 dark:text-gray-100"
  const textSubtitle = "text-gray-600 dark:text-gray-300"
  const textHighlight = "text-primary font-bold"
  const textMuted = "text-gray-400 dark:text-gray-500"
  const textTableHeader = "text-gray-700 dark:text-gray-200"
  const textTableCell = "text-gray-800 dark:text-gray-100"
  const textTableCellRight = "text-right text-gray-800 dark:text-gray-100"
  const textTableCellTotal = "text-gray-900 dark:text-gray-100 font-bold"

  return (
    <div className="max-w-[1100px] mx-auto py-8 px-4 flex flex-col gap-8">
      {/* Header */}
      <div className={`${translucentBg} rounded-lg p-4 md:p-6 flex flex-col md:flex-row md:items-center md:justify-between gap-2`}>
        <div>
          <h1 className={`text-3xl md:text-4xl font-bold mb-1 ${textTitle}`}>營收報表總覽</h1>
          <p className={`text-base md:text-lg ${textSubtitle}`}>管理者專用統計數據一覽</p>
        </div>
        <div className={`mt-2 md:mt-0 text-sm ${textSubtitle}`}>
          資料區間：{stats.firstOrderDate ? stats.firstOrderDate.toLocaleDateString() : "-"} ~ {stats.lastOrderDate ? stats.lastOrderDate.toLocaleDateString() : "-"}
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
        <Card className={translucentBg}>
          <CardContent className="p-4 md:p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className={`text-sm font-medium ${textSubtitle}`}>總營收</p>
                <p className={`text-2xl font-bold mt-1 ${textHighlight}`}>{formatCurrency(stats.totalRevenue)}</p>
              </div>
              <div className="w-10 h-10 rounded-lg flex items-center justify-center text-green-600 bg-green-100">
                <DollarSign className="h-6 w-6" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className={translucentBg}>
          <CardContent className="p-4 md:p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className={`text-sm font-medium ${textSubtitle}`}>已付款訂單</p>
                <p className={`text-2xl font-bold mt-1 text-blue-600 dark:text-blue-400`}>{stats.paidOrders}</p>
              </div>
              <div className="w-10 h-10 rounded-lg flex items-center justify-center text-blue-600 bg-blue-100">
                <ShoppingCart className="h-6 w-6" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className={translucentBg}>
          <CardContent className="p-4 md:p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className={`text-sm font-medium ${textSubtitle}`}>平均客單價</p>
                <p className={`text-2xl font-bold mt-1 text-amber-600 dark:text-amber-400`}>{formatCurrency(Math.round(stats.avgOrderValue))}</p>
              </div>
              <div className="w-10 h-10 rounded-lg flex items-center justify-center text-amber-600 bg-amber-100">
                <Users className="h-6 w-6" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className={translucentBg}>
          <CardContent className="p-4 md:p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className={`text-sm font-medium ${textSubtitle}`}>已取消訂單</p>
                <p className={`text-2xl font-bold mt-1 text-red-500 dark:text-red-400`}>{stats.cancelledOrders}</p>
              </div>
              <div className="w-10 h-10 rounded-lg flex items-center justify-center text-red-500 bg-red-100">
                <XCircle className="h-6 w-6" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Order Status Table */}
      <Card className={translucentBg}>
        <CardHeader>
          <CardTitle className={`text-lg md:text-xl flex items-center gap-2 ${textTitle}`}>
            <TrendingUp className="w-5 h-5 text-primary" />
            訂單狀態統計
          </CardTitle>
        </CardHeader>
        <CardContent className="overflow-x-auto">
          <table className="min-w-full text-sm md:text-base">
            <thead>
              <tr className="border-b">
                <th className={`py-2 px-4 text-left ${textTableHeader}`}>狀態</th>
                <th className={`py-2 px-4 text-right ${textTableHeader}`}>數量</th>
                <th className={`py-2 px-4 text-right ${textTableHeader}`}>佔比</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className={`py-2 px-4 ${textTableCell}`}>已付款</td>
                <td className={`py-2 px-4 ${textTableCellRight} text-blue-600 dark:text-blue-400`}>{stats.paidOrders}</td>
                <td className={`py-2 px-4 ${textTableCellRight}`}>{stats.totalOrders > 0 ? ((stats.paidOrders / stats.totalOrders) * 100).toFixed(1) : 0}%</td>
              </tr>
              <tr>
                <td className={`py-2 px-4 ${textTableCell}`}>已完成</td>
                <td className={`py-2 px-4 ${textTableCellRight} text-green-600 dark:text-green-400`}>{stats.completedOrders}</td>
                <td className={`py-2 px-4 ${textTableCellRight}`}>{stats.totalOrders > 0 ? ((stats.completedOrders / stats.totalOrders) * 100).toFixed(1) : 0}%</td>
              </tr>
              <tr>
                <td className={`py-2 px-4 ${textTableCell}`}>處理中</td>
                <td className={`py-2 px-4 ${textTableCellRight} text-amber-600 dark:text-amber-400`}>{stats.pendingOrders}</td>
                <td className={`py-2 px-4 ${textTableCellRight}`}>{stats.totalOrders > 0 ? ((stats.pendingOrders / stats.totalOrders) * 100).toFixed(1) : 0}%</td>
              </tr>
              <tr>
                <td className={`py-2 px-4 ${textTableCell}`}>已取消</td>
                <td className={`py-2 px-4 ${textTableCellRight} text-red-500 dark:text-red-400`}>{stats.cancelledOrders}</td>
                <td className={`py-2 px-4 ${textTableCellRight}`}>{stats.totalOrders > 0 ? ((stats.cancelledOrders / stats.totalOrders) * 100).toFixed(1) : 0}%</td>
              </tr>
              <tr className="font-bold border-t">
                <td className={`py-2 px-4 ${textTableCellTotal}`}>總訂單</td>
                <td className={`py-2 px-4 ${textTableCellRight} ${textTableCellTotal}`}>{stats.totalOrders}</td>
                <td className={`py-2 px-4 ${textTableCellRight} ${textTableCellTotal}`}>100%</td>
              </tr>
            </tbody>
          </table>
        </CardContent>
      </Card>

      {/* Top Products */}
      <Card className={translucentBg}>
        <CardHeader>
          <CardTitle className={`text-lg md:text-xl flex items-center gap-2 ${textTitle}`}>
            <Trophy className="w-5 h-5 text-yellow-500" />
            熱銷商品排行（前5名）
          </CardTitle>
        </CardHeader>
        <CardContent className="overflow-x-auto">
          <table className="min-w-full text-sm md:text-base">
            <thead>
              <tr className="border-b">
                <th className={`py-2 px-4 text-left ${textTableHeader}`}>排名</th>
                <th className={`py-2 px-4 text-left ${textTableHeader}`}>商品名稱</th>
                <th className={`py-2 px-4 text-right ${textTableHeader}`}>銷售數量</th>
                <th className={`py-2 px-4 text-right ${textTableHeader}`}>營收</th>
              </tr>
            </thead>
            <tbody>
              {stats.productSales.length === 0 && (
                <tr>
                  <td colSpan={4} className={`py-4 text-center ${textMuted}`}>暫無資料</td>
                </tr>
              )}
              {stats.productSales.map((prod, idx) => (
                <tr key={prod.name} className={clsx(idx === 0 && "bg-yellow-50")}>
                  <td className={`py-2 px-4 ${idx === 0 ? "text-yellow-600 font-bold" : textTableCell}`}>{idx + 1}</td>
                  <td className={`py-2 px-4 ${textTableCell}`}>{prod.name}</td>
                  <td className={`py-2 px-4 ${textTableCellRight}`}>{prod.sales}</td>
                  <td className={`py-2 px-4 ${textTableCellRight} ${idx === 0 ? "text-yellow-600 font-bold" : ""}`}>{formatCurrency(prod.revenue)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </CardContent>
      </Card>

      {/* Recent 7 Days Revenue */}
      <Card className={translucentBg}>
        <CardHeader>
          <CardTitle className={`text-lg md:text-xl flex items-center gap-2 ${textTitle}`}>
            <TrendingUp className="w-5 h-5 text-primary" />
            近7日營收與訂單
          </CardTitle>
        </CardHeader>
        <CardContent className="overflow-x-auto">
          <table className="min-w-full text-sm md:text-base">
            <thead>
              <tr className="border-b">
                <th className={`py-2 px-4 text-left ${textTableHeader}`}>日期</th>
                <th className={`py-2 px-4 text-right ${textTableHeader}`}>營收</th>
                <th className={`py-2 px-4 text-right ${textTableHeader}`}>訂單數</th>
              </tr>
            </thead>
            <tbody>
              {stats.dailyRevenue.length === 0 && (
                <tr>
                  <td colSpan={3} className={`py-4 text-center ${textMuted}`}>暫無資料</td>
                </tr>
              )}
              {stats.dailyRevenue.map(day => (
                <tr key={day.date}>
                  <td className={`py-2 px-4 ${textTableCell}`}>{day.date}</td>
                  <td className={`py-2 px-4 ${textTableCellRight} text-green-600 dark:text-green-400`}>{formatCurrency(day.revenue)}</td>
                  <td className={`py-2 px-4 ${textTableCellRight}`}>{day.orders}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </CardContent>
      </Card>

      {/* Monthly Revenue */}
      <Card className={translucentBg}>
        <CardHeader>
          <CardTitle className={`text-lg md:text-xl flex items-center gap-2 ${textTitle}`}>
            <TrendingUp className="w-5 h-5 text-primary" />
            歷史每月營收
          </CardTitle>
        </CardHeader>
        <CardContent className="overflow-x-auto">
          <table className="min-w-full text-sm md:text-base">
            <thead>
              <tr className="border-b">
                <th className={`py-2 px-4 text-left ${textTableHeader}`}>月份</th>
                <th className={`py-2 px-4 text-right ${textTableHeader}`}>營收</th>
                <th className={`py-2 px-4 text-right ${textTableHeader}`}>訂單數</th>
              </tr>
            </thead>
            <tbody>
              {stats.monthlyRevenue.length === 0 && (
                <tr>
                  <td colSpan={3} className={`py-4 text-center ${textMuted}`}>暫無資料</td>
                </tr>
              )}
              {stats.monthlyRevenue.map(month => (
                <tr key={month.month}>
                  <td className={`py-2 px-4 ${textTableCell}`}>{month.month}</td>
                  <td className={`py-2 px-4 ${textTableCellRight} text-green-600 dark:text-green-400`}>{formatCurrency(month.revenue)}</td>
                  <td className={`py-2 px-4 ${textTableCellRight}`}>{month.orders}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </CardContent>
      </Card>
    </div>
  )
}
