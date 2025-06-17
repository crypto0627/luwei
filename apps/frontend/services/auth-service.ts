import axios from "axios";

const API_URL = `${process.env.NEXT_PUBLIC_API_URL}/api/auth`

export class AuthService {
  private static instance: AuthService;
  private apiKey: string;
  private googleInitialized: boolean = false;

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

  private initializeGoogle() {
    if (this.googleInitialized) return;

    const clientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;
    if (!clientId) {
      throw new Error('Google Client ID is not configured');
    }

    // @ts-ignore
    if (typeof google === 'undefined') {
      throw new Error('Google Identity Services script not loaded');
    }

    // @ts-ignore
    google.accounts.id.initialize({
      client_id: clientId,
      callback: this.handleCredentialResponse.bind(this),
      ux_mode: 'popup'
    });

    this.googleInitialized = true;
  }

  public async handleCredentialResponse(response: any) {
    try {
      window.location.href = `${API_URL}/google/callback?credential=${response.credential}&redirect_uri=${encodeURIComponent(window.location.origin)}`;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async signInWithGoogle(): Promise<{ user: { id: string; email: string; name: string } }> {
    try {
      this.initializeGoogle();

      return new Promise((resolve, reject) => {
        try {
          // @ts-ignore
          google.accounts.id.renderButton(
            document.getElementById('google-signin-container'),
            { 
              type: 'standard', 
              theme: 'outline', 
              size: 'large',
              width: '100%'
            }
          );
        } catch (error) {
          reject(this.handleError(error));
        }
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
