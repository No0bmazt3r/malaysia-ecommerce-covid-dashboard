"use client";
import { useDashboard } from "@/context/DashboardContext";

export default function Insights() {
  const { mode } = useDashboard();

  const insights = [
    {
      title: "Regional Anomaly: Sabah + Electronics + CMCO",
      body: "Revenue in this cell is ~2.6× the category-wide baseline. A skew toward Facebook Ads and Influencer marketing suggests a highly successful targeted regional promo during movement restrictions.",
      tint: "insight-card-rose",
      icon: "🔴",
      tag: "Anomaly",
      tagColor: "bg-rose-100 text-rose-700 dark:bg-rose-500/10 dark:text-rose-300",
    },
    {
      title: "Hidden Cluster: Selangor/KL + Groceries + Loyal-VIP + MCO",
      body: "A cluster of ~100 rows showing +23% revenue and +0.11 rating vs baseline. Only visible when faceting across all 4 dimensions simultaneously — proving the value of multivariate analysis.",
      tint: "insight-card-emerald",
      icon: "🟢",
      tag: "Cluster",
      tagColor: "bg-emerald-100 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-300",
    },
    {
      title: "Debunked: Discounts Do NOT Drive Revenue",
      body: "discount_pct has near-zero correlation with sales_revenue, while ad_spend_myr is the dominant driver (r≈0.66). Budget should shift from blanket discounts to targeted ad spend.",
      tint: "insight-card-slate",
      icon: "⚪",
      tag: "Debunked",
      tagColor: "bg-slate-100 text-slate-700 dark:bg-slate-500/10 dark:text-slate-300",
    },
    {
      title: "MCO Delivery Shock & Rating Drop",
      body: "Average delivery jumped from 2.75 days (Pre-MCO) to 7.5 days (MCO). This directly caused a sharp drop in customer_rating (r≈-0.75) — a critical supply chain vulnerability during lockdowns.",
      tint: "insight-card-amber",
      icon: "🟠",
      tag: "Impact",
      tagColor: "bg-amber-100 text-amber-700 dark:bg-amber-500/10 dark:text-amber-300",
    },
  ];

  const bodySize = mode === "elderly" ? "text-base leading-7" : "text-sm leading-6";
  const titleSize = mode === "elderly" ? "text-xl" : "text-base";

  return (
    <div className="space-y-6">
      {/* Page header */}
      <section className="dashboard-surface rounded-[var(--section-radius)] px-6 py-6 md:px-8">
        <span className="inline-flex items-center rounded-md bg-[var(--accent-muted)] px-2.5 py-1 text-[11px] font-semibold uppercase tracking-[0.15em] text-[var(--accent)]">
          Insights
        </span>
        <h2
          className={`display-heading mt-3 text-slate-950 dark:text-white ${
            mode === "elderly" ? "text-3xl" : "text-2xl"
          }`}
        >
          Actionable Business Insights
        </h2>
        <p className="mt-1.5 max-w-2xl text-sm text-slate-600 dark:text-slate-400">
          Key discoveries from multivariate analysis of the dataset. Each finding is cross-referenced with the dashboard visualizations.
        </p>
      </section>

      {/* Insight cards */}
      <div
        className={`grid gap-4 ${
          mode === "elderly" ? "grid-cols-1" : "grid-cols-1 md:grid-cols-2"
        }`}
      >
        {insights.map((ins, idx) => (
          <div
            key={ins.title}
            className={`dashboard-card ${ins.tint} rounded-[var(--card-radius)] p-6`}
            style={{ animationDelay: `${idx * 80}ms` }}
          >
            <div className="mb-3 flex items-center gap-2">
              <span className="text-lg">{ins.icon}</span>
              <span
                className={`rounded-md px-2 py-0.5 text-[10px] font-bold uppercase tracking-[0.15em] ${ins.tagColor}`}
              >
                {ins.tag}
              </span>
            </div>
            <h3
              className={`font-bold tracking-tight text-slate-950 dark:text-white ${titleSize}`}
              style={{ fontFamily: "var(--font-display)" }}
            >
              {ins.title}
            </h3>
            <p className={`mt-2 text-slate-700 dark:text-slate-300 ${bodySize}`}>
              {ins.body}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
