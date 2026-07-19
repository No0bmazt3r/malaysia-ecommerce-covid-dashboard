"use client";
import { useState } from "react";
import { ScatterMatrix } from "@/components/charts/ScatterMatrix";
import { CategoryTreemap } from "@/components/charts/CategoryTreemap";
import { CategoryMosaicPlot } from "@/components/charts/CategoryMosaicPlot";
import { TopProductsBarChart } from "@/components/charts/TopProductsBarChart";
import { useUserMode } from "@/hooks/useUserMode";
import { ChildProductsView } from "@/components/child/ChildProductsView";
import { ElderlyScatterSingle } from "@/components/elderly/ElderlyScatterSingle";

export default function Product() {
  const [activeTab, setActiveTab] = useState<"performance" | "correlation">("performance");
  const userMode = useUserMode();

  if (userMode === "child") return <ChildProductsView />;

  return (
    <div className="space-y-6">
      <section className="dashboard-surface rounded-[var(--section-radius)] px-6 py-6 md:px-8">
        <div className="flex flex-col gap-6 md:flex-row md:items-start md:justify-between">
          <div>
            <span className="inline-flex items-center rounded-[2px] px-2.5 py-1 text-[11px] font-semibold uppercase tracking-[0.15em]" style={{ background: 'rgba(141, 181, 150, 0.12)', color: '#8DB596' }}>
              Product analysis
            </span>
            <h2 className="display-heading mt-3 text-2xl" style={{ color: 'var(--foreground)' }}>
              Product &amp; Correlation Analysis
            </h2>
            <p className="mt-1.5 text-sm" style={{ color: 'var(--secondary, #5D8FA3)' }}>
              Deep dive into top performing SKUs, category revenues, and complex multivariate correlations.
            </p>
          </div>

          <div className="relative flex items-center rounded-[2px] bg-[var(--surface-muted)] p-1.5 shadow-inner self-start">
            {/* Sliding Pill Background */}
            <div
              className={`absolute bottom-1.5 left-1.5 top-1.5 rounded-[2px] bg-[var(--surface-strong)] shadow-sm transition-all duration-300 ease-out ${
                activeTab === "performance"
                  ? "w-[130px] translate-x-0"
                  : "w-[172px] translate-x-[130px]"
              }`}
            />

            <button
              onClick={() => setActiveTab("performance")}
              className="relative z-10 inline-flex w-[130px] items-center justify-center gap-1.5 rounded-[2px] py-2 text-sm font-medium transition-colors"
              style={{ color: activeTab === "performance" ? 'var(--foreground)' : 'var(--secondary, #5D8FA3)' }}
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="h-3.5 w-3.5 shrink-0" aria-hidden="true">
                <path d="M3 3v16a2 2 0 0 0 2 2h16" />
                <rect x="15" y="5" width="4" height="12" rx="1" />
                <rect x="7" y="8" width="4" height="9" rx="1" />
              </svg>
              Performance
            </button>

            <button
              onClick={() => setActiveTab("correlation")}
              className="relative z-10 inline-flex w-[172px] items-center justify-center gap-1.5 rounded-[2px] py-2 text-sm font-medium transition-colors"
              style={{ color: activeTab === "correlation" ? 'var(--foreground)' : 'var(--secondary, #5D8FA3)' }}
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="h-3.5 w-3.5 shrink-0" aria-hidden="true">
                <circle cx="7.5" cy="7.5" r=".5" fill="currentColor" />
                <circle cx="18.5" cy="5.5" r=".5" fill="currentColor" />
                <circle cx="11.5" cy="11.5" r=".5" fill="currentColor" />
                <circle cx="7.5" cy="16.5" r=".5" fill="currentColor" />
                <circle cx="17.5" cy="14.5" r=".5" fill="currentColor" />
                <path d="M3 3v16a2 2 0 0 0 2 2h16" />
              </svg>
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
          {userMode === "elderly" ? <ElderlyScatterSingle /> : <ScatterMatrix />}
        </div>
      )}
    </div>
  );
}
