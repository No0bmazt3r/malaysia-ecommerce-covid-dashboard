"use client";
import { useDashboard } from "@/context/DashboardContext";
import { uniqueValues } from "@/lib/data";

function MultiSelect({
  label, options, selected, onChange,
}: { label: string; options: string[]; selected: string[]; onChange: (v: string[]) => void }) {
  return (
    <div className="flex flex-col gap-1">
      <label className="text-xs font-semibold text-slate-600 uppercase tracking-wide">{label}</label>
      <select
        multiple
        value={selected}
        onChange={(e) => onChange(Array.from(e.target.selectedOptions).map((o) => o.value))}
        className="px-2 py-1 rounded border border-slate-300 text-sm min-h-[80px]"
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

  return (
    <div className="bg-white rounded-xl shadow-sm border p-4 space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="font-bold text-slate-800">Filters</h3>
        <button onClick={reset} className="text-xs text-blue-600 hover:underline">Reset</button>
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div className="flex flex-col gap-1">
          <label className="text-xs font-semibold text-slate-600 uppercase">From</label>
          <input type="date" value={filters.dateRange[0]} onChange={(e) => setFilters({ ...filters, dateRange: [e.target.value, filters.dateRange[1]] })} className="px-2 py-1 rounded border border-slate-300 text-sm" />
        </div>
        <div className="flex flex-col gap-1">
          <label className="text-xs font-semibold text-slate-600 uppercase">To</label>
          <input type="date" value={filters.dateRange[1]} onChange={(e) => setFilters({ ...filters, dateRange: [filters.dateRange[0], e.target.value] })} className="px-2 py-1 rounded border border-slate-300 text-sm" />
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
