import axios from "axios";
import { CartItem } from "@/types/cart-types";

const API_URL = "http://localhost:8787/api/order";

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
}

export default OrderService.getInstance();
