"use client";
import { useEffect, useRef, useState } from "react";
import * as d3 from "d3";
import { createD3Tooltip, positionTooltip } from "@/lib/d3-utils";
import Link from "next/link";
import { useDashboard } from "@/context/DashboardContext";
import { useDashboardTheme } from "@/hooks/useDashboardTheme";

export function MiniScatterMatrix() {
  const { filteredData, loading } = useDashboard();
  const theme = useDashboardTheme();
  const ref = useRef<SVGSVGElement>(null);
  const [deferred, setDeferred] = useState(false);
  const hasData = filteredData.length > 0;

  // Defer heavy SVG rendering so the page doesn't freeze for 5 seconds on load
  useEffect(() => {
    const t = setTimeout(() => setDeferred(true), 50);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    if (!ref.current || !hasData || !deferred) return;

    const svg = d3.select(ref.current);
    svg.selectAll("*").remove();

    // Subsample data to a maximum of 300 points to ensure instant rendering
    const sampleSize = 300;
    const sampledData =
      filteredData.length > sampleSize
        ? d3.shuffle([...filteredData]).slice(0, sampleSize)
        : filteredData;

    const isDark = theme === "dark";
    const axisColor = isDark ? "#94a3b8" : "#64748b";
    const dotColor = isDark ? "rgba(107, 157, 177, 0.4)" : "rgba(93, 143, 163, 0.4)";

    // Only render the 3 most critical variables for the mini version
    const vars: { key: keyof (typeof filteredData)[0]; label: string }[] = [
      { key: "sales_revenue", label: "Revenue" },
      { key: "ad_spend_myr", label: "Ad Spend" },
      { key: "customer_rating", label: "Rating" },
    ];

    const size = 180;
    const margin = { top: 10, right: 10, bottom: 30, left: 40 };
    const n = vars.length;
    const totalW = size * n + margin.left + margin.right;
    const totalH = size * n + margin.top + margin.bottom;

    svg.attr("viewBox", `0 0 ${totalW} ${totalH}`);

    const g = svg.append("g").attr("transform", `translate(${margin.left},${margin.top})`);

    const scales = new Map();
    vars.forEach((v) => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const extent = d3.extent(sampledData, (d: any) => d[v.key] as number) as [number, number];
      scales.set(v.key, d3.scaleLinear().domain(extent).nice().range([size - 10, 10]));
    });

    const tooltip = createD3Tooltip(theme);

    for (let i = 0; i < n; i++) {
      for (let j = 0; j < n; j++) {
        const cell = g
          .append("g")
          .attr("transform", `translate(${j * size},${i * size})`);

        cell
          .append("rect")
          .attr("width", size)
          .attr("height", size)
          .attr("fill", "none")
          .attr("stroke", isDark ? "rgba(255, 255, 255, 0.08)" : "rgba(0, 0, 0, 0.08)");

        if (i === j) {
          cell.select("rect").attr("stroke", "none");
          cell
            .append("text")
            .attr("x", size / 2)
            .attr("y", size / 2)
            .attr("text-anchor", "middle")
            .attr("alignment-baseline", "middle")
            .style("font-size", "14px")
            .style("font-weight", "600")
            .style("fill", axisColor)
            .text(vars[i].label);
        } else {
          const varX = vars[j].key;
          const varY = vars[i].key;
          const scaleX = d3.scaleLinear().domain(scales.get(varX).domain()).range([10, size - 10]);
          const scaleY = scales.get(varY);

          const dotsGroup = cell.append("g").attr("class", "dots");

          dotsGroup
            .selectAll("circle")
            .data(sampledData)
            .enter()
            .append("circle")
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            .attr("cx", (d: any) => scaleX(d[varX]))
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            .attr("cy", (d: any) => scaleY(d[varY]))
            .attr("r", 2.5)
            .attr("fill", dotColor)
            .attr("opacity", 0.7)
            .style("mix-blend-mode", isDark ? "screen" : "multiply")
            .style("cursor", "pointer");

          dotsGroup
            .on("mouseover", function (event) {
              const target = event.target as Element;
              if (target.tagName === "circle") {
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                const d = d3.select(target).datum() as any;
                d3.select(target)
                  .attr("r", 5)
                  .attr("fill", isDark ? "#E48585" : "#D96C6C")
                  .style("opacity", 1);

                tooltip
                  .style("opacity", 1)
                  .html(
                    `<strong>${d.product_category}</strong><br/>${vars[j].label}: ${d[varX]}<br/>${vars[i].label}: ${d[varY]}`
                  );
                positionTooltip(tooltip, event);
              }
            })
            .on("mousemove", (event) => {
              const target = event.target as Element;
              if (target.tagName === "circle") {
                positionTooltip(tooltip, event);
              }
            })
            .on("mouseout", function (event) {
              const target = event.target as Element;
              if (target.tagName === "circle") {
                d3.select(target).attr("r", 2.5).attr("fill", dotColor).style("opacity", 0.7);
                tooltip.style("opacity", 0);
              }
            });
            
          // Add external axes
          if (i === n - 1) {
            const xAxis = d3.axisBottom(scaleX).ticks(4).tickSize(4);
            const gx = cell.append("g").attr("transform", `translate(0,${size})`).call(xAxis);
            gx.selectAll("text").style("font-size", "10px").attr("fill", axisColor).style("opacity", 0.7);
            gx.selectAll("path, line").attr("stroke", isDark ? "rgba(255, 255, 255, 0.2)" : "rgba(0, 0, 0, 0.2)");
          }
          if (j === 0) {
            const yAxis = d3.axisLeft(scaleY).ticks(4).tickSize(4);
            const gy = cell.append("g").call(yAxis);
            gy.selectAll("text").style("font-size", "10px").attr("fill", axisColor).style("opacity", 0.7);
            gy.selectAll("path, line").attr("stroke", isDark ? "rgba(255, 255, 255, 0.2)" : "rgba(0, 0, 0, 0.2)");
          }
        }
      }
    }

    return () => {
      tooltip.remove();
    };
  }, [filteredData, hasData, theme, deferred]);

  return (
    <div className="dashboard-card chart-fig relative rounded-[var(--section-radius)] p-5">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-lg font-bold">Correlation Overview (Sampled)</h3>
          <p className="text-xs" style={{ color: 'var(--secondary, #5D8FA3)' }}>
            Lightweight 3×3 matrix comparing Revenue, Ad Spend, and Rating.
          </p>
        </div>
        <Link href="/product?tab=correlation">
          <button className="inline-flex items-center gap-1.5 rounded-[2px] bg-[var(--accent-muted)] px-3 py-1.5 text-sm font-semibold text-[var(--accent)] hover:opacity-80 transition-colors">
            View Full 6×6 Matrix <span>→</span>
          </button>
        </Link>
      </div>

      <div className="overflow-x-auto">
        {loading || !deferred ? (
        <div className="h-[320px] w-full rounded-[2px] skeleton-shimmer" />
      ) : hasData ? (
          <svg ref={ref} className="mx-auto min-w-[500px] w-full max-w-[700px]" />
        ) : (
          <div className="grid min-h-[240px] place-items-center rounded-[2px] border border-dashed border-[var(--border-strong)] bg-[var(--surface-muted)] px-6 text-center">
          <div>
            <p className="text-sm font-semibold" style={{ color: 'var(--foreground)' }}>No data for the current filters</p>
            <p className="mt-1 text-xs" style={{ color: 'var(--secondary, #5D8FA3)' }}>Clear one or more filters to bring this chart back.</p>
          </div>
        </div>
        )}
      </div>
    </div>
  );
}
