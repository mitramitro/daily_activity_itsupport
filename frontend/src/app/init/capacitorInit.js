import { Capacitor } from "@capacitor/core";
import { StatusBar, Style } from "@capacitor/status-bar";

export const initCapacitor = async () => {
  if (!Capacitor.isNativePlatform()) {
    console.log("[Capacitor] Not in native platform, skipping init");
    return;
  }

  console.log("[Capacitor] Initializing for platform:", Capacitor.getPlatform());

  try {
    // ============================================
    // STATUS BAR CONFIGURATION
    // ============================================

    // OVERLAY = TRUE agar webview full screen
    // Safe area akan dihandle via CSS env()
    await StatusBar.setOverlaysWebView({ overlay: true });
    console.log("[StatusBar] Overlay set to true");

    // Set style status bar (Dark = teks gelap untuk background putih)
    await StatusBar.setStyle({
      style: Style.Dark,
    });
    console.log("[StatusBar] Style set to Dark");

    // Set background color status bar (opsional, untuk transisi yang mulus)
    await StatusBar.setBackgroundColor({
      color: "#ffffff",
    });
    console.log("[StatusBar] Background color set to #ffffff");

    // ============================================
    // OPTIONAL: HIDE STATUS BAR (Jika perlu full immersive)
    // ============================================
    // await StatusBar.hide(); // Uncomment if you want to hide status bar completely
  } catch (err) {
    console.error("[Capacitor Init Error]:", err);
  }
};
