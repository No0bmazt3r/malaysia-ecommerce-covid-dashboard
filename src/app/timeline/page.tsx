"use client";
import { ProjectTimeline } from "@/components/charts/ProjectTimeline";
import { useDashboard } from "@/context/DashboardContext";

export default function Timeline() {
  const { mode } = useDashboard();
  return (
    <div className="space-y-6">
      <section className="dashboard-surface rounded-[var(--section-radius)] px-6 py-6 md:px-8">
        <span className="inline-flex items-center rounded-md bg-violet-500/10 px-2.5 py-1 text-[11px] font-semibold uppercase tracking-[0.15em] text-violet-600 dark:text-violet-300">
          Timeline
        </span>
        <h2
          className={`display-heading mt-3 text-slate-950 dark:text-white ${
            mode === "elderly" ? "text-3xl" : "text-2xl"
          }`}
        >
          Project Progress Timeline
        </h2>
        <p className="mt-1.5 max-w-2xl text-sm text-slate-600 dark:text-slate-400">
          Development milestones cross-referenced with actual Malaysian MCO/CMCO/RMCO phase boundaries.
        </p>
      </section>
      <ProjectTimeline />
    </div>
  );
}
