"use client";
import { useEffect, useRef } from "react";
import * as d3 from "d3";
import { useDashboard } from "@/context/DashboardContext";
import { useDashboardTheme } from "@/hooks/useDashboardTheme";

export function StateSalesBarChart() {
  const { filteredData } = useDashboard();
  const theme = useDashboardTheme();
  const ref = useRef<SVGSVGElement>(null);

  const hasData = filteredData.length > 0;

  useEffect(() => {
    if (!ref.current || !hasData) return;

    const svg = d3.select(ref.current);
    svg.selectAll("*").remove();

    const isDark = theme === "dark";
    const axisColor = isDark ? "#94a3b8" : "#64748b";
    const barFill = isDark ? "#6B9DB1" : "#5D8FA3";
    const highlightFill = isDark ? "#E48585" : "#D96C6C";
    
    const margin = { top: 20, right: 30, bottom: 40, left: 100 };
    const width = 800 - margin.left - margin.right;
    const height = 350 - margin.top - margin.bottom;

    svg.attr("viewBox", `0 0 ${width + margin.left + margin.right} ${height + margin.top + margin.bottom}`);
    
    const g = svg.append("g").attr("transform", `translate(${margin.left},${margin.top})`);

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

    const agg = d3.rollups(
      filteredData,
      (v) => d3.sum(v, (d) => d.sales_revenue),
      (d) => d.state
    );
    agg.sort((a, b) => b[1] - a[1]);

    const x = d3.scaleLinear().domain([0, d3.max(agg, (d) => d[1]) || 0]).range([0, width]);
    const y = d3.scaleBand().domain(agg.map((d) => d[0])).range([0, height]).padding(0.2);

    g.append("g")
      .attr("transform", `translate(0,${height})`)
      .call(d3.axisBottom(x).ticks(5).tickFormat((d) => `${+d / 1000}k`))
      .call((sel) => sel.selectAll("text").attr("fill", axisColor));
      
    g.append("g")
      .call(d3.axisLeft(y))
      .call((sel) => sel.selectAll("text").attr("fill", axisColor).style("font-size", "11px"));

    g.selectAll(".bar")
      .data(agg)
      .enter()
      .append("rect")
      .attr("class", "bar")
      .attr("x", 0)
      .attr("y", (d) => y(d[0])!)
      .attr("width", (d) => x(d[1]))
      .attr("height", y.bandwidth())
      .attr("fill", (d) => (d[0] === "Sabah" ? highlightFill : barFill))
      .attr("rx", 4)
      .on("mouseover", function (event, d) {
        d3.select(this).attr("opacity", 0.8);
        tooltip
          .style("opacity", 1)
          .html(`<strong>${d[0]}</strong><br/>Revenue: RM ${d[1].toLocaleString(undefined, { maximumFractionDigits: 0 })}`);
      })
      .on("mousemove", (event) => {
        tooltip.style("left", event.pageX + 10 + "px").style("top", event.pageY - 10 + "px");
      })
      .on("mouseout", function () {
        d3.select(this).attr("opacity", 1);
        tooltip.style("opacity", 0);
      });

    return () => {
      tooltip.remove();
    };
  }, [filteredData, hasData, theme]);

  return (
    <div className="dashboard-card chart-fig rounded-[var(--section-radius)] p-5">
      <h3 className="text-lg font-bold">Sales by State</h3>
      <p className="text-xs mb-4" style={{ color: 'var(--secondary, #5D8FA3)' }}>Total revenue across all regions, highlighting Sabah.</p>
      {hasData ? (
        <svg ref={ref} className="w-full" />
      ) : (
        <p className="text-sm" style={{ color: 'var(--secondary, #5D8FA3)' }}>No data</p>
      )}
    </div>
  );
}
