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
      accentColor: "#8DB596",
      note: `${filteredData.length.toLocaleString()} orders`,
    },
    {
      label: "Total Orders",
      value: kpis.totalOrders.toLocaleString(),
      icon: "📦",
      accentColor: "#5D8FA3",
      note: "Filtered selection",
    },
    {
      label: "Avg Delivery",
      value: `${kpis.avgDelivery.toFixed(1)} days`,
      icon: "🚚",
      accentColor: "#E4B363",
      note: "Fulfillment speed",
    },
    {
      label: "Stockout Rate",
      value: `${kpis.stockoutRate.toFixed(1)}%`,
      icon: "⚠️",
      accentColor: "#D96C6C",
      note: "Inventory risk",
    },
    {
      label: "Return Rate",
      value: `${kpis.returnRate.toFixed(1)}%`,
      icon: "↩️",
      accentColor: "#63B7B2",
      note: "Quality signal",
      status: kpis.returnRate < 5 ? "good" : "bad",
    },
    {
      label: "Avg Rating",
      value: `${kpis.avgRating.toFixed(2)}`,
      icon: "⭐",
      accentColor: "#E4B363",
      note: "Out of 5.0",
      status: kpis.avgRating >= 4 ? "good" : kpis.avgRating >= 3 ? "warn" : "bad",
    },
  ];

  const { mode } = useDashboard();

  if (mode === "kiosk") {
    return (
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        <div className="flex flex-col items-center justify-center rounded-[32px] p-8 text-center border-4 shadow-xl" style={{ background: 'rgba(141, 181, 150, 0.15)', borderColor: 'rgba(141, 181, 150, 0.4)' }}>
          <div className="text-4xl mb-4">💰</div>
          <div className="text-3xl font-black mb-2" style={{ color: 'var(--foreground)' }}>Revenue</div>
          <div className="text-5xl font-black" style={{ color: '#8DB596' }}>RM {kpis.totalRevenue.toLocaleString("en-MY", { maximumFractionDigits: 0 })}</div>
        </div>
        <div className="flex flex-col items-center justify-center rounded-[32px] p-8 text-center border-4 shadow-xl" style={{ background: 'rgba(93, 143, 163, 0.15)', borderColor: 'rgba(93, 143, 163, 0.4)' }}>
          <div className="text-4xl mb-4">📦</div>
          <div className="text-3xl font-black mb-2" style={{ color: 'var(--foreground)' }}>Deliveries</div>
          <div className="text-5xl font-black" style={{ color: '#5D8FA3' }}>{kpis.avgDelivery.toFixed(1)} Days</div>
        </div>
        <div className="flex flex-col items-center justify-center rounded-[32px] p-8 text-center border-4 shadow-xl" style={{ background: 'rgba(228, 179, 99, 0.15)', borderColor: 'rgba(228, 179, 99, 0.4)' }}>
          <div className="text-4xl mb-4">⭐</div>
          <div className="text-3xl font-black mb-2" style={{ color: 'var(--foreground)' }}>Rating</div>
          <div className="text-5xl font-black" style={{ color: '#E4B363' }}>{kpis.avgRating.toFixed(1)} / 5</div>
        </div>
      </div>
    );
  }

  if (mode === "elderly") {
    return (
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {cards.map((c) => (
          <div key={c.label} className="flex flex-col rounded-2xl bg-[var(--surface-strong)] border-4 p-6" style={{ borderColor: 'var(--foreground)', boxShadow: `8px 8px 0 0 var(--foreground)` }}>
            <div className="flex items-center gap-4 mb-4">
              <span className="text-4xl">{c.icon}</span>
              <span className="text-2xl font-bold uppercase tracking-wider" style={{ color: 'var(--foreground)' }}>{c.label}</span>
            </div>
            <div className="text-4xl font-black mb-2" style={{ color: 'var(--foreground)' }}>{c.value}</div>
            <div className="text-xl font-bold" style={{ color: 'var(--secondary, #5D8FA3)' }}>{c.note}</div>
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
          <div className="absolute inset-x-0 top-0 h-1" style={{ background: c.accentColor }} />

          {/* Icon + badge */}
          <div className="mb-4 flex items-center justify-between">
            <div className="grid h-10 w-10 place-items-center rounded-xl text-xl" style={{ background: 'var(--surface-muted)' }}>
              {c.icon}
            </div>
            <span className="inline-flex h-5 items-center rounded-md bg-[var(--surface-muted)] px-2 text-[10px] font-semibold uppercase tracking-[0.15em]" style={{ color: 'var(--accent)' }}>
              Live
            </span>
          </div>

          {/* Label */}
          <div className="text-[11px] font-semibold uppercase tracking-[0.18em]" style={{ color: 'var(--secondary, #5D8FA3)' }}>
            {c.label}
          </div>

          {/* Value */}
          <div
            className="mt-1.5 text-2xl font-bold tracking-tight"
            style={{ fontFamily: "var(--font-display)", color: 'var(--foreground)' }}
          >
            {c.value}
          </div>

          {/* Note */}
          <div className="mt-2 text-xs" style={{ color: 'var(--secondary, #5D8FA3)' }}>
            {c.note}
          </div>
        </div>
      ))}
    </div>
  );
}
