"use client";
import { useDashboard } from "@/context/DashboardContext";
import { computeKPIs } from "@/lib/filters";

export function KPICards() {
  const { filteredData, mode } = useDashboard();
  const kpis = computeKPIs(filteredData);

  const cards = [
    { label: "Total Revenue", value: `RM ${kpis.totalRevenue.toLocaleString("en-MY", { maximumFractionDigits: 0 })}`, icon: "💰", color: "from-emerald-500 to-teal-600" },
    { label: "Total Orders", value: kpis.totalOrders.toLocaleString(), icon: "📦", color: "from-blue-500 to-indigo-600" },
    { label: "Avg Delivery", value: `${kpis.avgDelivery.toFixed(1)} days`, icon: "🚚", color: "from-amber-500 to-orange-600" },
    { label: "Stockout Rate", value: `${kpis.stockoutRate.toFixed(1)}%`, icon: "⚠️", color: "from-rose-500 to-red-600" },
    { label: "Return Rate", value: `${kpis.returnRate.toFixed(1)}%`, icon: "↩️", color: "from-purple-500 to-fuchsia-600" },
  ];

  const sizeClass = mode === "elderly" ? "text-ucd-2xl" : mode === "kiosk" ? "text-ucd-3xl" : "text-2xl";

  return (
    <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
      {cards.map((c) => (
        <div key={c.label} className={`bg-gradient-to-br ${c.color} rounded-xl p-4 text-white shadow-md`}>
          <div className="text-3xl mb-2">{c.icon}</div>
          <div className="text-xs uppercase tracking-wide opacity-80">{c.label}</div>
          <div className={`${sizeClass} font-bold mt-1`}>{c.value}</div>
        </div>
      ))}
    </div>
  );
}
