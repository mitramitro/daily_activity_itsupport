import axios from "axios";
import toast from "react-hot-toast";

let isOfflineToastShown = false; // ✅ TARUH DI SINI (global)

const api = axios.create({
  baseURL: `${BASE_URL}/api`,
  timeout: 10000,
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    // 🔐 401
    if (error.response?.status === 401) {
      localStorage.removeItem("token");
      window.location.href = "/login";
    }

    // 🌐 NETWORK ERROR (ANTI SPAM)
    if (!error.response) {
      if (!isOfflineToastShown) {
        toast.error("Server tidak bisa diakses");
        isOfflineToastShown = true;

        setTimeout(() => {
          isOfflineToastShown = false;
        }, 5000);
      }
    }

    return Promise.reject(error);
  },
);

export default api;
