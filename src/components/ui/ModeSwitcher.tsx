"use client";
import { useDashboard } from "@/context/DashboardContext";
import { UCMode } from "@/lib/types";

const modes: { id: UCMode; label: string; icon: string }[] = [
  { id: "analyst", label: "Analyst", icon: "📊" },
  { id: "elderly", label: "Executive", icon: "👔" },
  { id: "kiosk", label: "Kiosk", icon: "🖥️" },
];

export function ModeSwitcher() {
  const { mode, setMode } = useDashboard();
  return (
    <div className="flex gap-1 rounded-full border border-white/60 bg-white/70 p-1.5 shadow-sm backdrop-blur-xl dark:border-slate-800/70 dark:bg-slate-900/70">
      {modes.map((m) => (
        <button
          key={m.id}
          onClick={() => setMode(m.id)}
          className={`inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium transition-all duration-200 ${
            mode === m.id
              ? "bg-sky-600 text-white shadow-sm shadow-sky-500/30"
              : "text-slate-600 hover:bg-slate-100 hover:text-slate-950 dark:text-slate-300 dark:hover:bg-slate-800 dark:hover:text-white"
          }`}
        >
          <span>{m.icon}</span>
          {m.label}
        </button>
      ))}
    </div>
  );
}
