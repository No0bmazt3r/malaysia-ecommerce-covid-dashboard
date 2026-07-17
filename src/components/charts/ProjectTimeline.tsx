"use client";
import { useEffect, useRef } from "react";
import * as d3 from "d3";
import { useDashboard } from "@/context/DashboardContext";
import { useDashboardTheme } from "@/hooks/useDashboardTheme";

export function ProjectTimeline() {
  const { mode } = useDashboard();
  const theme = useDashboardTheme();
  const ref = useRef<SVGSVGElement>(null);

  useEffect(() => {
    if (!ref.current) return;
    const svg = d3.select(ref.current);
    svg.selectAll("*").remove();

    const isDark = theme === "dark";
    const textColor = isDark ? "#e2e8f0" : "#1e293b";
    const mutedColor = isDark ? "#94a3b8" : "#64748b";
    const lineColor = isDark ? "#334155" : "#cbd5e1";

    const margin = { top: 40, right: 40, bottom: 70, left: 40 };
    const width = 960 - margin.left - margin.right;
    const height = 240 - margin.top - margin.bottom;

    svg.attr("viewBox", `0 0 ${width + margin.left + margin.right} ${height + margin.top + margin.bottom}`);

    const g = svg
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
    const contextScale = d3
      .scaleTime()
      .domain([parse("2020-01-01")!, parse("2021-12-31")!])
      .range([0, width]);

    const covidPhases = [
      { label: "Pre-MCO", start: "2020-01-01", end: "2020-03-17", color: isDark ? "rgba(16,185,129,0.15)" : "#d1fae5" },
      { label: "MCO", start: "2020-03-18", end: "2020-05-03", color: isDark ? "rgba(239,68,68,0.15)" : "#fee2e2" },
      { label: "CMCO", start: "2020-05-04", end: "2020-06-09", color: isDark ? "rgba(245,158,11,0.15)" : "#fef3c7" },
      { label: "RMCO", start: "2020-06-10", end: "2021-12-31", color: isDark ? "rgba(59,130,246,0.15)" : "#dbeafe" },
    ];

    // Main timeline line
    g.append("line")
      .attr("x1", 0)
      .attr("x2", width)
      .attr("y1", height / 2)
      .attr("y2", height / 2)
      .attr("stroke", lineColor)
      .attr("stroke-width", 2)
      .attr("stroke-dasharray", "6,6");

    // Milestone markers
    milestones.forEach((m, i) => {
      const cx = x(parse(m.date)!);
      const cy = height / 2;
      const above = i % 2 === 0;

      // Connector line
      g.append("line")
        .attr("x1", cx)
        .attr("x2", cx)
        .attr("y1", cy)
        .attr("y2", above ? cy - 36 : cy + 36)
        .attr("stroke", m.color)
        .attr("stroke-width", 1.5)
        .attr("stroke-dasharray", "2,3");

      // Circle
      g.append("circle")
        .attr("cx", cx)
        .attr("cy", cy)
        .attr("r", mode === "elderly" ? 10 : 7)
        .attr("fill", m.color)
        .attr("stroke", isDark ? "#0f172a" : "#ffffff")
        .attr("stroke-width", 3);

      // Label
      g.append("text")
        .attr("x", cx)
        .attr("y", above ? cy - 44 : cy + 52)
        .attr("text-anchor", "middle")
        .style("font-size", mode === "elderly" ? "14px" : "11px")
        .style("font-weight", "700")
        .style("fill", textColor)
        .text(m.label);

      // Phase sublabel
      if (m.phase) {
        g.append("text")
          .attr("x", cx)
          .attr("y", above ? cy - 30 : cy + 66)
          .attr("text-anchor", "middle")
          .style("font-size", mode === "elderly" ? "12px" : "9px")
          .style("fill", mutedColor)
          .text(`(${m.phase})`);
      }
    });

    // Context bar: COVID phases
    const contextAxisY = height + 46;
    g.append("text")
      .attr("x", 0)
      .attr("y", contextAxisY - 10)
      .style("font-size", mode === "elderly" ? "12px" : "10px")
      .style("font-weight", "700")
      .style("fill", textColor)
      .text("Dataset context: Malaysian COVID-19 phase boundaries");

    covidPhases.forEach((phase) => {
      const startX = contextScale(parse(phase.start)!);
      const endX = contextScale(parse(phase.end)!);
      const widthX = Math.max(endX - startX, 4);

      g.append("rect")
        .attr("x", startX)
        .attr("y", contextAxisY + 2)
        .attr("width", widthX)
        .attr("height", 16)
        .attr("rx", 4)
        .attr("fill", phase.color)
        .attr("stroke", isDark ? "rgba(148,163,184,0.15)" : "rgba(148,163,184,0.3)");

      g.append("text")
        .attr("x", startX + widthX / 2)
        .attr("y", contextAxisY + 14)
        .attr("text-anchor", "middle")
        .style("font-size", mode === "elderly" ? "11px" : "9px")
        .style("font-weight", "600")
        .style("fill", textColor)
        .text(phase.label);
    });
  }, [mode, theme]);

  return (
    <div className="dashboard-card rounded-[var(--section-radius)] p-5">
      <div className="mb-4 flex items-end justify-between gap-4">
        <div>
          <h3
            className={`font-bold tracking-tight text-slate-950 dark:text-white ${
              mode === "elderly" ? "text-xl" : "text-lg"
            }`}
            style={{ fontFamily: "var(--font-display)" }}
          >
            Project Progress Timeline
          </h3>
          <p className="mt-0.5 text-xs text-slate-500 dark:text-slate-400">
            Milestones aligned with real Malaysian COVID-19 phase boundaries.
          </p>
        </div>
        <span className="rounded-md bg-violet-500/10 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-[0.15em] text-violet-600 dark:text-violet-300">
          Milestones
        </span>
      </div>
      <div className="overflow-x-auto rounded-xl border border-[var(--border)] bg-[var(--surface-muted)] p-3">
        <svg ref={ref} className="w-full" preserveAspectRatio="xMidYMid meet" />
      </div>
    </div>
  );
}
