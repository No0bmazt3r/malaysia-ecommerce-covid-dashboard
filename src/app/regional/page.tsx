import { HeatMap } from "@/components/charts/HeatMap";
import { StateSalesBarChart } from "@/components/charts/StateSalesBarChart";
import { CategoryStateStackedBar } from "@/components/charts/CategoryStateStackedBar";
import { StateDeliveryLineChart } from "@/components/charts/StateDeliveryLineChart";

export default function Regional() {
  return (
    <div className="space-y-6">
      <section className="dashboard-surface rounded-[var(--section-radius)] px-6 py-6 md:px-8">
        <span className="inline-flex items-center rounded-md bg-amber-500/10 px-2.5 py-1 text-[11px] font-semibold uppercase tracking-[0.15em] text-amber-600 dark:text-amber-300">
          Regional analysis
        </span>
        <h2
          className="display-heading mt-3 text-2xl text-slate-950 dark:text-white"
        >
          Revenue by State &amp; COVID Phase
        </h2>
        <p className="mt-1.5 max-w-2xl text-sm text-slate-600 dark:text-slate-400">
          Explore revenue distribution across Malaysian states and COVID-19 phases.{" "}
          <span className="font-semibold text-rose-600 dark:text-rose-400">
            Look for the Sabah + CMCO anomaly.
          </span>
        </p>
      </section>
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <StateSalesBarChart />
        <StateDeliveryLineChart />
      </div>
      <CategoryStateStackedBar />
      <HeatMap />
    </div>
  );
}
