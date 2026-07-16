"use client";
import { ProjectTimeline } from "@/components/charts/ProjectTimeline";
import { useDashboard } from "@/context/DashboardContext";

export default function Timeline() {
  const { mode } = useDashboard();
  return (
    <div className="space-y-6">
      <section className="dashboard-surface rounded-[32px] px-6 py-7 md:px-8">
        <div className="inline-flex items-center gap-2 rounded-full bg-violet-500/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.22em] text-violet-700 dark:text-violet-200">
          Timeline
        </div>
        <h2 className={`mt-4 font-semibold tracking-tight text-slate-950 dark:text-white ${mode === "elderly" ? "text-3xl" : "text-2xl"}`}>
          Project Progress Timeline
        </h2>
        <p className="mt-2 max-w-3xl text-sm text-slate-600 dark:text-slate-300">
          Development milestones cross-referenced with actual Malaysian MCO/CMCO/RMCO phase boundaries.
        </p>
      </section>
      <ProjectTimeline />
    </div>
  );
}
