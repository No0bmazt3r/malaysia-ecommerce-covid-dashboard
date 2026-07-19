"use client";

import { useEffect, useState } from "react";
import type { UserMode } from "@/hooks/useUserMode";

const STORAGE_KEY = "dashboard-usermode";

const MODES: { value: UserMode; label: string }[] = [
  { value: "adult", label: "Standard" },
  { value: "elderly", label: "Large Text" },
  { value: "child", label: "Simple View" },
];

function applyUserMode(mode: UserMode) {
  const root = document.documentElement;
  root.dataset.usermode = mode;
  window.dispatchEvent(new Event("dashboard-usermode-change"));
}

export function UserModeToggle() {
  const [mode, setMode] = useState<UserMode>("adult");

  useEffect(() => {
    const stored = window.localStorage.getItem(STORAGE_KEY) as UserMode | null;
    const initialMode = stored === "elderly" || stored === "child" ? stored : "adult";
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMode(initialMode);
    applyUserMode(initialMode);
  }, []);

  const selectMode = (nextMode: UserMode) => {
    setMode(nextMode);
    window.localStorage.setItem(STORAGE_KEY, nextMode);
    applyUserMode(nextMode);
  };

  return (
    <div
      role="radiogroup"
      aria-label="Viewing mode"
      className="flex items-center rounded-[2px] border border-[var(--border-strong)] bg-[var(--surface-muted)] p-0.5"
    >
      {MODES.map((m) => {
        const active = mode === m.value;
        return (
          <button
            key={m.value}
            type="button"
            role="radio"
            aria-checked={active}
            onClick={() => selectMode(m.value)}
            className={`h-8 rounded-[2px] px-2.5 text-[10px] font-medium uppercase transition active:scale-95 ${
              active ? "bg-[var(--surface-strong)] shadow-sm" : "hover:opacity-80"
            }`}
            style={{ color: active ? "var(--foreground)" : "var(--secondary, #5D8FA3)" }}
          >
            {m.label}
          </button>
        );
      })}
    </div>
  );
}
