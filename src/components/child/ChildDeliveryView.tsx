"use client";
import { useMemo } from "react";
import { PackageCheck, PackageX } from "lucide-react";
import { useDashboard } from "@/context/DashboardContext";
import { ChildScreen } from "./ChildScreen";
import { childTipHandlers, useChildTooltip } from "./ChildTooltip";

/* Icon-array pictogram: out of every 10 packages, how many arrived on time.
   Color is never alone — each state pairs an icon shape with a word chip. */
export function ChildDeliveryView() {
  const { rawData, loading } = useDashboard();
  const tip = useChildTooltip();

  const { onTimeOutOf10, onTimePct } = useMemo(() => {
    if (rawData.length === 0) return { onTimeOutOf10: 0, onTimePct: 0 };
    const share = rawData.filter((r) => r.delivery_status === "On-Time").length / rawData.length;
    return { onTimeOutOf10: Math.round(share * 10), onTimePct: Math.round(share * 100) };
  }, [rawData]);

  if (loading) {
    return (
      <ChildScreen title="Did Packages Arrive?" sentence="Counting the packages…">
        <div className="h-[220px] w-full rounded-[2px] skeleton-shimmer" />
      </ChildScreen>
    );
  }

  const sentence =
    onTimeOutOf10 >= 7
      ? `${onTimeOutOf10} out of every 10 packages arrived on time. Great job!`
      : `Only ${onTimeOutOf10} out of every 10 packages arrived on time.`;

  return (
    <ChildScreen title="Did Packages Arrive?" sentence={sentence}>
      <div className="flex flex-wrap items-center justify-center gap-3" role="img" aria-label={sentence}>
        {Array.from({ length: 10 }).map((_, i) => {
          const onTime = i < onTimeOutOf10;
          const Icon = onTime ? PackageCheck : PackageX;
          const title = onTime ? "On time" : "Late";
          const value = onTime ? `${onTimePct}% of all packages` : `${100 - onTimePct}% of all packages`;
          const color = onTime ? "var(--viz-good, #0CA678)" : "var(--viz-bad, #E03131)";
          return (
            <span
              key={i}
              className="focus:outline-none"
              {...childTipHandlers(tip, `pkg-${i}`, title, value, color)}
            >
              <Icon aria-hidden="true" className="h-14 w-14 md:h-16 md:w-16" strokeWidth={2} style={{ color }} />
            </span>
          );
        })}
      </div>
      {tip.node}
      <div className="mt-5 flex items-center justify-center gap-4">
        <span className="inline-flex items-center gap-2 rounded-[2px] px-3 py-2 text-base font-bold text-white" style={{ background: "var(--viz-good, #0CA678)" }}>
          <PackageCheck aria-hidden="true" className="h-5 w-5" /> On time
        </span>
        <span className="inline-flex items-center gap-2 rounded-[2px] px-3 py-2 text-base font-bold text-white" style={{ background: "var(--viz-bad, #E03131)" }}>
          <PackageX aria-hidden="true" className="h-5 w-5" /> Late
        </span>
      </div>
    </ChildScreen>
  );
}
