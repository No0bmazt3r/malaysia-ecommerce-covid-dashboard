"use client";
import { useDashboard } from "@/context/DashboardContext";

export function SearchBar() {
  const { filters, setFilters } = useDashboard();
  return (
    <div className="relative">
      <svg
        className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400"
        fill="none"
        viewBox="0 0 24 24"
        strokeWidth={2}
        stroke="currentColor"
      >
        <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
      </svg>
      <input
        type="text"
        placeholder="Search orders, products…"
        value={filters.searchQuery}
        onChange={(e) => setFilters({ ...filters, searchQuery: e.target.value })}
        className="w-56 rounded-lg border border-[var(--border)] bg-[var(--surface-strong)] py-2 pl-9 pr-3 text-sm text-[var(--foreground)] outline-none transition placeholder:text-slate-400 focus:border-[var(--accent)] focus:ring-2 focus:ring-[var(--accent-muted)] dark:placeholder:text-slate-500"
      />
    </div>
  );
}
