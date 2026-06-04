import { Capacitor } from "@capacitor/core";
import { Preferences } from "@capacitor/preferences";

const isNative = Capacitor.isNativePlatform();

// 🔐 KEY (biar konsisten)
const TOKEN_KEY = "token";
const USER_KEY = "user";
const DEVICE_ID_KEY = "device_id";
const FINGERPRINT_TOKEN_KEY = "fingerprint_token";
const LAST_USER_EMAIL_KEY = "lastUserEmail";

// 🔐 SIMPAN TOKEN
export const setToken = async (token) => {
  try {
    if (!token) return;

    if (isNative) {
      await Preferences.set({
        key: TOKEN_KEY,
        value: token,
      });
    } else {
      localStorage.setItem(TOKEN_KEY, token);
    }
  } catch (err) {
    console.error("Set token error:", err);
  }
};

// 🔐 AMBIL TOKEN
export const getToken = async () => {
  try {
    if (isNative) {
      const { value } = await Preferences.get({ key: TOKEN_KEY });
      return value;
    } else {
      return localStorage.getItem(TOKEN_KEY);
    }
  } catch (err) {
    console.error("Get token error:", err);
    return null;
  }
};

// 🔐 HAPUS TOKEN
export const removeToken = async () => {
  try {
    if (isNative) {
      await Preferences.remove({ key: TOKEN_KEY });
    } else {
      localStorage.removeItem(TOKEN_KEY);
    }
  } catch (err) {
    console.error("Remove token error:", err);
  }
};

// ========== USER DATA ==========
export const setUser = async (user) => {
  try {
    const userStr = JSON.stringify(user);
    if (isNative) {
      await Preferences.set({ key: USER_KEY, value: userStr });
    } else {
      localStorage.setItem(USER_KEY, userStr);
    }
  } catch (err) {
    console.error("Set user error:", err);
  }
};

export const getUser = async () => {
  try {
    if (isNative) {
      const { value } = await Preferences.get({ key: USER_KEY });
      return value ? JSON.parse(value) : null;
    } else {
      const user = localStorage.getItem(USER_KEY);
      return user ? JSON.parse(user) : null;
    }
  } catch (err) {
    console.error("Get user error:", err);
    return null;
  }
};

// ========== FINGERPRINT DATA ==========
export const setDeviceId = async (deviceId) => {
  try {
    if (isNative) {
      await Preferences.set({ key: DEVICE_ID_KEY, value: deviceId });
    } else {
      localStorage.setItem(DEVICE_ID_KEY, deviceId);
    }
  } catch (err) {
    console.error("Set deviceId error:", err);
  }
};

export const getDeviceId = async () => {
  try {
    if (isNative) {
      const { value } = await Preferences.get({ key: DEVICE_ID_KEY });
      return value;
    } else {
      return localStorage.getItem(DEVICE_ID_KEY);
    }
  } catch (err) {
    console.error("Get deviceId error:", err);
    return null;
  }
};

export const setFingerprintToken = async (token) => {
  try {
    if (isNative) {
      await Preferences.set({ key: FINGERPRINT_TOKEN_KEY, value: token });
    } else {
      localStorage.setItem(FINGERPRINT_TOKEN_KEY, token);
    }
  } catch (err) {
    console.error("Set fingerprint token error:", err);
  }
};

export const getFingerprintToken = async () => {
  try {
    if (isNative) {
      const { value } = await Preferences.get({ key: FINGERPRINT_TOKEN_KEY });
      return value;
    } else {
      return localStorage.getItem(FINGERPRINT_TOKEN_KEY);
    }
  } catch (err) {
    console.error("Get fingerprint token error:", err);
    return null;
  }
};

export const setLastUserEmail = async (email) => {
  try {
    if (isNative) {
      await Preferences.set({ key: LAST_USER_EMAIL_KEY, value: email });
    } else {
      localStorage.setItem(LAST_USER_EMAIL_KEY, email);
    }
  } catch (err) {
    console.error("Set lastUserEmail error:", err);
  }
};

export const getLastUserEmail = async () => {
  try {
    if (isNative) {
      const { value } = await Preferences.get({ key: LAST_USER_EMAIL_KEY });
      return value;
    } else {
      return localStorage.getItem(LAST_USER_EMAIL_KEY);
    }
  } catch (err) {
    console.error("Get lastUserEmail error:", err);
    return null;
  }
};

// 🔐 HAPUS SEMUA DATA (logout)
export const clearAllData = async () => {
  try {
    const keys = [TOKEN_KEY, USER_KEY, DEVICE_ID_KEY, FINGERPRINT_TOKEN_KEY, LAST_USER_EMAIL_KEY];

    if (isNative) {
      for (const key of keys) {
        await Preferences.remove({ key });
      }
    } else {
      keys.forEach((key) => localStorage.removeItem(key));
    }
  } catch (err) {
    console.error("Clear all data error:", err);
  }
};

// 🔐 HAPUS DATA FINGERPRINT SAJA (disable fingerprint)
export const clearFingerprintData = async () => {
  try {
    if (isNative) {
      await Preferences.remove({ key: DEVICE_ID_KEY });
      await Preferences.remove({ key: FINGERPRINT_TOKEN_KEY });
    } else {
      localStorage.removeItem(DEVICE_ID_KEY);
      localStorage.removeItem(FINGERPRINT_TOKEN_KEY);
    }
  } catch (err) {
    console.error("Clear fingerprint data error:", err);
  }
};
