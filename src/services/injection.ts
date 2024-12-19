import { ApiService } from "@/services/api";
import { CookiesService } from "@/services/cookies";

let ICookies: CookiesService;
export const getCookies = () => {
  if (!ICookies) {
    ICookies = new CookiesService();
  }
  return ICookies;
};

let IApi: ApiService;
export const getApi = () => {
  if (!IApi) {
    IApi = new ApiService();
  }
  return IApi;
};