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
    const tooltip = d3
      .select("body")
      .append("div")
      .style("position", "absolute")
      .style("pointer-events", "none")
      .style("opacity", 0)
      .style("padding", "10px 12px")
      .style("border-radius", "12px")
      .style("border", `1px solid ${gridColor}`)
      .style("background", isDark ? "rgba(15, 23, 42, 0.96)" : "rgba(255, 255, 255, 0.98)")
      .style("color", isDark ? "#e2e8f0" : "#0f172a")
      .style("box-shadow", "0 16px 40px rgba(15, 23, 42, 0.18)")
      .style("font-size", mode === "elderly" ? "16px" : "12px");

    const margin = { top: 20, right: 30, bottom: 60, left: 70 };
    const width = 800 - margin.left - margin.right;
    const height = 320 - margin.top - margin.bottom;

    const g = svg
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
      .append("g")
      .attr("transform", `translate(${margin.left},${margin.top})`);

    const hoverLayer = g.append("g").style("display", "none").style("pointer-events", "none");
    const hoverLine = hoverLayer
      .append("line")
      .attr("y1", 0)
      .attr("y2", height)
      .attr("stroke", isDark ? "rgba(125, 211, 252, 0.7)" : "rgba(37, 99, 235, 0.55)")
      .attr("stroke-width", 1.5)
      .attr("stroke-dasharray", "4,4");
    const hoverDot = hoverLayer
      .append("circle")
      .attr("r", mode === "elderly" ? 8 : 6)
      .attr("fill", isDark ? "#7dd3fc" : "#2563eb")
      .attr("stroke", isDark ? "#0f172a" : "#ffffff")
      .attr("stroke-width", 3);
    const hoverLabel = hoverLayer
      .append("g")
      .attr("transform", "translate(0, 0)");
    hoverLabel
      .append("rect")
      .attr("rx", 10)
      .attr("ry", 10)
      .attr("width", 170)
      .attr("height", 68)
      .attr("fill", isDark ? "rgba(15, 23, 42, 0.96)" : "rgba(255,255,255,0.96)")
      .attr("stroke", gridColor);
    const hoverMonthText = hoverLabel
      .append("text")
      .attr("x", 12)
      .attr("y", 22)
      .attr("fill", axisColor)
      .style("font-size", mode === "elderly" ? "16px" : "12px")
      .style("font-weight", "700");
    const hoverRevenueText = hoverLabel
      .append("text")
      .attr("x", 12)
      .attr("y", 42)
      .attr("fill", axisColor)
      .style("font-size", mode === "elderly" ? "15px" : "11px");
    const hoverDeliveryText = hoverLabel
      .append("text")
      .attr("x", 12)
      .attr("y", 58)
      .attr("fill", axisColor)
      .style("font-size", mode === "elderly" ? "15px" : "11px");

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
      .attr("fill", isDark ? "#7dd3fc" : "#2563eb")
      .style("cursor", "pointer")
      .on("mouseenter", (event, d) => {
        const xPos = x(d.month) ?? 0;
        const dotY = y(d.revenue);
        const labelX = Math.min(Math.max(xPos + 18, 0), width - 180);
        const labelY = Math.max(dotY - 86, 0);

        hoverLayer.style("display", null);
        hoverLine.attr("x1", xPos).attr("x2", xPos);
        hoverDot.attr("cx", xPos).attr("cy", dotY);
        hoverLabel.attr("transform", `translate(${labelX},${labelY})`);
        hoverMonthText.text(d.month);
        hoverRevenueText.text(`Revenue: RM ${d.revenue.toLocaleString("en-MY", { maximumFractionDigits: 0 })}`);
        hoverDeliveryText.text(`Avg delivery: ${d.avgDelivery.toFixed(1)} days`);

        tooltip
          .style("opacity", 1)
          .html(
            `<div style="font-weight:600;margin-bottom:4px;">${d.month}</div><div>Revenue: RM ${d.revenue.toLocaleString("en-MY", { maximumFractionDigits: 0 })}</div><div>Avg delivery: ${d.avgDelivery.toFixed(1)} days</div>`
          );

        d3.select(event.currentTarget as SVGCircleElement)
          .transition()
          .duration(120)
          .attr("r", mode === "elderly" ? 9 : 7);
      })
      .on("mousemove", (event) => {
        tooltip
          .style("left", `${event.pageX + 12}px`)
          .style("top", `${event.pageY - 16}px`);
      })
      .on("mouseleave", () => {
        tooltip.style("opacity", 0);
        hoverLayer.style("display", "none");
      });

    return () => {
      tooltip.remove();
    };
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
