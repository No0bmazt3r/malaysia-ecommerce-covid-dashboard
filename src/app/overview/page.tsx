"use client";
import { KPICards } from "@/components/ui/KPICards";
import { FilterPanel } from "@/components/ui/FilterPanel";
import { PhaseLineChart } from "@/components/charts/PhaseLineChart";
import { HeatMap } from "@/components/charts/HeatMap";
import { useDashboard } from "@/context/DashboardContext";

export default function Overview() {
  const { loading } = useDashboard();
  if (loading) return <div className="p-8 text-center text-slate-500">Loading dataset...</div>;
  return (
    <div className="space-y-6">
      <KPICards />
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <aside className="lg:col-span-1"><FilterPanel /></aside>
        <div className="lg:col-span-3 space-y-6">
          <PhaseLineChart />
          <HeatMap />
        </div>
      </div>
    </div>
  );
}
