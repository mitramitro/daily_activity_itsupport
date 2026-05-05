import axios from "axios";
import toast from "react-hot-toast";
import { getToken, removeToken } from "./storage";

// export const BASE_URL = "https://api-itdesk.digisib.net";
export const BASE_URL = "http://localhost:8000";

export const getImageUrl = (path) => {
  if (!path) return null;
  if (path.startsWith("http://") || path.startsWith("https://")) return path;
  const cleaned = path.replace(/^\/?(storage\/)?/, "");
  return `${BASE_URL}/storage/${cleaned}`;
};

export const downloadBlob = async (url) => {
  const token = await getToken();

  const response = await axios.get(url, {
    responseType: "blob",
    withCredentials: true, // ← tambahan
    headers: token ? { Authorization: `Bearer ${token}` } : {},
  });

  return response.data;
};

let isOfflineToastShown = false;
let onUnauthorized = null;

export const setUnauthorizedHandler = (callback) => {
  onUnauthorized = callback;
};

const api = axios.create({
  baseURL: `${BASE_URL}/api`,
  timeout: 10000,
  withCredentials: true, // ← tambahan
});

api.interceptors.request.use(async (config) => {
  const token = await getToken();
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      await removeToken();
      onUnauthorized?.();
    }

    if (!error.response) {
      if (!isOfflineToastShown) {
        toast.error(navigator.onLine ? "Server tidak bisa diakses" : "Kamu sedang offline");
        isOfflineToastShown = true;
        setTimeout(() => (isOfflineToastShown = false), 5000);
      }
    }

    return Promise.reject(error);
  },
);

export default api;
