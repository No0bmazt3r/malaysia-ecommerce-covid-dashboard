"use client";
import { useMemo } from "react";
import * as Slider from "@radix-ui/react-slider";
import { ChevronDown } from "lucide-react";
import { useDashboard } from "@/context/DashboardContext";
import { uniqueValues } from "@/lib/data";
import { PhaseGlossary, PHASE_DEFINITIONS } from "@/components/ui/PhaseGlossary";

function CheckboxGroup({
  label,
  options,
  selected,
  onChange,
  hints,
}: {
  label: string;
  options: string[];
  selected: string[];
  onChange: (v: string[]) => void;
  hints?: Record<string, string>;
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
      <label className="text-[11px] font-semibold uppercase tracking-[0.15em]" style={{ color: 'var(--secondary, #5D8FA3)' }}>
        {label}
        {selected.length > 0 && (
          <span className="ml-1.5 inline-flex h-4 min-w-4 items-center justify-center rounded-[2px] px-1 text-[10px] font-bold text-white" style={{ background: 'var(--accent)' }}>
            {selected.length}
          </span>
        )}
      </label>
      <div className="max-h-48 space-y-0.5 overflow-y-auto rounded-[2px] border border-[var(--border)] bg-[var(--surface-strong)] p-2">
        {options.map((option) => {
          const checked = selected.includes(option);
          return (
            <label
              key={option}
              title={hints?.[option]}
              className={`flex min-h-[44px] cursor-pointer items-center gap-3 rounded-[2px] px-2.5 py-1.5 text-base transition ${
                checked ? "bg-[var(--accent-muted)] font-medium" : "hover:bg-[var(--surface-muted)]"
              }`}
              style={{ color: 'var(--foreground)' }}
            >
              <input
                type="checkbox"
                checked={checked}
                onChange={() => toggle(option)}
                className="h-5 w-5 rounded"
                style={{ accentColor: 'var(--accent)' }}
              />
              <span className="truncate">{option}</span>
            </label>
          );
        })}
      </div>
    </div>
  );
}

/* Elderly variant of the filter panel: only the three primary filters are
   visible (Date Range, State, Category); the rest live behind one
   "Advanced filters" expander so the panel never shows six controls at once. */
export function ElderlyFilterPanel() {
  const { rawData, filters, setFilters } = useDashboard();

  const timestamps = useMemo(() => {
    if (rawData.length === 0) return null;
    const times = rawData.map((d) => new Date(d.order_date).getTime());
    return { min: Math.min(...times), max: Math.max(...times) };
  }, [rawData]);

  const reset = () =>
    setFilters({
      dateRange: ["2020-01-01", "2021-12-31"],
      covidPhase: [],
      state: [],
      category: [],
      segment: [],
      searchQuery: "",
    });

  return (
    <div className="dashboard-card space-y-5 rounded-[var(--section-radius)] p-5 lg:sticky lg:top-24">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h3 className="text-lg font-bold" style={{ fontFamily: "var(--font-display)", color: 'var(--foreground)' }}>
            Filters
          </h3>
          <p className="mt-0.5 text-sm" style={{ color: 'var(--secondary, #5D8FA3)' }}>
            Refine the data shown in the charts.
          </p>
        </div>
        <button
          onClick={reset}
          className="rounded-[2px] border border-[var(--border-strong)] bg-[var(--surface-muted)] px-4 py-2 text-sm font-semibold transition hover:opacity-80 active:scale-95"
          style={{ color: 'var(--foreground)' }}
        >
          Reset
        </button>
      </div>

      {/* Primary filter 1: Date range */}
      <div className="flex flex-col gap-3">
        <label className="text-[11px] font-semibold uppercase tracking-[0.15em]" style={{ color: 'var(--secondary, #5D8FA3)' }}>
          Date Range
        </label>
        {!timestamps ? (
          <div className="h-4 w-full rounded-[2px] skeleton-shimmer" />
        ) : (
          <div className="px-2">
            <Slider.Root
              className="relative flex w-full touch-none select-none items-center"
              min={timestamps.min}
              max={timestamps.max}
              step={86400000}
              value={[
                new Date(filters.dateRange[0]).getTime() || timestamps.min,
                new Date(filters.dateRange[1]).getTime() || timestamps.max,
              ]}
              onValueChange={(val) => {
                const start = new Date(val[0]).toISOString().split("T")[0];
                const end = new Date(val[1]).toISOString().split("T")[0];
                setFilters({ ...filters, dateRange: [start, end] });
              }}
              style={{ height: "44px" }}
            >
              <Slider.Track className="relative h-2.5 grow rounded-full bg-[var(--surface-muted)]">
                <Slider.Range className="absolute h-full rounded-full" style={{ background: "var(--accent)" }} />
              </Slider.Track>
              <Slider.Thumb className="block h-7 w-7 cursor-grab active:cursor-grabbing rounded-full border-2 border-[var(--border-strong)] bg-[var(--surface-strong)] shadow hover:scale-110 focus:outline-none focus:ring-2" />
              <Slider.Thumb className="block h-7 w-7 cursor-grab active:cursor-grabbing rounded-full border-2 border-[var(--border-strong)] bg-[var(--surface-strong)] shadow hover:scale-110 focus:outline-none focus:ring-2" />
            </Slider.Root>
            <div className="mt-2.5 flex items-center justify-between text-[10px] font-semibold tracking-wide" style={{ color: 'var(--secondary, #5D8FA3)', fontFamily: "var(--font-mono)" }}>
              <span>{filters.dateRange[0]}</span>
              <span>{filters.dateRange[1]}</span>
            </div>
          </div>
        )}
      </div>

      {rawData.length > 0 && (
        <>
          {/* Primary filter 2: State */}
          <div className="flex flex-col gap-1.5">
            <label className="text-[11px] font-semibold uppercase tracking-[0.15em]" style={{ color: 'var(--secondary, #5D8FA3)' }}>
              State / Region
            </label>
            <select
              value={filters.state[0] ?? "all"}
              onChange={(e) => setFilters({ ...filters, state: e.target.value === "all" ? [] : [e.target.value] })}
              className="min-h-[44px] rounded-[2px] border border-[var(--border-strong)] bg-[var(--surface-strong)] px-3 py-2.5 text-base outline-none transition focus:ring-2"
              style={{ color: 'var(--foreground)' }}
            >
              <option value="all">All states</option>
              {uniqueValues(rawData, "state").map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </div>

          {/* Primary filter 3: Category */}
          <CheckboxGroup
            label="Category"
            options={uniqueValues(rawData, "product_category")}
            selected={filters.category}
            onChange={(v) => setFilters({ ...filters, category: v })}
          />

          {/* Everything else stays behind one expander */}
          <details className="group rounded-[2px] border border-[var(--border-strong)]">
            <summary className="flex min-h-[44px] cursor-pointer list-none items-center justify-between gap-2 px-3 py-2.5 text-base font-semibold" style={{ color: 'var(--foreground)' }}>
              Advanced filters
              <ChevronDown aria-hidden="true" className="h-5 w-5 transition group-open:rotate-180" style={{ color: 'var(--secondary, #5D8FA3)' }} />
            </summary>
            <div className="space-y-4 border-t border-[var(--border)] p-3">
              <CheckboxGroup
                label="COVID Phase"
                options={uniqueValues(rawData, "covid_phase")}
                selected={filters.covidPhase}
                onChange={(v) => setFilters({ ...filters, covidPhase: v })}
                hints={PHASE_DEFINITIONS}
              />
              <PhaseGlossary />
              <CheckboxGroup
                label="Segment"
                options={uniqueValues(rawData, "customer_segment")}
                selected={filters.segment}
                onChange={(v) => setFilters({ ...filters, segment: v })}
              />
            </div>
          </details>
        </>
      )}
    </div>
  );
}
