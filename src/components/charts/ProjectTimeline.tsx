"use client";
import { useEffect, useRef } from "react";
import * as d3 from "d3";
import { useDashboardTheme } from "@/hooks/useDashboardTheme";
import { useDashboard } from "@/context/DashboardContext";

export function ProjectTimeline() {
  const theme = useDashboardTheme();
  const { filters, setFilters } = useDashboard();
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

    const defs = svg.append("defs");

    // Pulse animation filter
    const pulseFilterId = "pulse-glow";
    const filter = defs
      .append("filter")
      .attr("id", pulseFilterId)
      .attr("x", "-50%")
      .attr("y", "-50%")
      .attr("width", "200%")
      .attr("height", "200%");
    filter
      .append("feGaussianBlur")
      .attr("stdDeviation", "3")
      .attr("result", "blur");
    const feMerge = filter.append("feMerge");
    feMerge.append("feMergeNode").attr("in", "blur");
    feMerge.append("feMergeNode").attr("in", "SourceGraphic");

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

    // Tooltip
    const tooltip = d3
      .select("body")
      .append("div")
      .attr("class", "chart-tooltip")
      .style("position", "absolute")
      .style("pointer-events", "none")
      .style("opacity", 0)
      .style("padding", "8px 12px")
      .style("border-radius", "10px")
      .style("border", `1px solid ${isDark ? "rgba(148,163,184,0.15)" : "rgba(148,163,184,0.25)"}`)
      .style("background", isDark ? "rgba(15, 23, 42, 0.96)" : "rgba(255, 255, 255, 0.98)")
      .style("color", isDark ? "#e2e8f0" : "#0f172a")
      .style("box-shadow", "0 8px 32px rgba(15, 23, 42, 0.16)")
      .style("font-size", "12px")
      .style("font-family", "Inter, system-ui, sans-serif")
      .style("z-index", "9999");

    // Main timeline line — animate on load
    const mainLine = g.append("line")
      .attr("x1", 0)
      .attr("x2", 0)
      .attr("y1", height / 2)
      .attr("y2", height / 2)
      .attr("stroke", lineColor)
      .attr("stroke-width", 2)
      .attr("stroke-dasharray", "6,6");

    mainLine
      .transition()
      .duration(800)
      .ease(d3.easeQuadOut)
      .attr("x2", width);

    // Determine which milestone is the latest/active one
    const now = new Date();
    let activeIndex = 0;
    milestones.forEach((m, i) => {
      const d = parse(m.date);
      if (d && d <= now) activeIndex = i;
    });

    // Milestone markers
    milestones.forEach((m, i) => {
      const cx = x(parse(m.date)!);
      const cy = height / 2;
      const above = i % 2 === 0;
      const isActive = i === activeIndex;
      const connectorTarget = above ? cy - 36 : cy + 36;

      // Connector line — animate on load
      const connector = g.append("line")
        .attr("x1", cx)
        .attr("x2", cx)
        .attr("y1", cy)
        .attr("y2", cy)
        .attr("stroke", m.color)
        .attr("stroke-width", 1.5)
        .attr("stroke-dasharray", "2,3");

      connector
        .transition()
        .delay(300 + i * 100)
        .duration(400)
        .ease(d3.easeQuadOut)
        .attr("y2", connectorTarget);

      // Pulse ring for active milestone
      if (isActive) {
        const pulseRing = g.append("circle")
          .attr("cx", cx)
          .attr("cy", cy)
          .attr("r", 7)
          .attr("fill", "none")
          .attr("stroke", m.color)
          .attr("stroke-width", 2)
          .attr("opacity", 0.6);

        function animatePulse() {
          pulseRing
            .attr("r", 7)
            .attr("opacity", 0.6)
            .transition()
            .duration(1500)
            .ease(d3.easeQuadOut)
            .attr("r", 18)
            .attr("opacity", 0)
            .on("end", animatePulse);
        }
        animatePulse();
      }

      // Circle
      const circle = g.append("circle")
        .attr("cx", cx)
        .attr("cy", cy)
        .attr("r", 7)
        .attr("fill", m.color)
        .attr("stroke", isDark ? "#0f172a" : "#ffffff")
        .attr("stroke-width", 3)
        .style("cursor", "pointer");

      if (isActive) {
        circle.attr("filter", `url(#${pulseFilterId})`);
      }

      // Hover interactions on circle
      circle
        .on("mouseenter", function (event) {
          d3.select(this)
            .transition()
            .duration(150)
            .attr("r", 11)
            .attr("stroke-width", 4);
          tooltip
            .style("opacity", 1)
            .html(
              `<div style="font-weight:700;margin-bottom:3px;color:${m.color}">${m.label}</div>` +
              `<div>Date: <strong>${m.date}</strong></div>` +
              (m.phase ? `<div>Phase: <strong>${m.phase}</strong></div>` : "") +
              (isActive ? `<div style="margin-top:4px;color:${m.color};font-weight:600;">● Active</div>` : "")
            );
        })
        .on("mousemove", (event) => {
          tooltip
            .style("left", `${event.pageX + 14}px`)
            .style("top", `${event.pageY - 14}px`);
        })
        .on("mouseleave", function () {
          d3.select(this)
            .transition()
            .duration(150)
            .attr("r", 7)
            .attr("stroke-width", 3);
          tooltip.style("opacity", 0);
        })
        .on("click", (_event, d) => {
          if (m.phase) {
            setFilters({
              ...filters,
              covidPhase: [m.phase],
            });
          }
        });

      // Label
      g.append("text")
        .attr("x", cx)
        .attr("y", above ? cy - 44 : cy + 52)
        .attr("text-anchor", "middle")
        .style("font-size", "11px")
        .style("font-weight", "700")
        .style("fill", textColor)
        .style("opacity", 0)
        .text(m.label)
        .transition()
        .delay(500 + i * 100)
        .duration(300)
        .style("opacity", 1);

      // Phase sublabel
      if (m.phase) {
        g.append("text")
          .attr("x", cx)
          .attr("y", above ? cy - 30 : cy + 66)
          .attr("text-anchor", "middle")
          .style("font-size", "9px")
          .style("fill", mutedColor)
          .style("opacity", 0)
          .text(`(${m.phase})`)
          .transition()
          .delay(600 + i * 100)
          .duration(300)
          .style("opacity", 1);
      }
    });

    // Context bar: COVID phases
    const contextAxisY = height + 46;
    g.append("text")
      .attr("x", 0)
      .attr("y", contextAxisY - 10)
      .style("font-size", "10px")
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
        .style("font-size", "9px")
        .style("font-weight", "600")
        .style("fill", textColor)
        .text(phase.label);
    });

    return () => {
      tooltip.remove();
    };
  }, [theme]);

  return (
    <div className="dashboard-card rounded-[var(--section-radius)] p-5">
      <div className="mb-4 flex items-end justify-between gap-4">
        <div>
          <h3
            className="text-lg font-bold tracking-tight text-slate-950 dark:text-white"
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
