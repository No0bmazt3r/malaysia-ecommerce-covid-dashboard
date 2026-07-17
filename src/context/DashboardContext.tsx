"use client";
import { createContext, useContext, useEffect, useMemo, useState, ReactNode } from "react";
import { Filters, Order, UCMode } from "@/lib/types";
import { loadDataset } from "@/lib/data";
import { applyFilters } from "@/lib/filters";

interface Ctx {
  filters: Filters; setFilters: (f: Filters) => void;
  rawData: Order[]; filteredData: Order[]; loading: boolean;
  mode: UCMode; setMode: (m: UCMode) => void;
}
const DashboardContext = createContext<Ctx | null>(null);
const DEFAULT_FILTERS: Filters = { dateRange: ["2020-01-01", "2021-12-31"], covidPhase: [], state: [], category: [], segment: [], searchQuery: "" };

export function DashboardProvider({ children }: { children: ReactNode }) {
  const [filters, setFilters] = useState<Filters>(DEFAULT_FILTERS);
  const [rawData, setRawData] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [mode, setMode] = useState<UCMode>("analyst");

  useEffect(() => { loadDataset().then((d) => { setRawData(d); setLoading(false); }); }, []);
  const filteredData = useMemo(() => applyFilters(rawData, filters), [rawData, filters]);

  return (
    <DashboardContext.Provider value={{ filters, setFilters, rawData, filteredData, loading, mode, setMode }}>
      <div className={`mode-${mode}`}>
        {children}
      </div>
    </DashboardContext.Provider>
  );
}
export function useDashboard() {
  const ctx = useContext(DashboardContext);
  if (!ctx) throw new Error("useDashboard must be used within DashboardProvider");
  return ctx;
}
