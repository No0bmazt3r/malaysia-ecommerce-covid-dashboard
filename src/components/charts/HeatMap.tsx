"use client";
import { useEffect, useRef } from "react";
import * as d3 from "d3";
import { useDashboard } from "@/context/DashboardContext";

export function HeatMap() {
  const { filteredData, setFilters, filters, mode } = useDashboard();
  const ref = useRef<SVGSVGElement>(null);

  useEffect(() => {
    if (!ref.current || !filteredData.length) return;

    const svg = d3.select(ref.current);
    svg.selectAll("*").remove();

    const margin = { top: 30, right: 30, bottom: 80, left: 120 };
    const width = 800 - margin.left - margin.right;
    const height = 400 - margin.top - margin.bottom;

    const g = svg
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
      .append("g")
      .attr("transform", `translate(${margin.left},${margin.top})`);

    const states = Array.from(new Set(filteredData.map((d) => d.state))).sort();
    const phases = ["Pre-MCO", "MCO", "CMCO", "RMCO"];

    const agg = d3.rollup(
      filteredData,
      (v) => d3.sum(v, (d) => d.sales_revenue),
      (d) => d.state,
      (d) => d.covid_phase
    );

    const data: { state: string; phase: string; value: number }[] = [];
    states.forEach((s) =>
      phases.forEach((p) =>
        data.push({
          state: s,
          phase: p,
          value: agg.get(s)?.get(p) ?? 0,
        })
      )
    );

    const x = d3.scaleBand().domain(phases).range([0, width]).padding(0.05);
    const y = d3.scaleBand().domain(states).range([0, height]).padding(0.05);
    const max = d3.max(data, (d) => d.value) ?? 1;
    
    // Color scale: yellow to red for revenue intensity
    const color = d3.scaleSequential(d3.interpolateYlOrRd).domain([0, max]);

    g.append("g")
      .attr("transform", `translate(0,${height})`)
      .call(d3.axisBottom(x))
      .selectAll("text")
      .style("font-size", mode === "elderly" ? "16px" : "12px");

    g.append("g")
      .call(d3.axisLeft(y))
      .selectAll("text")
      .style("font-size", mode === "elderly" ? "16px" : "12px");

    const tooltip = d3
      .select("body")
      .append("div")
      .style("position", "absolute")
      .style("background", "rgba(0,0,0,0.85)")
      .style("color", "white")
      .style("padding", "8px 12px")
      .style("border-radius", "6px")
      .style("font-size", mode === "elderly" ? "16px" : "12px")
      .style("pointer-events", "none")
      .style("opacity", 0);

    g.selectAll("rect")
      .data(data)
      .enter()
      .append("rect")
      .attr("x", (d) => x(d.phase) ?? 0)
      .attr("y", (d) => y(d.state) ?? 0)
      .attr("width", x.bandwidth())
      .attr("height", y.bandwidth())
      .attr("fill", (d) => color(d.value))
      .style("cursor", "pointer")
      .on("mouseover", (event, d) => {
        tooltip
          .style("opacity", 1)
          .html(
            `<b>${d.state}</b> • ${d.phase}<br/>Revenue: RM ${d.value.toLocaleString("en-MY", { maximumFractionDigits: 0 })}`
          );
      })
      .on("mousemove", (event) => {
        tooltip
          .style("left", event.pageX + 10 + "px")
          .style("top", event.pageY - 28 + "px");
      })
      .on("mouseout", () => tooltip.style("opacity", 0))
      .on("click", (event, d) => {
        // Cross-filtering: click a cell to filter to that state + phase
        setFilters({
          ...filters,
          state: [d.state],
          covidPhase: [d.phase],
        });
      });

    // Cleanup tooltip on unmount
    return () => {
      tooltip.remove();
    };
  }, [filteredData, filters, setFilters, mode]);

  return (
    <div className="bg-white rounded-xl shadow-sm border p-4">
      <h3 className={`font-bold mb-2 ${mode === "elderly" ? "text-xl" : "text-lg"}`}>
        Revenue Heat Map: State × COVID Phase
      </h3>
      <p className="text-xs text-slate-500 mb-3">
        Click any cell to cross-filter. Look for the Sabah + CMCO anomaly.
      </p>
      <div className="overflow-x-auto">
        <svg ref={ref}></svg>
      </div>
    </div>
  );
}
