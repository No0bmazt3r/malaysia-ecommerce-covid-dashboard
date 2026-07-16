"use client";
import { KPICards } from "@/components/ui/KPICards";
import { FilterPanel } from "@/components/ui/FilterPanel";
import { PhaseLineChart } from "@/components/charts/PhaseLineChart";
import { HeatMap } from "@/components/charts/HeatMap";
import { useDashboard } from "@/context/DashboardContext";

function ActiveChip({ label, onRemove }: { label: string; onRemove: () => void }) {
  return (
    <button
      type="button"
      onClick={onRemove}
      className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white/80 px-3 py-1.5 text-sm font-medium text-slate-700 shadow-sm transition hover:-translate-y-0.5 hover:border-sky-300 hover:text-sky-700 dark:border-slate-700 dark:bg-slate-950/70 dark:text-slate-200 dark:hover:border-sky-500/40 dark:hover:text-sky-200"
    >
      <span>{label}</span>
      <span className="text-xs opacity-70">×</span>
    </button>
  );
}

export default function Overview() {
  const { loading, filteredData, filters, setFilters, mode } = useDashboard();
  const activeFilters = filters.covidPhase.length + filters.state.length + filters.category.length + filters.segment.length + (filters.searchQuery ? 1 : 0);

  const clearAll = () => setFilters({ dateRange: [filters.dateRange[0], filters.dateRange[1]], covidPhase: [], state: [], category: [], segment: [], searchQuery: "" });
  const removePhase = (phase: string) => setFilters({ ...filters, covidPhase: filters.covidPhase.filter((value) => value !== phase) });
  const removeState = (state: string) => setFilters({ ...filters, state: filters.state.filter((value) => value !== state) });
  const removeCategory = (category: string) => setFilters({ ...filters, category: filters.category.filter((value) => value !== category) });
  const removeSegment = (segment: string) => setFilters({ ...filters, segment: filters.segment.filter((value) => value !== segment) });
  const removeSearch = () => setFilters({ ...filters, searchQuery: "" });

  if (loading) return <div className="p-8 text-center text-slate-500">Loading dataset...</div>;
  return (
    <div className="space-y-8">
      <section className="dashboard-surface rounded-[32px] px-6 py-7 md:px-8">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-3xl space-y-3">
            <div className="inline-flex items-center gap-2 rounded-full bg-sky-500/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.22em] text-sky-700 dark:text-sky-200">
              Overview
            </div>
            <h2 className="text-3xl font-semibold tracking-tight text-slate-950 dark:text-white md:text-4xl">
              A modern view of Malaysia e-commerce performance during COVID phases.
            </h2>
            <p className="text-base leading-7 text-slate-600 dark:text-slate-300">
              Track revenue, delivery friction, inventory risk, and regional patterns in one shared filter state.
            </p>
          </div>
          <div className="grid grid-cols-2 gap-3 md:grid-cols-3">
            <div className="rounded-2xl border border-slate-200 bg-white/70 px-4 py-3 dark:border-slate-800 dark:bg-slate-950/70">
              <div className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400">Rows in view</div>
              <div className="mt-2 text-2xl font-semibold text-slate-950 dark:text-white">{filteredData.length.toLocaleString()}</div>
            </div>
            <div className="rounded-2xl border border-slate-200 bg-white/70 px-4 py-3 dark:border-slate-800 dark:bg-slate-950/70">
              <div className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400">Active filters</div>
              <div className="mt-2 text-2xl font-semibold text-slate-950 dark:text-white">{activeFilters}</div>
            </div>
            <div className="rounded-2xl border border-slate-200 bg-white/70 px-4 py-3 dark:border-slate-800 dark:bg-slate-950/70">
              <div className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400">Mode</div>
              <div className="mt-2 text-2xl font-semibold capitalize text-slate-950 dark:text-white">{mode}</div>
            </div>
          </div>
        </div>
        <div className="mt-6 rounded-3xl border border-slate-200 bg-white/60 p-4 dark:border-slate-800 dark:bg-slate-950/40">
          <div className="mb-3 flex items-center justify-between gap-3">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.22em] text-slate-500 dark:text-slate-400">Active filters</p>
              <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">Click any chip to remove it.</p>
            </div>
            {activeFilters > 0 && (
              <button type="button" onClick={clearAll} className="rounded-full border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-600 transition hover:bg-slate-100 dark:border-slate-700 dark:bg-slate-950/70 dark:text-slate-300 dark:hover:bg-slate-800">
                Clear all
              </button>
            )}
          </div>
          {activeFilters > 0 ? (
            <div className="flex flex-wrap gap-2">
              {filters.covidPhase.map((value) => <ActiveChip key={`phase-${value}`} label={`Phase: ${value}`} onRemove={() => removePhase(value)} />)}
              {filters.state.map((value) => <ActiveChip key={`state-${value}`} label={`State: ${value}`} onRemove={() => removeState(value)} />)}
              {filters.category.map((value) => <ActiveChip key={`category-${value}`} label={`Category: ${value}`} onRemove={() => removeCategory(value)} />)}
              {filters.segment.map((value) => <ActiveChip key={`segment-${value}`} label={`Segment: ${value}`} onRemove={() => removeSegment(value)} />)}
              {filters.searchQuery ? <ActiveChip label={`Search: ${filters.searchQuery}`} onRemove={removeSearch} /> : null}
            </div>
          ) : (
            <p className="text-sm text-slate-500 dark:text-slate-400">No active filters. Start from the left panel or search bar.</p>
          )}
        </div>
      </section>

      <KPICards />
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-4">
        <aside className="lg:col-span-1"><FilterPanel /></aside>
        <div className="space-y-6 lg:col-span-3">
          <PhaseLineChart />
          <HeatMap />
        </div>
      </div>
    </div>
  );
}
