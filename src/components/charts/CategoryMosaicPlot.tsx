"use client";
import { useEffect, useRef } from "react";
import * as d3 from "d3";
import { useDashboard } from "@/context/DashboardContext";
import { useDashboardTheme } from "@/hooks/useDashboardTheme";

export function CategoryMosaicPlot() {
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

    const margin = { top: 30, right: 120, bottom: 40, left: 100 };
    const width = 800 - margin.left - margin.right;
    const height = 400 - margin.top - margin.bottom;

    svg.attr("viewBox", `0 0 ${width + margin.left + margin.right} ${height + margin.top + margin.bottom}`);
    const g = svg.append("g").attr("transform", `translate(${margin.left},${margin.top})`);

    const categories = Array.from(new Set(filteredData.map(d => d.product_category))).sort();
    const statuses = Array.from(new Set(filteredData.map(d => d.delivery_status))).sort();

    const rollups = d3.rollup(
      filteredData,
      v => v.length,
      d => d.product_category,
      d => d.delivery_status
    );

    const totalOrders = filteredData.length;
    
    let xOffset = 0;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const rects: any[] = [];
    
    categories.forEach(cat => {
      const catTotal = Array.from(rollups.get(cat)?.values() || []).reduce((a, b) => a + b, 0);
      const catWidth = (catTotal / totalOrders) * width;
      
      let yOffset = 0;
      statuses.forEach(status => {
        const val = rollups.get(cat)?.get(status) || 0;
        const statusHeight = catTotal ? (val / catTotal) * height : 0;
        
        if (val > 0) {
          rects.push({
            cat,
            status,
            val,
            x: xOffset,
            y: yOffset,
            w: catWidth,
            h: statusHeight
          });
        }
        yOffset += statusHeight;
      });
      
      // X-axis label
      g.append("text")
        .attr("x", xOffset + catWidth / 2)
        .attr("y", height + 15)
        .attr("text-anchor", "middle")
        .style("font-size", "10px")
        .style("fill", axisColor)
        .text(catTotal > totalOrders * 0.05 ? cat : "");

      xOffset += catWidth;
    });

    const color = d3.scaleOrdinal(["#0B2A4A", "#5D8FA3", "#63B7B2", "#E4B363", "#D96C6C", "#8DB596", "#C6C1BC", "#3D6E8A"]).domain(statuses);

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

    g.selectAll("rect")
      .data(rects)
      .enter().append("rect")
      .attr("x", d => d.x)
      .attr("y", d => d.y)
      .attr("width", d => d.w - 1)
      .attr("height", d => d.h - 1)
      .attr("fill", d => color(d.status))
      .attr("rx", 2)
      .on("mouseover", function(event, d) {
        d3.select(this).attr("opacity", 0.8);
        tooltip.style("opacity", 1)
          .html(`<strong>${d.cat}</strong><br/>${d.status}: ${d.val} orders`);
      })
      .on("mousemove", event => tooltip.style("left", event.pageX + 10 + "px").style("top", event.pageY - 10 + "px"))
      .on("mouseout", function() {
        d3.select(this).attr("opacity", 1);
        tooltip.style("opacity", 0);
      });

    // Legend
    const legend = svg.append("g").attr("transform", `translate(${width + margin.left + 20}, ${margin.top})`);
    statuses.forEach((status, i) => {
      legend.append("rect").attr("y", i * 20).attr("width", 12).attr("height", 12).attr("fill", color(status)).attr("rx", 2);
      legend.append("text").attr("x", 20).attr("y", i * 20 + 10).attr("font-size", "11px").attr("fill", axisColor).text(status);
    });
    
    // Y-axis label
    g.append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", -15)
      .attr("x", -height / 2)
      .attr("text-anchor", "middle")
      .style("font-size", "11px")
      .style("font-weight", "600")
      .style("fill", axisColor)
      .text("Delivery Status Distribution");

    return () => { tooltip.remove(); };
  }, [filteredData, hasData, theme]);

  return (
    <div className="dashboard-card rounded-[var(--section-radius)] p-5">
      <h3 className="text-lg font-bold">Category × Delivery Status</h3>
      <p className="text-xs mb-4" style={{ color: 'var(--secondary, #5D8FA3)' }}>Mosaic plot showing delivery delays across product categories.</p>
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
