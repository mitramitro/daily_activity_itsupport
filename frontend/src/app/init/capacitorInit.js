import { Capacitor } from "@capacitor/core";
import { StatusBar, Style } from "@capacitor/status-bar";

/**
 * Init native layer (StatusBar, dll)
 */
export const initCapacitor = async () => {
  if (!Capacitor.isNativePlatform()) {
    return;
  }

  try {
    // Status Bar
    await StatusBar.setOverlaysWebView({ overlay: false });

    await StatusBar.setStyle({
      style: Style.Dark, // teks gelap (biar cocok background putih)
    });

    await StatusBar.setBackgroundColor({
      color: "#ffffff",
    });
  } catch (err) {
    console.error("[Capacitor Init Error]:", err);
  }
};
