"use client";
import { useEffect, useRef } from "react";
import * as d3 from "d3";
import { createD3Tooltip } from "@/lib/d3-utils";
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

    const tooltip = createD3Tooltip(theme);

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
      .attr("rx", 2)
      .on("mouseover", function(event, d) {
        g.selectAll(".bar").attr("opacity", 0.35);
        d3.select(this).attr("opacity", 1);
        tooltip.style("opacity", 1)
          .html(`<strong>${d.id}</strong><br/>Revenue: RM ${d.revenue.toLocaleString(undefined, { maximumFractionDigits: 0 })}`);
      })
      .on("mousemove", event => tooltip.style("left", event.pageX + 10 + "px").style("top", event.pageY - 10 + "px"))
      .on("mouseout", function() {
        g.selectAll(".bar").attr("opacity", 1);
        tooltip.style("opacity", 0);
      });

    return () => { tooltip.remove(); };
  }, [filteredData, hasData, theme]);

  return (
    <div className="dashboard-card chart-fig rounded-[var(--section-radius)] p-5">
      <h3 className="text-lg font-bold">Top 10 Products by Revenue</h3>
      <p className="text-xs mb-4" style={{ color: 'var(--secondary, #5D8FA3)' }}>Highest grossing product SKUs.</p>
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
