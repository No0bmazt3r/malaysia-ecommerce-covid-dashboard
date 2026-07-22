"use client";
import { useMemo, useState, useEffect, useRef } from "react";
import * as Slider from "@radix-ui/react-slider";
import { useDashboard } from "@/context/DashboardContext";
import { uniqueValues } from "@/lib/data";
import type { Order } from "@/lib/types";
import { PhaseGlossary, PHASE_DEFINITIONS } from "@/components/ui/PhaseGlossary";
import { useDebounce } from "@/hooks/useDebounce";

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
      <div className="max-h-40 space-y-0.5 overflow-y-auto rounded-[2px] border border-[var(--border)] bg-[var(--surface-strong)] p-2">
        {options.map((option) => {
          const checked = selected.includes(option);
          return (
            <label
              key={option}
              title={hints?.[option]}
              className={`flex cursor-pointer items-center gap-2.5 rounded-[2px] px-2.5 py-1.5 text-sm transition ${
                checked
                  ? "bg-[var(--accent-muted)] font-medium"
                  : "hover:bg-[var(--surface-muted)]"
              }`}
              style={{ color: 'var(--foreground)' }}
            >
              <input
                type="checkbox"
                checked={checked}
                onChange={() => toggle(option)}
                className="h-3.5 w-3.5 rounded"
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
      <label className="text-[11px] font-semibold uppercase tracking-[0.15em]" style={{ color: 'var(--secondary, #5D8FA3)' }}>
        {label}
      </label>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value === "all" ? [] : [e.target.value])}
        className="rounded-[2px] border border-[var(--border)] bg-[var(--surface-strong)] px-3 py-2.5 text-sm outline-none transition focus:ring-2"
        style={{ color: 'var(--foreground)', borderColor: undefined }}
      >
        <option value="all">All states</option>
        {options.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
    </div>
  );
}

function SearchFilter({
  label,
  value,
  onChange,
  rawData,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  rawData: Order[];
}) {
  const [localValue, setLocalValue] = useState(value);
  const debouncedValue = useDebounce(localValue, 300);
  const [showDropdown, setShowDropdown] = useState(false);
  const isInternalChange = useRef(false);

  useEffect(() => {
    isInternalChange.current = false;
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setLocalValue(value);
  }, [value]);

  useEffect(() => {
    if (isInternalChange.current) {
      onChange(debouncedValue);
    }
  }, [debouncedValue, onChange]);

  const suggestions = useMemo(() => {
    const tokens = localValue.split(/[, ]+/).filter(Boolean);
    const lastToken = localValue.trim().length > 0 && !localValue.match(/[, ]$/) ? tokens[tokens.length - 1] : "";
    
    if (!lastToken || lastToken.length < 2) return [];
    
    const completedTokens = lastToken ? tokens.slice(0, -1) : tokens;
    const existingTokens = new Set(completedTokens.map((t) => t.toLowerCase()));
    const q = lastToken.toLowerCase();
    const matches = new Set<string>();
    
    for (const r of rawData) {
      if (r.order_id.toLowerCase().includes(q) && !existingTokens.has(r.order_id.toLowerCase())) matches.add(`Order: ${r.order_id}`);
      if (r.product_id.toLowerCase().includes(q) && !existingTokens.has(r.product_id.toLowerCase())) matches.add(`Product: ${r.product_id}`);
      if (r.customer_id.toLowerCase().includes(q) && !existingTokens.has(r.customer_id.toLowerCase())) matches.add(`Customer: ${r.customer_id}`);
      if (matches.size >= 10) break;
    }
    return Array.from(matches);
  }, [localValue, rawData]);

  return (
    <div className="flex flex-col gap-1.5 relative">
      <label className="text-[11px] font-semibold uppercase tracking-[0.15em]" style={{ color: 'var(--secondary, #5D8FA3)' }}>
        {label}
      </label>
      <input
        type="text"
        placeholder="Search IDs (e.g. CUST90, ORD1...)"
        value={localValue}
        onFocus={() => setShowDropdown(true)}
        onBlur={() => setTimeout(() => setShowDropdown(false), 150)}
        onChange={(e) => {
          isInternalChange.current = true;
          setLocalValue(e.target.value);
        }}
        className="rounded-[2px] border border-[var(--border)] bg-[var(--surface-strong)] px-3 py-2 text-sm outline-none transition focus:ring-2 placeholder:text-[var(--secondary)]"
        style={{ color: 'var(--foreground)', borderColor: 'var(--border)' }}
      />
      {showDropdown && suggestions.length > 0 && (
        <div className="absolute top-[100%] left-0 w-full z-10 mt-1 max-h-40 overflow-y-auto rounded-[2px] border border-[var(--border)] bg-[var(--surface-strong)] text-sm shadow-md" style={{ color: 'var(--foreground)' }}>
          {suggestions.map((s) => {
            const exactId = s.split(": ")[1];
            return (
              <div
                key={s}
                className="cursor-pointer px-3 py-2 transition hover:bg-[var(--surface-muted)]"
                onClick={() => {
                  isInternalChange.current = true;
                  const tokens = localValue.split(/[, ]+/).filter(Boolean);
                  if (localValue.trim().length > 0 && !localValue.match(/[, ]$/)) {
                    tokens.pop(); // replace the incomplete token
                  }
                  const newTokens = [...tokens, exactId].filter(Boolean);
                  setLocalValue(newTokens.join(", ") + ", ");
                  setShowDropdown(false);
                }}
              >
                {s}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

export function FilterPanel() {
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
    <div className="dashboard-card space-y-4 rounded-[var(--section-radius)] p-5 lg:sticky lg:top-20">
      {/* Header */}
      <div className="flex items-start justify-between gap-3">
        <div>
          <h3
            className="text-base font-bold"
            style={{ fontFamily: "var(--font-display)", color: 'var(--foreground)' }}
          >
            Filters
          </h3>
          <p className="mt-0.5 text-xs" style={{ color: 'var(--secondary, #5D8FA3)' }}>
            Refine the data and cross-filter the charts.
          </p>
        </div>
        <button
          onClick={reset}
          className="rounded-[2px] border border-[var(--border)] bg-[var(--surface-muted)] px-2.5 py-1 text-[11px] font-semibold transition hover:opacity-80 active:scale-95"
          style={{ color: 'var(--foreground)' }}
        >
          Reset
        </button>
      </div>

      {/* Date range */}
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
              style={{ height: "20px" }}
            >
              <Slider.Track className="relative h-1.5 grow rounded-full bg-[var(--surface-muted)]">
                <Slider.Range className="absolute h-full rounded-full" style={{ background: "var(--accent)" }} />
              </Slider.Track>
              <Slider.Thumb
                className="block h-4 w-4 cursor-grab active:cursor-grabbing rounded-full border border-[var(--border-strong)] bg-[var(--surface-strong)] shadow hover:scale-110 focus:outline-none focus:ring-2"
              />
              <Slider.Thumb
                className="block h-4 w-4 cursor-grab active:cursor-grabbing rounded-full border border-[var(--border-strong)] bg-[var(--surface-strong)] shadow hover:scale-110 focus:outline-none focus:ring-2"
              />
            </Slider.Root>
            <div className="mt-2.5 flex items-center justify-between text-[10px] font-semibold tracking-wide" style={{ color: 'var(--secondary, #5D8FA3)', fontFamily: "var(--font-mono)" }}>
              <span>{filters.dateRange[0]}</span>
              <span>{filters.dateRange[1]}</span>
            </div>
          </div>
        )}
      </div>

      {/* Dimension filters */}
      {rawData.length > 0 && (
        <>
          <SearchFilter
            label="Dynamic Search"
            value={filters.searchQuery || ""}
            onChange={(v) => setFilters({ ...filters, searchQuery: v })}
            rawData={rawData}
          />
          <CheckboxGroup
            label="COVID Phase"
            options={uniqueValues(rawData, "covid_phase")}
            selected={filters.covidPhase}
            onChange={(v) => setFilters({ ...filters, covidPhase: v })}
            hints={PHASE_DEFINITIONS}
          />
          <PhaseGlossary />
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
