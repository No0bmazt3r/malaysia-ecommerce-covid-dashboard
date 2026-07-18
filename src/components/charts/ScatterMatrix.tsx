"use client";
import { useEffect, useRef } from "react";
import * as d3 from "d3";
import { useDashboard } from "@/context/DashboardContext";
import { useDashboardTheme } from "@/hooks/useDashboardTheme";

export function ScatterMatrix() {
  const { filteredData, loading } = useDashboard();
  const theme = useDashboardTheme();
  const ref = useRef<SVGSVGElement>(null);

  const hasData = filteredData.length > 0;

  useEffect(() => {
    if (!ref.current || !hasData) return;

    const svg = d3.select(ref.current);
    svg.selectAll("*").remove();

    const isDark = theme === "dark";
    const panelFill = isDark ? "rgba(15, 30, 46, 0.4)" : "#FAFBFC";
    const borderColor = isDark ? "#1E2E3E" : "#E8ECF0";
    const labelColor = isDark ? "#CBD5E1" : "#475569";
    const diagBg = isDark ? "rgba(15, 30, 46, 0.6)" : "#F6F3EC";

    const vars: { key: keyof (typeof filteredData)[0]; label: string }[] = [
      { key: "sales_revenue", label: "Revenue" },
      { key: "ad_spend_myr", label: "Ad Spend" },
      { key: "delivery_time_days", label: "Delivery" },
      { key: "customer_rating", label: "Rating" },
      { key: "unit_price", label: "Price" },
      { key: "discount_pct", label: "Discount" },
    ];

    const size = 130;
    const padding = 16;
    const n = vars.length;
    const total = size * n + padding * 2;

    svg.attr("viewBox", `0 0 ${total} ${total}`);

    const scales = vars.map((v) => {
      const extent = d3.extent(filteredData, (d) => +d[v.key]) as [number, number];
      return d3.scaleLinear().domain(extent).nice().range([padding, size - padding]);
    });

    const phaseColor = d3
      .scaleOrdinal<string>()
      .domain(["Pre-MCO", "MCO", "CMCO", "RMCO"])
      .range(["#8DB596", "#D96C6C", "#E4B363", "#5D8FA3"]);

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

    for (let i = 0; i < n; i++) {
      for (let j = 0; j < n; j++) {
        const cell = svg
          .append("g")
          .attr("transform", `translate(${j * size},${i * size})`);

        if (i === j) {
          // Diagonal: label
          cell
            .append("rect")
            .attr("width", size)
            .attr("height", size)
            .attr("rx", 6)
            .attr("fill", diagBg)
            .attr("stroke", borderColor);

          cell
            .append("text")
            .attr("x", size / 2)
            .attr("y", size / 2)
            .attr("text-anchor", "middle")
            .attr("dominant-baseline", "middle")
            .style("font-size", "11px")
            .style("font-weight", "700")
            .style("letter-spacing", "0.02em")
            .attr("fill", labelColor)
            .text(vars[i].label);
        } else {
          // Scatter cell
          cell
            .append("rect")
            .attr("width", size)
            .attr("height", size)
            .attr("rx", 6)
            .attr("fill", panelFill)
            .attr("stroke", borderColor);

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
            .attr("r", 2)
            .attr("fill", (d) => phaseColor(d.covid_phase))
            .attr("opacity", 0.55)
            .style("cursor", "pointer")
            .on("mouseenter", function (event, d) {
              d3.select(this)
                .transition()
                .duration(100)
                .attr("r", 5)
                .attr("opacity", 1);
              tooltip
                .style("opacity", 1)
                .html(
                  `<div style="font-weight:700;margin-bottom:3px;">${d.covid_phase}</div>` +
                  `<div>${vars[j].label}: <strong>${(+d[xVar]).toLocaleString("en-MY", { maximumFractionDigits: 2 })}</strong></div>` +
                  `<div>${vars[i].label}: <strong>${(+d[yVar]).toLocaleString("en-MY", { maximumFractionDigits: 2 })}</strong></div>`
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
                .duration(100)
                .attr("r", 2)
                .attr("opacity", 0.55);
              tooltip.style("opacity", 0);
            });
        }
      }
    }

    // Legend
    const legend = svg
      .append("g")
      .attr("transform", `translate(${n * size - 130}, 8)`);

    legend
      .append("rect")
      .attr("x", -10)
      .attr("y", -10)
      .attr("width", 120)
      .attr("height", 100)
      .attr("rx", 8)
      .attr("fill", isDark ? "rgba(15, 30, 46, 0.8)" : "rgba(255, 255, 255, 0.9)")
      .attr("stroke", borderColor);

    ["Pre-MCO", "MCO", "CMCO", "RMCO"].forEach((p, i) => {
      legend
        .append("circle")
        .attr("cx", 4)
        .attr("cy", i * 22)
        .attr("r", 5)
        .attr("fill", phaseColor(p));
      legend
        .append("text")
        .attr("x", 16)
        .attr("y", i * 22 + 4)
        .style("font-size", "11px")
        .style("font-weight", "500")
        .attr("fill", labelColor)
        .text(p);
    });

    return () => {
      tooltip.remove();
    };
  }, [filteredData, hasData, theme]);

  return (
    <div className="dashboard-card overflow-hidden rounded-[var(--section-radius)] p-5">
      <div className="mb-4 flex items-end justify-between gap-4">
        <div>
          <h3
            className="text-lg font-bold tracking-tight"
            style={{ fontFamily: "var(--font-display)", color: 'var(--foreground)' }}
          >
            Scatter Plot Matrix
          </h3>
          <p className="mt-0.5 text-xs" style={{ color: 'var(--secondary, #5D8FA3)' }}>
            Explore relationships across ad spend, delivery, revenue, and rating.
          </p>
        </div>
        <span className="rounded-md px-2 py-0.5 text-[10px] font-semibold uppercase tracking-[0.15em]" style={{ background: 'rgba(141, 181, 150, 0.12)', color: '#8DB596' }}>
          Correlation
        </span>
      </div>
      <p className="mb-3 text-[11px]" style={{ color: 'var(--secondary, #5D8FA3)' }}>
        Reveals ad_spend ↔ revenue (r≈0.66) and delivery_time ↔ rating (r≈−0.75).
      </p>
      {loading ? (
        <div className="mx-auto h-[600px] w-full rounded-xl skeleton-shimmer" />
      ) : hasData ? (
        <div className="overflow-x-auto rounded-xl border border-[var(--border)] bg-[var(--surface-muted)] p-3">
          <svg ref={ref} className="w-full" preserveAspectRatio="xMidYMid meet" />
        </div>
      ) : (
        <div className="grid min-h-[280px] place-items-center rounded-xl border border-dashed border-[var(--border-strong)] bg-[var(--surface-muted)] px-6 text-center">
          <div>
            <p className="text-sm font-semibold" style={{ color: 'var(--foreground)' }}>
              No scatter points to plot
            </p>
            <p className="mt-1 text-xs" style={{ color: 'var(--secondary, #5D8FA3)' }}>
              Adjust the filters to restore the correlation matrix.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
