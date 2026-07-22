"use client";
import { useEffect, useRef, useState } from "react";
import * as d3 from "d3";
import { createD3Tooltip, positionTooltip } from "@/lib/d3-utils";
import { useDashboard } from "@/context/DashboardContext";
import { useDashboardTheme } from "@/hooks/useDashboardTheme";

// Cap the points drawn per cell: 30 cells × every row would mean 100k+ DOM
// nodes and a frozen tab. At 2.5px dots a sample is visually identical.
const MAX_POINTS = 250;

export function ScatterMatrix() {
  const { filteredData, loading } = useDashboard();
  const theme = useDashboardTheme();
  const ref = useRef<SVGSVGElement>(null);
  const [deferred, setDeferred] = useState(false);

  const hasData = filteredData.length > 0;
  const isSampled = filteredData.length > MAX_POINTS;

  // Let the tab switch paint (skeleton first) before the heavy SVG build.
  useEffect(() => {
    const t = setTimeout(() => setDeferred(true), 50);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    if (!ref.current || !hasData || !deferred) return;

    const step = Math.ceil(filteredData.length / MAX_POINTS);
    const plotData = step > 1 ? filteredData.filter((_, i) => i % step === 0) : filteredData;

    const svg = d3.select(ref.current);
    svg.selectAll("*").remove();

    const isDark = theme === "dark";
    const borderColor = isDark ? "#1E2E3E" : "#E8ECF0";
    const labelColor = isDark ? "#CBD5E1" : "#475569";

    const vars: { key: keyof (typeof filteredData)[0]; label: string }[] = [
      { key: "sales_revenue", label: "Revenue" },
      { key: "ad_spend_myr", label: "Ad Spend" },
      { key: "delivery_time_days", label: "Delivery" },
      { key: "customer_rating", label: "Rating" },
      { key: "unit_price", label: "Price" },
      { key: "discount_pct", label: "Discount" },
    ];

    const size = 130;
    const padding = 12;
    const n = vars.length;
    const margin = { top: 20, right: 140, bottom: 40, left: 50 };
    const totalW = size * n + margin.left + margin.right;
    const totalH = size * n + margin.top + margin.bottom;

    svg.attr("viewBox", `0 0 ${totalW} ${totalH}`);
    const gMain = svg.append("g").attr("transform", `translate(${margin.left},${margin.top})`);

    const scales = vars.map((v) => {
      const extent = d3.extent(filteredData, (d) => +d[v.key]) as [number, number];
      return d3.scaleLinear().domain(extent).nice().range([padding, size - padding]);
    });

    const phaseColor = d3
      .scaleOrdinal<string>()
      .domain(["Pre-MCO", "MCO", "CMCO", "RMCO"])
      .range(["#8DB596", "#D96C6C", "#E4B363", "#5D8FA3"]);

    // Tooltip
    const tooltip = createD3Tooltip(theme);

    for (let i = 0; i < n; i++) {
      for (let j = 0; j < n; j++) {
        const cell = gMain
          .append("g")
          .attr("transform", `translate(${j * size},${i * size})`);

        if (i === j) {
          // Diagonal: label
          cell
            .append("rect")
            .attr("width", size)
            .attr("height", size)
            .attr("fill", "none")
            .attr("stroke", "none");

          cell
            .append("text")
            .attr("x", size / 2)
            .attr("y", size / 2)
            .attr("text-anchor", "middle")
            .attr("dominant-baseline", "middle")
            .style("font-size", "14px")
            .style("font-weight", "600")
            .style("letter-spacing", "0.02em")
            .attr("fill", labelColor)
            .text(vars[i].label);
        } else {
          // Scatter cell
          cell
            .append("rect")
            .attr("width", size)
            .attr("height", size)
            .attr("fill", "none")
            .attr("stroke", isDark ? "rgba(255, 255, 255, 0.08)" : "rgba(0, 0, 0, 0.08)");

          const xVar = vars[j].key;
          const yVar = vars[i].key;
          const xScale = scales[j];
          const yScale = d3
            .scaleLinear()
            .domain(scales[i].domain())
            .range([size - padding, padding]);

          const dotsGroup = cell.append("g").attr("class", "dots");

          dotsGroup
            .selectAll("circle")
            .data(plotData)
            .enter()
            .append("circle")
            .attr("cx", (d) => xScale(+d[xVar]))
            .attr("cy", (d) => yScale(+d[yVar]))
            .attr("r", 2.5)
            .attr("fill", (d) => phaseColor(d.covid_phase))
            .attr("opacity", 0.7)
            .style("mix-blend-mode", isDark ? "screen" : "multiply")
            .style("cursor", "pointer");

          // Performance Fix: Use Event Delegation (3 listeners per cell instead of 3,000+)
          dotsGroup
            .on("mouseover", function (event) {
              const target = event.target as Element;
              if (target.tagName === "circle") {
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                const d = d3.select(target).datum() as any;
                d3.select(target).attr("r", 5).attr("opacity", 1);
                tooltip
                  .style("opacity", 1)
                  .html(
                    `<div style="font-weight:700;margin-bottom:3px;">${d.covid_phase}</div>` +
                    `<div>${vars[j].label}: <strong>${(+d[xVar]).toLocaleString("en-MY", { maximumFractionDigits: 2 })}</strong></div>` +
                    `<div>${vars[i].label}: <strong>${(+d[yVar]).toLocaleString("en-MY", { maximumFractionDigits: 2 })}</strong></div>`
                  );
                positionTooltip(tooltip, event);
              }
            })
            .on("mousemove", function (event) {
              const target = event.target as Element;
              if (target.tagName === "circle") {
                positionTooltip(tooltip, event);
              }
            })
            .on("mouseout", function (event) {
              const target = event.target as Element;
              if (target.tagName === "circle") {
                d3.select(target).attr("r", 2.5).attr("opacity", 0.7);
                tooltip.style("opacity", 0);
              }
            });
            
          // Add external axes
          if (i === n - 1) {
            const xAxis = d3.axisBottom(xScale).ticks(3).tickSize(4).tickPadding(4);
            const gx = cell.append("g").attr("transform", `translate(0,${size})`).call(xAxis);
            gx.selectAll("text").style("font-size", "9px").attr("fill", labelColor).style("opacity", 0.7);
            gx.selectAll("path, line").attr("stroke", isDark ? "rgba(255, 255, 255, 0.2)" : "rgba(0, 0, 0, 0.2)");
          }
          if (j === 0) {
            const yAxis = d3.axisLeft(yScale).ticks(3).tickSize(4).tickPadding(4);
            const gy = cell.append("g").call(yAxis);
            gy.selectAll("text").style("font-size", "9px").attr("fill", labelColor).style("opacity", 0.7);
            gy.selectAll("path, line").attr("stroke", isDark ? "rgba(255, 255, 255, 0.2)" : "rgba(0, 0, 0, 0.2)");
          }
        }
      }
    }

    // Legend
    const legend = gMain
      .append("g")
      .attr("transform", `translate(${n * size + 20}, ${size / 2})`);

    legend
      .append("rect")
      .attr("x", -10)
      .attr("y", -10)
      .attr("width", 120)
      .attr("height", 100)
      .attr("rx", 2)
      .attr("fill", isDark ? "rgba(15, 30, 46, 0.8)" : "rgba(255, 255, 255, 0.9)")
      .attr("stroke", borderColor);

    ["Pre-MCO", "MCO", "CMCO", "RMCO"].forEach((p, i) => {
      legend
        .append("circle")
        .attr("cx", 4)
        .attr("cy", i * 22)
        .attr("r", 5)
        .attr("fill", phaseColor(p));
      legend
        .append("text")
        .attr("x", 16)
        .attr("y", i * 22 + 4)
        .style("font-size", "11px")
        .style("font-weight", "500")
        .attr("fill", labelColor)
        .text(p);
    });

    return () => {
      tooltip.remove();
    };
  }, [filteredData, hasData, theme, deferred]);

  return (
    <div className="dashboard-card chart-fig overflow-hidden rounded-[var(--section-radius)] p-5">
      <div className="mb-4 flex items-end justify-between gap-4">
        <div>
          <h3
            className="text-lg font-bold tracking-tight"
            style={{ fontFamily: "var(--font-display)", color: 'var(--foreground)' }}
          >
            Scatter Plot Matrix
          </h3>
          <p className="mt-0.5 text-xs" style={{ color: 'var(--secondary, #5D8FA3)' }}>
            Explore relationships across ad spend, delivery, revenue, and rating.
          </p>
        </div>
      </div>
      <div className="mb-3 flex items-center justify-between gap-4">
        <p className="text-[11px]" style={{ color: 'var(--secondary, #5D8FA3)' }}>
          Reveals ad_spend ↔ revenue (r≈0.66) and delivery_time ↔ rating (r≈−0.75).
        </p>
        {isSampled && (
          <div className="inline-flex items-center gap-1.5 rounded-[2px] border border-[var(--warning)] bg-[rgba(228,179,99,0.1)] px-2 py-1 text-[10px] font-semibold uppercase tracking-[0.1em] text-[var(--warning)]">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>
            Data Quality: Sampled ({MAX_POINTS}/cell)
          </div>
        )}
      </div>
      {loading || !deferred ? (
        <div className="mx-auto h-[600px] w-full rounded-[2px] skeleton-shimmer" />
      ) : hasData ? (
        <div className="overflow-x-auto rounded-[2px] bg-[var(--surface-strong)]">
          <svg ref={ref} className="w-full" preserveAspectRatio="xMidYMid meet" />
        </div>
      ) : (
        <div className="grid min-h-[280px] place-items-center rounded-[2px] border border-dashed border-[var(--border-strong)] bg-[var(--surface-muted)] px-6 text-center">
          <div>
            <p className="text-sm font-semibold" style={{ color: 'var(--foreground)' }}>
              No scatter points to plot
            </p>
            <p className="mt-1 text-xs" style={{ color: 'var(--secondary, #5D8FA3)' }}>
              Adjust the filters to restore the correlation matrix.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
