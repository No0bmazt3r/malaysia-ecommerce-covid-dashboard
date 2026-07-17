"use client";
import { KPICards } from "@/components/ui/KPICards";
import { FilterPanel } from "@/components/ui/FilterPanel";
import { PhaseLineChart } from "@/components/charts/PhaseLineChart";
import { HeatMap } from "@/components/charts/HeatMap";
import { ProjectTimeline } from "@/components/charts/ProjectTimeline";
import { MiniScatterMatrix } from "@/components/charts/MiniScatterMatrix";
import { useDashboard } from "@/context/DashboardContext";

function ActiveChip({ label, onRemove }: { label: string; onRemove: () => void }) {
  return (
    <button
      type="button"
      onClick={onRemove}
      className="inline-flex items-center gap-1.5 rounded-lg border border-[var(--border)] bg-[var(--surface-strong)] px-2.5 py-1 text-xs font-medium text-[var(--foreground)] transition hover:border-[var(--accent)] hover:text-[var(--accent)] active:scale-95"
    >
      <span>{label}</span>
      <span className="text-[10px] opacity-50">✕</span>
    </button>
  );
}

function SkeletonCard() {
  return (
    <div className="dashboard-card rounded-[var(--card-radius)] p-5">
      <div className="skeleton mb-4 h-3 w-24" />
      <div className="skeleton mb-2 h-8 w-32" />
      <div className="skeleton h-3 w-20" />
    </div>
  );
}

export default function Overview() {
  const { loading, filteredData, filters, setFilters, mode } = useDashboard();
  const activeFilters =
    filters.covidPhase.length +
    filters.state.length +
    filters.category.length +
    filters.segment.length +
    (filters.searchQuery ? 1 : 0);

  const clearAll = () =>
    setFilters({
      dateRange: [filters.dateRange[0], filters.dateRange[1]],
      covidPhase: [],
      state: [],
      category: [],
      segment: [],
      searchQuery: "",
    });
  const removePhase = (phase: string) =>
    setFilters({ ...filters, covidPhase: filters.covidPhase.filter((v) => v !== phase) });
  const removeState = (state: string) =>
    setFilters({ ...filters, state: filters.state.filter((v) => v !== state) });
  const removeCategory = (category: string) =>
    setFilters({ ...filters, category: filters.category.filter((v) => v !== category) });
  const removeSegment = (segment: string) =>
    setFilters({ ...filters, segment: filters.segment.filter((v) => v !== segment) });
  const removeSearch = () => setFilters({ ...filters, searchQuery: "" });

  if (loading) {
    return (
      <div className="space-y-6">
        {/* Skeleton hero */}
        <div className="dashboard-surface rounded-[var(--section-radius)] p-8">
          <div className="skeleton mb-4 h-4 w-28 rounded-full" />
          <div className="skeleton mb-3 h-10 w-3/4" />
          <div className="skeleton h-4 w-1/2" />
        </div>
        {/* Skeleton KPIs */}
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-5">
          {Array.from({ length: 5 }).map((_, i) => (
            <SkeletonCard key={i} />
          ))}
        </div>
        {/* Skeleton charts */}
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-4">
          <div className="dashboard-card rounded-[var(--section-radius)] p-5 lg:col-span-1">
            <div className="skeleton mb-3 h-5 w-16" />
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="skeleton mb-2 h-8 w-full" />
            ))}
          </div>
          <div className="space-y-6 lg:col-span-3">
            <div className="dashboard-card rounded-[var(--section-radius)] p-5">
              <div className="skeleton h-64 w-full" />
            </div>
            <div className="dashboard-card rounded-[var(--section-radius)] p-5">
              <div className="skeleton h-64 w-full" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Hero section */}
      <section className="dashboard-surface rounded-[var(--section-radius)] px-6 py-6 md:px-8">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-2xl space-y-2">
            <span className="inline-flex items-center rounded-md bg-[var(--accent-muted)] px-2.5 py-1 text-[11px] font-semibold uppercase tracking-[0.15em] text-[var(--accent)]">
              Overview
            </span>
            <h2
              className="display-heading text-2xl text-slate-950 dark:text-white md:text-3xl"
            >
              Malaysia e-commerce during COVID phases
            </h2>
            <p className="text-sm leading-relaxed text-slate-600 dark:text-slate-400">
              Revenue trends, delivery friction, inventory risk, and regional patterns — cross-filtered in real time.
            </p>
          </div>

          {/* Summary pills */}
          <div className="flex flex-wrap gap-2">
            <div className="rounded-xl border border-[var(--border)] bg-[var(--surface-strong)] px-4 py-2.5">
              <div className="text-[10px] font-semibold uppercase tracking-[0.15em] text-slate-500 dark:text-slate-400">
                Rows
              </div>
              <div
                className="mt-0.5 text-lg font-bold text-slate-950 dark:text-white"
                style={{ fontFamily: "var(--font-display)" }}
              >
                {filteredData.length.toLocaleString()}
              </div>
            </div>
            <div className="rounded-xl border border-[var(--border)] bg-[var(--surface-strong)] px-4 py-2.5">
              <div className="text-[10px] font-semibold uppercase tracking-[0.15em] text-slate-500 dark:text-slate-400">
                Filters
              </div>
              <div
                className="mt-0.5 text-lg font-bold text-slate-950 dark:text-white"
                style={{ fontFamily: "var(--font-display)" }}
              >
                {activeFilters}
              </div>
            </div>
          </div>
        </div>

        {/* Active filter chips */}
        {activeFilters > 0 && (
          <div className="mt-4 flex flex-wrap items-center gap-2 rounded-xl bg-[var(--surface-muted)] px-4 py-3">
            <span className="mr-1 text-[11px] font-semibold uppercase tracking-[0.15em] text-slate-500 dark:text-slate-400">
              Active:
            </span>
            {filters.covidPhase.map((v) => (
              <ActiveChip key={`p-${v}`} label={v} onRemove={() => removePhase(v)} />
            ))}
            {filters.state.map((v) => (
              <ActiveChip key={`s-${v}`} label={v} onRemove={() => removeState(v)} />
            ))}
            {filters.category.map((v) => (
              <ActiveChip key={`c-${v}`} label={v} onRemove={() => removeCategory(v)} />
            ))}
            {filters.segment.map((v) => (
              <ActiveChip key={`seg-${v}`} label={v} onRemove={() => removeSegment(v)} />
            ))}
            {filters.searchQuery && (
              <ActiveChip label={`"${filters.searchQuery}"`} onRemove={removeSearch} />
            )}
            <button
              type="button"
              onClick={clearAll}
              className="ml-auto text-[11px] font-semibold text-[var(--accent)] transition hover:underline"
            >
              Clear all
            </button>
          </div>
        )}

        {/* Drill-down hint */}
        <div className="mt-3 flex items-center gap-2 rounded-lg bg-[var(--accent-muted)] px-3 py-2 text-xs text-[var(--accent)]">
          <span className="font-bold">Tip:</span>
          Click any heat map cell to drill down to a specific state and COVID phase.
        </div>
      </section>

      {/* KPIs */}
      <KPICards />

      {/* Filter sidebar + Charts */}
      <div className={`grid grid-cols-1 gap-6 ${mode === "analyst" ? "lg:grid-cols-4" : ""}`}>
        {mode !== "kiosk" && (
          <aside className={mode === "analyst" ? "lg:col-span-1" : ""}>
            <FilterPanel />
          </aside>
        )}
        <div className={`space-y-6 ${mode === "analyst" ? "lg:col-span-3" : ""}`}>
          <PhaseLineChart />
          <HeatMap />
          <MiniScatterMatrix />
          <ProjectTimeline />
        </div>
      </div>
    </div>
  );
}
