"use client";
import { useEffect, useRef } from "react";
import * as d3 from "d3";
import { useDashboard } from "@/context/DashboardContext";
import { useDashboardTheme } from "@/hooks/useDashboardTheme";

export function SegmentDonutChart() {
  const { filteredData } = useDashboard();
  const theme = useDashboardTheme();
  const ref = useRef<SVGSVGElement>(null);
  const hasData = filteredData.length > 0;

  useEffect(() => {
    if (!ref.current || !hasData) return;

    const svg = d3.select(ref.current);
    svg.selectAll("*").remove();

    const isDark = theme === "dark";
    const labelColor = isDark ? "#E8ECF0" : "#0B2A4A";

    const width = 400;
    const height = 300;
    const radius = Math.min(width, height) / 2 - 20;

    svg.attr("viewBox", `0 0 ${width} ${height}`);
    const g = svg.append("g").attr("transform", `translate(${width / 2},${height / 2})`);

    const segments = d3.rollup(filteredData, v => d3.sum(v, d => d.sales_revenue), d => d.customer_segment);
    const data = Array.from(segments, ([key, value]) => ({ key, value }));

    const color = d3.scaleOrdinal<string>()
      .domain(["New", "Returning", "Loyal/VIP"])
      .range(["#5D8FA3", "#63B7B2", "#8DB596"]);

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const pie = d3.pie<any>().value(d => d.value).sort(null);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const arc = d3.arc<any>().innerRadius(radius * 0.6).outerRadius(radius);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const outerArc = d3.arc<any>().innerRadius(radius * 0.9).outerRadius(radius * 0.9);

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

    const arcs = g.selectAll(".arc")
      .data(pie(data))
      .enter()
      .append("g")
      .attr("class", "arc");

    arcs.append("path")
      .attr("d", arc)
      .attr("fill", d => color(d.data.key))
      .attr("stroke", isDark ? "#0F1E2E" : "#ffffff")
      .attr("stroke-width", 2)
      .style("cursor", "pointer")
      .on("mouseover", function(event, d) {
        d3.select(this).attr("opacity", 0.8);
        tooltip.style("opacity", 1)
          .html(`<strong>${d.data.key}</strong><br/>Revenue: RM ${d.data.value.toLocaleString(undefined, { maximumFractionDigits: 0 })}`);
      })
      .on("mousemove", event => tooltip.style("left", event.pageX + 10 + "px").style("top", event.pageY - 10 + "px"))
      .on("mouseout", function() {
        d3.select(this).attr("opacity", 1);
        tooltip.style("opacity", 0);
      });

    arcs.append("text")
      .attr("transform", d => `translate(${outerArc.centroid(d)})`)
      .attr("dy", "0.35em")
      .style("text-anchor", "middle")
      .style("font-size", "11px")
      .style("font-weight", "600")
      .attr("fill", labelColor)
      .text(d => d.data.key);

    return () => { tooltip.remove(); };
  }, [filteredData, hasData, theme]);

  return (
    <div className="dashboard-card chart-fig rounded-[var(--section-radius)] p-5">
      <h3 className="text-lg font-bold">Revenue by Segment</h3>
      <p className="text-xs mb-4" style={{ color: 'var(--secondary, #5D8FA3)' }}>Distribution of sales across customer segments.</p>
      {hasData ? <svg ref={ref} className="w-full" /> : <p className="text-sm" style={{ color: 'var(--secondary, #5D8FA3)' }}>No data</p>}
    </div>
  );
}
