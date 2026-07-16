"use client";
import { ScatterMatrix } from "@/components/charts/ScatterMatrix";
import { useDashboard } from "@/context/DashboardContext";

export default function Product() {
  const { mode } = useDashboard();
  return (
    <div className="space-y-6">
      <section className="dashboard-surface rounded-[32px] px-6 py-7 md:px-8">
        <div className="inline-flex items-center gap-2 rounded-full bg-emerald-500/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.22em] text-emerald-700 dark:text-emerald-200">
          Product analysis
        </div>
        <h2 className={`mt-4 font-semibold tracking-tight text-slate-950 dark:text-white ${mode === "elderly" ? "text-3xl" : "text-2xl"}`}>
          Product & Correlation Analysis
        </h2>
        <p className="mt-2 max-w-3xl text-sm text-slate-600 dark:text-slate-300">
          Advanced Scatter Plot Matrix revealing hidden relationships: 
          <span className="font-semibold text-emerald-600"> Ad Spend ↔ Revenue (r≈0.66)</span> and 
          <span className="font-semibold text-rose-600"> Delivery Time ↔ Rating (r≈-0.75)</span>.
        </p>
      </section>
      <ScatterMatrix />
    </div>
  );
}
