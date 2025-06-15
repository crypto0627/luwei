import axios from "axios";
import { CartItem } from "@/types/cart-types";

const API_URL = `${process.env.NEXT_PUBLIC_API_URL}/api/order`

export class OrderService {
  private static instance: OrderService;
  private apiKey: string;

  private constructor() {
    this.apiKey = process.env.NEXT_PUBLIC_X_API_KEY || "";
  }

  private handleError(error: any) {
    if (axios.isAxiosError(error)) {
      return new Error(error.response?.data?.error || "An error occurred");
    }
    return error;
  }

  public static getInstance(): OrderService {
    if (!OrderService.instance) {
      OrderService.instance = new OrderService();
    }
    return OrderService.instance;
  }

  private getHeaders() {
    return {
      "X-API-Key": this.apiKey,
      "Content-Type": "application/json",
    };
  }

  private formatDate(dateStr: string): string {
    try {
      return new Date(dateStr).toISOString();
    } catch (error) {
      console.error("Error formatting date:", dateStr);
      return dateStr;
    }
  }

  private formatOrderDates(order: any) {
    return {
      ...order,
      createdAt: this.formatDate(order.createdAt),
      updatedAt: this.formatDate(order.updatedAt),
      items: order.items.map((item: any) => ({
        ...item,
        createdAt: this.formatDate(item.createdAt)
      }))
    };
  }

  async checkout(items: CartItem[]) {
    try {
      const response = await axios.post(
        `${API_URL}/checkout`,
        { items },
        { 
          headers: this.getHeaders(),
          withCredentials: true
        }
      );
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async monitor() {
    try {
      const response = await axios.get(
        `${API_URL}/monitor`,
        { 
          headers: this.getHeaders(),
          withCredentials: true
        }
      );
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async fetch_meals() {
    try {
      const response = await axios.post(
        `${API_URL}/fetch-meals`,
        {},
        { 
          headers: this.getHeaders(),
          withCredentials: true
        }
      );
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async getAllOrders() {
    try {
      const response = await axios.post(
        `${API_URL}/get_all_order`,
        {},
        { 
          headers: this.getHeaders(),
          withCredentials: true
        }
      );
      // Format dates and return orders array
      return response.data.orders.map((order: any) => this.formatOrderDates(order));
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async deleteOrder(orderId: string) {
    try {
      const response = await axios.post(
        `${API_URL}/delete_order`,
        { orderId },
        { 
          headers: this.getHeaders(),
          withCredentials: true
        }
      );
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async completeOrder(orderId: string, status: "completed" | "paid" = "completed") {
    try {
      const response = await axios.post(
        `${API_URL}/complete_order`,
        { orderId, status },
        { 
          headers: this.getHeaders(),
          withCredentials: true
        }
      );
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }
}

export default OrderService.getInstance();
