"use client";

import { useEffect, useState } from "react";

export type UserMode = "adult" | "elderly" | "child";

function readUserMode(): UserMode {
  if (typeof document === "undefined") return "adult";
  const mode = document.documentElement.dataset.usermode;
  return mode === "elderly" || mode === "child" ? mode : "adult";
}

export function useUserMode() {
  const [userMode, setUserMode] = useState<UserMode>(readUserMode);

  useEffect(() => {
    const syncMode = () => setUserMode(readUserMode());
    syncMode();
    window.addEventListener("dashboard-usermode-change", syncMode);
    return () => window.removeEventListener("dashboard-usermode-change", syncMode);
  }, []);

  return userMode;
}
