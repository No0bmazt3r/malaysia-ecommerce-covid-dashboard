"use client";
import { useDashboard } from "@/context/DashboardContext";

export default function Insights() {
  const { mode } = useDashboard();
  
  const insights = [
    {
      title: "🔴 Regional Anomaly: Sabah + Electronics + CMCO",
      body: "Revenue in this specific cell is ~2.6× the category-wide baseline. Driven by a skew toward Facebook Ads and Influencer marketing, suggesting a highly successful, targeted regional promo event during movement restrictions.",
      color: "bg-rose-50 border-rose-200 text-rose-900",
    },
    {
      title: "🟢 Hidden Cluster: Selangor/KL + Groceries + Loyal-VIP + MCO",
      body: "A cluster of ~100 rows showing +23% revenue and +0.11 rating vs baseline. This is only visible when faceting across all 4 dimensions simultaneously, proving the value of multivariate analysis.",
      color: "bg-emerald-50 border-emerald-200 text-emerald-900",
    },
    {
      title: "⚪ Debunked Assumption: Discounts Do NOT Drive Revenue",
      body: "Management often assumes discounting drives sales. The data shows `discount_pct` has a near-zero correlation with `sales_revenue`, while `ad_spend_myr` is the dominant driver (r≈0.66). Budget should shift from blanket discounts to targeted ad spend.",
      color: "bg-slate-50 border-slate-200 text-slate-900",
    },
    {
      title: "🟠 MCO Delivery Shock & Rating Drop",
      body: "Average delivery time jumped from 2.75 days (Pre-MCO) to 7.5 days (MCO). This directly caused a sharp drop in `customer_rating` (r≈-0.75), highlighting a critical supply chain vulnerability during lockdowns.",
      color: "bg-amber-50 border-amber-200 text-amber-900",
    },
  ];

  const cardTextSize = mode === "elderly" ? "text-lg" : "text-sm";
  const titleSize = mode === "elderly" ? "text-2xl" : "text-lg";

  return (
    <div className="space-y-6">
      <section className="dashboard-surface rounded-[32px] px-6 py-7 md:px-8">
        <div className="inline-flex items-center gap-2 rounded-full bg-sky-500/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.22em] text-sky-700 dark:text-sky-200">
          Insights
        </div>
        <h2 className={`mt-4 font-semibold tracking-tight text-slate-950 dark:text-white ${mode === "elderly" ? "text-4xl" : "text-3xl"}`}>
          Actionable Business Insights
        </h2>
        <p className="mt-2 max-w-3xl text-sm text-slate-600 dark:text-slate-300">
          Key discoveries generated from multivariate analysis of the dataset.
        </p>
      </section>
      <div className={`grid gap-6 ${mode === "elderly" ? "grid-cols-1" : "grid-cols-1 md:grid-cols-2"}`}>
        {insights.map((i) => (
          <div key={i.title} className={`dashboard-card rounded-[28px] p-6 ${i.color}`}>
            <h3 className={`mb-3 font-semibold tracking-tight ${titleSize}`}>{i.title}</h3>
            <p className={cardTextSize}>{i.body}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
