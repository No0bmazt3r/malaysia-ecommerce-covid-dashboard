"use client";
import { KPICards } from "@/components/ui/KPICards";
import { FilterPanel } from "@/components/ui/FilterPanel";
import { PhaseLineChart } from "@/components/charts/PhaseLineChart";
import { HeatMap } from "@/components/charts/HeatMap";
import { ProjectTimeline } from "@/components/charts/ProjectTimeline";
import { MiniScatterMatrix } from "@/components/charts/MiniScatterMatrix";
import { useDashboard } from "@/context/DashboardContext";
import { useUserMode } from "@/hooks/useUserMode";
import { ChildOverview } from "@/components/child/ChildOverview";
import { ElderlyFilterPanel } from "@/components/elderly/ElderlyFilterPanel";
import { ElderlyScatterSingle } from "@/components/elderly/ElderlyScatterSingle";

function ActiveChip({ label, onRemove }: { label: string; onRemove: () => void }) {
  return (
    <button
      type="button"
      onClick={onRemove}
      className="inline-flex items-center gap-1.5 rounded-[2px] border border-[var(--border)] bg-[var(--surface-strong)] px-2.5 py-1 text-xs font-medium transition hover:opacity-80 active:scale-95"
      style={{ color: 'var(--foreground)' }}
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
  const { loading, rawData, filters, setFilters } = useDashboard();
  const userMode = useUserMode();
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

  if (userMode === "child") return <ChildOverview />;

  if (loading) {
    return (
      <div className="space-y-6">
        {/* Skeleton hero */}
        <div className="dashboard-surface rounded-[var(--section-radius)] p-8">
          <div className="skeleton mb-4 h-4 w-28" />
          <div className="skeleton mb-3 h-10 w-3/4" />
          <div className="skeleton h-4 w-1/2" />
        </div>
        {/* Skeleton KPIs */}
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-6">
          {Array.from({ length: 6 }).map((_, i) => (
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
        <div className="space-y-2">
          <span className="inline-flex items-center rounded-[2px] bg-[var(--accent-muted)] px-2.5 py-1 text-[11px] font-semibold uppercase tracking-[0.15em]" style={{ color: 'var(--accent)' }}>
            Overview
          </span>
          <h2
            className="display-heading text-2xl md:text-3xl"
            style={{ color: 'var(--foreground)' }}
          >
            Malaysia e-commerce during COVID phases
          </h2>
          <p className="text-sm leading-relaxed" style={{ color: 'var(--secondary, #5D8FA3)' }}>
            Revenue trends, delivery friction, inventory risk, and regional patterns across{" "}
            {rawData.length.toLocaleString()} orders (Jan 2020 – Dec 2021), cross-filtered in real time.
          </p>
        </div>

        {/* Active filter chips */}
        {activeFilters > 0 && (
          <div className="mt-4 flex flex-wrap items-center gap-2 rounded-[2px] bg-[var(--surface-muted)] px-4 py-3">
            <span className="mr-1 text-[11px] font-semibold uppercase tracking-[0.15em]" style={{ color: 'var(--secondary, #5D8FA3)' }}>
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
              className="ml-auto text-[11px] font-semibold transition hover:underline"
              style={{ color: 'var(--accent)' }}
            >
              Clear all
            </button>
          </div>
        )}

      </section>

      {/* KPIs */}
      <KPICards />

      {/* Filter sidebar + Charts */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-4">
        <aside className="lg:col-span-1">
          {userMode === "elderly" ? <ElderlyFilterPanel /> : <FilterPanel />}
        </aside>
        <div className="space-y-6 lg:col-span-3">
          <PhaseLineChart />
          <HeatMap />
          {userMode === "elderly" ? <ElderlyScatterSingle /> : <MiniScatterMatrix />}
          <ProjectTimeline />
        </div>
      </div>
    </div>
  );
}
