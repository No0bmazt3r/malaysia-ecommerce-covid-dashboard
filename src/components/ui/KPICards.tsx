"use client";
import { useDashboard } from "@/context/DashboardContext";
import { computeKPIs } from "@/lib/filters";

export function KPICards() {
  const { filteredData, mode } = useDashboard();
  const kpis = computeKPIs(filteredData);

  const cards = [
    {
      label: "Total Revenue",
      value: `RM ${kpis.totalRevenue.toLocaleString("en-MY", { maximumFractionDigits: 0 })}`,
      icon: "💰",
      gradient: "from-emerald-500 to-teal-500",
      barColor: "bg-emerald-500",
      note: `${filteredData.length.toLocaleString()} orders`,
    },
    {
      label: "Total Orders",
      value: kpis.totalOrders.toLocaleString(),
      icon: "📦",
      gradient: "from-blue-500 to-indigo-500",
      barColor: "bg-blue-500",
      note: "Filtered selection",
    },
    {
      label: "Avg Delivery",
      value: `${kpis.avgDelivery.toFixed(1)} days`,
      icon: "🚚",
      gradient: "from-amber-500 to-orange-500",
      barColor: "bg-amber-500",
      note: "Fulfillment speed",
    },
    {
      label: "Stockout Rate",
      value: `${kpis.stockoutRate.toFixed(1)}%`,
      icon: "⚠️",
      gradient: "from-rose-500 to-pink-500",
      barColor: "bg-rose-500",
      note: "Inventory risk",
    },
    {
      label: "Return Rate",
      value: `${kpis.returnRate.toFixed(1)}%`,
      icon: "↩️",
      gradient: "from-violet-500 to-purple-500",
      barColor: "bg-violet-500",
      note: "Quality signal",
    },
  ];

  const valueSize =
    mode === "elderly" ? "text-3xl" : mode === "early-childhood" ? "text-4xl" : "text-2xl";

  return (
    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-5">
      {cards.map((c, idx) => (
        <div
          key={c.label}
          className={`dashboard-card relative overflow-hidden rounded-[var(--card-radius)] p-5 ${
            mode === "early-childhood"
              ? "border-2 border-amber-300 bg-amber-50 dark:bg-amber-100"
              : ""
          }`}
          style={{ animationDelay: `${idx * 60}ms` }}
        >
          {/* Top accent bar */}
          <div className={`absolute inset-x-0 top-0 h-1 bg-gradient-to-r ${c.gradient}`} />

          {/* Icon + badge */}
          <div className="mb-4 flex items-center justify-between">
            <div
              className={`grid h-10 w-10 place-items-center rounded-xl text-xl ${
                mode === "early-childhood"
                  ? "bg-amber-200"
                  : "bg-slate-100 dark:bg-slate-800"
              }`}
            >
              {c.icon}
            </div>
            <span
              className={`inline-flex h-5 items-center rounded-md px-2 text-[10px] font-semibold uppercase tracking-[0.15em] ${
                mode === "early-childhood"
                  ? "bg-amber-200 text-amber-800"
                  : "bg-[var(--surface-muted)] text-slate-500 dark:text-slate-400"
              }`}
            >
              Live
            </span>
          </div>

          {/* Label */}
          <div
            className={`text-[11px] font-semibold uppercase tracking-[0.18em] ${
              mode === "early-childhood"
                ? "text-slate-700"
                : "text-slate-500 dark:text-slate-400"
            }`}
          >
            {c.label}
          </div>

          {/* Value */}
          <div
            className={`${valueSize} mt-1.5 font-bold tracking-tight ${
              mode === "early-childhood" ? "text-slate-950" : "text-slate-950 dark:text-white"
            }`}
            style={{ fontFamily: "var(--font-display)" }}
          >
            {c.value}
          </div>

          {/* Note */}
          <div
            className={`mt-2 text-xs ${
              mode === "early-childhood"
                ? "text-slate-600"
                : "text-slate-500 dark:text-slate-400"
            }`}
          >
            {c.note}
          </div>
        </div>
      ))}
    </div>
  );
}
