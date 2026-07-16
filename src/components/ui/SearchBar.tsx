"use client";
import { useDashboard } from "@/context/DashboardContext";

export function SearchBar() {
  const { filters, setFilters } = useDashboard();
  return (
    <div className="relative w-full max-w-md">
      <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">⌕</span>
      <input
        type="text"
        placeholder="Search order, product, or customer"
        value={filters.searchQuery}
        onChange={(e) => setFilters({ ...filters, searchQuery: e.target.value })}
        className="w-full rounded-full border border-white/60 bg-white/80 py-2.5 pl-11 pr-4 text-sm text-slate-900 shadow-sm outline-none transition placeholder:text-slate-400 focus:border-sky-400 focus:ring-4 focus:ring-sky-500/10 dark:border-slate-800/70 dark:bg-slate-900/70 dark:text-slate-100 dark:placeholder:text-slate-500"
      />
    </div>
  );
}
