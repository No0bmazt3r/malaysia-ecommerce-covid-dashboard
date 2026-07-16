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
      accent: "from-emerald-400 via-teal-400 to-cyan-500",
      note: "Filtered revenue",
    },
    { label: "Total Orders", value: kpis.totalOrders.toLocaleString(), icon: "📦", accent: "from-blue-400 via-sky-500 to-indigo-600", note: "Current selection" },
    { label: "Avg Delivery", value: `${kpis.avgDelivery.toFixed(1)} days`, icon: "🚚", accent: "from-amber-400 via-orange-500 to-rose-500", note: "Fulfillment speed" },
    { label: "Stockout Rate", value: `${kpis.stockoutRate.toFixed(1)}%`, icon: "⚠️", accent: "from-rose-400 via-pink-500 to-fuchsia-600", note: "Inventory risk" },
    { label: "Return Rate", value: `${kpis.returnRate.toFixed(1)}%`, icon: "↩️", accent: "from-violet-400 via-purple-500 to-indigo-600", note: "Product quality signal" },
  ];

  const sizeClass = mode === "elderly" ? "text-ucd-2xl" : mode === "kiosk" ? "text-ucd-3xl" : "text-2xl";

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-5">
      {cards.map((c) => (
        <div key={c.label} className="dashboard-card relative overflow-hidden rounded-[24px] p-5 text-slate-950 transition-transform duration-200 hover:-translate-y-0.5 dark:text-white">
          <div className={`absolute inset-x-0 top-0 h-1.5 bg-gradient-to-r ${c.accent}`} />
          <div className="mb-5 flex items-center justify-between">
            <div className={`grid h-12 w-12 place-items-center rounded-2xl bg-slate-950/5 text-2xl dark:bg-white/10`}>
              {c.icon}
            </div>
            <span className="rounded-full border border-slate-200 bg-slate-50 px-2.5 py-1 text-[11px] font-semibold uppercase tracking-[0.2em] text-slate-500 dark:border-slate-700 dark:bg-slate-900/70 dark:text-slate-300">
              Live
            </span>
          </div>
          <div className="text-xs font-semibold uppercase tracking-[0.22em] text-slate-500 dark:text-slate-400">{c.label}</div>
          <div className={`${sizeClass} mt-2 font-semibold tracking-tight`}>{c.value}</div>
          <div className="mt-3 text-sm text-slate-500 dark:text-slate-400">{c.note}</div>
        </div>
      ))}
    </div>
  );
}
