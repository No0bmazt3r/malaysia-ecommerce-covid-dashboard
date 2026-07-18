"use client";
import { useDashboard } from "@/context/DashboardContext";
import { computeKPIs } from "@/lib/filters";

export function KPICards() {
  const { filteredData, rawData } = useDashboard();
  const kpis = computeKPIs(filteredData);

  const cards = [
    {
      label: "Total Revenue",
      value: `RM ${kpis.totalRevenue.toLocaleString("en-MY", { maximumFractionDigits: 0 })}`,
      accentColor: "#8DB596",
      note: `${filteredData.length.toLocaleString()} orders`,
    },
    {
      label: "Total Orders",
      value: kpis.totalOrders.toLocaleString(),
      accentColor: "#5D8FA3",
      note:
        rawData.length > 0 && filteredData.length < rawData.length
          ? `${Math.round((filteredData.length / rawData.length) * 100)}% of all orders`
          : "All orders included",
    },
    {
      label: "Avg Delivery",
      value: `${kpis.avgDelivery.toFixed(1)} days`,
      accentColor: "#E4B363",
      note: "Fulfillment speed",
    },
    {
      label: "Stockout Rate",
      value: `${kpis.stockoutRate.toFixed(1)}%`,
      accentColor: "#D96C6C",
      note: "Inventory risk",
    },
    {
      label: "Return Rate",
      value: `${kpis.returnRate.toFixed(1)}%`,
      accentColor: "#63B7B2",
      note: "Quality signal",
      status: kpis.returnRate < 5 ? "good" : "bad",
    },
    {
      label: "Avg Rating",
      value: `${kpis.avgRating.toFixed(2)}`,
      accentColor: "#E4B363",
      note: "Out of 5.0",
      status: kpis.avgRating >= 4 ? "good" : kpis.avgRating >= 3 ? "warn" : "bad",
    },
  ];

  const statusColor = { good: "var(--success)", warn: "var(--warning)", bad: "var(--critical)" } as const;

  const { mode } = useDashboard();

  if (mode === "kiosk") {
    return (
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        <div className="flex flex-col items-center justify-center rounded-[2px] p-8 text-center border-4" style={{ background: 'rgba(141, 181, 150, 0.15)', borderColor: 'rgba(141, 181, 150, 0.4)' }}>
          <div className="text-2xl font-bold mb-3 uppercase" style={{ color: 'var(--foreground)' }}>Revenue</div>
          <div className="text-5xl font-black" style={{ color: '#8DB596', fontFamily: 'var(--font-mono)' }}>RM {kpis.totalRevenue.toLocaleString("en-MY", { maximumFractionDigits: 0 })}</div>
        </div>
        <div className="flex flex-col items-center justify-center rounded-[2px] p-8 text-center border-4" style={{ background: 'rgba(93, 143, 163, 0.15)', borderColor: 'rgba(93, 143, 163, 0.4)' }}>
          <div className="text-2xl font-bold mb-3 uppercase" style={{ color: 'var(--foreground)' }}>Deliveries</div>
          <div className="text-5xl font-black" style={{ color: '#5D8FA3', fontFamily: 'var(--font-mono)' }}>{kpis.avgDelivery.toFixed(1)} Days</div>
        </div>
        <div className="flex flex-col items-center justify-center rounded-[2px] p-8 text-center border-4" style={{ background: 'rgba(228, 179, 99, 0.15)', borderColor: 'rgba(228, 179, 99, 0.4)' }}>
          <div className="text-2xl font-bold mb-3 uppercase" style={{ color: 'var(--foreground)' }}>Rating</div>
          <div className="text-5xl font-black" style={{ color: '#E4B363', fontFamily: 'var(--font-mono)' }}>{kpis.avgRating.toFixed(1)} / 5</div>
        </div>
      </div>
    );
  }

  if (mode === "elderly") {
    return (
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {cards.map((c) => (
          <div key={c.label} className="flex flex-col rounded-[2px] bg-[var(--surface-strong)] border-4 p-6" style={{ borderColor: 'var(--foreground)', boxShadow: `8px 8px 0 0 var(--foreground)` }}>
            <div className="mb-4">
              <span className="text-2xl font-bold uppercase" style={{ color: 'var(--foreground)' }}>{c.label}</span>
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
          className="dashboard-card rounded-[var(--card-radius)] p-4"
          style={{ animationDelay: `${idx * 60}ms`, borderLeft: `3px solid ${c.accentColor}` }}
        >
          {/* Label */}
          <div className="text-[10px] font-semibold uppercase" style={{ color: 'var(--secondary, #5D8FA3)' }}>
            {c.label}
          </div>

          {/* Value */}
          <div
            className="mt-2 text-xl font-semibold tracking-tight"
            style={{ fontFamily: "var(--font-mono)", color: 'var(--foreground)' }}
          >
            {c.value}
          </div>

          {/* Note + status */}
          <div className="mt-2 flex items-center gap-1.5 text-xs" style={{ color: 'var(--secondary, #5D8FA3)' }}>
            {c.status && (
              <span
                className="inline-block h-2 w-2"
                style={{ background: statusColor[c.status as keyof typeof statusColor] }}
                aria-label={`Status: ${c.status}`}
              />
            )}
            {c.note}
          </div>
        </div>
      ))}
    </div>
  );
}
