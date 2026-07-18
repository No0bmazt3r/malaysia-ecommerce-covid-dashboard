"use client";
import { useEffect, useRef } from "react";
import * as d3 from "d3";
import { useDashboard } from "@/context/DashboardContext";
import { useDashboardTheme } from "@/hooks/useDashboardTheme";

export function TopProductsBarChart() {
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

    const margin = { top: 20, right: 30, bottom: 40, left: 100 };
    const width = 800 - margin.left - margin.right;
    const height = 400 - margin.top - margin.bottom;

    svg.attr("viewBox", `0 0 ${width + margin.left + margin.right} ${height + margin.top + margin.bottom}`);
    const g = svg.append("g").attr("transform", `translate(${margin.left},${margin.top})`);

    const productRollup = d3.rollup(
      filteredData,
      v => d3.sum(v, d => d.sales_revenue),
      d => d.product_id
    );

    const topProducts = Array.from(productRollup, ([id, revenue]) => ({ id, revenue }))
      .sort((a, b) => b.revenue - a.revenue)
      .slice(0, 10);

    const x = d3.scaleLinear().domain([0, d3.max(topProducts, d => d.revenue) || 0]).range([0, width]);
    const y = d3.scaleBand().domain(topProducts.map(d => d.id)).range([0, height]).padding(0.2);

    g.append("g")
      .attr("transform", `translate(0,${height})`)
      .call(d3.axisBottom(x).ticks(5).tickFormat(d => `${+d / 1000}k`))
      .call(sel => sel.selectAll("text").attr("fill", axisColor));
      
    g.append("g")
      .call(d3.axisLeft(y))
      .call(sel => sel.selectAll("text").attr("fill", axisColor).style("font-size", "11px"));

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

    g.selectAll(".bar")
      .data(topProducts)
      .enter()
      .append("rect")
      .attr("class", "bar")
      .attr("x", 0)
      .attr("y", d => y(d.id)!)
      .attr("width", d => x(d.revenue))
      .attr("height", y.bandwidth())
      .attr("fill", isDark ? "#6B9DB1" : "#5D8FA3")
      .attr("rx", 4)
      .on("mouseover", function(event, d) {
        d3.select(this).attr("opacity", 0.8);
        tooltip.style("opacity", 1)
          .html(`<strong>${d.id}</strong><br/>Revenue: RM ${d.revenue.toLocaleString(undefined, { maximumFractionDigits: 0 })}`);
      })
      .on("mousemove", event => tooltip.style("left", event.pageX + 10 + "px").style("top", event.pageY - 10 + "px"))
      .on("mouseout", function() {
        d3.select(this).attr("opacity", 1);
        tooltip.style("opacity", 0);
      });

    return () => { tooltip.remove(); };
  }, [filteredData, hasData, theme]);

  return (
    <div className="dashboard-card rounded-[var(--section-radius)] p-5">
      <h3 className="text-lg font-bold">Top 10 Products by Revenue</h3>
      <p className="text-xs mb-4" style={{ color: 'var(--secondary, #5D8FA3)' }}>Highest grossing product SKUs.</p>
      {loading ? (
        <div className="h-[400px] w-full rounded-lg skeleton-shimmer" />
      ) : hasData ? (
        <svg ref={ref} className="w-full" />
      ) : (
        <p className="text-sm" style={{ color: 'var(--secondary, #5D8FA3)' }}>No data</p>
      )}
    </div>
  );
}
