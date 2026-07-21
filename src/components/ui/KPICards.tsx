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
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-6">
      {cards.map((c, idx) => {
        const Icon = c.icon;
        return (
          <div
            key={c.label}
            className="dashboard-card flex flex-col justify-between rounded-xl border border-[var(--border)] bg-[var(--surface)] p-4 shadow-sm"
            style={{ animationDelay: `${idx * 60}ms` }}
          >
            <div className="flex items-center justify-between">
              <div className="text-sm font-medium tracking-tight" style={{ color: 'var(--foreground)' }}>
                {c.label}
              </div>
              <Icon className="h-7 w-7" style={{ color: c.accentColor }} strokeWidth={2} />
            </div>
            
            <div className="mt-2">
              <div
                className="text-2xl font-bold tracking-tight truncate"
                style={{ fontFamily: "var(--font-display)", color: 'var(--foreground)' }}
              >
                {c.value}
              </div>
              
              <div className="mt-1 text-xs truncate" style={{ color: 'var(--secondary, #64748b)' }}>
                {c.note}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
