import { Capacitor } from "@capacitor/core";
import { Keyboard } from "@capacitor/keyboard";

/**
 * Handle keyboard behavior (UX mobile)
 */
export const initKeyboard = () => {
  if (!Capacitor.isNativePlatform()) return;

  Keyboard.addListener("keyboardWillShow", () => {
    document.body.classList.add("keyboard-open");
  });

  Keyboard.addListener("keyboardWillHide", () => {
    document.body.classList.remove("keyboard-open");
  });
};
