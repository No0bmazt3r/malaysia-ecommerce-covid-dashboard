"use client";
import { useDashboard } from "@/context/DashboardContext";
import { uniqueValues } from "@/lib/data";

function CheckboxGroup({
  label,
  options,
  selected,
  onChange,
}: {
  label: string;
  options: string[];
  selected: string[];
  onChange: (v: string[]) => void;
}) {
  const toggle = (value: string) => {
    if (selected.includes(value)) {
      onChange(selected.filter((item) => item !== value));
      return;
    }
    onChange([...selected, value]);
  };

  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-[11px] font-semibold uppercase tracking-[0.15em] text-slate-500 dark:text-slate-400">
        {label}
        {selected.length > 0 && (
          <span className="ml-1.5 inline-flex h-4 min-w-4 items-center justify-center rounded-full bg-[var(--accent)] px-1 text-[10px] font-bold text-white">
            {selected.length}
          </span>
        )}
      </label>
      <div className="max-h-40 space-y-0.5 overflow-y-auto rounded-xl border border-[var(--border)] bg-[var(--surface-strong)] p-2">
        {options.map((option) => {
          const checked = selected.includes(option);
          return (
            <label
              key={option}
              className={`flex cursor-pointer items-center gap-2.5 rounded-lg px-2.5 py-1.5 text-sm transition ${
                checked
                  ? "bg-[var(--accent-muted)] text-[var(--foreground)] font-medium"
                  : "text-slate-600 hover:bg-[var(--surface-muted)] dark:text-slate-300"
              }`}
            >
              <input
                type="checkbox"
                checked={checked}
                onChange={() => toggle(option)}
                className="h-3.5 w-3.5 rounded border-slate-300 text-[var(--accent)] focus:ring-[var(--accent)]"
              />
              <span className="truncate">{option}</span>
            </label>
          );
        })}
      </div>
    </div>
  );
}

function DropdownFilter({
  label,
  options,
  selected,
  onChange,
}: {
  label: string;
  options: string[];
  selected: string[];
  onChange: (v: string[]) => void;
}) {
  const value = selected[0] ?? "all";
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-[11px] font-semibold uppercase tracking-[0.15em] text-slate-500 dark:text-slate-400">
        {label}
      </label>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value === "all" ? [] : [e.target.value])}
        className="rounded-xl border border-[var(--border)] bg-[var(--surface-strong)] px-3 py-2.5 text-sm text-[var(--foreground)] outline-none transition focus:border-[var(--accent)] focus:ring-2 focus:ring-[var(--accent-muted)]"
      >
        <option value="all">All regions</option>
        {options.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
    </div>
  );
}

export function FilterPanel() {
  const { rawData, filters, setFilters } = useDashboard();
  const reset = () =>
    setFilters({
      dateRange: ["2020-01-01", "2021-12-31"],
      covidPhase: [],
      state: [],
      category: [],
      segment: [],
      searchQuery: "",
    });
  const activeFilters =
    filters.covidPhase.length +
    filters.state.length +
    filters.category.length +
    filters.segment.length +
    (filters.searchQuery ? 1 : 0);

  return (
    <div className="dashboard-card space-y-4 rounded-[var(--section-radius)] p-5 lg:sticky lg:top-20">
      {/* Header */}
      <div className="flex items-start justify-between gap-3">
        <div>
          <h3
            className="text-base font-bold text-slate-950 dark:text-white"
            style={{ fontFamily: "var(--font-display)" }}
          >
            Filters
          </h3>
          <p className="mt-0.5 text-xs text-slate-500 dark:text-slate-400">
            Refine the data and cross-filter the charts.
          </p>
        </div>
        <button
          onClick={reset}
          className="rounded-lg border border-[var(--border)] bg-[var(--surface-muted)] px-2.5 py-1 text-[11px] font-semibold text-slate-600 transition hover:bg-slate-100 active:scale-95 dark:text-slate-300 dark:hover:bg-slate-800"
        >
          Reset
        </button>
      </div>

      {/* Active count */}
      <div className="flex items-center justify-between rounded-xl bg-[var(--surface-muted)] px-3 py-2">
        <span className="text-[11px] font-semibold uppercase tracking-[0.15em] text-slate-500 dark:text-slate-400">
          Active filters
        </span>
        <span
          className={`grid h-6 min-w-6 place-items-center rounded-md text-xs font-bold ${
            activeFilters > 0
              ? "bg-[var(--accent)] text-white"
              : "bg-[var(--border)] text-slate-500"
          }`}
        >
          {activeFilters}
        </span>
      </div>

      {/* Date range */}
      <div className="grid grid-cols-2 gap-2">
        <div className="flex flex-col gap-1">
          <label className="text-[11px] font-semibold uppercase tracking-[0.15em] text-slate-500 dark:text-slate-400">
            From
          </label>
          <input
            type="date"
            value={filters.dateRange[0]}
            onChange={(e) =>
              setFilters({
                ...filters,
                dateRange: [e.target.value, filters.dateRange[1]],
              })
            }
            className="rounded-xl border border-[var(--border)] bg-[var(--surface-strong)] px-2.5 py-2 text-sm text-[var(--foreground)] outline-none transition focus:border-[var(--accent)] focus:ring-2 focus:ring-[var(--accent-muted)]"
          />
        </div>
        <div className="flex flex-col gap-1">
          <label className="text-[11px] font-semibold uppercase tracking-[0.15em] text-slate-500 dark:text-slate-400">
            To
          </label>
          <input
            type="date"
            value={filters.dateRange[1]}
            onChange={(e) =>
              setFilters({
                ...filters,
                dateRange: [filters.dateRange[0], e.target.value],
              })
            }
            className="rounded-xl border border-[var(--border)] bg-[var(--surface-strong)] px-2.5 py-2 text-sm text-[var(--foreground)] outline-none transition focus:border-[var(--accent)] focus:ring-2 focus:ring-[var(--accent-muted)]"
          />
        </div>
      </div>

      {/* Dimension filters */}
      {rawData.length > 0 && (
        <>
          <CheckboxGroup
            label="COVID Phase"
            options={uniqueValues(rawData, "covid_phase")}
            selected={filters.covidPhase}
            onChange={(v) => setFilters({ ...filters, covidPhase: v })}
          />
          <DropdownFilter
            label="State / Region"
            options={uniqueValues(rawData, "state")}
            selected={filters.state}
            onChange={(v) => setFilters({ ...filters, state: v })}
          />
          <CheckboxGroup
            label="Category"
            options={uniqueValues(rawData, "product_category")}
            selected={filters.category}
            onChange={(v) => setFilters({ ...filters, category: v })}
          />
          <CheckboxGroup
            label="Segment"
            options={uniqueValues(rawData, "customer_segment")}
            selected={filters.segment}
            onChange={(v) => setFilters({ ...filters, segment: v })}
          />
        </>
      )}
    </div>
  );
}
