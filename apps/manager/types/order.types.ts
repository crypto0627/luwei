export interface OrderItem {
  id: string;
  mealId: string;
  quantity: number;
  price: number;
  createdAt: string;
  meal: {
    id: string;
    name: string;
    description: string;
    price: number;
    image: string;
    isAvailable: boolean;
    createdAt: string;
    updatedAt: string;
  };
}

export interface Order {
  id: string;
  userId: string;
  phone: string;
  status: 'pending' | 'paid' | 'completed' | 'cancelled';
  totalAmount: number;
  createdAt: string;
  updatedAt: string;
  items: OrderItem[];
}
