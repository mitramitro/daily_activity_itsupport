import axios from "axios";
import toast from "react-hot-toast";
import { getToken, setToken, removeToken } from "./storage";

// export const BASE_URL = "https://api-itdesk.digisib.net";
export const BASE_URL = "http://localhost:8000";
// export const BASE_URL = "http://192.168.0.38:8000";

export const getImageUrl = (path) => {
  if (!path) return null;
  if (path.startsWith("http://") || path.startsWith("https://")) return path;
  const cleaned = path.replace(/^\/?(storage\/)?/, "");
  return `${BASE_URL}/storage/${cleaned}`;
};

// ============================================
// UNAUTHORIZED HANDLER
// ============================================
let onUnauthorized = null;

export const setUnauthorizedHandler = (callback) => {
  onUnauthorized = callback;
};

// ============================================
// AXIOS INSTANCE
// ============================================
const api = axios.create({
  baseURL: `${BASE_URL}/api`,
  timeout: 15000,
  withCredentials: true,
});

// ============================================
// REQUEST INTERCEPTOR
// ============================================
api.interceptors.request.use(async (config) => {
  const token = await getToken();
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// ============================================
// RESPONSE INTERCEPTOR — AUTO REFRESH
// ============================================
let isRefreshing = false;
let failedQueue = [];

const processQueue = (error, token = null) => {
  failedQueue.forEach(({ resolve, reject }) => {
    if (token) {
      resolve(token);
    } else {
      reject(error);
    }
  });
  failedQueue = [];
};

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // ═══════════════════════════════════════
    // CASE 1: 401 — coba refresh
    // ═══════════════════════════════════════
    if (error.response?.status === 401 && !originalRequest._retry) {
      // Jangan coba refresh kalau endpointnya sendiri adalah refresh
      if (originalRequest.url?.includes("/auth/refresh")) {
        await removeToken();
        onUnauthorized?.();
        return Promise.reject(error);
      }

      if (isRefreshing) {
        // Queue: tunggu refresh selesai
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        }).then((newToken) => {
          originalRequest.headers.Authorization = `Bearer ${newToken}`;
          return api(originalRequest);
        });
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        const currentToken = await getToken();
        const { data } = await axios.post(
          `${BASE_URL}/api/auth/refresh`,
          {},
          { headers: { Authorization: `Bearer ${currentToken}` } },
        );

        const newToken = data.data?.access_token || data.access_token;
        if (!newToken) throw new Error("No token in refresh response");

        await setToken(newToken);
        processQueue(null, newToken);

        originalRequest.headers.Authorization = `Bearer ${newToken}`;
        return api(originalRequest);
      } catch (refreshError) {
        processQueue(refreshError, null);
        await removeToken();
        onUnauthorized?.();
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    // ═══════════════════════════════════════
    // CASE 2: Network error
    // ═══════════════════════════════════════
    if (!error.response && !originalRequest._retry) {
      const isOnline = navigator.onLine;
      toast.error(isOnline ? "Server tidak bisa diakses" : "Kamu sedang offline", { duration: 3000 });
    }

    return Promise.reject(error);
  },
);

export default api;
