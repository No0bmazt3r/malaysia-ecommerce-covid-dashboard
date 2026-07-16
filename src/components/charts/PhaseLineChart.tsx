"use client";
import { useEffect, useRef } from "react";
import * as d3 from "d3";
import { useDashboard } from "@/context/DashboardContext";
import { useDashboardTheme } from "@/hooks/useDashboardTheme";

export function PhaseLineChart() {
  const { filteredData, mode } = useDashboard();
  const theme = useDashboardTheme();
  const ref = useRef<SVGSVGElement>(null);

  const hasData = filteredData.length > 0;

  useEffect(() => {
    if (!ref.current || !hasData) return;

    const svg = d3.select(ref.current);
    svg.selectAll("*").remove();

    const isDark = theme === "dark";
    const axisColor = isDark ? "#cbd5e1" : "#475569";
    const gridColor = isDark ? "rgba(148, 163, 184, 0.18)" : "rgba(148, 163, 184, 0.22)";

    const margin = { top: 20, right: 30, bottom: 60, left: 70 };
    const width = 800 - margin.left - margin.right;
    const height = 320 - margin.top - margin.bottom;

    const g = svg
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
      .append("g")
      .attr("transform", `translate(${margin.left},${margin.top})`);

    // Aggregate by month
    const byMonth = d3.rollups(
      filteredData,
      (v) => ({
        revenue: d3.sum(v, (d) => d.sales_revenue),
        avgDelivery: d3.mean(v, (d) => d.delivery_time_days) ?? 0,
      }),
      (d) => d.order_date.slice(0, 7) // "YYYY-MM"
    )
      .map(([k, v]) => ({ month: k, ...v }))
      .sort((a, b) => a.month.localeCompare(b.month));

    const x = d3
      .scalePoint()
      .domain(byMonth.map((d) => d.month))
      .range([0, width]);
    const y = d3
      .scaleLinear()
      .domain([0, d3.max(byMonth, (d) => d.revenue) ?? 0])
      .nice()
      .range([height, 0]);

    g.append("g")
      .attr("transform", `translate(0,${height})`)
      .call(d3.axisBottom(x).tickValues(byMonth.filter((_, i) => i % 3 === 0).map(d => d.month)))
      .selectAll("text")
      .attr("fill", axisColor)
      .attr("transform", "rotate(-45)")
      .style("text-anchor", "end")
      .style("font-size", mode === "elderly" ? "14px" : "11px");

    g.append("g")
      .call(d3.axisLeft(y).ticks(5))
      .call((selection) => {
        selection.selectAll("text").attr("fill", axisColor);
        selection.selectAll("path, line").attr("stroke", gridColor);
      });

    g.selectAll(".grid-line")
      .data(y.ticks(5))
      .enter()
      .append("line")
      .attr("class", "grid-line")
      .attr("x1", 0)
      .attr("x2", width)
      .attr("y1", (d) => y(d))
      .attr("y2", (d) => y(d))
      .attr("stroke", gridColor)
      .attr("stroke-dasharray", "2,6");

    const line = d3
      .line<(typeof byMonth)[0]>()
      .x((d) => x(d.month) ?? 0)
      .y((d) => y(d.revenue))
      .curve(d3.curveMonotoneX);

    g.append("path")
      .datum(byMonth)
      .attr("fill", "none")
      .attr("stroke", isDark ? "#7dd3fc" : "#2563eb")
      .attr("stroke-width", 3)
      .attr("d", line);

    g.selectAll("circle")
      .data(byMonth)
      .enter()
      .append("circle")
      .attr("cx", (d) => x(d.month) ?? 0)
      .attr("cy", (d) => y(d.revenue))
      .attr("r", mode === "elderly" ? 6 : 4)
        .attr("fill", isDark ? "#7dd3fc" : "#2563eb");
      }, [filteredData, hasData, mode, theme]);

  return (
    <div className="dashboard-card rounded-[28px] p-5">
      <div className="mb-4 flex items-end justify-between gap-4">
        <div>
          <h3 className={`font-semibold tracking-tight text-slate-950 dark:text-white ${mode === "elderly" ? "text-2xl" : "text-xl"}`}>
            Monthly Revenue Trend
          </h3>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">Revenue aggregated by month with phase-aware filtering.</p>
        </div>
        <span className="rounded-full bg-sky-500/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-sky-700 dark:text-sky-200">
          Revenue
        </span>
      </div>
      {hasData ? (
        <div className="overflow-x-auto rounded-2xl border border-slate-200 bg-white/60 p-2 dark:border-slate-800 dark:bg-slate-950/40">
          <svg ref={ref}></svg>
        </div>
      ) : (
        <div className="grid min-h-[240px] place-items-center rounded-2xl border border-dashed border-slate-300 bg-white/50 px-6 text-center dark:border-slate-700 dark:bg-slate-950/40">
          <div>
            <p className="text-base font-semibold text-slate-900 dark:text-white">No chart data for the current filters</p>
            <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">Clear one or more filters to bring the monthly revenue trend back.</p>
          </div>
        </div>
      )}
    </div>
  );
}
