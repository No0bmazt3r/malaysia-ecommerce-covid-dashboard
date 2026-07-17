"use client";
import { useEffect, useRef } from "react";
import * as d3 from "d3";
import { useDashboard } from "@/context/DashboardContext";
import { useDashboardTheme } from "@/hooks/useDashboardTheme";

export function SegmentGroupedBarChart() {
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

    const phases = ["Pre-MCO", "MCO", "CMCO", "RMCO"];
    const segments = ["New", "Returning", "Loyal/VIP"];

    const rollups = d3.rollup(
      filteredData,
      v => d3.sum(v, d => d.sales_revenue),
      d => d.covid_phase,
      d => d.customer_segment
    );

    const data = phases.map(phase => {
      const obj: any = { phase };
      segments.forEach(seg => {
        obj[seg] = rollups.get(phase)?.get(seg) || 0;
      });
      return obj;
    });

    const x0 = d3.scaleBand().domain(phases).rangeRound([0, width]).paddingInner(0.1);
    const x1 = d3.scaleBand().domain(segments).rangeRound([0, x0.bandwidth()]).padding(0.05);
    const y = d3.scaleLinear().domain([0, d3.max(data, d => d3.max(segments, seg => d[seg])) || 0]).nice().rangeRound([height, 0]);

    const color = d3.scaleOrdinal<string>()
      .domain(segments)
      .range(["#38bdf8", "#818cf8", "#34d399"]);

    g.append("g")
      .attr("transform", `translate(0,${height})`)
      .call(d3.axisBottom(x0))
      .call(sel => sel.selectAll("text").attr("fill", axisColor));

    g.append("g")
      .call(d3.axisLeft(y).ticks(5).tickFormat(d => `${+d / 1000}k`))
      .call(sel => sel.selectAll("text").attr("fill", axisColor));

    const tooltip = d3.select("body").append("div")
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

    g.append("g")
      .selectAll("g")
      .data(data)
      .enter().append("g")
      .attr("transform", d => `translate(${x0(d.phase)},0)`)
      .selectAll("rect")
      .data(d => segments.map(seg => ({ key: seg, value: d[seg], phase: d.phase })))
      .enter().append("rect")
      .attr("x", d => x1(d.key)!)
      .attr("y", d => y(d.value))
      .attr("width", x1.bandwidth())
      .attr("height", d => height - y(d.value))
      .attr("fill", d => color(d.key))
      .attr("rx", 3)
      .on("mouseover", function(event, d) {
        d3.select(this).attr("opacity", 0.8);
        tooltip.style("opacity", 1)
          .html(`<strong>${d.phase} - ${d.key}</strong><br/>RM ${d.value.toLocaleString(undefined, { maximumFractionDigits: 0 })}`);
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
      <h3 className="text-lg font-bold">Segment Revenue by Phase</h3>
      <p className="text-xs text-slate-500 mb-4">Track which segments drive revenue through different COVID phases.</p>
      {hasData ? <svg ref={ref} className="w-full" /> : <p className="text-sm text-slate-500">No data</p>}
    </div>
  );
}
