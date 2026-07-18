export default function Insights() {
  const insights = [
    {
      title: "Regional Anomaly: Sabah + Electronics + CMCO",
      body: "Revenue in this cell is ~2.6× the category-wide baseline. A skew toward Facebook Ads and Influencer marketing suggests a highly successful targeted regional promo during movement restrictions.",
      tint: "insight-card-rose",
      icon: "🔴",
      tag: "Anomaly",
      tagBg: "rgba(217, 108, 108, 0.12)",
      tagColor: "#D96C6C",
    },
    {
      title: "Hidden Cluster: Selangor/KL + Groceries + Loyal-VIP + MCO",
      body: "A cluster of ~100 rows showing +23% revenue and +0.11 rating vs baseline. Only visible when faceting across all 4 dimensions simultaneously — proving the value of multivariate analysis.",
      tint: "insight-card-emerald",
      icon: "🟢",
      tag: "Cluster",
      tagBg: "rgba(141, 181, 150, 0.12)",
      tagColor: "#8DB596",
    },
    {
      title: "Debunked: Discounts Do NOT Drive Revenue",
      body: "discount_pct has near-zero correlation with sales_revenue, while ad_spend_myr is the dominant driver (r≈0.66). Budget should shift from blanket discounts to targeted ad spend.",
      tint: "insight-card-slate",
      icon: "⚪",
      tag: "Debunked",
      tagBg: "rgba(198, 193, 188, 0.15)",
      tagColor: "var(--secondary, #5D8FA3)",
    },
    {
      title: "MCO Delivery Shock & Rating Drop",
      body: "Average delivery jumped from 2.75 days (Pre-MCO) to 7.5 days (MCO). This directly caused a sharp drop in customer_rating (r≈-0.75) — a critical supply chain vulnerability during lockdowns.",
      tint: "insight-card-amber",
      icon: "🟠",
      tag: "Impact",
      tagBg: "rgba(228, 179, 99, 0.12)",
      tagColor: "#E4B363",
    },
  ];

  return (
    <div className="space-y-6">
      {/* Page header */}
      <section className="dashboard-surface rounded-[var(--section-radius)] px-6 py-6 md:px-8">
        <span className="inline-flex items-center rounded-md bg-[var(--accent-muted)] px-2.5 py-1 text-[11px] font-semibold uppercase tracking-[0.15em]" style={{ color: 'var(--accent)' }}>
          Insights
        </span>
        <h2
          className="display-heading mt-3 text-2xl"
          style={{ color: 'var(--foreground)' }}
        >
          Actionable Business Insights
        </h2>
        <p className="mt-1.5 max-w-2xl text-sm" style={{ color: 'var(--secondary, #5D8FA3)' }}>
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
              <span className="text-lg">{ins.icon}</span>
              <span
                className="rounded-md px-2 py-0.5 text-[10px] font-bold uppercase tracking-[0.15em]"
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
            <p className="mt-2 text-sm leading-6" style={{ color: 'var(--foreground)', opacity: 0.75 }}>
              {ins.body}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
