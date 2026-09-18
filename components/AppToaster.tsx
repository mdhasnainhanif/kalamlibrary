"use client";

import { Toaster } from "react-hot-toast";

export default function AppToaster() {
  return (
    <Toaster
      position="top-right"
      toastOptions={{
        duration: 2000,
        style: {
          background: "#061410",
          color: "#f3f4f6",
          border: "1px solid rgba(16, 185, 129, 0.15)",
          fontSize: "14px",
          fontFamily: "var(--font-sans), sans-serif",
        },
        success: {
          iconTheme: {
            primary: "#eab308",
            secondary: "#061410",
          },
        },
        error: {
          iconTheme: {
            primary: "#f43f5e",
            secondary: "#061410",
          },
        },
      }}
    />
  );
}
