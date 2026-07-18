"use client";
import { useEffect, useRef } from "react";
import * as d3 from "d3";
import { useDashboard } from "@/context/DashboardContext";
import { useDashboardTheme } from "@/hooks/useDashboardTheme";

export function CustomerAgeScatterPlot() {
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

    const margin = { top: 20, right: 30, bottom: 40, left: 60 };
    const width = 800 - margin.left - margin.right;
    const height = 350 - margin.top - margin.bottom;

    svg.attr("viewBox", `0 0 ${width + margin.left + margin.right} ${height + margin.top + margin.bottom}`);
    const g = svg.append("g").attr("transform", `translate(${margin.left},${margin.top})`);

    const ageGroups = ["18-24", "25-34", "35-44", "45-54", "55+"];
    
    // Group by customer to calculate average order value
    const customers = d3.rollup(
      filteredData,
      v => ({
        aov: d3.mean(v, d => d.sales_revenue) || 0,
        age: v[0].customer_age_group
      }),
      d => d.customer_id
    );

    const data = Array.from(customers.values());

    const x = d3.scalePoint().domain(ageGroups).range([0, width]).padding(0.5);
    const y = d3.scaleLinear().domain([0, d3.max(data, d => d.aov) || 0]).nice().range([height, 0]);

    // Add jitter to X
    const jitter = 30;

    g.append("g")
      .attr("transform", `translate(0,${height})`)
      .call(d3.axisBottom(x))
      .call(sel => sel.selectAll("text").attr("fill", axisColor).style("font-size", "11px"));

    g.append("g")
      .call(d3.axisLeft(y).ticks(6).tickFormat(d => `RM ${d}`))
      .call(sel => sel.selectAll("text").attr("fill", axisColor));

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

    g.selectAll("circle")
      .data(data)
      .enter().append("circle")
      .attr("cx", d => (x(d.age) || 0) + (Math.random() - 0.5) * jitter)
      .attr("cy", d => y(d.aov))
      .attr("r", 3)
      .attr("fill", isDark ? "#6B9DB1" : "#5D8FA3")
      .attr("opacity", 0.6)
      .on("mouseover", function(event, d) {
        d3.select(this).attr("r", 6).attr("opacity", 1);
        tooltip.style("opacity", 1)
          .html(`Age: ${d.age}<br/>AOV: RM ${d.aov.toLocaleString(undefined, { maximumFractionDigits: 0 })}`);
      })
      .on("mousemove", event => tooltip.style("left", event.pageX + 10 + "px").style("top", event.pageY - 10 + "px"))
      .on("mouseout", function() {
        d3.select(this).attr("r", 3).attr("opacity", 0.6);
        tooltip.style("opacity", 0);
      });

    return () => { tooltip.remove(); };
  }, [filteredData, hasData, theme]);

  return (
    <div className="dashboard-card rounded-[var(--section-radius)] p-5">
      <h3 className="text-lg font-bold">Age vs Average Order Value</h3>
      <p className="text-xs mb-4" style={{ color: 'var(--secondary, #5D8FA3)' }}>Customer-level AOV spread across age groups.</p>
      {hasData ? <svg ref={ref} className="w-full" /> : <p className="text-sm" style={{ color: 'var(--secondary, #5D8FA3)' }}>No data</p>}
    </div>
  );
}
