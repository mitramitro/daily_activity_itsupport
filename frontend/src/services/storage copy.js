import { Capacitor } from "@capacitor/core";
import { Preferences } from "@capacitor/preferences";

const isNative = Capacitor.isNativePlatform();

// 🔐 KEY (biar konsisten)
const TOKEN_KEY = "token";

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
