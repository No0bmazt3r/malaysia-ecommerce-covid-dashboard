"use client";
import { useDashboard } from "@/context/DashboardContext";
import { uniqueValues } from "@/lib/data";

function MultiSelect({
  label, options, selected, onChange,
}: { label: string; options: string[]; selected: string[]; onChange: (v: string[]) => void }) {
  return (
    <div className="flex flex-col gap-1">
      <label className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400">{label}</label>
      <select
        multiple
        value={selected}
        onChange={(e) => onChange(Array.from(e.target.selectedOptions).map((o) => o.value))}
        className="min-h-[90px] rounded-2xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 shadow-sm outline-none transition focus:border-sky-400 focus:ring-4 focus:ring-sky-500/10 dark:border-slate-700 dark:bg-slate-950/50 dark:text-slate-100"
      >
        {options.map((o) => (
          <option key={o} value={o}>{o}</option>
        ))}
      </select>
    </div>
  );
}

export function FilterPanel() {
  const { rawData, filters, setFilters } = useDashboard();
  const reset = () => setFilters({ dateRange: ["2020-01-01", "2021-12-31"], covidPhase: [], state: [], category: [], segment: [], searchQuery: "" });
  const activeFilters = filters.covidPhase.length + filters.state.length + filters.category.length + filters.segment.length + (filters.searchQuery ? 1 : 0);

  return (
    <div className="dashboard-card space-y-5 rounded-[28px] p-5 lg:sticky lg:top-28">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h3 className="text-lg font-semibold text-slate-950 dark:text-white">Filters</h3>
          <p className="text-sm text-slate-500 dark:text-slate-400">Refine the dataset and cross-filter the charts.</p>
        </div>
        <button onClick={reset} className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs font-semibold text-slate-600 transition hover:bg-slate-100 dark:border-slate-700 dark:bg-slate-900/80 dark:text-slate-300 dark:hover:bg-slate-800">
          Reset
        </button>
      </div>
      <div className="rounded-2xl border border-slate-200 bg-slate-50/80 p-3 dark:border-slate-800 dark:bg-slate-950/40">
        <div className="mb-2 flex items-center justify-between text-xs font-semibold uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400">
          <span>Active filters</span>
          <span>{activeFilters}</span>
        </div>
        <p className="text-sm text-slate-600 dark:text-slate-300">Use the controls below to narrow the analysis.</p>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div className="flex flex-col gap-1">
          <label className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400">From</label>
          <input type="date" value={filters.dateRange[0]} onChange={(e) => setFilters({ ...filters, dateRange: [e.target.value, filters.dateRange[1]] })} className="rounded-2xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 shadow-sm outline-none focus:border-sky-400 focus:ring-4 focus:ring-sky-500/10 dark:border-slate-700 dark:bg-slate-950/50 dark:text-slate-100" />
        </div>
        <div className="flex flex-col gap-1">
          <label className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400">To</label>
          <input type="date" value={filters.dateRange[1]} onChange={(e) => setFilters({ ...filters, dateRange: [filters.dateRange[0], e.target.value] })} className="rounded-2xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 shadow-sm outline-none focus:border-sky-400 focus:ring-4 focus:ring-sky-500/10 dark:border-slate-700 dark:bg-slate-950/50 dark:text-slate-100" />
        </div>
      </div>
      {rawData.length > 0 && (
        <>
          <MultiSelect label="COVID Phase" options={uniqueValues(rawData, "covid_phase")} selected={filters.covidPhase} onChange={(v) => setFilters({ ...filters, covidPhase: v })} />
          <MultiSelect label="State" options={uniqueValues(rawData, "state")} selected={filters.state} onChange={(v) => setFilters({ ...filters, state: v })} />
          <MultiSelect label="Category" options={uniqueValues(rawData, "product_category")} selected={filters.category} onChange={(v) => setFilters({ ...filters, category: v })} />
          <MultiSelect label="Segment" options={uniqueValues(rawData, "customer_segment")} selected={filters.segment} onChange={(v) => setFilters({ ...filters, segment: v })} />
        </>
      )}
    </div>
  );
}
