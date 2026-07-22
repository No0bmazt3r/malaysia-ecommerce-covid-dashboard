"use client";
import { useUserMode } from "@/hooks/useUserMode";
import { ChildSimpleScreen } from "@/components/child/ChildSimpleScreen";
import { useDynamicInsights } from "@/hooks/useDynamicInsights";
import { InsightCategory } from "@/lib/insights/types";

export default function Insights() {
  const userMode = useUserMode();
  const dynamicInsights = useDynamicInsights();

  if (userMode === "child") return <ChildSimpleScreen />;

  const getStyleForCategory = (cat: InsightCategory) => {
    switch (cat) {
      case 'top_performer': return { tint: "insight-card-emerald", tag: "Strength", tagBg: "rgba(141, 181, 150, 0.12)", tagColor: "#8DB596" };
      case 'bottom_performer': return { tint: "insight-card-rose", tag: "Weakness", tagBg: "rgba(217, 108, 108, 0.12)", tagColor: "#D96C6C" };
      case 'delivery_bottleneck': return { tint: "insight-card-amber", tag: "Risk", tagBg: "rgba(228, 179, 99, 0.12)", tagColor: "#E4B363" };
      case 'correlation': return { tint: "insight-card-slate", tag: "Driver", tagBg: "rgba(198, 193, 188, 0.15)", tagColor: "var(--secondary, #5D8FA3)" };
      case 'anomaly': return { tint: "insight-card-rose", tag: "Anomaly", tagBg: "rgba(217, 108, 108, 0.12)", tagColor: "#D96C6C" };
      default: return { tint: "insight-card-slate", tag: "Insight", tagBg: "rgba(198, 193, 188, 0.15)", tagColor: "var(--secondary, #5D8FA3)" };
    }
  }

  return (
    <div className="space-y-6">
      {/* Page header */}
      <section className="dashboard-surface rounded-[var(--section-radius)] px-6 py-6 md:px-8">
        <span className="inline-flex items-center rounded-[2px] bg-[var(--accent-muted)] px-2.5 py-1 text-[11px] font-semibold uppercase tracking-[0.15em]" style={{ color: 'var(--accent)' }}>
          Insights
        </span>
        <h2
          className="display-heading mt-3 text-2xl"
          style={{ color: 'var(--foreground)' }}
        >
          Dynamic Business Intelligence
        </h2>
        <p className="mt-1.5 text-sm" style={{ color: 'var(--secondary, #5D8FA3)' }}>
          These insights are mathematically generated in real-time based on your active dashboard filters.
        </p>
      </section>

      {/* Insight cards */}
      {dynamicInsights.length === 0 ? (
        <div className="grid min-h-[300px] place-items-center rounded-[2px] border border-dashed border-[var(--border-strong)] bg-[var(--surface-muted)] px-6 text-center">
          <div>
            <p className="text-sm font-semibold" style={{ color: 'var(--foreground)' }}>Not enough data for reliable insights</p>
            <p className="mt-1 text-xs" style={{ color: 'var(--secondary, #5D8FA3)' }}>Broaden your filters (e.g., select more states or categories) to generate meaningful mathematical correlations.</p>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          {dynamicInsights.map((ins, idx) => {
            const style = getStyleForCategory(ins.category);
            return (
              <div
                key={ins.id}
                className={`dashboard-card ${style.tint} rounded-[var(--card-radius)] p-6`}
                style={{ animationDelay: `${idx * 80}ms` }}
              >
                <div className="mb-3 flex items-center justify-between gap-2">
                  <span
                    className="rounded-[2px] px-2 py-0.5 text-[10px] font-bold uppercase tracking-[0.15em]"
                    style={{ background: style.tagBg, color: style.tagColor }}
                  >
                    {style.tag}
                  </span>
                  <span className="text-[10px] font-medium" style={{ color: 'var(--secondary, #5D8FA3)' }}>
                    {Math.round(ins.confidence * 100)}% CONFIDENCE
                  </span>
                </div>
                <h3
                  className="text-base font-bold tracking-tight"
                  style={{ fontFamily: "var(--font-display)", color: 'var(--foreground)' }}
                >
                  {ins.headline}
                </h3>
                <p 
                  className="mt-2 text-sm leading-6" 
                  style={{ color: 'var(--foreground)', opacity: 0.75 }}
                  dangerouslySetInnerHTML={{ __html: ins.body }}
                />
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
