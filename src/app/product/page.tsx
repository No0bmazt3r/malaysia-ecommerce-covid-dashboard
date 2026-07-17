import { ScatterMatrix } from "@/components/charts/ScatterMatrix";

export default function Product() {
  return (
    <div className="space-y-6">
      <section className="dashboard-surface rounded-[var(--section-radius)] px-6 py-6 md:px-8">
        <span className="inline-flex items-center rounded-md bg-emerald-500/10 px-2.5 py-1 text-[11px] font-semibold uppercase tracking-[0.15em] text-emerald-600 dark:text-emerald-300">
          Product analysis
        </span>
        <h2
          className="display-heading mt-3 text-2xl text-slate-950 dark:text-white"
        >
          Product &amp; Correlation Analysis
        </h2>
        <p className="mt-1.5 max-w-2xl text-sm text-slate-600 dark:text-slate-400">
          Scatter Plot Matrix revealing hidden relationships:{" "}
          <span className="font-semibold text-emerald-600 dark:text-emerald-400">
            Ad Spend ↔ Revenue (r≈0.66)
          </span>{" "}
          and{" "}
          <span className="font-semibold text-rose-600 dark:text-rose-400">
            Delivery Time ↔ Rating (r≈−0.75)
          </span>
          .
        </p>
      </section>
      <ScatterMatrix />
    </div>
  );
}
