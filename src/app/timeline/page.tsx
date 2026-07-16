"use client";
import { ProjectTimeline } from "@/components/charts/ProjectTimeline";
import { useDashboard } from "@/context/DashboardContext";

export default function Timeline() {
  const { mode } = useDashboard();
  return (
    <div className="space-y-6">
      <div>
        <h2 className={`font-bold ${mode === "elderly" ? "text-2xl" : "text-xl"}`}>
          Project Progress Timeline
        </h2>
        <p className="text-sm text-slate-500 mt-1">
          Development milestones cross-referenced with actual Malaysian MCO/CMCO/RMCO phase boundaries.
        </p>
      </div>
      <ProjectTimeline />
    </div>
  );
}
