"use client";
import { useDashboard } from "@/context/DashboardContext";
import { uniqueValues } from "@/lib/data";

function CheckboxGroup({
  label, options, selected, onChange,
}: { label: string; options: string[]; selected: string[]; onChange: (v: string[]) => void }) {
  const toggle = (value: string) => {
    if (selected.includes(value)) {
      onChange(selected.filter((item) => item !== value));
      return;
    }
    onChange([...selected, value]);
  };

  return (
    <div className="flex flex-col gap-2">
      <label className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400">{label}</label>
      <div className="max-h-44 space-y-2 overflow-y-auto rounded-2xl border border-slate-200 bg-white px-3 py-3 shadow-sm dark:border-slate-700 dark:bg-slate-950/50">
        {options.map((option) => {
          const checked = selected.includes(option);
          return (
            <label
              key={option}
              className="flex cursor-pointer items-center gap-3 rounded-xl px-2 py-2 text-sm text-slate-700 transition hover:bg-slate-50 dark:text-slate-200 dark:hover:bg-slate-900/80"
            >
              <input
                type="checkbox"
                checked={checked}
                onChange={() => toggle(option)}
                className="h-4 w-4 rounded border-slate-300 text-sky-600 focus:ring-sky-500"
              />
              <span className="flex-1">{option}</span>
            </label>
          );
        })}
      </div>
    </div>
  );
}

function DropdownFilter({
  label, options, selected, onChange,
}: { label: string; options: string[]; selected: string[]; onChange: (v: string[]) => void }) {
  const value = selected[0] ?? "all";
  return (
    <div className="flex flex-col gap-2">
      <label className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400">{label}</label>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value === "all" ? [] : [e.target.value])}
        className="rounded-2xl border border-slate-200 bg-white px-3 py-3 text-sm text-slate-900 shadow-sm outline-none transition focus:border-sky-400 focus:ring-4 focus:ring-sky-500/10 dark:border-slate-700 dark:bg-slate-950/50 dark:text-slate-100"
      >
        <option value="all">All regions</option>
        {options.map((option) => (
          <option key={option} value={option}>{option}</option>
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
          <CheckboxGroup label="COVID Phase" options={uniqueValues(rawData, "covid_phase")} selected={filters.covidPhase} onChange={(v) => setFilters({ ...filters, covidPhase: v })} />
          <DropdownFilter label="State / Region" options={uniqueValues(rawData, "state")} selected={filters.state} onChange={(v) => setFilters({ ...filters, state: v })} />
          <CheckboxGroup label="Category" options={uniqueValues(rawData, "product_category")} selected={filters.category} onChange={(v) => setFilters({ ...filters, category: v })} />
          <CheckboxGroup label="Segment" options={uniqueValues(rawData, "customer_segment")} selected={filters.segment} onChange={(v) => setFilters({ ...filters, segment: v })} />
        </>
      )}
    </div>
  );
}
