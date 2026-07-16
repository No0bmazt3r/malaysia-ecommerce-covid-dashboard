"use client";
import { createContext, useContext, useEffect, useMemo, useState, ReactNode } from "react";
import { Filters, Order, UCMode } from "@/lib/types";
import { loadDataset } from "@/lib/data";
import { applyFilters } from "@/lib/filters";

interface Ctx {
  mode: UCMode; setMode: (m: UCMode) => void; filters: Filters; setFilters: (f: Filters) => void;
  rawData: Order[]; filteredData: Order[]; loading: boolean;
}
const DashboardContext = createContext<Ctx | null>(null);
const DEFAULT_FILTERS: Filters = { dateRange: ["2020-01-01", "2021-12-31"], covidPhase: [], state: [], category: [], segment: [], searchQuery: "" };

export function DashboardProvider({ children }: { children: ReactNode }) {
  const [mode, setMode] = useState<UCMode>("analyst");
  const [filters, setFilters] = useState<Filters>(DEFAULT_FILTERS);
  const [rawData, setRawData] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => { loadDataset().then((d) => { setRawData(d); setLoading(false); }); }, []);
  const filteredData = useMemo(() => applyFilters(rawData, filters), [rawData, filters]);

  return (
    <DashboardContext.Provider value={{ mode, setMode, filters, setFilters, rawData, filteredData, loading }}>
      {children}
    </DashboardContext.Provider>
  );
}
export function useDashboard() {
  const ctx = useContext(DashboardContext);
  if (!ctx) throw new Error("useDashboard must be used within DashboardProvider");
  return ctx;
}
