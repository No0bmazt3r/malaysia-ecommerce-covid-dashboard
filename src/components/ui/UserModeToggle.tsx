"use client";

import { useEffect, useRef, useState } from "react";
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
  const groupRef = useRef<HTMLDivElement>(null);
  const [pillStyle, setPillStyle] = useState({ left: 0, width: 0, opacity: 0 });

  useEffect(() => {
    const stored = window.localStorage.getItem(STORAGE_KEY) as UserMode | null;
    const initialMode = stored === "elderly" || stored === "child" ? stored : "adult";
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMode(initialMode);
    applyUserMode(initialMode);
  }, []);

  // Slide the active pill under the selected segment (same pattern as Nav)
  useEffect(() => {
    function updatePill() {
      if (!groupRef.current) return;
      const activeEl = groupRef.current.querySelector('[aria-checked="true"]') as HTMLElement | null;
      if (activeEl) {
        setPillStyle({ left: activeEl.offsetLeft, width: activeEl.offsetWidth, opacity: 1 });
      }
    }

    updatePill();
    // Re-measure after fonts/layout settle
    const timeout = setTimeout(updatePill, 50);
    window.addEventListener("resize", updatePill);
    return () => {
      clearTimeout(timeout);
      window.removeEventListener("resize", updatePill);
    };
  }, [mode]);

  const selectMode = (nextMode: UserMode) => {
    setMode(nextMode);
    window.localStorage.setItem(STORAGE_KEY, nextMode);
    applyUserMode(nextMode);
  };

  return (
    <div
      ref={groupRef}
      role="radiogroup"
      aria-label="Viewing mode"
      className="relative flex items-center rounded-[2px] border border-[var(--border-strong)] bg-[var(--surface-muted)] p-0.5"
    >
      {/* Sliding pill background */}
      <div
        className="absolute inset-y-0.5 rounded-[2px] bg-[var(--surface-strong)] shadow-sm transition-all duration-300 ease-out"
        style={{ left: `${pillStyle.left}px`, width: `${pillStyle.width}px`, opacity: pillStyle.opacity }}
      />

      {MODES.map((m) => {
        const active = mode === m.value;
        return (
          <button
            key={m.value}
            type="button"
            role="radio"
            aria-checked={active}
            onClick={() => selectMode(m.value)}
            className="relative z-10 h-8 rounded-[2px] px-2.5 text-[10px] font-medium uppercase transition-colors duration-200 active:scale-95"
            style={{ color: active ? "var(--foreground)" : "var(--secondary, #5D8FA3)" }}
          >
            {m.label}
          </button>
        );
      })}
    </div>
  );
}
