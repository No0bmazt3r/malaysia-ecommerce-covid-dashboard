"use client";
import { useDashboard } from "@/context/DashboardContext";
import { UCMode } from "@/lib/types";

const modes: { id: UCMode; label: string; icon: string }[] = [
  { id: "analyst", label: "Analyst", icon: "📊" },
  { id: "elderly", label: "Executive", icon: "👔" },
  { id: "kiosk", label: "Kiosk Mode", icon: "🏢" },
];

export function ModeSwitcher() {
  const { mode, setMode } = useDashboard();
  return (
    <div className="flex gap-0.5 rounded-[2px] bg-[var(--surface-muted)] p-1">
      {modes.map((m) => (
        <button
          key={m.id}
          onClick={() => setMode(m.id)}
          className={`inline-flex items-center gap-1.5 rounded-[2px] px-2.5 py-1.5 text-[13px] font-medium transition-all duration-200 ${
            mode === m.id
              ? m.id === "kiosk"
                ? "shadow-sm"
                : "text-white shadow-sm"
              : ""
          }`}
          style={
            mode === m.id
              ? m.id === "kiosk"
                ? { background: "#E4B363", color: "#0B2A4A" }
                : { background: "var(--accent)" }
              : { color: "var(--foreground)", opacity: 0.55 }
          }
          aria-label={`Switch to ${m.label} mode`}
        >
          <span className={m.id === "kiosk" ? "text-base" : "text-sm"}>{m.icon}</span>
          <span className="hidden sm:inline">{m.label}</span>
        </button>
      ))}
    </div>
  );
}
