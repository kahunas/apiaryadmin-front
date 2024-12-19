import { deleteCookie, getCookie, setCookie } from "cookies-next/client";

export class CookiesService {
  public retrieveToken(): string | undefined {
    return getCookie("token");
  }

  public setToken(token: string): void {
    setCookie("token", token);
  }

  public removeToken(): void {
    deleteCookie("token");
  }
}