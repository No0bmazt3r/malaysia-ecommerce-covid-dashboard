"use client";
import { useUserMode } from "@/hooks/useUserMode";
import { ChildSimpleScreen } from "@/components/child/ChildSimpleScreen";

export default function Insights() {
  const userMode = useUserMode();
  if (userMode === "child") return <ChildSimpleScreen />;
  const insights = [
    {
      title: "Sabah Electronics Anomaly (CMCO)",
      body: "Because movement restrictions trapped rural demographics indoors during CMCO, Sabah electronics revenue spiked 2.6× above baseline, driven almost entirely by Facebook Ads. <strong class=\"block mt-3 mb-1 text-[var(--foreground)]\">Recommendation:</strong> Permanently reallocate 15% of the national digital ad budget specifically to targeted social campaigns in East Malaysia during any future movement control restrictions to capture this isolated demand.",
      tint: "insight-card-rose",
      tag: "Actionable",
      tagBg: "rgba(217, 108, 108, 0.12)",
      tagColor: "#D96C6C",
    },
    {
      title: "Klang Valley VIP Grocery Hoarding",
      body: "Because Loyal-VIPs in Selangor/KL aggressively hoarded essential goods during the early MCO phase, grocery revenue jumped 23% within this cohort without the usual negative impact on ratings. <strong class=\"block mt-3 mb-1 text-[var(--foreground)]\">Recommendation:</strong> Implement a VIP-only 'Priority Pantry' subscription tier specifically in the Klang Valley to lock in this recurring grocery revenue stream before competitors capture it.",
      tint: "insight-card-emerald",
      tag: "Opportunity",
      tagBg: "rgba(141, 181, 150, 0.12)",
      tagColor: "#8DB596",
    },
    {
      title: "Inefficiency: Blanket Discounts",
      body: "Statistical analysis definitively proves that discount percentages have near-zero correlation with revenue growth, whereas ad spend drives a massive 0.66 correlation. <strong class=\"block mt-3 mb-1 text-[var(--foreground)]\">Recommendation:</strong> Immediately halt all blanket discounting campaigns across the platform. Redirect the saved margin directly into top-of-funnel targeted ad spend to aggressively maximize ROAS.",
      tint: "insight-card-slate",
      tag: "Process Fix",
      tagBg: "rgba(198, 193, 188, 0.15)",
      tagColor: "var(--secondary, #5D8FA3)",
    },
    {
      title: "Logistics Collapse & Rating Penalty",
      body: "Because nationwide logistics networks shattered during the sudden MCO lockdowns, delivery times spiked from 2.75 to 7.5 days, dragging customer ratings down proportionally (r = -0.75). <strong class=\"block mt-3 mb-1 text-[var(--foreground)]\">Recommendation:</strong> Mandate a 14-day localized inventory buffer in regional micro-fulfillment centers across major states to insulate customer satisfaction from future supply chain shocks.",
      tint: "insight-card-amber",
      tag: "Risk Mitigation",
      tagBg: "rgba(228, 179, 99, 0.12)",
      tagColor: "#E4B363",
    },
  ];

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
          Actionable Business Insights
        </h2>
        <p className="mt-1.5 text-sm" style={{ color: 'var(--secondary, #5D8FA3)' }}>
          Key discoveries from multivariate analysis of the dataset. Each finding is cross-referenced with the dashboard visualizations.
        </p>
      </section>

      {/* Insight cards */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        {insights.map((ins, idx) => (
          <div
            key={ins.title}
            className={`dashboard-card ${ins.tint} rounded-[var(--card-radius)] p-6`}
            style={{ animationDelay: `${idx * 80}ms` }}
          >
            <div className="mb-3 flex items-center gap-2">
              <span
                className="rounded-[2px] px-2 py-0.5 text-[10px] font-bold uppercase tracking-[0.15em]"
                style={{ background: ins.tagBg, color: ins.tagColor }}
              >
                {ins.tag}
              </span>
            </div>
            <h3
              className="text-base font-bold tracking-tight"
              style={{ fontFamily: "var(--font-display)", color: 'var(--foreground)' }}
            >
              {ins.title}
            </h3>
            <p 
              className="mt-2 text-sm leading-6" 
              style={{ color: 'var(--foreground)', opacity: 0.75 }}
              dangerouslySetInnerHTML={{ __html: ins.body }}
            />
          </div>
        ))}
      </div>
    </div>
  );
}
