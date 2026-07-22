"use client";
import { useEffect, useRef } from "react";
import * as d3 from "d3";
import { createD3Tooltip } from "@/lib/d3-utils";
import { useDashboard } from "@/context/DashboardContext";
import { useDashboardTheme } from "@/hooks/useDashboardTheme";

export function PhaseLineChart() {
  const { filteredData, loading } = useDashboard();
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
    const lineStroke = isDark ? "#6B9DB1" : "#5D8FA3";
    const dotFill = isDark ? "#6B9DB1" : "#5D8FA3";

    const margin = { top: 20, right: 24, bottom: 56, left: 64 };
    const width = 800 - margin.left - margin.right;
    const height = 300 - margin.top - margin.bottom;

    svg.attr("viewBox", `0 0 ${width + margin.left + margin.right} ${height + margin.top + margin.bottom}`);

    const g = svg
      .append("g")
      .attr("transform", `translate(${margin.left},${margin.top})`);

    // Tooltip
    const tooltip = createD3Tooltip(theme);

    // Aggregate by month
    const byMonth = d3
      .rollups(
        filteredData,
        (v) => ({
          revenue: d3.sum(v, (d) => d.sales_revenue),
          avgDelivery: d3.mean(v, (d) => d.delivery_time_days) ?? 0,
        }),
        (d) => d.order_date.slice(0, 7)
      )
      .map(([k, v]) => ({ month: k, ...v }))
      .sort((a, b) => a.month.localeCompare(b.month));

    const x = d3.scalePoint().domain(byMonth.map((d) => d.month)).range([0, width]);
    const y = d3
      .scaleLinear()
      .domain([0, d3.max(byMonth, (d) => d.revenue) ?? 0])
      .nice()
      .range([height, 0]);

    // Grid lines
    g.selectAll(".grid-line")
      .data(y.ticks(5))
      .enter()
      .append("line")
      .attr("x1", 0)
      .attr("x2", width)
      .attr("y1", (d) => y(d))
      .attr("y2", (d) => y(d))
      .attr("stroke", gridColor);

    // X axis
    g.append("g")
      .attr("transform", `translate(0,${height})`)
      .call(
        d3
          .axisBottom(x)
          .tickValues(byMonth.filter((_, i) => i % 3 === 0).map((d) => d.month))
      )
      .call((sel) => {
        sel.select(".domain").attr("stroke", gridColor);
        sel.selectAll(".tick line").attr("stroke", gridColor);
        sel
          .selectAll("text")
          .attr("fill", axisColor)
          .attr("transform", "rotate(-40)")
          .style("text-anchor", "end")
          .style("font-size", "10px");
      });

    // Y axis
    g.append("g")
      .call(d3.axisLeft(y).ticks(5).tickFormat((d) => `${(+d / 1000).toFixed(0)}k`))
      .call((sel) => {
        sel.select(".domain").attr("stroke", gridColor);
        sel.selectAll(".tick line").attr("stroke", gridColor);
        sel.selectAll("text").attr("fill", axisColor).style("font-size", "10px");
      });

    // Area fill
    const area = d3
      .area<(typeof byMonth)[0]>()
      .x((d) => x(d.month) ?? 0)
      .y0(height)
      .y1((d) => y(d.revenue))
      .curve(d3.curveMonotoneX);

    const gradientId = `line-area-${isDark ? "dark" : "light"}`;
    const defs = svg.append("defs");
    const grad = defs
      .append("linearGradient")
      .attr("id", gradientId)
      .attr("x1", "0%")
      .attr("x2", "0%")
      .attr("y1", "0%")
      .attr("y2", "100%");
    grad.append("stop").attr("offset", "0%").attr("stop-color", lineStroke).attr("stop-opacity", 0.2);
    grad.append("stop").attr("offset", "100%").attr("stop-color", lineStroke).attr("stop-opacity", 0.02);

    g.append("path")
      .datum(byMonth)
      .attr("fill", `url(#${gradientId})`)
      .attr("d", area);

    // Line
    const line = d3
      .line<(typeof byMonth)[0]>()
      .x((d) => x(d.month) ?? 0)
      .y((d) => y(d.revenue))
      .curve(d3.curveMonotoneX);

    g.append("path")
      .datum(byMonth)
      .attr("fill", "none")
      .attr("stroke", lineStroke)
      .attr("stroke-width", 2)
      .attr("stroke-linecap", "round")
      .attr("d", line);

    // Dots
    g.selectAll(".data-dot")
      .data(byMonth)
      .enter()
      .append("circle")
      .attr("class", "data-dot")
      .attr("cx", (d) => x(d.month) ?? 0)
      .attr("cy", (d) => y(d.revenue))
      .attr("r", 2.5)
      .attr("fill", dotFill)
      .attr("stroke", isDark ? "#0F1E2E" : "#ffffff")
      .attr("stroke-width", 2)
      .style("cursor", "pointer")
      .on("mouseenter", function (event, d) {
        d3.select(this).transition().duration(100).attr("r", 6);
        tooltip
          .style("opacity", 1)
          .html(
            `<div style="font-weight:700;margin-bottom:3px;">${d.month}</div>` +
            `<div>Revenue: <strong>RM ${d.revenue.toLocaleString("en-MY", { maximumFractionDigits: 0 })}</strong></div>` +
            `<div>Avg delivery: <strong>${d.avgDelivery.toFixed(1)} days</strong></div>`
          );
      })
      .on("mousemove", (event) => {
        tooltip
          .style("left", `${event.pageX + 14}px`)
          .style("top", `${event.pageY - 14}px`);
      })
      .on("mouseleave", function () {
        d3.select(this).transition().duration(100).attr("r", 2.5);
        tooltip.style("opacity", 0);
      });

    return () => {
      tooltip.remove();
    };
  }, [filteredData, hasData, theme]);

  return (
    <div className="dashboard-card chart-fig rounded-[var(--section-radius)] p-5">
      <div className="mb-4 flex items-end justify-between gap-4">
        <div>
          <h3
            className="text-lg font-bold tracking-tight"
            style={{ fontFamily: "var(--font-display)", color: 'var(--foreground)' }}
          >
            Monthly Revenue Trend
          </h3>
          <p className="mt-0.5 text-xs" style={{ color: 'var(--secondary, #5D8FA3)' }}>
            Revenue aggregated by month with phase-aware filtering.
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
        <div className="grid min-h-[240px] place-items-center rounded-[2px] border border-dashed border-[var(--border-strong)] bg-[var(--surface-muted)] px-6 text-center">
          <div>
            <p className="text-sm font-semibold" style={{ color: 'var(--foreground)' }}>
              No chart data for the current filters
            </p>
            <p className="mt-1 text-xs" style={{ color: 'var(--secondary, #5D8FA3)' }}>
              Clear one or more filters to bring the revenue trend back.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
