"use client";
import { ScatterMatrix } from "@/components/charts/ScatterMatrix";
import { useDashboard } from "@/context/DashboardContext";

export default function Product() {
  const { mode } = useDashboard();
  return (
    <div className="space-y-6">
      <div>
        <h2 className={`font-bold ${mode === "elderly" ? "text-2xl" : "text-xl"}`}>
          Product & Correlation Analysis
        </h2>
        <p className="text-sm text-slate-500 mt-1">
          Advanced Scatter Plot Matrix revealing hidden relationships: 
          <span className="font-semibold text-emerald-600"> Ad Spend ↔ Revenue (r≈0.66)</span> and 
          <span className="font-semibold text-rose-600"> Delivery Time ↔ Rating (r≈-0.75)</span>.
        </p>
      </div>
      <ScatterMatrix />
    </div>
  );
}
