import axios from "axios";

const API_URL = "http://localhost:8787/api/auth";

export class AuthService {
  private static instance: AuthService;
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

  public static getInstance(): AuthService {
    if (!AuthService.instance) {
      AuthService.instance = new AuthService();
    }
    return AuthService.instance;
  }

  private getHeaders() {
    return {
      "X-API-Key": this.apiKey,
      "Content-Type": "application/json",
    };
  }

  async logout() {
    try {
      const response = await axios.post(`${API_URL}/logout`, null, { 
        headers: this.getHeaders(),
        withCredentials: true
      });
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async getCurrentUser() {
    try {
      const response = await axios.get(`${API_URL}/me`, {
        headers: this.getHeaders(),
        withCredentials: true
      });
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async signInWithGoogle() {
    try {
      // Redirect to the Google OAuth endpoint
      window.location.href = `${API_URL}/google`;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async signInWithLine() {
    window.location.href = `${API_URL}/line/login`;
  }
}

export default AuthService.getInstance();
