"use client";
import { useEffect, useRef } from "react";
import * as d3 from "d3";
import { useDashboardTheme } from "@/hooks/useDashboardTheme";
import { useDashboard } from "@/context/DashboardContext";

export function CovidPhaseTimeline() {
  const theme = useDashboardTheme();
  const { filters, setFilters } = useDashboard();
  const ref = useRef<SVGSVGElement>(null);

  useEffect(() => {
    if (!ref.current) return;
    const svg = d3.select(ref.current);
    svg.selectAll("*").remove();

    const isDark = theme === "dark";
    const textColor = isDark ? "#E8ECF0" : "#0B2A4A";

    const margin = { top: 15, right: 40, bottom: 25, left: 40 };
    const width = 960 - margin.left - margin.right;
    const height = 80 - margin.top - margin.bottom;

    svg.attr("viewBox", `0 0 ${width + margin.left + margin.right} ${height + margin.top + margin.bottom}`);

    const g = svg
      .append("g")
      .attr("transform", `translate(${margin.left},${margin.top})`);

    const parse = d3.timeParse("%Y-%m-%d");
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

    const xAxis = d3.axisBottom(contextScale)
      .ticks(d3.timeMonth.every(2))
      .tickFormat((d) => d3.timeFormat("%b '%y")(d as Date));

    g.append("g")
      .attr("transform", `translate(0, ${height + 2})`)
      .call(xAxis)
      .selectAll("text")
      .style("font-family", "IBM Plex Mono")
      .style("font-size", "10px")
      .style("fill", textColor)
      .style("opacity", 0.7);

    g.selectAll(".domain").remove();
    g.selectAll(".tick line").style("stroke", isDark ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.1)");

    covidPhases.forEach((phase) => {
      const startX = contextScale(parse(phase.start)!);
      const endX = contextScale(parse(phase.end)!);
      const widthX = Math.max(endX - startX, 4);

      const isFiltered = filters.covidPhase.length > 0;
      const isActive = !isFiltered || filters.covidPhase.includes(phase.label);
      const activeStroke = isDark ? "#ffffff" : "#0B2A4A";
      const inactiveStroke = isDark ? "rgba(148,163,184,0.35)" : "rgba(148,163,184,0.3)";

      const rect = g.append("rect")
        .attr("x", startX)
        .attr("y", 0)
        .attr("width", widthX)
        .attr("height", height)
        .attr("rx", 3)
        .attr("fill", phase.color)
        .attr("stroke", isActive && isFiltered ? activeStroke : inactiveStroke)
        .attr("stroke-width", isActive && isFiltered ? 2 : 1)
        .style("opacity", isActive ? 1 : 0.4)
        .style("cursor", "pointer");

      rect
        .on("mouseenter", function () {
          d3.select(this)
            .attr("stroke", activeStroke)
            .attr("stroke-width", 2)
            .style("opacity", 1);
          tooltip
            .style("opacity", 1)
            .html(
              `<div style="font-weight:700;margin-bottom:3px;color:${isDark ? '#E8ECF0' : '#0B2A4A'}">${phase.label}</div>` +
              `<div>${phase.start} to ${phase.end}</div>` +
              `<div style="margin-top:4px;color:var(--accent);font-weight:600;">${isActive && isFiltered ? 'Click to deselect' : 'Click to filter'}</div>`
            );
        })
        .on("mousemove", (event) => {
          tooltip
            .style("left", `${event.pageX + 14}px`)
            .style("top", `${event.pageY - 14}px`);
        })
        .on("mouseleave", function () {
          d3.select(this)
            .attr("stroke", isActive && isFiltered ? activeStroke : inactiveStroke)
            .attr("stroke-width", isActive && isFiltered ? 2 : 1)
            .style("opacity", isActive ? 1 : 0.4);
          tooltip.style("opacity", 0);
        })
        .on("click", () => {
          let newPhases = [...filters.covidPhase];
          if (newPhases.includes(phase.label)) {
            newPhases = newPhases.filter(p => p !== phase.label);
          } else {
            newPhases.push(phase.label);
          }
          setFilters({
            ...filters,
            covidPhase: newPhases,
          });
        });

      g.append("text")
        .attr("x", startX + widthX / 2)
        .attr("y", height / 2 + 4)
        .attr("text-anchor", "middle")
        .style("font-size", "11px")
        .style("font-weight", "600")
        .style("fill", textColor)
        .style("opacity", isActive ? 1 : 0.5)
        .style("pointer-events", "none")
        .text(phase.label);
    });

    return () => {
      tooltip.remove();
    };
  }, [theme, filters, setFilters]);

  return (
    <div className="dashboard-card chart-fig rounded-[var(--section-radius)] p-5">
      <div className="mb-4 flex items-end justify-between gap-4">
        <div>
          <h3
            className="text-lg font-bold tracking-tight"
            style={{ fontFamily: "var(--font-display)", color: 'var(--foreground)' }}
          >
            Dataset Context: COVID-19 Phases
          </h3>
          <p className="mt-0.5 text-xs" style={{ color: 'var(--secondary, #5D8FA3)' }}>
            Malaysian MCO/CMCO/RMCO phase boundaries (2020-2021). Click a phase to filter.
          </p>
        </div>
      </div>
      <div className="overflow-x-auto rounded-[2px] border border-[var(--border)] bg-[var(--surface-muted)] p-3">
        <svg ref={ref} className="w-full" preserveAspectRatio="xMidYMid meet" />
      </div>
    </div>
  );
}
