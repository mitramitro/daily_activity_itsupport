import axios from "axios";
import toast from "react-hot-toast";
import { getToken, removeToken } from "./storage";

export const BASE_URL = "http://localhost:8000";

export const getImageUrl = (path) => {
  return `${BASE_URL}/storage/${path}`;
};

let isOfflineToastShown = false;

// 🔥 GLOBAL HANDLER (INI KUNCI)
let onUnauthorized = null;

export const setUnauthorizedHandler = (callback) => {
  onUnauthorized = callback;
};

const api = axios.create({
  baseURL: `${BASE_URL}/api`,
  timeout: 10000,
});

// 🔐 AUTO TOKEN
api.interceptors.request.use(async (config) => {
  const token = await getToken();

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

// 🌐 ERROR HANDLER
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    // 🔐 TOKEN EXPIRED
    if (error.response?.status === 401) {
      await removeToken();
      // 🔥 TRIGGER LOGOUT DARI CONTEXT
      if (onUnauthorized) {
        onUnauthorized();
      }
    }

    // 🌐 NETWORK ERROR
    if (!error.response) {
      if (!isOfflineToastShown) {
        if (!navigator.onLine) {
          toast.error("Kamu sedang offline");
        } else {
          toast.error("Server tidak bisa diakses");
        }

        isOfflineToastShown = true;

        setTimeout(() => {
          isOfflineToastShown = false;
        }, 5000);
      }
    }

    return Promise.reject(error);
  },
);

// 🔥 DOWNLOAD HELPER (PENTING)
export const downloadFile = async (url) => {
  const response = await api.get(url, {
    responseType: "blob",
  });

  return response.data;
};

export default api;
