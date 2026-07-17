"use client";
import { HeatMap } from "@/components/charts/HeatMap";
import { useDashboard } from "@/context/DashboardContext";

export default function Regional() {
  const { mode } = useDashboard();
  return (
    <div className="space-y-6">
      <section className="dashboard-surface rounded-[var(--section-radius)] px-6 py-6 md:px-8">
        <span className="inline-flex items-center rounded-md bg-amber-500/10 px-2.5 py-1 text-[11px] font-semibold uppercase tracking-[0.15em] text-amber-600 dark:text-amber-300">
          Regional analysis
        </span>
        <h2
          className={`display-heading mt-3 text-slate-950 dark:text-white ${
            mode === "elderly" ? "text-3xl" : "text-2xl"
          }`}
        >
          Revenue by State &amp; COVID Phase
        </h2>
        <p className="mt-1.5 max-w-2xl text-sm text-slate-600 dark:text-slate-400">
          Explore revenue distribution across Malaysian states and COVID-19 phases.{" "}
          <span className="font-semibold text-rose-600 dark:text-rose-400">
            Look for the Sabah + CMCO anomaly.
          </span>
        </p>
      </section>
      <HeatMap />
    </div>
  );
}
