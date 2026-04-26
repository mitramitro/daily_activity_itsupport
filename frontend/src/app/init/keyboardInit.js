import { Capacitor } from "@capacitor/core";
import { Keyboard } from "@capacitor/keyboard";

let isInitialized = false;

export const initKeyboard = () => {
  if (!Capacitor.isNativePlatform()) return;
  if (isInitialized) return;

  isInitialized = true;

  console.log("[Keyboard] Init");

  // Helper function untuk scroll ke input
  const scrollToInput = (el) => {
    if (!el) return;

    setTimeout(() => {
      el.scrollIntoView({
        behavior: "smooth",
        block: "center",
      });
    }, 200);
  };

  // Keyboard muncul
  Keyboard.addListener("keyboardDidShow", () => {
    const activeElement = document.activeElement;
    const isFormElement = activeElement && ["INPUT", "TEXTAREA", "SELECT"].includes(activeElement.tagName);

    if (isFormElement) {
      scrollToInput(activeElement);
    }

    document.body.classList.add("keyboard-open");
  });

  // Keyboard hilang
  Keyboard.addListener("keyboardDidHide", () => {
    document.body.classList.remove("keyboard-open");
    window.scrollTo({ top: 0, behavior: "smooth" });
  });
};
