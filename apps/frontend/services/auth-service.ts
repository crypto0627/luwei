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

  async signInWithGoogle() {
    try {
      // Load the Google OAuth client library
      const script = document.createElement('script');
      script.src = 'https://accounts.google.com/gsi/client';
      script.async = true;
      script.defer = true;
      document.head.appendChild(script);

      return new Promise((resolve, reject) => {
        script.onload = () => {
          // @ts-ignore
          google.accounts.id.initialize({
            client_id: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID,
            callback: async (response: any) => {
              try {
                // Send the credential to your backend
                const result = await axios.post(
                  `${API_URL}/google/callback`,
                  { credential: response.credential },
                  {
                    headers: this.getHeaders(),
                    withCredentials: true
                  }
                );
                resolve(result.data);
              } catch (error) {
                reject(this.handleError(error));
              }
            },
          });

          // @ts-ignore
          google.accounts.id.prompt();
        };

        script.onerror = () => {
          reject(new Error('Failed to load Google OAuth client library'));
        };
      });
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async signInWithLine() {
    window.location.href = `${API_URL}/line/login`;
  }
}

export default AuthService.getInstance();
