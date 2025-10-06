"use client";

import { ThemeProvider } from "../context/ThemeContext";
import { ToastProvider } from "../contexts/ToastContext";

export default function ClientProviders({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ThemeProvider>
      <ToastProvider>
        {children}
      </ToastProvider>
    </ThemeProvider>
  );
}
