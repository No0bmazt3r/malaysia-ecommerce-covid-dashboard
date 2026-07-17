"use client";
import { useEffect, useRef } from "react";
import * as d3 from "d3";
import { useDashboard } from "@/context/DashboardContext";
import { useDashboardTheme } from "@/hooks/useDashboardTheme";

export function StateDeliveryLineChart() {
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

    const margin = { top: 20, right: 120, bottom: 40, left: 50 };
    const width = 800 - margin.left - margin.right;
    const height = 350 - margin.top - margin.bottom;

    svg.attr("viewBox", `0 0 ${width + margin.left + margin.right} ${height + margin.top + margin.bottom}`);
    
    const g = svg.append("g").attr("transform", `translate(${margin.left},${margin.top})`);

    const phases = ["Pre-MCO", "MCO", "CMCO", "RMCO"];
    
    // Select top 5 states by volume to not overcrowd the line chart
    const stateCounts = d3.rollup(filteredData, v => v.length, d => d.state);
    const topStates = Array.from(stateCounts.entries()).sort((a,b) => b[1]-a[1]).slice(0,5).map(d => d[0]);
    // Ensure Sabah is in the list since we need to highlight it
    if (!topStates.includes("Sabah")) topStates[4] = "Sabah";

    const rollups = d3.rollup(
      filteredData.filter(d => topStates.includes(d.state)),
      (v) => d3.mean(v, (d) => d.delivery_time_days) || 0,
      (d) => d.state,
      (d) => d.covid_phase
    );

    const x = d3.scalePoint().domain(phases).range([0, width]).padding(0.1);
    const maxVal = d3.max(Array.from(rollups.values()).flatMap(m => Array.from(m.values()))) || 0;
    const y = d3.scaleLinear().domain([0, maxVal * 1.2]).range([height, 0]);

    const color = d3.scaleOrdinal(d3.schemeCategory10).domain(topStates);

    g.append("g")
      .attr("transform", `translate(0,${height})`)
      .call(d3.axisBottom(x))
      .call((sel) => sel.selectAll("text").attr("fill", axisColor));
      
    g.append("g")
      .call(d3.axisLeft(y))
      .call((sel) => sel.selectAll("text").attr("fill", axisColor));

    const line = d3.line<string>()
      .x(d => x(d)!)
      .y(d => y(0)); // Placeholder

    const tooltip = d3
      .select("body")
      .append("div")
      .attr("class", "chart-tooltip")
      .style("position", "absolute")
      .style("background", isDark ? "rgba(15, 23, 42, 0.96)" : "rgba(255, 255, 255, 0.98)")
      .style("color", isDark ? "#e2e8f0" : "#0f172a")
      .style("padding", "8px 12px")
      .style("border-radius", "8px")
      .style("box-shadow", "0 4px 12px rgba(0,0,0,0.1)")
      .style("font-size", "12px")
      .style("pointer-events", "none")
      .style("opacity", 0)
      .style("z-index", "9999");

    topStates.forEach((state) => {
      const stateData = phases.map(p => ({ phase: p, value: rollups.get(state)?.get(p) || 0 }));
      
      const realLine = d3.line<{phase: string, value: number}>()
        .x(d => x(d.phase)!)
        .y(d => y(d.value));

      g.append("path")
        .datum(stateData)
        .attr("fill", "none")
        .attr("stroke", color(state))
        .attr("stroke-width", state === "Sabah" ? 4 : 2)
        .attr("d", realLine);

      g.selectAll(`.dot-${state.replace(/\s+/g,'')}`)
        .data(stateData)
        .enter()
        .append("circle")
        .attr("class", `dot-${state.replace(/\s+/g,'')}`)
        .attr("cx", d => x(d.phase)!)
        .attr("cy", d => y(d.value))
        .attr("r", 4)
        .attr("fill", color(state))
        .on("mouseover", function(event, d) {
          d3.select(this).attr("r", 6);
          tooltip.style("opacity", 1).html(`<strong>${state}</strong><br/>${d.phase}: ${d.value.toFixed(1)} days`);
        })
        .on("mousemove", event => tooltip.style("left", event.pageX + 10 + "px").style("top", event.pageY - 10 + "px"))
        .on("mouseout", function() {
          d3.select(this).attr("r", 4);
          tooltip.style("opacity", 0);
        });
    });

    const legend = svg.append("g").attr("transform", `translate(${width + margin.left + 20}, ${margin.top})`);
    topStates.forEach((state, i) => {
      legend.append("line").attr("x1", 0).attr("x2", 15).attr("y1", i * 20).attr("y2", i * 20).attr("stroke", color(state)).attr("stroke-width", 2);
      legend.append("text").attr("x", 20).attr("y", i * 20 + 4).attr("font-size", "11px").attr("fill", axisColor).text(state);
    });

    return () => { tooltip.remove(); };
  }, [filteredData, hasData, theme]);

  return (
    <div className="dashboard-card rounded-[var(--section-radius)] p-5">
      <h3 className="text-lg font-bold">Delivery Time Trends by State</h3>
      <p className="text-xs text-slate-500 mb-4">Average delivery time (days) across COVID phases for top states.</p>
      {hasData ? (
        <svg ref={ref} className="w-full" />
      ) : (
        <p className="text-sm text-slate-500">No data</p>
      )}
    </div>
  );
}
