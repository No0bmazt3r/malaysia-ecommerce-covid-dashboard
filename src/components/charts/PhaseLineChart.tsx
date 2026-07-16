"use client";
import { useEffect, useRef } from "react";
import * as d3 from "d3";
import { useDashboard } from "@/context/DashboardContext";

export function PhaseLineChart() {
  const { filteredData, mode } = useDashboard();
  const ref = useRef<SVGSVGElement>(null);

  useEffect(() => {
    if (!ref.current || !filteredData.length) return;

    const svg = d3.select(ref.current);
    svg.selectAll("*").remove();

    const margin = { top: 20, right: 30, bottom: 60, left: 70 };
    const width = 800 - margin.left - margin.right;
    const height = 320 - margin.top - margin.bottom;

    const g = svg
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
      .append("g")
      .attr("transform", `translate(${margin.left},${margin.top})`);

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
      .attr("transform", "rotate(-45)")
      .style("text-anchor", "end")
      .style("font-size", mode === "elderly" ? "14px" : "11px");

    g.append("g").call(d3.axisLeft(y).ticks(5));

    const line = d3
      .line<(typeof byMonth)[0]>()
      .x((d) => x(d.month) ?? 0)
      .y((d) => y(d.revenue))
      .curve(d3.curveMonotoneX);

    g.append("path")
      .datum(byMonth)
      .attr("fill", "none")
      .attr("stroke", "#2563eb")
      .attr("stroke-width", 3)
      .attr("d", line);

    g.selectAll("circle")
      .data(byMonth)
      .enter()
      .append("circle")
      .attr("cx", (d) => x(d.month) ?? 0)
      .attr("cy", (d) => y(d.revenue))
      .attr("r", mode === "elderly" ? 6 : 4)
      .attr("fill", "#2563eb");
  }, [filteredData, mode]);

  return (
    <div className="bg-white rounded-xl shadow-sm border p-4">
      <h3 className={`font-bold mb-2 ${mode === "elderly" ? "text-xl" : "text-lg"}`}>
        Monthly Revenue Trend
      </h3>
      <div className="overflow-x-auto">
        <svg ref={ref}></svg>
      </div>
    </div>
  );
}
