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

     
     
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const root = d3.hierarchy(data).sum((d: any) => d.value).sort((a: any, b: any) => b.value - a.value);

     
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    d3.treemap<any>().size([width, height]).padding(2)(root as any);

    const color = d3.scaleOrdinal(["#0B2A4A", "#5D8FA3", "#63B7B2", "#E4B363", "#D96C6C", "#8DB596", "#A8D5D1", "#3D6E8A"]).domain(data.children.map(d => d.name));

    const tooltip = d3.select("body").append("div")
      .attr("class", "chart-tooltip")
      .style("position", "absolute")
      .style("background", isDark ? "rgba(15, 30, 46, 0.96)" : "rgba(255, 255, 255, 0.98)")
      .style("color", isDark ? "#E8ECF0" : "#0B2A4A")
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
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      .attr("transform", (d: any) => `translate(${d.x0},${d.y0})`);

    leaf.append("rect")
      .attr("id", (d, i) => `leaf-${i}`)
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      .attr("fill", (d: any) => color(d.data.name))
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      .attr("width", (d: any) => d.x1 - d.x0)
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      .attr("height", (d: any) => d.y1 - d.y0)
      .attr("rx", 2)
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      .on("mouseover", function(event, d: any) {
        leaf.selectAll("rect").attr("opacity", 0.4);
        d3.select(this).attr("opacity", 1);
        tooltip.style("opacity", 1)
          .html(`<strong>${d.data.name}</strong><br/>RM ${d.data.value.toLocaleString(undefined, { maximumFractionDigits: 0 })}`);
      })
      .on("mousemove", event => tooltip.style("left", event.pageX + 10 + "px").style("top", event.pageY - 10 + "px"))
      .on("mouseout", function() {
        leaf.selectAll("rect").attr("opacity", 1);
        tooltip.style("opacity", 0);
      });

    leaf.append("clipPath")
      .attr("id", (d, i) => `clip-${i}`)
      .append("use")
      .attr("href", (d, i) => `#leaf-${i}`);

    leaf.append("text")
      .attr("clip-path", (d, i) => `url(#clip-${i})`)
      .selectAll("tspan")
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      .data((d: any) => [d.data.name, `RM ${(d.data.value / 1000).toFixed(0)}k`])
      .enter().append("tspan")
      .attr("x", 4)
      .attr("y", (d, i) => 13 + i * 14)
      .text(d => d as string)
      .attr("font-size", "11px")
      .attr("fill", "#ffffff")
      .attr("font-weight", (d, i) => i === 0 ? "bold" : "normal");

    return () => { tooltip.remove(); };
  }, [filteredData, hasData, theme]);

  return (
    <div className="dashboard-card chart-fig rounded-[var(--section-radius)] p-5">
      <h3 className="text-lg font-bold">Revenue by Category</h3>
      <p className="text-xs mb-4" style={{ color: 'var(--secondary, #5D8FA3)' }}>Treemap showing revenue share of product categories.</p>
      {loading ? (
        <div className="h-[400px] w-full rounded-[2px] skeleton-shimmer" />
      ) : hasData ? (
        <svg ref={ref} className="w-full" />
      ) : (
        <div className="grid min-h-[240px] place-items-center rounded-[2px] border border-dashed border-[var(--border-strong)] bg-[var(--surface-muted)] px-6 text-center">
          <div>
            <p className="text-sm font-semibold" style={{ color: 'var(--foreground)' }}>No data for the current filters</p>
            <p className="mt-1 text-xs" style={{ color: 'var(--secondary, #5D8FA3)' }}>Clear one or more filters to bring this chart back.</p>
          </div>
        </div>
      )}
    </div>
  );
}
