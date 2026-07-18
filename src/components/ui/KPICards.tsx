"use client";
import { useDashboard } from "@/context/DashboardContext";
import { computeKPIs } from "@/lib/filters";
import { CircleDollarSign, Package, Truck, AlertTriangle, Undo2, Star } from "lucide-react";

export function KPICards() {
  const { filteredData, rawData } = useDashboard();
  const kpis = computeKPIs(filteredData);

  const cards = [
    {
      label: "Total Revenue",
      value: `RM ${kpis.totalRevenue.toLocaleString("en-MY", { maximumFractionDigits: 0 })}`,
      icon: CircleDollarSign,
      accentColor: "#8DB596",
      note: `${filteredData.length.toLocaleString()} orders`,
    },
    {
      label: "Total Orders",
      value: kpis.totalOrders.toLocaleString(),
      icon: Package,
      accentColor: "#5D8FA3",
      note:
        rawData.length > 0 && filteredData.length < rawData.length
          ? `${Math.round((filteredData.length / rawData.length) * 100)}% of all orders`
          : "All orders included",
    },
    {
      label: "Avg Delivery",
      value: `${kpis.avgDelivery.toFixed(1)} days`,
      icon: Truck,
      accentColor: "#E4B363",
      note: "Fulfillment speed",
    },
    {
      label: "Stockout Rate",
      value: `${kpis.stockoutRate.toFixed(1)}%`,
      icon: AlertTriangle,
      accentColor: "#D96C6C",
      note: "Inventory risk",
    },
    {
      label: "Return Rate",
      value: `${kpis.returnRate.toFixed(1)}%`,
      icon: Undo2,
      accentColor: "#63B7B2",
      note: "Quality signal",
      status: kpis.returnRate < 5 ? "good" : "bad",
    },
    {
      label: "Avg Rating",
      value: `${kpis.avgRating.toFixed(2)}`,
      icon: Star,
      accentColor: "#E4B363",
      note: "Out of 5.0",
      status: kpis.avgRating >= 4 ? "good" : kpis.avgRating >= 3 ? "warn" : "bad",
    },
  ];

  return (
    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-6">
      {cards.map((c, idx) => {
        const Icon = c.icon;
        return (
          <div
            key={c.label}
            className="dashboard-card relative overflow-hidden rounded-[20px] p-5 flex items-center gap-4"
            style={{ animationDelay: `${idx * 60}ms` }}
          >
            {/* Top accent bar */}
            <div className="absolute inset-x-0 top-0 h-1" style={{ background: c.accentColor }} />

            {/* Icon */}
            <div className="shrink-0 grid h-12 w-12 place-items-center rounded-xl" style={{ background: 'var(--surface-muted)', color: c.accentColor }}>
              <Icon className="h-6 w-6" strokeWidth={2.5} />
            </div>

            {/* Content */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between">
                <div className="text-[11px] font-semibold uppercase tracking-[0.18em] truncate" style={{ color: 'var(--secondary, #5D8FA3)' }}>
                  {c.label}
                </div>
                <span className="shrink-0 inline-flex h-4 items-center rounded bg-[var(--surface-muted)] px-1.5 text-[8px] font-semibold uppercase tracking-[0.15em]" style={{ color: 'var(--accent)' }}>
                  Live
                </span>
              </div>
              
              <div
                className="mt-1 text-2xl font-bold tracking-tight truncate"
                style={{ fontFamily: "var(--font-display)", color: 'var(--foreground)' }}
              >
                {c.value}
              </div>
              
              <div className="mt-1 text-xs truncate" style={{ color: 'var(--secondary, #5D8FA3)' }}>
                {c.note}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
