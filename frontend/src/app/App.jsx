import { RouterProvider } from "react-router-dom";
import { router } from "./Router";
import { Toaster } from "react-hot-toast";
import { useEffect } from "react";
import { initApp } from "./init";

export default function App() {
  useEffect(() => {
    initApp();
  }, []);
  return (
    <>
      <Toaster position="top-right" />
      <RouterProvider router={router} />
    </>
  );
}
