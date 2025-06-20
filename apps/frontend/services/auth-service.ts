import axios from "axios";

const API_URL = `${process.env.NEXT_PUBLIC_API_URL}/api/auth`

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

  public async handleCredentialResponse(response: any) {
    try {
      const res = await axios.post(`${API_URL}/google/callback`, {
        credential: response.credential,
        redirect_uri: window.location.origin,
      }, {
        headers: this.getHeaders(),
        withCredentials: true, // ⬅️ 這非常重要！確保 Safari 設 Cookie
      });
      const cookie_res = await axios.post(`${API_URL}/set-cookie`, { token: res.data.token }, {
        withCredentials: true,
        headers: { "X-API-Key": this.apiKey },
      });
      if (cookie_res.data.message === "Cookie set") {
        window.location.href = res.data.redirectUrl;
      } else {
        throw new Error("Failed to set cookie");
      }
    } catch (error) {
      throw this.handleError(error);
    }
  }
}

export default AuthService.getInstance();
