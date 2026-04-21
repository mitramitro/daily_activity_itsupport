import { initCapacitor } from "./capacitorInit";
import { initKeyboard } from "./keyboardInit";

/**
 * Global app initializer
 */
export const initApp = async () => {
  await initCapacitor();
  initKeyboard();
};
