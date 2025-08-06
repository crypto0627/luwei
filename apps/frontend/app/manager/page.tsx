'use client';

import { useEffect, useState } from 'react';
import orderService from '@/services/order-service';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { format, isToday, isThisWeek, isThisMonth, isThisYear } from 'date-fns';
import { zhTW } from 'date-fns/locale';
import { Order } from '@/types/order.types';
import { AlertCircle, MapPin, Calendar, Filter, Edit } from 'lucide-react';
import { PageLoading, ButtonLoading } from '@/components/ui/loading';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

type FilterType = 'all' | 'today' | 'week' | 'month' | 'year';

export default function ManagerPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [filteredOrders, setFilteredOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeFilter, setActiveFilter] = useState<FilterType>('all');
  const [updatingStatus, setUpdatingStatus] = useState<string | null>(null);

  const fetchOrders = async () => {
    try {
      // 嘗試使用管理員 API，如果失敗則使用一般監控 API
      let response;
      try {
        response = await orderService.getAllOrders();
      } catch {
        response = await orderService.monitor();
      }
      
      // 按時間排序，最新的在最上面
      const sortedOrders = response.orders.sort((a: Order, b: Order) => 
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );
      setOrders(sortedOrders);
      setError(null);
    } catch (err) {
      setError('無法載入訂單資訊');
      console.error('Error fetching orders:', err);
    } finally {
      setLoading(false);
    }
  };

  const filterOrders = (filter: FilterType) => {
    setActiveFilter(filter);
    
    if (filter === 'all') {
      setFilteredOrders(orders);
      return;
    }

    const filtered = orders.filter(order => {
      const orderDate = new Date(order.createdAt);
      
      switch (filter) {
        case 'today':
          return isToday(orderDate);
        case 'week':
          return isThisWeek(orderDate, { weekStartsOn: 1 }); // 週一開始
        case 'month':
          return isThisMonth(orderDate);
        case 'year':
          return isThisYear(orderDate);
        default:
          return true;
      }
    });
    
    setFilteredOrders(filtered);
  };

  useEffect(() => {
    fetchOrders();
    const interval = setInterval(fetchOrders, 30000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    filterOrders(activeFilter);
  }, [orders, activeFilter]);

  const getStatusBadge = (status: Order['status']) => {
    const statusMap: Record<Order['status'], { label: string; variant: 'default' | 'secondary' | 'destructive' | 'outline' }> = {
      pending: { label: '處理中', variant: 'secondary' },
      paid: { label: '已付款', variant: 'default' },
      completed: { label: '已完成', variant: 'default' },
      cancelled: { label: '已取消', variant: 'destructive' },
    };

    const { label, variant } = statusMap[status];
    return <Badge variant={variant}>{label}</Badge>;
  };

  const getFilterStats = () => {
    const today = orders.filter(order => isToday(new Date(order.createdAt))).length;
    const week = orders.filter(order => isThisWeek(new Date(order.createdAt), { weekStartsOn: 1 })).length;
    const month = orders.filter(order => isThisMonth(new Date(order.createdAt))).length;
    const year = orders.filter(order => isThisYear(new Date(order.createdAt))).length;
    
    return { today, week, month, year, all: orders.length };
  };

  const getTotalAmount = (orders: Order[]) => {
    return orders.reduce((sum, order) => sum + order.totalAmount, 0);
  };

  const handleStatusUpdate = async (orderId: string, newStatus: Order['status']) => {
    setUpdatingStatus(orderId);
    try {
      await orderService.updateOrderStatus(orderId, newStatus);
      // 更新本地狀態
      setOrders(prevOrders => 
        prevOrders.map(order => 
          order.id === orderId 
            ? { ...order, status: newStatus, updatedAt: new Date().toISOString() }
            : order
        )
      );
    } catch (err) {
      console.error('Error updating order status:', err);
      // 這裡可以添加錯誤提示
    } finally {
      setUpdatingStatus(null);
    }
  };

  if (loading) {
    return (
      <div className="h-screen w-full overflow-y-auto pt-24 container mx-auto p-4">
        <PageLoading message="載入管理資料中..." />
      </div>
    );
  }

  if (error) {
    return (
      <div className="h-screen w-full overflow-y-auto pt-24 container mx-auto p-4">
        <div className="text-center text-red-500">{error}</div>
      </div>
    );
  }

  const stats = getFilterStats();

  return (
    <div className="h-screen w-full overflow-y-auto pt-24">
      <div className="container mx-auto p-4">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold text-amber-700">訂單管理</h1>
          <div className="flex items-center gap-2 text-sm text-amber-600">
            <Calendar className="w-4 h-4" />
            <span>自動更新每30秒</span>
          </div>
        </div>

        {/* 統計卡片 */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-6">
          <Card className="bg-gradient-to-br from-amber-50 to-orange-50">
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-amber-700">{stats.all}</div>
              <div className="text-sm text-amber-600">全部訂單</div>
              <div className="text-xs text-amber-500">NT${getTotalAmount(orders)}</div>
            </CardContent>
          </Card>
          <Card className="bg-gradient-to-br from-blue-50 to-cyan-50">
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-blue-700">{stats.today}</div>
              <div className="text-sm text-blue-600">本日訂單</div>
              <div className="text-xs text-blue-500">
                NT${getTotalAmount(orders.filter(order => isToday(new Date(order.createdAt))))}
              </div>
            </CardContent>
          </Card>
          <Card className="bg-gradient-to-br from-green-50 to-emerald-50">
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-green-700">{stats.week}</div>
              <div className="text-sm text-green-600">本週訂單</div>
              <div className="text-xs text-green-500">
                NT${getTotalAmount(orders.filter(order => isThisWeek(new Date(order.createdAt), { weekStartsOn: 1 })))}
              </div>
            </CardContent>
          </Card>
          <Card className="bg-gradient-to-br from-purple-50 to-violet-50">
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-purple-700">{stats.month}</div>
              <div className="text-sm text-purple-600">本月訂單</div>
              <div className="text-xs text-purple-500">
                NT${getTotalAmount(orders.filter(order => isThisMonth(new Date(order.createdAt))))}
              </div>
            </CardContent>
          </Card>
          <Card className="bg-gradient-to-br from-rose-50 to-pink-50">
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-rose-700">{stats.year}</div>
              <div className="text-sm text-rose-600">本年訂單</div>
              <div className="text-xs text-rose-500">
                NT${getTotalAmount(orders.filter(order => isThisYear(new Date(order.createdAt))))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* 篩選按鈕 */}
        <div className="flex flex-wrap gap-2 mb-6">
          <div className="flex items-center gap-2 mr-4">
            <Filter className="w-4 h-4 text-amber-600" />
            <span className="text-sm font-medium text-amber-700">篩選：</span>
          </div>
          {[
            { key: 'all', label: '全部', count: stats.all },
            { key: 'today', label: '本日', count: stats.today },
            { key: 'week', label: '本週', count: stats.week },
            { key: 'month', label: '本月', count: stats.month },
            { key: 'year', label: '本年', count: stats.year },
          ].map(({ key, label, count }) => (
            <Button
              key={key}
              variant={activeFilter === key ? 'default' : 'outline'}
              size="sm"
              onClick={() => filterOrders(key as FilterType)}
              className={`${
                activeFilter === key 
                  ? 'bg-amber-600 hover:bg-amber-700 text-white' 
                  : 'border-amber-300 text-amber-700 hover:bg-amber-50'
              }`}
            >
              {label} ({count})
            </Button>
          ))}
        </div>

        {/* 訂單列表 */}
        <div className="space-y-4">
          {filteredOrders.length === 0 ? (
            <div className="text-center text-gray-500 py-8">
              {activeFilter === 'all' ? '尚無訂單' : `${activeFilter === 'today' ? '本日' : activeFilter === 'week' ? '本週' : activeFilter === 'month' ? '本月' : '本年'}尚無訂單`}
            </div>
          ) : (
            filteredOrders.map((order) => (
              <Card key={order.id} className="hover:shadow-lg transition-shadow duration-200">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 bg-amber-50">
                  <CardTitle className="text-sm font-medium text-amber-800">
                    訂單編號: {order.id}
                  </CardTitle>
                  <div className="flex items-center gap-2">
                    <div className="text-xs text-amber-600">
                      {format(new Date(order.createdAt), 'MM/dd HH:mm')}
                    </div>
                    <div className="flex items-center gap-2">
                      <Select
                        value={order.status}
                        onValueChange={(value) => handleStatusUpdate(order.id, value as Order['status'])}
                        disabled={updatingStatus === order.id}
                      >
                        <SelectTrigger className="w-[120px] h-8 text-xs">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="pending">處理中</SelectItem>
                          <SelectItem value="paid">已付款</SelectItem>
                          <SelectItem value="completed">已完成</SelectItem>
                          <SelectItem value="cancelled">已取消</SelectItem>
                        </SelectContent>
                      </Select>
                      {updatingStatus === order.id && (
                        <div className="w-4 h-4 border-2 border-amber-300 border-t-amber-600 rounded-full animate-spin" />
                      )}
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="pt-4">
                  <div className="space-y-3">
                    <div className="text-sm text-gray-600">
                      建立時間: {format(new Date(order.createdAt), 'PPP p', { locale: zhTW })}
                    </div>
                    <div className="space-y-2 bg-gray-50 p-3 rounded-lg">
                      {order.items.map((item) => (
                        <div key={item.id} className="flex justify-between text-sm">
                          <span className="text-gray-700">
                            {item.meal.name} x {item.quantity}
                          </span>
                          <span className="text-amber-700">${item.price * item.quantity}</span>
                        </div>
                      ))}
                    </div>
                    <div className="flex justify-between font-medium pt-2 border-t border-amber-100">
                      <span className="text-amber-800">總計</span>
                      <span className="text-amber-700">${order.totalAmount}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </div>
    </div>
  );
}