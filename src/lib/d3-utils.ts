import * as d3 from "d3";

export function createD3Tooltip(theme: string) {
  const isDark = theme === "dark";
  return d3
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
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function positionTooltip(tooltip: d3.Selection<HTMLDivElement, unknown, HTMLElement, any>, event: MouseEvent) {
  if (!tooltip.node()) return;
  const node = tooltip.node();
  if (!node) return;
  
  const tooltipWidth = node.offsetWidth || 150;
  const tooltipHeight = node.offsetHeight || 50;
  
  const margin = 14;
  let left = event.pageX + margin;
  let top = event.pageY - margin - tooltipHeight;
  
  // Flip left if it hits the right edge
  if (left + tooltipWidth > window.innerWidth) {
    left = event.pageX - tooltipWidth - margin;
  }
  
  // Flip down if it hits the top edge
  if (top < window.scrollY) {
    top = event.pageY + margin;
  }
  
  tooltip
    .style("left", `${left}px`)
    .style("top", `${top}px`);
}
