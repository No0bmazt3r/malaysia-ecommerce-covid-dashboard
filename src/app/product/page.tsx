"use client";
import { useState } from "react";
import { ScatterMatrix } from "@/components/charts/ScatterMatrix";
import { CategoryTreemap } from "@/components/charts/CategoryTreemap";
import { CategoryMosaicPlot } from "@/components/charts/CategoryMosaicPlot";
import { TopProductsBarChart } from "@/components/charts/TopProductsBarChart";

export default function Product() {
  const [activeTab, setActiveTab] = useState<"performance" | "correlation">("performance");

  return (
    <div className="space-y-6">
      <section className="dashboard-surface rounded-[var(--section-radius)] px-6 py-6 md:px-8">
        <div className="flex flex-col gap-6 md:flex-row md:items-start md:justify-between">
          <div>
            <span className="inline-flex items-center rounded-md bg-emerald-500/10 px-2.5 py-1 text-[11px] font-semibold uppercase tracking-[0.15em] text-emerald-600 dark:text-emerald-300">
              Product analysis
            </span>
            <h2 className="display-heading mt-3 text-2xl text-slate-950 dark:text-white">
              Product &amp; Correlation Analysis
            </h2>
            <p className="mt-1.5 max-w-2xl text-sm text-slate-600 dark:text-slate-400">
              Deep dive into top performing SKUs, category revenues, and complex multivariate correlations.
            </p>
          </div>

          <div className="flex items-center rounded-lg bg-[var(--surface-muted)] p-1.5 shadow-inner self-start">
            <button
              onClick={() => setActiveTab("performance")}
              className={`rounded-md px-4 py-2 text-sm font-medium transition-all ${
                activeTab === "performance"
                  ? "bg-white text-slate-900 shadow-sm dark:bg-slate-800 dark:text-white"
                  : "text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200"
              }`}
            >
              Performance
            </button>
            <button
              onClick={() => setActiveTab("correlation")}
              className={`rounded-md px-4 py-2 text-sm font-medium transition-all ${
                activeTab === "correlation"
                  ? "bg-white text-slate-900 shadow-sm dark:bg-slate-800 dark:text-white"
                  : "text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200"
              }`}
            >
              Correlation Matrix
            </button>
          </div>
        </div>
      </section>

      {activeTab === "performance" && (
        <div className="space-y-6 animate-in fade-in duration-500 slide-in-from-bottom-2">
          <CategoryTreemap />
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            <CategoryMosaicPlot />
            <TopProductsBarChart />
          </div>
        </div>
      )}

      {activeTab === "correlation" && (
        <div className="animate-in fade-in duration-500 slide-in-from-bottom-2">
          <ScatterMatrix />
        </div>
      )}
    </div>
  );
}
