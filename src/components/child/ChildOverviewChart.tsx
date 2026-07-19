"use client";
import { useMemo, useState } from "react";
import { useDashboard } from "@/context/DashboardContext";
import { useChildTooltip } from "./ChildTooltip";

const BAR_COLOR = "var(--viz-good, #0CA678)";

/* One simple bar chart: money we made each quarter. Single bright hue,
   a tooltip box with the exact amount on hover/focus, "Best!" marks the
   tallest bar. */
export function ChildOverviewChart() {
  const { rawData, loading } = useDashboard();
  const [hovered, setHovered] = useState<number | null>(null);
  const tip = useChildTooltip();

  const quarters = useMemo(() => {
    const totals = new Map<string, number>();
    for (const row of rawData) {
      const d = new Date(row.order_date);
      const key = `${d.getFullYear()} Q${Math.floor(d.getMonth() / 3) + 1}`;
      totals.set(key, (totals.get(key) ?? 0) + row.sales_revenue);
    }
    return [...totals.entries()]
      .sort((a, b) => a[0].localeCompare(b[0]))
      .map(([label, revenue]) => ({ label, revenue }));
  }, [rawData]);

  if (loading) return <div className="h-[300px] w-full rounded-[2px] skeleton-shimmer" />;
  if (quarters.length === 0) return null;

  const max = Math.max(...quarters.map((q) => q.revenue));
  const bestIndex = quarters.findIndex((q) => q.revenue === max);
  const chartH = 260;
  const barW = 72;
  const gap = 18;
  const width = quarters.length * (barW + gap) + gap;

  const exact = (v: number) => `RM ${v.toLocaleString("en-MY", { maximumFractionDigits: 0 })}`;

  return (
    <div className="overflow-x-auto">
      <svg
        viewBox={`0 0 ${width} ${chartH + 44}`}
        className="mx-auto w-full max-w-[760px]"
        role="img"
        aria-label={`Money made each quarter. The biggest was ${quarters[bestIndex].label} with ${exact(max)}.`}
      >
        {quarters.map((q, i) => {
          const h = Math.max((q.revenue / max) * chartH, 8);
          const x = gap + i * (barW + gap);
          const y = chartH - h;
          const isBest = i === bestIndex;
          const isHovered = hovered === i;
          return (
            <g
              key={q.label}
              tabIndex={0}
              aria-label={`${q.label}: ${exact(q.revenue)}`}
              onMouseEnter={(e) => {
                setHovered(i);
                tip.show(e, q.label, exact(q.revenue), BAR_COLOR);
              }}
              onMouseMove={(e) => tip.show(e, q.label, exact(q.revenue), BAR_COLOR)}
              onMouseLeave={() => {
                setHovered(null);
                tip.hide();
              }}
              onFocus={(e) => {
                setHovered(i);
                tip.showForElement(e.currentTarget, q.label, exact(q.revenue), BAR_COLOR);
              }}
              onBlur={() => {
                setHovered(null);
                tip.hide();
              }}
              style={{ cursor: "default", outline: "none" }}
            >
              {/* Full-height hit target so short bars are easy to hover */}
              <rect x={x} y={0} width={barW} height={chartH} fill="transparent" />
              <path
                d={`M${x},${chartH} L${x},${y + 4} Q${x},${y} ${x + 4},${y} L${x + barW - 4},${y} Q${x + barW},${y} ${x + barW},${y + 4} L${x + barW},${chartH} Z`}
                fill={BAR_COLOR}
                opacity={isBest || isHovered ? 1 : 0.55}
              />
              {isBest && (
                <text
                  x={x + barW / 2}
                  y={y - 10}
                  textAnchor="middle"
                  fontSize="16"
                  fontWeight="700"
                  fill="var(--foreground)"
                >
                  Best!
                </text>
              )}
              <text
                x={x + barW / 2}
                y={chartH + 26}
                textAnchor="middle"
                fontSize="14"
                fontWeight="600"
                fill="var(--secondary, #5D8FA3)"
              >
                {q.label}
              </text>
            </g>
          );
        })}
      </svg>
      {tip.node}
    </div>
  );
}
