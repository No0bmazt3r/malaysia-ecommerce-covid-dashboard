"use client";
import { useEffect, useRef } from "react";
import * as d3 from "d3";
import { useDashboard } from "@/context/DashboardContext";

export function ProjectTimeline() {
  const { mode } = useDashboard();
  const ref = useRef<SVGSVGElement>(null);

  useEffect(() => {
    if (!ref.current) return;
    const svg = d3.select(ref.current);
    svg.selectAll("*").remove();

    const margin = { top: 40, right: 40, bottom: 60, left: 40 };
    const width = 1000 - margin.left - margin.right;
    const height = 250 - margin.top - margin.bottom;

    const g = svg
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
      .append("g")
      .attr("transform", `translate(${margin.left},${margin.top})`);

    const milestones = [
      { date: "2026-02-15", label: "Project Initiation", color: "#6366f1" },
      { date: "2026-03-01", label: "Data Collection", phase: "Pre-MCO", color: "#10b981" },
      { date: "2026-03-20", label: "Data Cleaning", phase: "MCO", color: "#f59e0b" },
      { date: "2026-05-10", label: "Dashboard Dev", phase: "CMCO", color: "#3b82f6" },
      { date: "2026-06-15", label: "Testing & Validation", phase: "RMCO", color: "#8b5cf6" },
      { date: "2026-07-20", label: "Deployment", color: "#ef4444" },
    ];

    const parse = d3.timeParse("%Y-%m-%d");
    const dates = milestones.map((m) => parse(m.date) as Date);
    const x = d3.scaleTime().domain([d3.min(dates)!, d3.max(dates)!]).range([0, width]);

    // Main line
    g.append("line")
      .attr("x1", 0)
      .attr("x2", width)
      .attr("y1", height / 2)
      .attr("y2", height / 2)
      .attr("stroke", "#94a3b8")
      .attr("stroke-width", 3)
      .attr("stroke-dasharray", "4,4");

    milestones.forEach((m, i) => {
      const cx = x(parse(m.date)!);
      const cy = height / 2;
      const above = i % 2 === 0;

      g.append("circle")
        .attr("cx", cx)
        .attr("cy", cy)
        .attr("r", mode === "elderly" ? 12 : 8)
        .attr("fill", m.color)
        .attr("stroke", "white")
        .attr("stroke-width", 3);

      g.append("line")
        .attr("x1", cx)
        .attr("x2", cx)
        .attr("y1", cy)
        .attr("y2", above ? cy - 40 : cy + 40)
        .attr("stroke", m.color)
        .attr("stroke-width", 2);

      g.append("text")
        .attr("x", cx)
        .attr("y", above ? cy - 50 : cy + 60)
        .attr("text-anchor", "middle")
        .style("font-size", mode === "elderly" ? "16px" : "12px")
        .style("font-weight", "600")
        .style("fill", "#1e293b")
        .text(m.label);

      if (m.phase) {
        g.append("text")
          .attr("x", cx)
          .attr("y", above ? cy - 34 : cy + 76)
          .attr("text-anchor", "middle")
          .style("font-size", mode === "elderly" ? "14px" : "10px")
          .style("fill", "#64748b")
          .text(`(${m.phase})`);
      }
    });
  }, [mode]);

  return (
    <div className="bg-white rounded-xl shadow-sm border p-4">
      <h3 className={`font-bold mb-2 ${mode === "elderly" ? "text-xl" : "text-lg"}`}>
        Project Progress Timeline
      </h3>
      <p className="text-xs text-slate-500 mb-3">
        Aligned with real Malaysian COVID-19 phase boundaries.
      </p>
      <div className="overflow-x-auto">
        <svg ref={ref}></svg>
      </div>
    </div>
  );
}
