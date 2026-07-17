"use client";
import { useDashboard } from "@/context/DashboardContext";
import { computeKPIs } from "@/lib/filters";

export function KPICards() {
  const { filteredData } = useDashboard();
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
      status: kpis.returnRate < 5 ? "good" : "bad",
    },
    {
      label: "Avg Rating",
      value: `${kpis.avgRating.toFixed(2)}`,
      icon: "⭐",
      gradient: "from-yellow-400 to-amber-500",
      barColor: "bg-yellow-400",
      note: "Out of 5.0",
      status: kpis.avgRating >= 4 ? "good" : kpis.avgRating >= 3 ? "warn" : "bad",
    },
  ];

  const { mode } = useDashboard();

  if (mode === "kiosk") {
    return (
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        <div className="flex flex-col items-center justify-center rounded-[32px] bg-emerald-100 p-8 text-center border-4 border-emerald-300 shadow-xl">
          <div className="text-4xl mb-4">💰</div>
          <div className="text-3xl font-black text-emerald-900 mb-2">Revenue</div>
          <div className="text-5xl font-black text-emerald-700">RM {kpis.totalRevenue.toLocaleString("en-MY", { maximumFractionDigits: 0 })}</div>
        </div>
        <div className="flex flex-col items-center justify-center rounded-[32px] bg-blue-100 p-8 text-center border-4 border-blue-300 shadow-xl">
          <div className="text-4xl mb-4">📦</div>
          <div className="text-3xl font-black text-blue-900 mb-2">Deliveries</div>
          <div className="text-5xl font-black text-blue-700">{kpis.avgDelivery.toFixed(1)} Days</div>
        </div>
        <div className="flex flex-col items-center justify-center rounded-[32px] bg-amber-100 p-8 text-center border-4 border-amber-300 shadow-xl">
          <div className="text-4xl mb-4">⭐</div>
          <div className="text-3xl font-black text-amber-900 mb-2">Rating</div>
          <div className="text-5xl font-black text-amber-700">{kpis.avgRating.toFixed(1)} / 5</div>
        </div>
      </div>
    );
  }

  if (mode === "elderly") {
    return (
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {cards.map((c) => (
          <div key={c.label} className="flex flex-col rounded-2xl bg-white border-4 border-black p-6 shadow-[8px_8px_0_0_#000] dark:bg-slate-900 dark:border-white dark:shadow-[8px_8px_0_0_#fff]">
            <div className="flex items-center gap-4 mb-4">
              <span className="text-4xl">{c.icon}</span>
              <span className="text-2xl font-bold uppercase tracking-wider text-black dark:text-white">{c.label}</span>
            </div>
            <div className="text-4xl font-black text-black dark:text-white mb-2">{c.value}</div>
            <div className="text-xl font-bold text-slate-600 dark:text-slate-400">{c.note}</div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-6">
      {cards.map((c, idx) => (
        <div
          key={c.label}
          className="dashboard-card relative overflow-hidden rounded-[var(--card-radius)] p-5"
          style={{ animationDelay: `${idx * 60}ms` }}
        >
          {/* Top accent bar */}
          <div className={`absolute inset-x-0 top-0 h-1 bg-gradient-to-r ${c.gradient}`} />

          {/* Icon + badge */}
          <div className="mb-4 flex items-center justify-between">
            <div className="grid h-10 w-10 place-items-center rounded-xl bg-slate-100 text-xl dark:bg-slate-800">
              {c.icon}
            </div>
            <span className="inline-flex h-5 items-center rounded-md bg-[var(--surface-muted)] px-2 text-[10px] font-semibold uppercase tracking-[0.15em] text-slate-500 dark:text-slate-400">
              Live
            </span>
          </div>

          {/* Label */}
          <div className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-500 dark:text-slate-400">
            {c.label}
          </div>

          {/* Value */}
          <div
            className="mt-1.5 text-2xl font-bold tracking-tight text-slate-950 dark:text-white"
            style={{ fontFamily: "var(--font-display)" }}
          >
            {c.value}
          </div>

          {/* Note */}
          <div className="mt-2 text-xs text-slate-500 dark:text-slate-400">
            {c.note}
          </div>
        </div>
      ))}
    </div>
  );
}
