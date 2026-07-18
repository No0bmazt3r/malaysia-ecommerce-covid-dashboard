import { ProjectTimeline } from "@/components/charts/ProjectTimeline";

export default function Timeline() {
  return (
    <div className="space-y-6">
      <section className="dashboard-surface rounded-[var(--section-radius)] px-6 py-6 md:px-8">
        <span className="inline-flex items-center rounded-[2px] px-2.5 py-1 text-[11px] font-semibold uppercase tracking-[0.15em]" style={{ background: 'rgba(99, 183, 178, 0.12)', color: '#63B7B2' }}>
          Timeline
        </span>
        <h2
          className="display-heading mt-3 text-2xl"
          style={{ color: 'var(--foreground)' }}
        >
          Project Progress Timeline
        </h2>
        <p className="mt-1.5 max-w-2xl text-sm" style={{ color: 'var(--secondary, #5D8FA3)' }}>
          Development milestones cross-referenced with actual Malaysian MCO/CMCO/RMCO phase boundaries.
        </p>
      </section>
      <ProjectTimeline />
    </div>
  );
}
