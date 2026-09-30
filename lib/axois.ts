import axios from "axios";
import type { AxiosInstance } from "axios";

export const api: AxiosInstance = axios.create({
  baseURL: process.env.G2BULK_URL,
  timeout: 20000,
});

// Guide rule: repeated failed auth = permanent IP ban.
// After the first 401, block all keyed calls until restart.
let authBlocked = false;

export function g2bulkGuard() {
  if (authBlocked) {
    throw new Error("G2Bulk paused after 401 - fix API key, then restart");
  }
}

api.interceptors.response.use(
  (r) => r,
  (err) => {
    if (err.response?.status === 401 && !authBlocked) {
      authBlocked = true;
      console.error(
        "[g2bulk] 401 received - keyed calls paused to avoid an IP ban. Fix G2BULK_API_KEY, then restart.",
      );
    }
    return Promise.reject(err);
  },
);

export default api;
