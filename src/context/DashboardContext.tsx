"use client";
import { createContext, useContext, useEffect, useMemo, useState, ReactNode } from "react";
import { Filters, Order } from "@/lib/types";
import { loadDataset } from "@/lib/data";
import { applyFilters } from "@/lib/filters";

interface Ctx {
  filters: Filters; setFilters: (f: Filters) => void;
  rawData: Order[]; filteredData: Order[]; loading: boolean;
}
const DashboardContext = createContext<Ctx | null>(null);
const DEFAULT_FILTERS: Filters = { dateRange: ["2020-01-01", "2021-12-31"], covidPhase: [], state: [], category: [], segment: [], searchQuery: "" };

export function DashboardProvider({ children }: { children: ReactNode }) {
  const [filters, setFiltersState] = useState<Filters>(DEFAULT_FILTERS);
  const [rawData, setRawData] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => { 
    let urlFilters: Partial<Filters> | null = null;
    if (typeof window !== "undefined") {
      const search = window.location.search;
      if (search) {
        const params = new URLSearchParams(search);
        const f = params.get("f");
        if (f) {
          try {
            urlFilters = JSON.parse(decodeURIComponent(f));
          } catch {}
        }
      }
    }

    loadDataset().then((d) => { 
      setRawData(d); 
      if (urlFilters) {
         setFiltersState(prev => ({ ...prev, ...urlFilters }));
      } else if (d.length > 0) {
        const times = d.map(r => new Date(r.order_date).getTime());
        const minDate = new Date(Math.min(...times)).toISOString().split("T")[0];
        const maxDate = new Date(Math.max(...times)).toISOString().split("T")[0];
        setFiltersState(prev => ({ ...prev, dateRange: [minDate, maxDate] }));
      }
      setLoading(false); 
    }); 
  }, []);

  const setFilters = (newFilters: Filters) => {
    setFiltersState(newFilters);
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      params.set("f", encodeURIComponent(JSON.stringify(newFilters)));
      window.history.replaceState(null, "", "?" + params.toString());
    }
  };

  const filteredData = useMemo(() => applyFilters(rawData, filters), [rawData, filters]);

  return (
    <DashboardContext.Provider value={{ filters, setFilters, rawData, filteredData, loading }}>
      {children}
    </DashboardContext.Provider>
  );
}
export function useDashboard() {
  const ctx = useContext(DashboardContext);
  if (!ctx) throw new Error("useDashboard must be used within DashboardProvider");
  return ctx;
}
