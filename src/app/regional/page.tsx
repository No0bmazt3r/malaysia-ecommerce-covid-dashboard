"use client";
import { HeatMap } from "@/components/charts/HeatMap";
import { useDashboard } from "@/context/DashboardContext";

export default function Regional() {
  const { mode } = useDashboard();
  return (
    <div className="space-y-6">
      <div>
        <h2 className={`font-bold ${mode === "elderly" ? "text-2xl" : "text-xl"}`}>
          Regional & Phase Analysis
        </h2>
        <p className="text-sm text-slate-500 mt-1">
          Explore revenue distribution across Malaysian states and COVID-19 phases. 
          <span className="font-semibold text-rose-600"> Look for the Sabah + CMCO anomaly.</span>
        </p>
      </div>
      <HeatMap />
    </div>
  );
}
