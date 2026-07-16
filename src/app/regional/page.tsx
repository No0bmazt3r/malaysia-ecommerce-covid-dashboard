"use client";
import { HeatMap } from "@/components/charts/HeatMap";
import { useDashboard } from "@/context/DashboardContext";

export default function Regional() {
  const { mode } = useDashboard();
  return (
    <div className="space-y-6">
      <section className="dashboard-surface rounded-[32px] px-6 py-7 md:px-8">
        <div className="inline-flex items-center gap-2 rounded-full bg-amber-500/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.22em] text-amber-700 dark:text-amber-200">
          Regional analysis
        </div>
        <h2 className={`mt-4 font-semibold tracking-tight text-slate-950 dark:text-white ${mode === "elderly" ? "text-3xl" : "text-2xl"}`}>
          Regional & Phase Analysis
        </h2>
        <p className="mt-2 max-w-3xl text-sm text-slate-600 dark:text-slate-300">
          Explore revenue distribution across Malaysian states and COVID-19 phases. 
          <span className="font-semibold text-rose-600"> Look for the Sabah + CMCO anomaly.</span>
        </p>
      </section>
      <HeatMap />
    </div>
  );
}
