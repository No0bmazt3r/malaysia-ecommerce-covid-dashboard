"use client";
import { useEffect, useRef } from "react";
import * as d3 from "d3";
import { useDashboard } from "@/context/DashboardContext";
import { useDashboardTheme } from "@/hooks/useDashboardTheme";

export function ScatterMatrix() {
  const { filteredData, mode } = useDashboard();
  const theme = useDashboardTheme();
  const ref = useRef<SVGSVGElement>(null);

  const hasData = filteredData.length > 0;

  useEffect(() => {
    if (!ref.current || !hasData) return;

    const svg = d3.select(ref.current);
    svg.selectAll("*").remove();

    const isDark = theme === "dark";
    const panelFill = isDark ? "rgba(15, 23, 42, 0.55)" : "#fafafa";
    const borderColor = isDark ? "rgba(148, 163, 184, 0.18)" : "#e5e7eb";
    const labelColor = isDark ? "#e2e8f0" : "#334155";

    const vars: { key: keyof (typeof filteredData)[0]; label: string }[] = [
      { key: "ad_spend_myr", label: "Ad Spend" },
      { key: "delivery_time_days", label: "Delivery Days" },
      { key: "sales_revenue", label: "Revenue" },
      { key: "customer_rating", label: "Rating" },
    ];

    const size = mode === "early-childhood" ? 200 : 180;
    const padding = mode === "early-childhood" ? 40 : 30;
    const n = vars.length;
    const total = size * n + padding * 2;

    svg.attr("width", total).attr("height", total);

    const scales = vars.map((v) => {
      const extent = d3.extent(filteredData, (d) => +d[v.key]) as [number, number];
      return d3.scaleLinear().domain(extent).nice().range([padding, size - padding]);
    });

    const phaseColor = d3
      .scaleOrdinal<string>()
      .domain(["Pre-MCO", "MCO", "CMCO", "RMCO"])
      .range(["#10b981", "#ef4444", "#f59e0b", "#3b82f6"]);

    for (let i = 0; i < n; i++) {
      for (let j = 0; j < n; j++) {
        const cell = svg
          .append("g")
          .attr("transform", `translate(${j * size},${i * size})`);

        cell
          .append("rect")
          .attr("width", size)
          .attr("height", size)
            .attr("fill", panelFill)
            .attr("stroke", borderColor);

        if (i === j) {
          cell
            .append("text")
            .attr("x", size / 2)
            .attr("y", size / 2)
            .attr("text-anchor", "middle")
            .attr("dominant-baseline", "middle")
            .style("font-size", mode === "early-childhood" ? "16px" : mode === "elderly" ? "14px" : "12px")
            .style("font-weight", mode === "early-childhood" ? "700" : "600")
            .attr("fill", labelColor)
            .text(vars[i].label);
        } else {
          const xVar = vars[j].key;
          const yVar = vars[i].key;
          const xScale = scales[j];
          const yScale = d3
            .scaleLinear()
            .domain(scales[i].domain())
            .range([size - padding, padding]);

          cell
            .selectAll("circle")
            .data(filteredData)
            .enter()
            .append("circle")
            .attr("cx", (d) => xScale(+d[xVar]))
            .attr("cy", (d) => yScale(+d[yVar]))
            .attr("r", mode === "early-childhood" ? 4 : mode === "elderly" ? 3 : 2)
            .attr("fill", (d) => phaseColor(d.covid_phase))
            .attr("opacity", 0.6);
        }
      }
    }

    // Legend
    const legend = svg.append("g").attr("transform", `translate(${total - 140}, 20)`);
    ["Pre-MCO", "MCO", "CMCO", "RMCO"].forEach((p, i) => {
      legend.append("circle").attr("cx", 0).attr("cy", i * 20).attr("r", 6).attr("fill", phaseColor(p));
      legend.append("text").attr("x", 12).attr("y", i * 20 + 4).style("font-size", "12px").attr("fill", labelColor).text(p);
    });
  }, [filteredData, hasData, mode, theme]);

  return (
    <div className="dashboard-card rounded-[28px] p-5">
      <div className="mb-4 flex items-end justify-between gap-4">
        <div>
          <h3 className={`font-semibold tracking-tight text-slate-950 dark:text-white ${mode === "early-childhood" ? "text-2xl" : mode === "elderly" ? "text-2xl" : "text-xl"}`}>
            Scatter Plot Matrix (Advanced Visualization)
          </h3>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">Explore relationships across ad spend, delivery, revenue, and rating.</p>
        </div>
        <span className="rounded-full bg-emerald-500/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-emerald-700 dark:text-emerald-200">
          Correlation
        </span>
      </div>
      <p className="mb-3 text-xs text-slate-500 dark:text-slate-400">
        Reveals ad_spend ↔ revenue (r≈0.66) and delivery_time ↔ rating (r≈-0.75).
      </p>
      {hasData ? (
        <div className="overflow-x-auto rounded-2xl border border-slate-200 bg-white/60 p-2 dark:border-slate-800 dark:bg-slate-950/40">
          <svg ref={ref}></svg>
        </div>
      ) : (
        <div className="grid min-h-[280px] place-items-center rounded-2xl border border-dashed border-slate-300 bg-white/50 px-6 text-center dark:border-slate-700 dark:bg-slate-950/40">
          <div>
            <p className="text-base font-semibold text-slate-900 dark:text-white">No scatter points to plot</p>
            <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">Adjust the filters to restore the correlation matrix.</p>
          </div>
        </div>
      )}
    </div>
  );
}
