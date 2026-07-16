"use client";
import { useDashboard } from "@/context/DashboardContext";

export function SearchBar() {
  const { filters, setFilters } = useDashboard();
  return (
    <input
      type="text"
      placeholder="🔍 Search order_id, product_id, customer_id..."
      value={filters.searchQuery}
      onChange={(e) => setFilters({ ...filters, searchQuery: e.target.value })}
      className="px-4 py-2 rounded-lg border border-slate-300 bg-white text-sm w-full max-w-md focus:outline-none focus:ring-2 focus:ring-blue-500"
    />
  );
}
