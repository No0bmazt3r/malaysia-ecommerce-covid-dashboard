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
    <div className="flex gap-2 bg-white/80 backdrop-blur rounded-lg p-1 shadow-sm border">
      {modes.map((m) => (
        <button
          key={m.id}
          onClick={() => setMode(m.id)}
          className={`px-3 py-2 rounded-md text-sm font-medium transition-all ${
            mode === m.id
              ? "bg-blue-600 text-white shadow"
              : "text-slate-600 hover:bg-slate-100"
          }`}
        >
          <span className="mr-1">{m.icon}</span>
          {m.label}
        </button>
      ))}
    </div>
  );
}
