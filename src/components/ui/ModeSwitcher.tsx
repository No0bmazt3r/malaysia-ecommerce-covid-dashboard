"use client";
import { useDashboard } from "@/context/DashboardContext";
import { UCMode } from "@/lib/types";

const modes: { id: UCMode; label: string; icon: string }[] = [
  { id: "analyst", label: "Analyst", icon: "📊" },
  { id: "elderly", label: "Executive", icon: "👔" },
  { id: "early-childhood", label: "Kid-friendly", icon: "🧸" },
];

export function ModeSwitcher() {
  const { mode, setMode } = useDashboard();
  return (
    <div className="flex gap-0.5 rounded-xl bg-[var(--surface-muted)] p-1">
      {modes.map((m) => (
        <button
          key={m.id}
          onClick={() => setMode(m.id)}
          className={`inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-[13px] font-medium transition-all duration-200 ${
            mode === m.id
              ? m.id === "early-childhood"
                ? "bg-amber-400 text-slate-950 shadow-sm"
                : "bg-[var(--accent)] text-white shadow-sm"
              : "text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-200"
          }`}
          aria-label={`Switch to ${m.label} mode`}
        >
          <span className={m.id === "early-childhood" ? "text-base" : "text-sm"}>{m.icon}</span>
          <span className="hidden sm:inline">{m.label}</span>
        </button>
      ))}
    </div>
  );
}
