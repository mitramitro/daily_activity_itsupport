import { Capacitor } from "@capacitor/core";

const isNative = Capacitor.isNativePlatform();

const getSecureStorage = async () => {
  if (!isNative) return null;

  try {
    const mod = await import(/* @vite-ignore */ "capacitor-secure-storage-plugin");
    return mod?.SecureStoragePlugin || null;
  } catch {
    return null;
  }
};

export const setToken = async (token) => {
  try {
    if (isNative) {
      const SecureStorage = await getSecureStorage();
      if (SecureStorage) {
        await SecureStorage.set({ key: "token", value: token });
      }
    } else {
      localStorage.setItem("token", token);
    }
  } catch {}
};

export const getToken = async () => {
  try {
    if (isNative) {
      const SecureStorage = await getSecureStorage();
      if (SecureStorage) {
        const result = await SecureStorage.get({ key: "token" });
        return result?.value ?? null;
      }
      return null;
    } else {
      return localStorage.getItem("token");
    }
  } catch {
    return null;
  }
};

export const removeToken = async () => {
  try {
    if (isNative) {
      const SecureStorage = await getSecureStorage();
      if (SecureStorage) {
        await SecureStorage.remove({ key: "token" });
      }
    } else {
      localStorage.removeItem("token");
    }
  } catch {}
};
