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
    const axisColor = isDark ? "#94a3b8" : "#64748b";
    const gridColor = isDark ? "rgba(148, 163, 184, 0.12)" : "rgba(148, 163, 184, 0.18)";
    const cellStroke = isDark ? "rgba(15, 23, 42, 0.5)" : "rgba(255, 255, 255, 0.8)";

    const margin = { top: 10, right: 24, bottom: 80, left: 110 };
    const width = 800 - margin.left - margin.right;
    const height = 380 - margin.top - margin.bottom;

    svg.attr("viewBox", `0 0 ${width + margin.left + margin.right} ${height + margin.top + margin.bottom}`);

    const g = svg
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
        data.push({ state: s, phase: p, value: agg.get(s)?.get(p) ?? 0 })
      )
    );

    const x = d3.scaleBand().domain(phases).range([0, width]).padding(0.06);
    const y = d3.scaleBand().domain(states).range([0, height]).padding(0.06);
    const max = d3.max(data, (d) => d.value) ?? 1;

    const color = d3.scaleSequential(d3.interpolateYlOrRd).domain([0, max]);

    // X axis (bottom)
    g.append("g")
      .attr("transform", `translate(0,${height})`)
      .call(d3.axisBottom(x))
      .call((sel) => {
        sel.select(".domain").attr("stroke", gridColor);
        sel.selectAll(".tick line").attr("stroke", gridColor);
        sel
          .selectAll("text")
          .attr("fill", axisColor)
          .style("font-size", mode === "elderly" ? "14px" : "11px")
          .style("font-weight", "500");
      });

    // Y axis (left)
    g.append("g")
      .call(d3.axisLeft(y))
      .call((sel) => {
        sel.select(".domain").attr("stroke", gridColor);
        sel.selectAll(".tick line").attr("stroke", gridColor);
        sel
          .selectAll("text")
          .attr("fill", axisColor)
          .style("font-size", mode === "elderly" ? "14px" : "11px");
      });

    // Legend
    const legendWidth = 150;
    const legendHeight = 10;
    const legendGroup = g
      .append("g")
      .attr("transform", `translate(${width - legendWidth}, ${height + 36})`);

    const defs = svg.append("defs");
    const gradientId = `hm-grad-${isDark ? "d" : "l"}`;
    const gradient = defs
      .append("linearGradient")
      .attr("id", gradientId)
      .attr("x1", "0%")
      .attr("x2", "100%");
    gradient.append("stop").attr("offset", "0%").attr("stop-color", d3.interpolateYlOrRd(0));
    gradient.append("stop").attr("offset", "50%").attr("stop-color", d3.interpolateYlOrRd(0.5));
    gradient.append("stop").attr("offset", "100%").attr("stop-color", d3.interpolateYlOrRd(1));

    legendGroup
      .append("text")
      .attr("x", 0)
      .attr("y", -6)
      .attr("fill", axisColor)
      .style("font-size", "10px")
      .style("font-weight", "600")
      .text("Revenue intensity");

    legendGroup
      .append("rect")
      .attr("width", legendWidth)
      .attr("height", legendHeight)
      .attr("rx", 5)
      .attr("fill", `url(#${gradientId})`);

    legendGroup
      .append("text")
      .attr("x", 0)
      .attr("y", 24)
      .attr("fill", axisColor)
      .style("font-size", "9px")
      .text("Low");
    legendGroup
      .append("text")
      .attr("x", legendWidth)
      .attr("y", 24)
      .attr("text-anchor", "end")
      .attr("fill", axisColor)
      .style("font-size", "9px")
      .text("High");

    // Tooltip
    const tooltip = d3
      .select("body")
      .append("div")
      .attr("class", "chart-tooltip")
      .style("position", "absolute")
      .style("background", isDark ? "rgba(15, 23, 42, 0.96)" : "rgba(255,255,255,0.98)")
      .style("color", isDark ? "#e2e8f0" : "#0f172a")
      .style("padding", "8px 12px")
      .style("border-radius", "10px")
      .style("border", `1px solid ${isDark ? "rgba(148,163,184,0.15)" : "rgba(148,163,184,0.25)"}`)
      .style("box-shadow", "0 8px 32px rgba(15, 23, 42, 0.16)")
      .style("font-size", mode === "elderly" ? "15px" : "12px")
      .style("font-family", "Inter, system-ui, sans-serif")
      .style("pointer-events", "none")
      .style("opacity", 0)
      .style("z-index", "9999");

    // Cells
    g.selectAll(".hm-cell")
      .data(data)
      .enter()
      .append("rect")
      .attr("class", "hm-cell")
      .attr("x", (d) => x(d.phase) ?? 0)
      .attr("y", (d) => y(d.state) ?? 0)
      .attr("width", x.bandwidth())
      .attr("height", y.bandwidth())
      .attr("rx", 4)
      .attr("fill", (d) => color(d.value))
      .attr("stroke", cellStroke)
      .attr("stroke-width", 1.5)
      .style("cursor", "pointer")
      .style("transition", "opacity 0.15s")
      .on("mouseover", function (event, d) {
        d3.select(this).attr("stroke", isDark ? "#38bdf8" : "#0ea5e9").attr("stroke-width", 2.5);
        tooltip
          .style("opacity", 1)
          .html(
            `<div style="font-weight:700;margin-bottom:2px;">${d.state}</div>` +
            `<div style="opacity:0.7;margin-bottom:4px;">${d.phase}</div>` +
            `<div>Revenue: <strong>RM ${d.value.toLocaleString("en-MY", { maximumFractionDigits: 0 })}</strong></div>`
          );
      })
      .on("mousemove", (event) => {
        tooltip
          .style("left", event.pageX + 14 + "px")
          .style("top", event.pageY - 14 + "px");
      })
      .on("mouseout", function () {
        d3.select(this).attr("stroke", cellStroke).attr("stroke-width", 1.5);
        tooltip.style("opacity", 0);
      })
      .on("click", (_event, d) => {
        setFilters({
          ...filters,
          state: [d.state],
          covidPhase: [d.phase],
        });
      });

    return () => {
      tooltip.remove();
    };
  }, [filteredData, filters, hasData, setFilters, mode, theme]);

  return (
    <div className="dashboard-card rounded-[var(--section-radius)] p-5">
      <div className="mb-4 flex items-end justify-between gap-4">
        <div>
          <h3
            className={`font-bold tracking-tight text-slate-950 dark:text-white ${
              mode === "elderly" ? "text-xl" : "text-lg"
            }`}
            style={{ fontFamily: "var(--font-display)" }}
          >
            Revenue Heat Map: State × COVID Phase
          </h3>
          <p className="mt-0.5 text-xs text-slate-500 dark:text-slate-400">
            Click any cell to cross-filter the dashboard.
          </p>
        </div>
        <span className="rounded-md bg-amber-500/10 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-[0.15em] text-amber-600 dark:text-amber-300">
          Cross-filter
        </span>
      </div>
      {hasData ? (
        <div className="overflow-x-auto rounded-xl border border-[var(--border)] bg-[var(--surface-muted)] p-3">
          <svg ref={ref} className="w-full" preserveAspectRatio="xMidYMid meet" />
        </div>
      ) : (
        <div className="grid min-h-[280px] place-items-center rounded-xl border border-dashed border-[var(--border-strong)] bg-[var(--surface-muted)] px-6 text-center">
          <div>
            <p className="text-sm font-semibold text-slate-900 dark:text-white">
              No matching regional data
            </p>
            <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
              Broaden the date range or clear the state and phase filters.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
