"use client";
import { useEffect, useMemo, useRef } from "react";
import * as d3 from "d3";
import { useDashboard } from "@/context/DashboardContext";
import { useDashboardTheme } from "@/hooks/useDashboardTheme";

type Segment = { key: string; value: number };

// Fixed hue per segment so colors never repaint when filters change.
const SEGMENT_ORDER = ["New", "Returning", "Loyal/VIP"];
const SEGMENT_COLOR: Record<string, string> = {
  New: "#5D8FA3",
  Returning: "#63B7B2",
  "Loyal/VIP": "#8DB596",
};

const compactRM = new Intl.NumberFormat("en-MY", {
  notation: "compact",
  maximumFractionDigits: 1,
});

export function SegmentDonutChart() {
  const { filteredData, loading } = useDashboard();
  const theme = useDashboardTheme();
  const ref = useRef<SVGSVGElement>(null);
  const hasData = filteredData.length > 0;

  const segments = useMemo<Segment[]>(() => {
    const roll = d3.rollup(
      filteredData,
      (v) => d3.sum(v, (d) => d.sales_revenue),
      (d) => d.customer_segment
    );
    return Array.from(roll, ([key, value]) => ({ key, value })).sort(
      (a, b) => SEGMENT_ORDER.indexOf(a.key) - SEGMENT_ORDER.indexOf(b.key)
    );
  }, [filteredData]);

  const total = useMemo(() => d3.sum(segments, (d) => d.value), [segments]);

  useEffect(() => {
    if (!ref.current || !hasData) return;

    const svg = d3.select(ref.current);
    svg.selectAll("*").remove();

    const isDark = theme === "dark";
    const surface = isDark ? "#0F1E2E" : "#ffffff";
    const inkStrong = isDark ? "#E8ECF0" : "#0B2A4A";
    const inkMuted = isDark ? "#94a3b8" : "#64748b";

    const width = 320;
    const height = 250;
    const radius = Math.min(width, height) / 2 - 10;

    svg.attr("viewBox", `0 0 ${width} ${height}`);
    const g = svg.append("g").attr("transform", `translate(${width / 2},${height / 2})`);

    const pie = d3
      .pie<Segment>()
      .value((d) => d.value)
      .sort(null)
      .padAngle(0.02);

    const arc = d3
      .arc<d3.PieArcDatum<Segment>>()
      .innerRadius(radius * 0.68)
      .outerRadius(radius)
      .cornerRadius(2);

    const arcHover = d3
      .arc<d3.PieArcDatum<Segment>>()
      .innerRadius(radius * 0.68)
      .outerRadius(radius + 6)
      .cornerRadius(2);

    // Center readout: shows the total until a slice is hovered.
    const centerLabel = g
      .append("text")
      .attr("y", -22)
      .attr("text-anchor", "middle")
      .style("font-family", "var(--font-mono)")
      .style("font-size", "9px")
      .style("font-weight", "500")
      .style("letter-spacing", "0.08em")
      .attr("fill", inkMuted);

    const centerValue = g
      .append("text")
      .attr("y", 4)
      .attr("text-anchor", "middle")
      .style("font-family", "var(--font-mono)")
      .style("font-size", "21px")
      .style("font-weight", "600")
      .attr("fill", inkStrong);

    const centerShare = g
      .append("text")
      .attr("y", 24)
      .attr("text-anchor", "middle")
      .style("font-family", "var(--font-mono)")
      .style("font-size", "11px")
      .attr("fill", inkMuted);

    const showTotal = () => {
      centerLabel.text("TOTAL REVENUE");
      centerValue.text(`RM ${compactRM.format(total)}`);
      centerShare.text(`${segments.length} segments`);
    };
    showTotal();

    const paths = g
      .selectAll<SVGPathElement, d3.PieArcDatum<Segment>>("path")
      .data(pie(segments))
      .enter()
      .append("path")
      .attr("d", arc)
      .attr("fill", (d) => SEGMENT_COLOR[d.data.key] ?? "#D96C6C")
      .attr("stroke", surface)
      .attr("stroke-width", 2)
      .style("cursor", "pointer");

    paths
      .on("mouseenter", function (_event, d) {
        d3.select(this).transition().duration(120).attr("d", arcHover(d));
        paths.attr("opacity", (a) => (a.index === d.index ? 1 : 0.45));
        centerLabel.text(d.data.key.toUpperCase());
        centerValue.text(`RM ${compactRM.format(d.data.value)}`);
        centerShare.text(`${((d.data.value / total) * 100).toFixed(1)}% of revenue`);
      })
      .on("mouseleave", function (_event, d) {
        d3.select(this).transition().duration(120).attr("d", arc(d));
        paths.attr("opacity", 1);
        showTotal();
      });
  }, [segments, total, hasData, theme]);

  return (
    <div className="dashboard-card chart-fig rounded-[var(--section-radius)] p-5">
      <h3 className="text-lg font-bold">Revenue by Segment</h3>
      <p className="text-xs mb-4" style={{ color: 'var(--secondary, #5D8FA3)' }}>
        Hover a slice for its share; the center shows the total.
      </p>
      {loading ? (
        <div className="h-[320px] w-full rounded-[2px] skeleton-shimmer" />
      ) : hasData ? (
        <>
          <svg ref={ref} className="w-full" />
          {/* Legend with values: identity is never carried by color alone. */}
          <div className="mt-4 space-y-1.5">
            {segments.map((s) => (
              <div key={s.key} className="flex items-center gap-2 text-xs">
                <span
                  className="h-2.5 w-2.5 shrink-0 rounded-[2px]"
                  style={{ background: SEGMENT_COLOR[s.key] ?? "#D96C6C" }}
                />
                <span style={{ color: 'var(--foreground)' }}>{s.key}</span>
                <span
                  className="ml-auto"
                  style={{ fontFamily: 'var(--font-mono)', color: 'var(--secondary, #5D8FA3)' }}
                >
                  {total > 0 ? ((s.value / total) * 100).toFixed(1) : "0.0"}% · RM {compactRM.format(s.value)}
                </span>
              </div>
            ))}
          </div>
        </>
      ) : (
        <div className="grid min-h-[240px] place-items-center rounded-[2px] border border-dashed border-[var(--border-strong)] bg-[var(--surface-muted)] px-6 text-center">
          <div>
            <p className="text-sm font-semibold" style={{ color: 'var(--foreground)' }}>No data for the current filters</p>
            <p className="mt-1 text-xs" style={{ color: 'var(--secondary, #5D8FA3)' }}>Clear one or more filters to bring this chart back.</p>
          </div>
        </div>
      )}
    </div>
  );
}
