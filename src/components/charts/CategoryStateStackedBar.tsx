"use client";
import { useEffect, useRef } from "react";
import * as d3 from "d3";
import { useDashboard } from "@/context/DashboardContext";
import { useDashboardTheme } from "@/hooks/useDashboardTheme";

export function CategoryStateStackedBar() {
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
    const surface = isDark ? "#0F1E2E" : "#ffffff";

    const margin = { top: 20, right: 120, bottom: 40, left: 100 };
    const width = 800 - margin.left - margin.right;
    const height = 350 - margin.top - margin.bottom;

    svg.attr("viewBox", `0 0 ${width + margin.left + margin.right} ${height + margin.top + margin.bottom}`);
    
    const g = svg.append("g").attr("transform", `translate(${margin.left},${margin.top})`);

    // Group by state and category
    const categories = Array.from(new Set(filteredData.map((d) => d.product_category))).sort();
    const states = Array.from(new Set(filteredData.map((d) => d.state))).sort();

    const rollups = d3.rollup(
      filteredData,
      (v) => v.length,
      (d) => d.state,
      (d) => d.product_category
    );

    const stackedData = states.map((state) => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const obj: any = { state };
      let total = 0;
      categories.forEach((cat) => {
        const val = rollups.get(state)?.get(cat) || 0;
        obj[cat] = val;
        total += val;
      });
      obj.total = total;
      return obj;
    });

    stackedData.sort((a, b) => b.total - a.total);

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const stack = d3.stack().keys(categories)(stackedData as any);

    const x = d3.scaleLinear().domain([0, d3.max(stackedData, (d) => d.total) || 0]).range([0, width]);
    const y = d3.scaleBand().domain(stackedData.map((d) => d.state)).range([0, height]).padding(0.2);
    
    const color = d3.scaleOrdinal(["#0B2A4A", "#5D8FA3", "#63B7B2", "#E4B363", "#D96C6C", "#8DB596", "#C6C1BC", "#A8D5D1"]).domain(categories);

    g.append("g")
      .attr("transform", `translate(0,${height})`)
      .call(d3.axisBottom(x).ticks(5))
      .call((sel) => sel.selectAll("text").attr("fill", axisColor));
      
    g.append("g")
      .call(d3.axisLeft(y))
      .call((sel) => sel.selectAll("text").attr("fill", axisColor).style("font-size", "11px"));

    const tooltip = d3
      .select("body")
      .append("div")
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

    g.selectAll("g.layer")
      .data(stack)
      .enter()
      .append("g")
      .attr("class", "layer")
      .attr("fill", (d) => color(d.key))
      .selectAll("rect")
      .data((d) => d.map((item) => ({ ...item, category: d.key })))
      .enter()
      .append("rect")
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      .attr("y", (d: any) => y(d.data.state)!)
      .attr("x", (d) => x(d[0]))
      .attr("width", (d) => x(d[1]) - x(d[0]))
      .attr("height", y.bandwidth())
      .attr("stroke", surface)
      .attr("stroke-width", 1.5)
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      .on("mouseover", function (event, d: any) {
        g.selectAll("g.layer rect").attr("opacity", 0.35);
        d3.select(this).attr("opacity", 1);
        const val = d[1] - d[0];
        tooltip
          .style("opacity", 1)
          .html(`<strong>${d.data.state}</strong><br/>${d.category}: ${val} orders`);
      })
      .on("mousemove", (event) => {
        tooltip.style("left", event.pageX + 10 + "px").style("top", event.pageY - 10 + "px");
      })
      .on("mouseout", function () {
        g.selectAll("g.layer rect").attr("opacity", 1);
        tooltip.style("opacity", 0);
      });

    // Legend
    const legend = svg.append("g").attr("transform", `translate(${width + margin.left + 20}, ${margin.top})`);
    categories.forEach((cat, i) => {
      legend.append("rect").attr("y", i * 20).attr("width", 12).attr("height", 12).attr("rx", 2).attr("fill", color(cat));
      legend.append("text").attr("x", 20).attr("y", i * 20 + 10).attr("font-size", "11px").attr("fill", axisColor).text(cat);
    });

    return () => { tooltip.remove(); };
  }, [filteredData, hasData, theme]);

  return (
    <div className="dashboard-card chart-fig rounded-[var(--section-radius)] p-5">
      <h3 className="text-lg font-bold">Category Distribution by State</h3>
      <p className="text-xs mb-4" style={{ color: 'var(--secondary, #5D8FA3)' }}>Breakdown of orders by product category for each state.</p>
      {loading ? (
        <div className="h-[320px] w-full rounded-[2px] skeleton-shimmer" />
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
