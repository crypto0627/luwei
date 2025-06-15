import axios from "axios";

interface Meal {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  isAvailable: boolean;
}

const API_URL = `${process.env.NEXT_PUBLIC_API_URL}/api/meal`

export class MealsService {
  private static instance: MealsService;
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

  public static getInstance(): MealsService {
    if (!MealsService.instance) {
      MealsService.instance = new MealsService();
    }
    return MealsService.instance;
  }

  private getHeaders() {
    return {
      "X-API-Key": this.apiKey,
      "Content-Type": "application/json",
    };
  }

  async addMeal(meal: Meal) {
    try {
      const response = await axios.post(
        `${API_URL}/add-meals`,
        { meals: [meal] },
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

  async fetchMeals() {
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

  async editMeal(meal: Meal) {
    try {
      const response = await axios.post(
        `${API_URL}/edit-meals`,
        { meals: [meal] },
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

  async deleteMeal(meal: Meal) {
    try {
      const response = await axios.post(
        `${API_URL}/delete-meals`,
        { id: meal.id },
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

export default MealsService.getInstance();
