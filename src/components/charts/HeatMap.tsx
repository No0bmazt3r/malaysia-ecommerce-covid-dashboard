"use client";
import { useEffect, useRef } from "react";
import * as d3 from "d3";
import { useDashboard } from "@/context/DashboardContext";
import { useDashboardTheme } from "@/hooks/useDashboardTheme";

export function HeatMap() {
  const { filteredData, setFilters, filters, mode } = useDashboard();
  const theme = useDashboardTheme();
  const ref = useRef<SVGSVGElement>(null);

  const hasData = filteredData.length > 0;

  useEffect(() => {
    if (!ref.current || !hasData) return;

    const svg = d3.select(ref.current);
    svg.selectAll("*").remove();

    const isDark = theme === "dark";
    const axisColor = isDark ? "#cbd5e1" : "#475569";
    const gridColor = isDark ? "rgba(148, 163, 184, 0.16)" : "rgba(148, 163, 184, 0.2)";

    const margin = { top: 30, right: 30, bottom: 80, left: 120 };
    const width = 800 - margin.left - margin.right;
    const height = 400 - margin.top - margin.bottom;

    const g = svg
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
      .append("g")
      .attr("transform", `translate(${margin.left},${margin.top})`);

    const states = Array.from(new Set(filteredData.map((d) => d.state))).sort();
    const phases = ["Pre-MCO", "MCO", "CMCO", "RMCO"];

    const agg = d3.rollup(
      filteredData,
      (v) => d3.sum(v, (d) => d.sales_revenue),
      (d) => d.state,
      (d) => d.covid_phase
    );

    const data: { state: string; phase: string; value: number }[] = [];
    states.forEach((s) =>
      phases.forEach((p) =>
        data.push({
          state: s,
          phase: p,
          value: agg.get(s)?.get(p) ?? 0,
        })
      )
    );

    const x = d3.scaleBand().domain(phases).range([0, width]).padding(0.05);
    const y = d3.scaleBand().domain(states).range([0, height]).padding(0.05);
    const max = d3.max(data, (d) => d.value) ?? 1;
    
    // Color scale: yellow to red for revenue intensity
    const color = d3.scaleSequential(d3.interpolateYlOrRd).domain([0, max]);

    g.append("g")
      .attr("transform", `translate(0,${height})`)
      .call(d3.axisBottom(x))
      .selectAll("text")
      .attr("fill", axisColor)
      .style("font-size", mode === "elderly" ? "16px" : "12px");

    g.append("g")
      .call(d3.axisLeft(y))
      .selectAll("text")
      .attr("fill", axisColor)
      .style("font-size", mode === "elderly" ? "16px" : "12px");

    const legendWidth = 160;
    const legendHeight = 12;
    const legendGroup = g
      .append("g")
      .attr("transform", `translate(${Math.max(width - legendWidth - 10, 0)}, ${Math.max(height + 34, 0)})`);

    const defs = svg.append("defs");
    const gradientId = `heatmap-gradient-${isDark ? "dark" : "light"}`;
    const gradient = defs.append("linearGradient").attr("id", gradientId).attr("x1", "0%").attr("x2", "100%").attr("y1", "0%").attr("y2", "0%");
    gradient.append("stop").attr("offset", "0%").attr("stop-color", d3.interpolateYlOrRd(0));
    gradient.append("stop").attr("offset", "50%").attr("stop-color", d3.interpolateYlOrRd(0.5));
    gradient.append("stop").attr("offset", "100%").attr("stop-color", d3.interpolateYlOrRd(1));

    legendGroup
      .append("text")
      .attr("x", 0)
      .attr("y", -8)
      .attr("fill", axisColor)
      .style("font-size", mode === "elderly" ? "14px" : "11px")
      .style("font-weight", "600")
      .text("Revenue intensity");

    legendGroup
      .append("rect")
      .attr("width", legendWidth)
      .attr("height", legendHeight)
      .attr("rx", 999)
      .attr("fill", `url(#${gradientId})`)
      .attr("stroke", gridColor);

    legendGroup
      .append("text")
      .attr("x", 0)
      .attr("y", 28)
      .attr("fill", axisColor)
      .style("font-size", mode === "elderly" ? "13px" : "10px")
      .text("Low");

    legendGroup
      .append("text")
      .attr("x", legendWidth / 2 - 18)
      .attr("y", 28)
      .attr("fill", axisColor)
      .style("font-size", mode === "elderly" ? "13px" : "10px")
      .text("Mid");

    legendGroup
      .append("text")
      .attr("x", legendWidth - 24)
      .attr("y", 28)
      .attr("fill", axisColor)
      .style("font-size", mode === "elderly" ? "13px" : "10px")
      .text("High");

    const tooltip = d3
      .select("body")
      .append("div")
      .style("position", "absolute")
      .style("background", isDark ? "rgba(15, 23, 42, 0.95)" : "rgba(0,0,0,0.88)")
      .style("color", "white")
      .style("padding", "8px 12px")
      .style("border-radius", "12px")
      .style("border", `1px solid ${gridColor}`)
      .style("box-shadow", "0 16px 40px rgba(15, 23, 42, 0.24)")
      .style("font-size", mode === "elderly" ? "16px" : "12px")
      .style("pointer-events", "none")
      .style("opacity", 0);

    g.selectAll("rect")
      .data(data)
      .enter()
      .append("rect")
      .attr("x", (d) => x(d.phase) ?? 0)
      .attr("y", (d) => y(d.state) ?? 0)
      .attr("width", x.bandwidth())
      .attr("height", y.bandwidth())
      .attr("fill", (d) => color(d.value))
      .attr("stroke", isDark ? "rgba(15, 23, 42, 0.4)" : "rgba(255,255,255,0.7)")
      .style("cursor", "pointer")
      .on("mouseover", (event, d) => {
        tooltip
          .style("opacity", 1)
          .html(
            `<b>${d.state}</b> • ${d.phase}<br/>Revenue: RM ${d.value.toLocaleString("en-MY", { maximumFractionDigits: 0 })}`
          );
      })
      .on("mousemove", (event) => {
        tooltip
          .style("left", event.pageX + 10 + "px")
          .style("top", event.pageY - 28 + "px");
      })
      .on("mouseout", () => tooltip.style("opacity", 0))
      .on("click", (event, d) => {
        // Drill-down: State + Phase
        setFilters({
          ...filters,
          state: [d.state],
          covidPhase: [d.phase],
        });
      });

    // Cleanup tooltip on unmount
    return () => {
      tooltip.remove();
    };
  }, [filteredData, filters, hasData, setFilters, mode, theme]);

  return (
    <div className="dashboard-card rounded-[28px] p-5">
      <div className="mb-4 flex items-end justify-between gap-4">
        <div>
          <h3 className={`font-semibold tracking-tight text-slate-950 dark:text-white ${mode === "elderly" ? "text-2xl" : "text-xl"}`}>
            Revenue Heat Map: State × COVID Phase
          </h3>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
            Compare state-level revenue across phases and cross-filter the dashboard.
          </p>
        </div>
        <span className="rounded-full bg-amber-500/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-amber-700 dark:text-amber-200">
          Cross-filter
        </span>
      </div>
      <p className="mb-3 text-xs text-slate-500 dark:text-slate-400">
        Click any cell to cross-filter. Look for the Sabah + CMCO anomaly.
      </p>
      {hasData ? (
        <div className="overflow-x-auto rounded-2xl border border-slate-200 bg-white/60 p-2 dark:border-slate-800 dark:bg-slate-950/40">
          <svg ref={ref}></svg>
        </div>
      ) : (
        <div className="grid min-h-[280px] place-items-center rounded-2xl border border-dashed border-slate-300 bg-white/50 px-6 text-center dark:border-slate-700 dark:bg-slate-950/40">
          <div>
            <p className="text-base font-semibold text-slate-900 dark:text-white">No matching regional data</p>
            <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">Broaden the date range or clear the state and phase filters.</p>
          </div>
        </div>
      )}
    </div>
  );
}
