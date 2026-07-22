"use client";
import { useEffect, useRef, useState } from "react";
import * as d3 from "d3";
import { useDashboard } from "@/context/DashboardContext";
import { useDashboardTheme } from "@/hooks/useDashboardTheme";
import { Order } from "@/lib/types";

const VARIABLES: { key: keyof Order; label: string }[] = [
  { key: "sales_revenue", label: "Revenue (RM)" },
  { key: "ad_spend_myr", label: "Ad Spend (RM)" },
  { key: "customer_rating", label: "Rating" },
  { key: "delivery_time_days", label: "Delivery Days" },
  { key: "order_quantity", label: "Quantity" },
  { key: "inventory_level_pct", label: "Inventory %" },
];

/* Elderly replacement for the scatter plot matrix: one large scatter at a
   time, with two dropdowns to pick which pair of variables to compare. */
export function ElderlyScatterSingle() {
  const { filteredData, loading } = useDashboard();
  const theme = useDashboardTheme();
  const ref = useRef<SVGSVGElement>(null);
  const [xKey, setXKey] = useState<keyof Order>("ad_spend_myr");
  const [yKey, setYKey] = useState<keyof Order>("sales_revenue");
  const [activePoint, setActivePoint] = useState<Order | null>(null);
  const hasData = filteredData.length > 0;

  useEffect(() => {
    if (!ref.current || !hasData) return;

    const svg = d3.select(ref.current);
    svg.selectAll("*").remove();

    const sampleSize = 400;
    const sampledData =
      filteredData.length > sampleSize
        ? d3.shuffle([...filteredData]).slice(0, sampleSize)
        : filteredData;

    const isDark = theme === "dark";
    const axisColor = isDark ? "#A9CBDD" : "#38607A";
    const dotColor = isDark ? "rgba(107, 157, 177, 0.55)" : "rgba(11, 42, 74, 0.45)";

    const width = 720;
    const height = 440;
    const margin = { top: 20, right: 24, bottom: 56, left: 76 };

    svg.attr("viewBox", `0 0 ${width} ${height}`);

    const xLabel = VARIABLES.find((v) => v.key === xKey)!.label;
    const yLabel = VARIABLES.find((v) => v.key === yKey)!.label;

    const x = d3
      .scaleLinear()
      .domain(d3.extent(sampledData, (d) => d[xKey] as number) as [number, number])
      .nice()
      .range([margin.left, width - margin.right]);
    const y = d3
      .scaleLinear()
      .domain(d3.extent(sampledData, (d) => d[yKey] as number) as [number, number])
      .nice()
      .range([height - margin.bottom, margin.top]);

    svg
      .append("g")
      .attr("transform", `translate(0,${height - margin.bottom})`)
      .call(d3.axisBottom(x).ticks(6))
      .call((g) => g.selectAll("text").style("font-size", "14px").style("fill", axisColor))
      .call((g) => g.selectAll("line, path").style("stroke", axisColor));
    svg
      .append("g")
      .attr("transform", `translate(${margin.left},0)`)
      .call(d3.axisLeft(y).ticks(6))
      .call((g) => g.selectAll("text").style("font-size", "14px").style("fill", axisColor))
      .call((g) => g.selectAll("line, path").style("stroke", axisColor));

    svg
      .append("text")
      .attr("x", (margin.left + width - margin.right) / 2)
      .attr("y", height - 12)
      .attr("text-anchor", "middle")
      .style("font-size", "15px")
      .style("font-weight", "600")
      .style("fill", axisColor)
      .text(xLabel);
    svg
      .append("text")
      .attr("transform", "rotate(-90)")
      .attr("x", -(margin.top + height - margin.bottom) / 2)
      .attr("y", 20)
      .attr("text-anchor", "middle")
      .style("font-size", "15px")
      .style("font-weight", "600")
      .style("fill", axisColor)
      .text(yLabel);

    svg
      .selectAll("circle")
      .data(sampledData)
      .enter()
      .append("circle")
      .attr("cx", (d) => x(d[xKey] as number))
      .attr("cy", (d) => y(d[yKey] as number))
      .attr("r", 6)
      .attr("fill", dotColor)
      .attr("stroke", isDark ? "#080E1A" : "#FAFBFC")
      .attr("stroke-width", 1)
      .attr("tabindex", "0")
      .style("cursor", "pointer")
      .style("outline", "none") // We handle focus visually with the circle itself
      .on("click", function (event, d) {
        svg.selectAll("circle").attr("r", 6).attr("fill", dotColor);
        d3.select(this).attr("r", 10).attr("fill", isDark ? "#E48585" : "#D96C6C");
        setActivePoint(d as Order);
      })
      .on("focus", function (event, d) {
        svg.selectAll("circle").attr("r", 6).attr("fill", dotColor);
        d3.select(this).attr("r", 10).attr("fill", isDark ? "#E48585" : "#D96C6C");
        setActivePoint(d as Order);
      })
      .on("keydown", function (event, d) {
        if (event.key === "Enter" || event.key === " ") {
          event.preventDefault();
          svg.selectAll("circle").attr("r", 6).attr("fill", dotColor);
          d3.select(this).attr("r", 10).attr("fill", isDark ? "#E48585" : "#D96C6C");
          setActivePoint(d as Order);
        }
      });

    return () => {
      // Cleanup if needed
    };
  }, [filteredData, hasData, theme, xKey, yKey]);

  const selectClass =
    "min-h-[44px] rounded-[2px] border border-[var(--border-strong)] bg-[var(--surface-strong)] px-3 py-2 text-base outline-none transition focus:ring-2";

  return (
    <div className="dashboard-card chart-fig relative rounded-[var(--section-radius)] p-5">
      <div className="mb-4 flex flex-wrap items-end justify-between gap-4">
        <div>
          <h3 className="text-lg font-bold">Compare Two Measures</h3>
          <p className="text-sm" style={{ color: 'var(--secondary, #5D8FA3)' }}>
            One large plot at a time — pick the pair to compare below.
          </p>
        </div>
        <div className="flex flex-wrap items-end gap-3">
          <label className="flex flex-col gap-1 text-[11px] font-semibold uppercase tracking-[0.15em]" style={{ color: 'var(--secondary, #5D8FA3)' }}>
            Across (X)
            <select value={xKey as string} onChange={(e) => setXKey(e.target.value as keyof Order)} className={selectClass} style={{ color: 'var(--foreground)' }}>
              {VARIABLES.filter((v) => v.key !== yKey).map((v) => (
                <option key={v.key as string} value={v.key as string}>{v.label}</option>
              ))}
            </select>
          </label>
          <label className="flex flex-col gap-1 text-[11px] font-semibold uppercase tracking-[0.15em]" style={{ color: 'var(--secondary, #5D8FA3)' }}>
            Up (Y)
            <select value={yKey as string} onChange={(e) => setYKey(e.target.value as keyof Order)} className={selectClass} style={{ color: 'var(--foreground)' }}>
              {VARIABLES.filter((v) => v.key !== xKey).map((v) => (
                <option key={v.key as string} value={v.key as string}>{v.label}</option>
              ))}
            </select>
          </label>
        </div>
      </div>

      {loading ? (
        <div className="h-[400px] w-full rounded-[2px] skeleton-shimmer" />
      ) : hasData ? (
        <div className="flex flex-col">
          <svg ref={ref} className="w-full focus:outline-none" aria-label="Scatter plot. Use tab to explore points." />
          <div 
            className="mt-4 rounded-[4px] border border-[var(--border-strong)] bg-[var(--surface-muted)] p-4 min-h-[80px] flex items-center justify-center"
            aria-live="polite"
          >
            {activePoint ? (
              <div className="text-[17px] text-center w-full text-[var(--foreground)]">
                <span className="font-bold block mb-2 text-xl">{activePoint.product_category}</span>
                <span className="mx-2"><strong>{VARIABLES.find(v => v.key === xKey)?.label}:</strong> {activePoint[xKey]}</span>
                <span className="mx-2"><strong>{VARIABLES.find(v => v.key === yKey)?.label}:</strong> {activePoint[yKey]}</span>
              </div>
            ) : (
              <p className="text-[17px] font-medium text-[var(--secondary, #5D8FA3)]">
                Select or tab to a data point on the chart to view its details here.
              </p>
            )}
          </div>
        </div>
      ) : (
        <div className="grid min-h-[240px] place-items-center rounded-[2px] border border-dashed border-[var(--border-strong)] bg-[var(--surface-muted)] px-6 text-center">
          <div>
            <p className="text-base font-semibold" style={{ color: 'var(--foreground)' }}>No data for the current filters</p>
            <p className="mt-1 text-sm" style={{ color: 'var(--secondary, #5D8FA3)' }}>Clear one or more filters to bring this chart back.</p>
          </div>
        </div>
      )}
    </div>
  );
}
