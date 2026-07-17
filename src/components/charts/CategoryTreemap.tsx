"use client";
import { useEffect, useRef } from "react";
import * as d3 from "d3";
import { useDashboard } from "@/context/DashboardContext";
import { useDashboardTheme } from "@/hooks/useDashboardTheme";

export function CategoryTreemap() {
  const { filteredData, loading } = useDashboard();
  const theme = useDashboardTheme();
  const ref = useRef<SVGSVGElement>(null);
  const hasData = filteredData.length > 0;

  useEffect(() => {
    if (!ref.current || !hasData) return;

    const svg = d3.select(ref.current);
    svg.selectAll("*").remove();

    const isDark = theme === "dark";

    const width = 800;
    const height = 400;

    svg.attr("viewBox", `0 0 ${width} ${height}`);

    const rollups = d3.rollup(filteredData, v => d3.sum(v, d => d.sales_revenue), d => d.product_category);
    const data = {
      name: "Categories",
      children: Array.from(rollups, ([name, value]) => ({ name, value }))
    };

    const root = d3.hierarchy(data).sum((d: any) => d.value).sort((a: any, b: any) => b.value - a.value);

    d3.treemap<any>().size([width, height]).padding(2)(root as any);

    const color = d3.scaleOrdinal(d3.schemeSet3).domain(data.children.map(d => d.name));

    const tooltip = d3.select("body").append("div")
      .attr("class", "chart-tooltip")
      .style("position", "absolute")
      .style("background", isDark ? "rgba(15, 23, 42, 0.96)" : "rgba(255, 255, 255, 0.98)")
      .style("color", isDark ? "#e2e8f0" : "#0f172a")
      .style("padding", "8px 12px")
      .style("border-radius", "8px")
      .style("box-shadow", "0 4px 12px rgba(0,0,0,0.1)")
      .style("font-size", "12px")
      .style("pointer-events", "none")
      .style("opacity", 0)
      .style("z-index", "9999");

    const leaf = svg.selectAll("g")
      .data(root.leaves())
      .enter().append("g")
      .attr("transform", (d: any) => `translate(${d.x0},${d.y0})`);

    leaf.append("rect")
      .attr("id", (d, i) => `leaf-${i}`)
      .attr("fill", (d: any) => color(d.data.name))
      .attr("width", (d: any) => d.x1 - d.x0)
      .attr("height", (d: any) => d.y1 - d.y0)
      .attr("rx", 4)
      .on("mouseover", function(event, d: any) {
        d3.select(this).attr("opacity", 0.8);
        tooltip.style("opacity", 1)
          .html(`<strong>${d.data.name}</strong><br/>RM ${d.data.value.toLocaleString(undefined, { maximumFractionDigits: 0 })}`);
      })
      .on("mousemove", event => tooltip.style("left", event.pageX + 10 + "px").style("top", event.pageY - 10 + "px"))
      .on("mouseout", function() {
        d3.select(this).attr("opacity", 1);
        tooltip.style("opacity", 0);
      });

    leaf.append("clipPath")
      .attr("id", (d, i) => `clip-${i}`)
      .append("use")
      .attr("href", (d, i) => `#leaf-${i}`);

    leaf.append("text")
      .attr("clip-path", (d, i) => `url(#clip-${i})`)
      .selectAll("tspan")
      .data((d: any) => [d.data.name, `RM ${(d.data.value / 1000).toFixed(0)}k`])
      .enter().append("tspan")
      .attr("x", 4)
      .attr("y", (d, i) => 13 + i * 14)
      .text(d => d as string)
      .attr("font-size", "11px")
      .attr("fill", "#0f172a")
      .attr("font-weight", (d, i) => i === 0 ? "bold" : "normal");

    return () => { tooltip.remove(); };
  }, [filteredData, hasData, theme]);

  return (
    <div className="dashboard-card rounded-[var(--section-radius)] p-5">
      <h3 className="text-lg font-bold">Revenue by Category</h3>
      <p className="text-xs text-slate-500 mb-4">Treemap showing revenue share of product categories.</p>
      {loading ? (
        <div className="h-[400px] w-full rounded-lg skeleton-shimmer" />
      ) : hasData ? (
        <svg ref={ref} className="w-full" />
      ) : (
        <p className="text-sm text-slate-500">No data</p>
      )}
    </div>
  );
}
