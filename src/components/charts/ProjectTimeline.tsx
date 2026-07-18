"use client";
import { useEffect, useRef } from "react";
import * as d3 from "d3";
import { useDashboardTheme } from "@/hooks/useDashboardTheme";
import { useDashboard } from "@/context/DashboardContext";

export function ProjectTimeline() {
  const theme = useDashboardTheme();
  const { filters, setFilters } = useDashboard();
  const ref = useRef<SVGSVGElement>(null);

  // Click handlers read the latest filters through a ref so the chart only
  // rebuilds (and replays its animations) on theme change, not every filter change.
  const filtersRef = useRef(filters);
  useEffect(() => {
    filtersRef.current = filters;
  }, [filters]);

  useEffect(() => {
    if (!ref.current) return;
    const svg = d3.select(ref.current);
    svg.selectAll("*").remove();

    const isDark = theme === "dark";
    const textColor = isDark ? "#E8ECF0" : "#0B2A4A";
    const mutedColor = isDark ? "#94a3b8" : "#64748b";
    const lineColor = isDark ? "rgba(148, 163, 184, 0.45)" : "#C6C1BC";

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

    // Semester timeline: May 2026 intake. The phase tags theme each work
    // stage to the dataset's COVID phases shown in the context bar below.
    const milestones = [
      // Navy is invisible on the dark background; use the dusty-blue variant there.
      { date: "2026-05-12", label: "Project Initiation", color: isDark ? "#6B9DB1" : "#0B2A4A" },
      { date: "2026-05-26", label: "Data Collection", phase: "Pre-MCO", color: "#8DB596" },
      { date: "2026-06-09", label: "Data Cleaning", phase: "MCO", color: "#E4B363" },
      { date: "2026-06-30", label: "Dashboard Dev", phase: "CMCO", color: "#5D8FA3" },
      { date: "2026-07-14", label: "Testing & Validation", phase: "RMCO", color: "#63B7B2" },
      { date: "2026-08-04", label: "Deployment", color: "#D96C6C" },
    ];

    const parse = d3.timeParse("%Y-%m-%d");
    const dates = milestones.map((m) => parse(m.date) as Date);
    const x = d3.scaleTime().domain([d3.min(dates)!, d3.max(dates)!]).range([0, width]);
    const contextScale = d3
      .scaleTime()
      .domain([parse("2020-01-01")!, parse("2021-12-31")!])
      .range([0, width]);

    const covidPhases = [
      { label: "Pre-MCO", start: "2020-01-01", end: "2020-03-17", color: isDark ? "rgba(141, 181, 150, 0.3)" : "#d1fae5" },
      { label: "MCO", start: "2020-03-18", end: "2020-05-03", color: isDark ? "rgba(217, 108, 108, 0.3)" : "#fee2e2" },
      { label: "CMCO", start: "2020-05-04", end: "2020-06-09", color: isDark ? "rgba(228, 179, 99, 0.3)" : "#fef3c7" },
      { label: "RMCO", start: "2020-06-10", end: "2021-12-31", color: isDark ? "rgba(93, 143, 163, 0.3)" : "#dbeafe" },
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
      .style("border", `1px solid ${isDark ? "rgba(198, 193, 188, 0.15)" : "rgba(198, 193, 188, 0.3)"}`)
      .style("background", isDark ? "rgba(15, 30, 46, 0.96)" : "rgba(255, 255, 255, 0.98)")
      .style("color", isDark ? "#E8ECF0" : "#0B2A4A")
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
        .attr("stroke", isDark ? "#0F1E2E" : "#ffffff")
        .attr("stroke-width", 3)
        .style("cursor", "pointer");

      if (isActive) {
        circle.attr("filter", `url(#${pulseFilterId})`);
      }

      // Hover interactions on circle
      circle
        .on("mouseenter", function () {
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
        .on("click", () => {
          if (m.phase) {
            setFilters({
              ...filtersRef.current,
              covidPhase: [m.phase],
            });
          }
        });

      // Label — clamp x so edge labels stay inside the drawable area
      const label = g.append("text")
        .attr("y", above ? cy - 44 : cy + 52)
        .attr("text-anchor", "middle")
        .style("font-size", "11px")
        .style("font-weight", "700")
        .style("fill", textColor)
        .style("opacity", 0)
        .text(m.label);

      const halfLabel = (label.node()?.getComputedTextLength() ?? 0) / 2;
      const labelX = Math.max(
        halfLabel - margin.left + 4,
        Math.min(width + margin.right - halfLabel - 4, cx)
      );

      label
        .attr("x", labelX)
        .transition()
        .delay(500 + i * 100)
        .duration(300)
        .style("opacity", 1);

      // Phase sublabel — follows the (possibly clamped) label position
      if (m.phase) {
        g.append("text")
          .attr("x", labelX)
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
        .attr("rx", 2)
        .attr("fill", phase.color)
        .attr("stroke", isDark ? "rgba(148,163,184,0.35)" : "rgba(148,163,184,0.3)");

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
  }, [theme, setFilters]);

  return (
    <div className="dashboard-card chart-fig rounded-[var(--section-radius)] p-5">
      <div className="mb-4 flex items-end justify-between gap-4">
        <div>
          <h3
            className="text-lg font-bold tracking-tight"
            style={{ fontFamily: "var(--font-display)", color: 'var(--foreground)' }}
          >
            Project Progress Timeline
          </h3>
          <p className="mt-0.5 text-xs" style={{ color: 'var(--secondary, #5D8FA3)' }}>
            Milestones aligned with real Malaysian COVID-19 phase boundaries.
          </p>
        </div>
      </div>
      <div className="overflow-x-auto rounded-[2px] border border-[var(--border)] bg-[var(--surface-muted)] p-3">
        <svg ref={ref} className="w-full" preserveAspectRatio="xMidYMid meet" />
      </div>
    </div>
  );
}
