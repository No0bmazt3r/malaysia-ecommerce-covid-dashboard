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
            <span className="inline-flex items-center rounded-md px-2.5 py-1 text-[11px] font-semibold uppercase tracking-[0.15em]" style={{ background: 'rgba(141, 181, 150, 0.12)', color: '#8DB596' }}>
              Product analysis
            </span>
            <h2 className="display-heading mt-3 text-2xl" style={{ color: 'var(--foreground)' }}>
              Product &amp; Correlation Analysis
            </h2>
            <p className="mt-1.5 max-w-2xl text-sm" style={{ color: 'var(--secondary, #5D8FA3)' }}>
              Deep dive into top performing SKUs, category revenues, and complex multivariate correlations.
            </p>
          </div>

          <div className="relative flex items-center rounded-lg bg-[var(--surface-muted)] p-1.5 shadow-inner self-start">
            {/* Sliding Pill Background */}
            <div
              className={`absolute bottom-1.5 left-1.5 top-1.5 rounded-md bg-[var(--surface-strong)] shadow-sm transition-all duration-300 ease-out ${
                activeTab === "performance"
                  ? "w-[108px] translate-x-0"
                  : "w-[146px] translate-x-[108px]"
              }`}
            />
            
            <button
              onClick={() => setActiveTab("performance")}
              className={`relative z-10 w-[108px] rounded-md py-2 text-sm font-medium transition-colors`}
              style={{ color: activeTab === "performance" ? 'var(--foreground)' : 'var(--secondary, #5D8FA3)' }}
            >
              Performance
            </button>
            
            <button
              onClick={() => setActiveTab("correlation")}
              className={`relative z-10 w-[146px] rounded-md py-2 text-sm font-medium transition-colors`}
              style={{ color: activeTab === "correlation" ? 'var(--foreground)' : 'var(--secondary, #5D8FA3)' }}
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
