import { SegmentDonutChart } from "@/components/charts/SegmentDonutChart";
import { SegmentGroupedBarChart } from "@/components/charts/SegmentGroupedBarChart";
import { CustomerAgeScatterPlot } from "@/components/charts/CustomerAgeScatterPlot";

export default function Customer() {
  return (
    <div className="space-y-6">
      <section className="dashboard-surface rounded-[var(--section-radius)] px-6 py-6 md:px-8">
        <span className="inline-flex items-center rounded-md px-2.5 py-1 text-[11px] font-semibold uppercase tracking-[0.15em]" style={{ background: 'rgba(93, 143, 163, 0.12)', color: '#5D8FA3' }}>
          Customer Segmentation
        </span>
        <h2 className="display-heading mt-3 text-2xl" style={{ color: 'var(--foreground)' }}>
          Audience Analysis
        </h2>
        <p className="mt-1.5 max-w-2xl text-sm" style={{ color: 'var(--secondary, #5D8FA3)' }}>
          Understand how different customer segments performed.{" "}
          <span className="font-semibold" style={{ color: '#8DB596' }}>
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
