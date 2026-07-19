"use client";
import { useMemo } from "react";
import { useDashboard } from "@/context/DashboardContext";
import { ChildScreen } from "./ChildScreen";
import { childTipHandlers, useChildTooltip } from "./ChildTooltip";

/* Top five product categories as one big horizontal bar chart. */
export function ChildProductsView() {
  const { rawData, loading } = useDashboard();
  const tip = useChildTooltip();

  const top = useMemo(() => {
    const totals = new Map<string, number>();
    for (const row of rawData) {
      totals.set(row.product_category, (totals.get(row.product_category) ?? 0) + row.sales_revenue);
    }
    return [...totals.entries()]
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([category, revenue]) => ({ category, revenue }));
  }, [rawData]);

  if (loading) {
    return (
      <ChildScreen title="What Did People Buy?" sentence="Checking the shelves…">
        <div className="h-[260px] w-full rounded-[2px] skeleton-shimmer" />
      </ChildScreen>
    );
  }
  if (top.length === 0) return null;

  const max = top[0].revenue;
  const exact = (v: number) => `RM ${v.toLocaleString("en-MY", { maximumFractionDigits: 0 })}`;

  return (
    <ChildScreen title="What Did People Buy?" sentence={`People bought ${top[0].category} the most!`}>
      <div className="mx-auto max-w-2xl space-y-4">
        {top.map((t, i) => (
          <div key={t.category}>
            <div className="mb-1 text-lg font-bold" style={{ color: "var(--foreground)" }}>
              {t.category}
            </div>
            <div
              className="h-9 w-full rounded-[2px] bg-[var(--surface-muted)] focus:outline-none"
              {...childTipHandlers(tip, `bar-${t.category}`, t.category, exact(t.revenue), "var(--viz-good, #0CA678)")}
            >
              <div
                className="h-full rounded-[2px]"
                style={{
                  width: `${Math.max((t.revenue / max) * 100, 6)}%`,
                  background: "var(--viz-good, #0CA678)",
                  opacity: i === 0 ? 1 : 0.55,
                }}
              />
            </div>
          </div>
        ))}
      </div>
      {tip.node}
    </ChildScreen>
  );
}
