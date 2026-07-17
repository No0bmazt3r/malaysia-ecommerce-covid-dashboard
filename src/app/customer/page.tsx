import { SegmentDonutChart } from "@/components/charts/SegmentDonutChart";
import { SegmentGroupedBarChart } from "@/components/charts/SegmentGroupedBarChart";
import { CustomerAgeScatterPlot } from "@/components/charts/CustomerAgeScatterPlot";

export default function Customer() {
  return (
    <div className="space-y-6">
      <section className="dashboard-surface rounded-[var(--section-radius)] px-6 py-6 md:px-8">
        <span className="inline-flex items-center rounded-md bg-blue-500/10 px-2.5 py-1 text-[11px] font-semibold uppercase tracking-[0.15em] text-blue-600 dark:text-blue-300">
          Customer Segmentation
        </span>
        <h2 className="display-heading mt-3 text-2xl text-slate-950 dark:text-white">
          Audience Analysis
        </h2>
        <p className="mt-1.5 max-w-2xl text-sm text-slate-600 dark:text-slate-400">
          Understand how different customer segments performed.{" "}
          <span className="font-semibold text-emerald-600 dark:text-emerald-400">
            Note the Loyal-VIP cluster spike during MCO.
          </span>
        </p>
      </section>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="lg:col-span-1">
          <SegmentDonutChart />
        </div>
        <div className="lg:col-span-2">
          <SegmentGroupedBarChart />
        </div>
      </div>
      
      <CustomerAgeScatterPlot />
    </div>
  );
}
