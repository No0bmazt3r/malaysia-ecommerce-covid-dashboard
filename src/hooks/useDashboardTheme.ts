"use client";

import { useEffect, useState } from "react";

export type DashboardTheme = "light" | "dark";

function readTheme(): DashboardTheme {
  if (typeof document === "undefined") return "light";
  return document.documentElement.dataset.theme === "dark" ? "dark" : "light";
}

export function useDashboardTheme() {
  const [theme, setTheme] = useState<DashboardTheme>(readTheme);

  useEffect(() => {
    const syncTheme = () => setTheme(readTheme());
    syncTheme();
    window.addEventListener("dashboard-theme-change", syncTheme);
    return () => window.removeEventListener("dashboard-theme-change", syncTheme);
  }, []);

  return theme;
}