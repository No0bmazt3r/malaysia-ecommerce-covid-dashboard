"use client";
import type { LucideIcon } from "lucide-react";
import { childTipHandlers, useChildTooltip } from "./ChildTooltip";

export function ChildKPITile({
  icon: Icon,
  value,
  label,
  color,
  iconScale = 1,
  detail,
}: {
  icon: LucideIcon;
  value: string;
  label: string;
  color: string;
  iconScale?: number;
  detail?: string;
}) {
  const tip = useChildTooltip();
  // Icon size tracks the metric's relative magnitude (clamped so it always stays readable)
  const size = Math.round(56 * Math.min(Math.max(iconScale, 0.6), 1.4));

  const tipHandlers = detail ? childTipHandlers(tip, `kpi-${label}`, label, detail, color) : {};

  return (
    <div
      className="dashboard-card flex min-h-[190px] flex-col items-center justify-center gap-3 rounded-[var(--card-radius)] p-6 text-center focus:outline-none"
      {...tipHandlers}
    >
      <div
        className="grid place-items-center rounded-[2px]"
        style={{ background: "var(--surface-muted)", color, width: size + 32, height: size + 32 }}
      >
        <Icon aria-hidden="true" strokeWidth={2} style={{ width: size, height: size }} />
      </div>
      <div className="text-4xl font-bold tracking-tight" style={{ fontFamily: "var(--font-mono)", color: "var(--foreground)" }}>
        {value}
      </div>
      <div className="text-base font-semibold" style={{ color: "var(--secondary, #5D8FA3)" }}>
        {label}
      </div>
      {tip.node}
    </div>
  );
}
