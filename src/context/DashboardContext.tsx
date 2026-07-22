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
        
        // Migrate from old `f` JSON param if it exists, otherwise read new params
        const f = params.get("f");
        if (f) {
          try {
            urlFilters = JSON.parse(decodeURIComponent(f));
          } catch {}
        } else {
          urlFilters = {};
          const qSearch = params.get("searchQuery");
          if (qSearch) urlFilters.searchQuery = qSearch;
          
          const qState = params.get("state");
          if (qState) urlFilters.state = qState.split(",");
          
          const qPhase = params.get("covidPhase");
          if (qPhase) urlFilters.covidPhase = qPhase.split(",");
          
          const qCategory = params.get("category");
          if (qCategory) urlFilters.category = qCategory.split(",");
          
          const qSegment = params.get("segment");
          if (qSegment) urlFilters.segment = qSegment.split(",");
          
          const qDate = params.get("dateRange");
          if (qDate) {
            const dates = qDate.split(",");
            if (dates.length === 2) urlFilters.dateRange = [dates[0], dates[1]];
          }
          if (Object.keys(urlFilters).length === 0) urlFilters = null;
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
      const params = new URLSearchParams();
      
      if (newFilters.searchQuery) params.set("searchQuery", newFilters.searchQuery);
      if (newFilters.state && newFilters.state.length > 0) params.set("state", newFilters.state.join(","));
      if (newFilters.covidPhase && newFilters.covidPhase.length > 0) params.set("covidPhase", newFilters.covidPhase.join(","));
      if (newFilters.category && newFilters.category.length > 0) params.set("category", newFilters.category.join(","));
      if (newFilters.segment && newFilters.segment.length > 0) params.set("segment", newFilters.segment.join(","));
      
      // Only serialize date range if it differs from the defaults to save URL space
      if (newFilters.dateRange && (newFilters.dateRange[0] !== "2020-01-01" || newFilters.dateRange[1] !== "2021-12-31")) {
         params.set("dateRange", newFilters.dateRange.join(","));
      }
      
      const searchStr = params.toString();
      window.history.replaceState(null, "", searchStr ? "?" + searchStr : window.location.pathname);
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
