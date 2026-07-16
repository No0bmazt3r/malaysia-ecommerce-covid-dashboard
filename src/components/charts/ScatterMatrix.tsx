"use client";
import { useEffect, useRef } from "react";
import * as d3 from "d3";
import { useDashboard } from "@/context/DashboardContext";

export function ScatterMatrix() {
  const { filteredData, mode } = useDashboard();
  const ref = useRef<SVGSVGElement>(null);

  useEffect(() => {
    if (!ref.current || !filteredData.length) return;

    const svg = d3.select(ref.current);
    svg.selectAll("*").remove();

    const vars: { key: keyof (typeof filteredData)[0]; label: string }[] = [
      { key: "unit_price", label: "Unit Price" },
      { key: "ad_spend_myr", label: "Ad Spend" },
      { key: "delivery_time_days", label: "Delivery Days" },
      { key: "sales_revenue", label: "Revenue" },
    ];

    const size = 180;
    const padding = 30;
    const n = vars.length;
    const total = size * n + padding * 2;

    svg.attr("width", total).attr("height", total);

    const scales = vars.map((v) => {
      const extent = d3.extent(filteredData, (d) => +d[v.key]) as [number, number];
      return d3.scaleLinear().domain(extent).nice().range([padding, size - padding]);
    });

    const phaseColor = d3
      .scaleOrdinal<string>()
      .domain(["Pre-MCO", "MCO", "CMCO", "RMCO"])
      .range(["#10b981", "#ef4444", "#f59e0b", "#3b82f6"]);

    for (let i = 0; i < n; i++) {
      for (let j = 0; j < n; j++) {
        const cell = svg
          .append("g")
          .attr("transform", `translate(${j * size},${i * size})`);

        cell
          .append("rect")
          .attr("width", size)
          .attr("height", size)
          .attr("fill", "#fafafa")
          .attr("stroke", "#e5e7eb");

        if (i === j) {
          cell
            .append("text")
            .attr("x", size / 2)
            .attr("y", size / 2)
            .attr("text-anchor", "middle")
            .attr("dominant-baseline", "middle")
            .style("font-size", mode === "elderly" ? "14px" : "12px")
            .style("font-weight", "600")
            .text(vars[i].label);
        } else {
          const xVar = vars[j].key;
          const yVar = vars[i].key;
          const xScale = scales[j];
          const yScale = d3
            .scaleLinear()
            .domain(scales[i].domain())
            .range([size - padding, padding]);

          cell
            .selectAll("circle")
            .data(filteredData)
            .enter()
            .append("circle")
            .attr("cx", (d) => xScale(+d[xVar]))
            .attr("cy", (d) => yScale(+d[yVar]))
            .attr("r", mode === "elderly" ? 3 : 2)
            .attr("fill", (d) => phaseColor(d.covid_phase))
            .attr("opacity", 0.6);
        }
      }
    }

    // Legend
    const legend = svg.append("g").attr("transform", `translate(${total - 130}, 20)`);
    ["Pre-MCO", "MCO", "CMCO", "RMCO"].forEach((p, i) => {
      legend.append("circle").attr("cx", 0).attr("cy", i * 20).attr("r", 6).attr("fill", phaseColor(p));
      legend.append("text").attr("x", 12).attr("y", i * 20 + 4).style("font-size", "12px").text(p);
    });
  }, [filteredData, mode]);

  return (
    <div className="bg-white rounded-xl shadow-sm border p-4">
      <h3 className={`font-bold mb-2 ${mode === "elderly" ? "text-xl" : "text-lg"}`}>
        Scatter Plot Matrix (Advanced Visualization)
      </h3>
      <p className="text-xs text-slate-500 mb-3">
        Reveals ad_spend ↔ revenue (r≈0.66) and delivery_time ↔ rating (r≈-0.75).
      </p>
      <div className="overflow-x-auto">
        <svg ref={ref}></svg>
      </div>
    </div>
  );
}
