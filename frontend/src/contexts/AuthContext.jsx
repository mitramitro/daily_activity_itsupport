import { createContext, useContext, useEffect, useState, useCallback } from "react";
import api, { setUnauthorizedHandler } from "../services/api";
import { setToken, getToken, removeToken, setUser, getUser, setDeviceId, getDeviceId, setFingerprintToken, getFingerprintToken, setLastUserEmail, getLastUserEmail, clearAllData, clearFingerprintData } from "../services/storage";
import toast from "react-hot-toast";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUserState] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [fingerprintEnabled, setFingerprintEnabled] = useState(false);

  // 🔥 LOGOUT SATU PINTU - Bersihkan semua data
  const handleLogout = useCallback(async () => {
    await clearAllData();
    setUserState(null);
    setIsAuthenticated(false);
    setFingerprintEnabled(false);
  }, []);

  // 👤 FETCH USER & Fingerprint Status
  const fetchUser = useCallback(async () => {
    try {
      const response = await api.get("/auth/me");
      const userData = response.data.data;

      setUserState(userData);
      setIsAuthenticated(true);
      await setUser(userData);

      // Cek status fingerprint dari user data
      const hasFingerprint = userData.fingerprint_enabled || false;
      setFingerprintEnabled(hasFingerprint);

      // Jika user enable fingerprint, simpan email untuk login cepat
      if (hasFingerprint && userData.email) {
        await setLastUserEmail(userData.email);
      }

      return userData;
    } catch (error) {
      if (error.response?.status === 401) {
        await handleLogout();
      }
      throw error;
    } finally {
      setLoading(false);
    }
  }, [handleLogout]);

  // 🔐 LOGIN dengan Email/Password
  const login = useCallback(
    async (email, password) => {
      try {
        const response = await api.post("/auth/login", {
          email,
          password,
        });

        const token = response.data.data.access_token;
        await setToken(token);

        // Fetch user data setelah login sukses
        const userData = await fetchUser();

        // Simpan email untuk fingerprint di下次 login
        await setLastUserEmail(email);

        toast.success("Login berhasil!");
        return { success: true, user: userData };
      } catch (error) {
        console.error("Login error:", error);
        throw error;
      }
    },
    [fetchUser],
  );

  // 🔐 LOGIN dengan Fingerprint
  const loginWithFingerprint = useCallback(
    async (fingerprintToken, deviceId) => {
      try {
        const response = await api.post("/auth/login/fingerprint", {
          fingerprint_token: fingerprintToken,
          device_id: deviceId,
        });

        const token = response.data.access_token;
        await setToken(token);

        // Fetch user data
        const userData = response.data.user;
        if (userData) {
          setUserState(userData);
          setIsAuthenticated(true);
          await setUser(userData);
        } else {
          await fetchUser();
        }

        toast.success("Login dengan fingerprint berhasil");
        return { success: true, user: userData };
      } catch (error) {
        console.error("Fingerprint login error:", error);
        const errorMessage = error.response?.data?.error || "Login fingerprint gagal";
        toast.error(errorMessage);
        throw error;
      }
    },
    [fetchUser],
  );

  // 👆 Generate Device ID (jika belum ada)
  const generateDeviceId = useCallback(async () => {
    let deviceId = await getDeviceId();
    if (!deviceId) {
      deviceId = `${Date.now()}_${Math.random().toString(36)}_${navigator.userAgent}`;
      await setDeviceId(deviceId);
    }
    return deviceId;
  }, []);

  // 👆 Generate Fingerprint Token
  const generateFingerprintToken = useCallback(async () => {
    const deviceId = await generateDeviceId();
    const token = `${deviceId}_${Date.now()}_${Math.random().toString(36)}`;
    return token;
  }, [generateDeviceId]);

  // 👆 Enable Fingerprint
  const enableFingerprint = useCallback(async (password, fingerprintToken, deviceId) => {
    try {
      const response = await api.post("/fingerprint/enable", {
        password,
        fingerprint_token: fingerprintToken,
        device_id: deviceId,
      });

      if (response.data.fingerprint_enabled) {
        setFingerprintEnabled(true);

        // Update user data di state
        setUserState((prev) => ({ ...prev, fingerprint_enabled: true }));
        const currentUser = await getUser();
        if (currentUser) {
          await setUser({ ...currentUser, fingerprint_enabled: true });
        }

        // Simpan ke storage untuk login cepat
        await setFingerprintToken(fingerprintToken);
        await setDeviceId(deviceId);

        toast.success("Login dengan fingerprint berhasil diaktifkan");
      }

      return response.data;
    } catch (error) {
      console.error("Enable fingerprint error:", error);
      const errorMessage = error.response?.data?.error || "Gagal mengaktifkan fingerprint";
      toast.error(errorMessage);
      throw error;
    }
  }, []);

  // 👎 Disable Fingerprint
  const disableFingerprint = useCallback(async () => {
    try {
      const response = await api.post("/fingerprint/disable");

      if (!response.data.fingerprint_enabled) {
        setFingerprintEnabled(false);

        // Hapus data fingerprint dari storage
        await clearFingerprintData();

        // Update user data di state
        setUserState((prev) => ({ ...prev, fingerprint_enabled: false }));
        const currentUser = await getUser();
        if (currentUser) {
          await setUser({ ...currentUser, fingerprint_enabled: false });
        }

        toast.success("Login dengan fingerprint berhasil dinonaktifkan");
      }

      return response.data;
    } catch (error) {
      console.error("Disable fingerprint error:", error);
      const errorMessage = error.response?.data?.error || "Gagal menonaktifkan fingerprint";
      toast.error(errorMessage);
      throw error;
    }
  }, []);

  // 🚪 LOGOUT MANUAL
  const logout = useCallback(async () => {
    try {
      await api.post("/auth/logout");
    } catch (error) {
      console.error("Logout API error:", error);
    } finally {
      await handleLogout();
      toast.success("Berhasil logout");
    }
  }, [handleLogout]);

  // 🚀 INIT + GLOBAL 401 HANDLER
  useEffect(() => {
    const init = async () => {
      const token = await getToken();

      if (token) {
        try {
          await fetchUser();
        } catch (error) {
          console.error("Init fetch user error:", error);
          await handleLogout();
        }
      } else {
        setLoading(false);
      }
    };

    init();

    // 🔥 LISTENER DARI API untuk 401 Unauthorized
    setUnauthorizedHandler(() => {
      handleLogout();
    });
  }, [fetchUser, handleLogout]);

  const value = {
    user,
    login,
    loginWithFingerprint,
    logout,
    loading,
    isAuthenticated,
    fingerprintEnabled,
    enableFingerprint,
    disableFingerprint,
    generateDeviceId,
    generateFingerprintToken,
    refetchUser: fetchUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
};
