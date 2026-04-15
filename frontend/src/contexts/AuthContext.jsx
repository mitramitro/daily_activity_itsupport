import { createContext, useContext, useEffect, useState } from "react";
import api, { setUnauthorizedHandler } from "../services/api";
import { setToken, getToken, removeToken } from "../services/storage";
import toast from "react-hot-toast";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // 🔥 LOGOUT SATU PINTU
  const handleLogout = async () => {
    await removeToken();
    setUser(null);
    setIsAuthenticated(false);
  };

  // 🔐 LOGIN
  const login = async (email, password) => {
    const response = await api.post("/auth/login", {
      email,
      password,
    });

    const token = response.data.data.access_token;

    await setToken(token);

    await fetchUser();
  };

  // 🚪 LOGOUT MANUAL
  const logout = async () => {
    try {
      await api.post("/auth/logout");
    } catch {}

    await handleLogout();
  };

  // 👤 FETCH USER
  const fetchUser = async () => {
    try {
      const response = await api.get("/auth/me");
      setUser(response.data.data);
      setIsAuthenticated(true);
    } catch (error) {
      if (error.response?.status === 401) {
        await handleLogout();
      }
    } finally {
      setLoading(false);
    }
  };

  // 🚀 INIT + GLOBAL 401 HANDLER
  useEffect(() => {
    const init = async () => {
      const token = await getToken();

      if (token) {
        await fetchUser();
      } else {
        setLoading(false);
      }
    };

    init();
    // 🔥 LISTENER DARI API
    setUnauthorizedHandler(() => {
      toast.error("Session habis, silakan login ulang");
      handleLogout();
    });
  }, []);

  return <AuthContext.Provider value={{ user, login, logout, loading, isAuthenticated }}>{children}</AuthContext.Provider>;
};

export const useAuth = () => useContext(AuthContext);
