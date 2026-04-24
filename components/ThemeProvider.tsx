"use client";

import { createContext, useContext, useSyncExternalStore, useCallback } from "react";

type Theme = "light" | "dark";

const ThemeCtx = createContext<{ theme: Theme; toggle: () => void }>({
  theme: "dark",
  toggle: () => {},
});

function getThemeSnapshot(): Theme {
  if (typeof window === "undefined") return "dark";
  return (localStorage.getItem("uangku_theme") as Theme) || "dark";
}

function getServerSnapshot(): Theme {
  return "dark";
}

function subscribeToTheme(callback: () => void) {
  window.addEventListener("storage", callback);
  return () => window.removeEventListener("storage", callback);
}

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const theme = useSyncExternalStore(subscribeToTheme, getThemeSnapshot, getServerSnapshot);

  const toggle = useCallback(() => {
    const next = theme === "dark" ? "light" : "dark";
    localStorage.setItem("uangku_theme", next);
    document.documentElement.classList.toggle("dark", next === "dark");
    // Force re-render
    window.dispatchEvent(new Event("storage"));
  }, [theme]);

  // Sync class on initial render
  if (typeof window !== "undefined") {
    document.documentElement.classList.toggle("dark", theme === "dark");
  }

  return <ThemeCtx.Provider value={{ theme, toggle }}>{children}</ThemeCtx.Provider>;
}

export function useTheme() {
  return useContext(ThemeCtx);
}
