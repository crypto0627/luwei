'use client';

import { useEffect, useState } from 'react';
import orderService from '@/services/order-service';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { format, addWeeks, nextMonday, isWeekend } from 'date-fns';
import { zhTW } from 'date-fns/locale';
import { Order } from '@/types/order.types';
import { AlertCircle, MapPin } from 'lucide-react';
import { Loading } from '@/components/ui/loading';

export default function MonitorPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchOrders = async () => {
    try {
      const response = await orderService.monitor();
      setOrders(response.orders);
      setError(null);
    } catch (err) {
      setError('無法載入訂單資訊');
      console.error('Error fetching orders:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
    const interval = setInterval(fetchOrders, 30000);
    return () => clearInterval(interval);
  }, []);

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

  const getPickupDate = (createdAt: string) => {
    const createdDate = new Date(createdAt);
    const isWeekendOrder = isWeekend(createdDate);
    const pickupDate = isWeekendOrder ? addWeeks(nextMonday(createdDate), 1) : nextMonday(createdDate);
    return format(pickupDate, 'yyyy年MM月dd日', { locale: zhTW });
  };

  if (loading) {
    return (
      <div className="h-screen w-full overflow-y-auto pt-24 container mx-auto p-4">
        <div className="flex flex-col items-center justify-center space-y-4">
          <Loading size="lg" />
          <div className="text-amber-600">載入中...</div>
        </div>
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

  return (
    <div className="h-screen w-full overflow-y-auto pt-24">
      <div className="container mx-auto p-4">
        <h1 className="text-2xl font-bold mb-6 text-amber-700">訂單追蹤</h1>
        <div className="space-y-4">
          {orders.length === 0 ? (
            <div className="text-center text-gray-500">尚無訂單</div>
          ) : (
            orders.map((order) => (
              <Card key={order.id} className="hover:shadow-lg transition-shadow duration-200">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 bg-amber-50">
                  <CardTitle className="text-sm font-medium text-amber-800">
                    訂單編號: {order.id}
                  </CardTitle>
                  <div className="w-[96px] flex justify-end">
                    {getStatusBadge(order.status)}
                  </div>
                </CardHeader>
                <CardContent className="pt-4">
                  <div className="space-y-3">
                    <div className="text-sm text-gray-600">
                      建立時間: {format(new Date(order.createdAt), 'PPP p', { locale: zhTW })}
                    </div>
                    <div className="text-sm text-amber-700 font-medium">
                      預計取貨時間: {getPickupDate(order.createdAt)}
                      <div className="text-xs text-gray-500 mt-1">
                        營業時間: 08:00–14:00, 16:30–19:00
                      </div>
                    </div>
                    <a 
                      href="https://maps.app.goo.gl/Ao4XE8KkccgKY2Nk7" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="flex items-center text-sm text-blue-600 hover:text-blue-800 hover:underline"
                    >
                      <MapPin className="w-4 h-4 mr-1" />
                      取貨地點 338桃園市蘆竹區中興路125-3號
                    </a>
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
                  <div className="mt-3 text-sm text-gray-600 flex items-center">
                    <AlertCircle className="w-4 h-4 mr-1 text-amber-600" />
                    僅支援現金到店支付
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
