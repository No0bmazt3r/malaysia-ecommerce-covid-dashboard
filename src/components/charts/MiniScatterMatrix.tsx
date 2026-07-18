"use client";
import { useEffect, useRef } from "react";
import * as d3 from "d3";
import Link from "next/link";
import { useDashboard } from "@/context/DashboardContext";
import { useDashboardTheme } from "@/hooks/useDashboardTheme";

export function MiniScatterMatrix() {
  const { filteredData } = useDashboard();
  const theme = useDashboardTheme();
  const ref = useRef<SVGSVGElement>(null);
  const hasData = filteredData.length > 0;

  useEffect(() => {
    if (!ref.current || !hasData) return;

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
    const diagBg = isDark ? "rgba(15, 30, 46, 0.6)" : "#F6F3EC";

    // Only render the 3 most critical variables for the mini version
    const vars: { key: keyof (typeof filteredData)[0]; label: string }[] = [
      { key: "sales_revenue", label: "Revenue" },
      { key: "ad_spend_myr", label: "Ad Spend" },
      { key: "customer_rating", label: "Rating" },
    ];

    const size = 180;
    const padding = 20;
    const n = vars.length;
    const total = size * n + padding * 2;

    svg.attr("viewBox", `0 0 ${total} ${total}`);

    const g = svg.append("g").attr("transform", `translate(${padding},${padding})`);

    const scales = new Map();
    vars.forEach((v) => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const extent = d3.extent(sampledData, (d: any) => d[v.key] as number) as [number, number];
      scales.set(v.key, d3.scaleLinear().domain(extent).nice().range([size - 10, 10]));
    });

    const tooltip = d3
      .select("body")
      .append("div")
      .attr("class", "chart-tooltip")
      .style("position", "absolute")
      .style("background", isDark ? "rgba(15, 30, 46, 0.96)" : "rgba(255, 255, 255, 0.98)")
      .style("color", isDark ? "#E8ECF0" : "#0B2A4A")
      .style("padding", "8px 12px")
      .style("border-radius", "8px")
      .style("box-shadow", "0 4px 12px rgba(0,0,0,0.1)")
      .style("font-size", "12px")
      .style("pointer-events", "none")
      .style("opacity", 0)
      .style("z-index", "9999");

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
          .attr("stroke", isDark ? "#1E2E3E" : "#E8ECF0");

        if (i === j) {
          cell
            .append("rect")
            .attr("width", size)
            .attr("height", size)
            .attr("fill", diagBg);
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

          cell
            .selectAll("circle")
            .data(sampledData)
            .enter()
            .append("circle")
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            .attr("cx", (d: any) => scaleX(d[varX]))
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            .attr("cy", (d: any) => scaleY(d[varY]))
            .attr("r", 3)
            .attr("fill", dotColor)
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            .on("mouseover", function (event, d: any) {
              d3.select(this)
                .attr("r", 5)
                .attr("fill", isDark ? "#E48585" : "#D96C6C")
                .style("opacity", 1);

              tooltip
                .style("opacity", 1)
                .html(
                  `<strong>${d.product_category}</strong><br/>${vars[j].label}: ${d[varX]}<br/>${vars[i].label}: ${d[varY]}`
                );
            })
            .on("mousemove", (event) => {
              tooltip.style("left", event.pageX + 10 + "px").style("top", event.pageY - 10 + "px");
            })
            .on("mouseout", function () {
              d3.select(this).attr("r", 3).attr("fill", dotColor);
              tooltip.style("opacity", 0);
            });
        }
      }
    }

    return () => {
      tooltip.remove();
    };
  }, [filteredData, hasData, theme]);

  return (
    <div className="dashboard-card relative rounded-[var(--section-radius)] p-5">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-lg font-bold">Correlation Overview (Sampled)</h3>
          <p className="text-xs" style={{ color: 'var(--secondary, #5D8FA3)' }}>
            Lightweight 3×3 matrix comparing Revenue, Ad Spend, and Rating.
          </p>
        </div>
        <Link href="/product">
          <button className="inline-flex items-center gap-1.5 rounded-lg bg-[var(--accent-muted)] px-3 py-1.5 text-sm font-semibold text-[var(--accent)] hover:opacity-80 transition-colors">
            View Full 6×6 Matrix <span>→</span>
          </button>
        </Link>
      </div>

      <div className="overflow-x-auto">
        {hasData ? (
          <svg ref={ref} className="mx-auto min-w-[500px] w-full max-w-[700px]" />
        ) : (
          <p className="text-sm" style={{ color: 'var(--secondary, #5D8FA3)' }}>No data</p>
        )}
      </div>
    </div>
  );
}
