import { Method } from "@/types/enums";
import { getToken } from "@/utils/auth";

export class ApiService {
  private baseUrl: string;
  constructor() {
    this.baseUrl = process.env.NEXT_PUBLIC_API_URL || "https://apiaryadmin.azurewebsites.net/api";
  }

  public async registerUser(
    email: string,
    username: string,
    password: string
  ): Promise<Response> {
    return await fetch(`${this.baseUrl}/accounts`, {
      method: Method.POST,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, username, password }),
    });
  }

  public async loginUser(
    username: string,
    password: string
  ): Promise<Response> {
    return await fetch(`${this.baseUrl}/login`, {
      method: Method.POST,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password }),
    });
  }

  public async login(username: string, password: string): Promise<string> {
    try {
      const response = await fetch(`${this.baseUrl}/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });

      if (!response.ok) {
        const errorData = await response
          .json()
          .catch(() => ({ message: "Failed to parse response" }));
        throw new Error(errorData.message || "Failed to log in");
      }

      const data = await response.json().catch(() => {
        throw new Error("Failed to parse API response.");
      });

      const token = data.accessToken; // Extract accessToken from the response

      if (!token) {
        throw new Error("Access token is missing in the API response.");
      }

      return token;
    } catch (error) {
      throw error;
    }
  }

  public async getApiaries(): Promise<any[]> {
    return this.get("/apiaries");
  }

  public async getHives(apiaryId: string): Promise<any[]> {
    return this.get(`/apiaries/${apiaryId}/hives`);
  }

  public async getInspections(hiveId: string): Promise<any[]> {
    return this.get(`/hives/${hiveId}/inspections`);
  }


  public async get<T>(endpoint: string, requireAuth: boolean = true): Promise<T> {
    try {
      const headers: Record<string, string> = { "Content-Type": "application/json" };
  
      if (requireAuth) {
        const token = getToken();
        if (!token) {
          throw new Error("JWT token is missing. User may not be authenticated.");
        }
        headers["Authorization"] = `Bearer ${token}`;
      }
  
      const response = await fetch(`${this.baseUrl}${endpoint}`, {
        method: Method.GET,
        headers,
      });
  
      if (!response.ok) {
        // Handle non-2xx responses
        const errorData = await response.json().catch(() => null);
        throw new Error(
          errorData?.message || `Request failed with status ${response.status}`
        );
      }
  
      // Parse and return the JSON response
      return await response.json().catch(() => {
        throw new Error("Failed to parse API response.");
      });
    } catch (error) {
      console.error(`GET request to ${endpoint} failed:`, error);
      throw error;
    }
  }
  public async delete(endpoint: string): Promise<void> {
    const token = getToken();
    if (!token) {
      throw new Error("JWT token is missing. User may not be authenticated.");
    }
  
    const response = await fetch(`${this.baseUrl}${endpoint}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });
  
    if (!response.ok) {
      const errorData = await response.json().catch(() => null);
      throw new Error(errorData?.message || `Request failed with status ${response.status}`);
    }
  }
  public async put<T>(endpoint: string, body: any): Promise<T> {
    const token = getToken();
    if (!token) {
      throw new Error("JWT token is missing. User may not be authenticated.");
    }
  
    const response = await fetch(`${this.baseUrl}${endpoint}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`, // Attach Bearer token
      },
      body: JSON.stringify(body),
    });
  
    if (!response.ok) {
      const errorData = await response.json().catch(() => null);
      throw new Error(errorData?.message || `Request failed with status ${response.status}`);
    }
  
    return response.json();
  }
  

  /**
   * Makes an authenticated POST request to the API.
   *
   * @param endpoint - The API endpoint (relative to baseUrl).
   * @param body - The request body to send.
   * @returns The API response as JSON.
   */
  public async post<T>(endpoint: string, body: any): Promise<T> {
    try {
      const token = getToken();

      if (!token) {
        throw new Error("JWT token is missing. User may not be authenticated.");
      }

      const response = await fetch(`${this.baseUrl}${endpoint}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`, // Attach Bearer token
        },
        body: JSON.stringify(body),
      });

      if (!response.ok) {
        const errorData = await response
          .json()
          .catch(() => ({ message: "Failed to parse response" }));
        throw new Error(
          errorData.message || `Request failed with status ${response.status}`
        );
      }

      const data = await response.json().catch(() => {
        throw new Error("Failed to parse API response.");
      });

      return data;
    } catch (error) {
      console.error(`POST request to ${endpoint} failed:`, error);
      throw error;
    }
  }
}
