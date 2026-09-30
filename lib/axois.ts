import axios from "axios";
import type { AxiosInstance } from "axios";

export const api: AxiosInstance = axios.create({
  baseURL: process.env.G2BULK_URL,
  timeout: 20000,
});

// Guide rule: repeated failed auth = permanent IP ban.
// After the first 401, block all keyed calls until restart.
// Kept on globalThis so hot reload / separate Next.js bundles share one flag.
const g = globalThis as typeof globalThis & { __g2bulkAuthBlocked?: boolean };

export class G2BulkPausedError extends Error {
  constructor() {
    super("G2Bulk paused after 401 - fix API key, then restart");
    this.name = "G2BulkPausedError";
  }
}

export function g2bulkGuard() {
  if (g.__g2bulkAuthBlocked) throw new G2BulkPausedError();
}

function tripGuard() {
  if (g.__g2bulkAuthBlocked) return;
  g.__g2bulkAuthBlocked = true;
  console.error(
    "[g2bulk] 401 received - keyed calls paused to avoid an IP ban. Fix G2BULK_API_KEY, then restart.",
  );
}

api.interceptors.response.use(
  (r) => {
    // placeOrder uses validateStatus: () => true, so a 401 arrives here.
    if (r.status === 401) tripGuard();
    return r;
  },
  (err) => {
    if (err.response?.status === 401) tripGuard();
    return Promise.reject(err);
  },
);

export default api;
