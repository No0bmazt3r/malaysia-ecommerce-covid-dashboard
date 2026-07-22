"use client";
import { useEffect, useRef } from "react";
import * as d3 from "d3";
import { createD3Tooltip, positionTooltip } from "@/lib/d3-utils";
import { useDashboard } from "@/context/DashboardContext";
import { useDashboardTheme } from "@/hooks/useDashboardTheme";

export function HeatMap() {
  const { filteredData, setFilters, filters, loading } = useDashboard();
  const theme = useDashboardTheme();
  const ref = useRef<SVGSVGElement>(null);

  const hasData = filteredData.length > 0;

  useEffect(() => {
    if (!ref.current || !hasData) return;

    const svg = d3.select(ref.current);
    svg.selectAll("*").remove();

    const isDark = theme === "dark";
    const axisColor = isDark ? "#94a3b8" : "#64748b";
    const gridColor = isDark ? "rgba(198, 193, 188, 0.12)" : "rgba(198, 193, 188, 0.22)";
    const cellStroke = isDark ? "rgba(15, 30, 46, 0.5)" : "rgba(255, 255, 255, 0.8)";

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

    // ColorBrewer YlOrRd: the standard perceptually-ordered sequential scheme
    // for heatmaps. Here color carries the data, so convention beats brand hues.
    const ramp = d3.interpolateYlOrRd;
    const color = d3.scaleSequential(ramp).domain([0, max]);

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
          .style("font-size", "11px")
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
          .style("font-size", "11px");
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
    gradient.append("stop").attr("offset", "0%").attr("stop-color", ramp(0));
    gradient.append("stop").attr("offset", "50%").attr("stop-color", ramp(0.5));
    gradient.append("stop").attr("offset", "100%").attr("stop-color", ramp(1));

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
      .attr("rx", 2)
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
    const tooltip = createD3Tooltip(theme);

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
      .attr("rx", 2)
      .attr("fill", (d) => color(d.value))
      .attr("stroke", cellStroke)
      .attr("stroke-width", 1.5)
      .attr("role", "graphics-symbol")
      .attr("aria-label", (d) => `${d.state} in ${d.phase}: Revenue RM ${d.value.toLocaleString("en-MY", { maximumFractionDigits: 0 })}`)
      .style("cursor", "pointer")
      .style("transition", "opacity 0.15s")
      .on("mouseover", function (event, d) {
        d3.select(this).attr("stroke", isDark ? "#74C5C0" : "#63B7B2").attr("stroke-width", 2.5);
        tooltip
          .style("opacity", 1)
          .html(
            `<div style="font-weight:700;margin-bottom:2px;">${d.state}</div>` +
            `<div style="opacity:0.7;margin-bottom:4px;">${d.phase}</div>` +
            `<div>Revenue: <strong>RM ${d.value.toLocaleString("en-MY", { maximumFractionDigits: 0 })}</strong></div>`
          );
      })
      .on("mousemove", (event) => {
        positionTooltip(tooltip, event);
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
  }, [filteredData, filters, hasData, setFilters, theme]);

  return (
    <div className="dashboard-card chart-fig rounded-[var(--section-radius)] p-5">
      <div className="mb-4 flex items-end justify-between gap-4">
        <div>
          <h3
            className="text-lg font-bold tracking-tight"
            style={{ fontFamily: "var(--font-display)", color: 'var(--foreground)' }}
          >
            Revenue Heat Map: State × COVID Phase
          </h3>
          <p className="mt-0.5 text-xs" style={{ color: 'var(--secondary, #5D8FA3)' }}>
            Click any cell to cross-filter the dashboard.
          </p>
        </div>
      </div>
      {loading ? (
        <div className="h-[320px] w-full rounded-[2px] skeleton-shimmer" />
      ) : hasData ? (
        <div className="overflow-x-auto rounded-[2px] border border-[var(--border)] bg-[var(--surface-muted)] p-3">
          <svg ref={ref} className="w-full" preserveAspectRatio="xMidYMid meet" />
        </div>
      ) : (
        <div className="grid min-h-[280px] place-items-center rounded-[2px] border border-dashed border-[var(--border-strong)] bg-[var(--surface-muted)] px-6 text-center">
          <div>
            <p className="text-sm font-semibold" style={{ color: 'var(--foreground)' }}>
              No matching regional data
            </p>
            <p className="mt-1 text-xs" style={{ color: 'var(--secondary, #5D8FA3)' }}>
              Broaden the date range or clear the state and phase filters.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
