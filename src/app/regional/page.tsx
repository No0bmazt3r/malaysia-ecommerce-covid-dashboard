import { HeatMap } from "@/components/charts/HeatMap";
import { StateSalesBarChart } from "@/components/charts/StateSalesBarChart";
import { CategoryStateStackedBar } from "@/components/charts/CategoryStateStackedBar";
import { StateDeliveryLineChart } from "@/components/charts/StateDeliveryLineChart";
import { PhaseGlossary } from "@/components/ui/PhaseGlossary";

export default function Regional() {
  return (
    <div className="space-y-6">
      <section className="dashboard-surface rounded-[var(--section-radius)] px-6 py-6 md:px-8">
        <span className="inline-flex items-center rounded-[2px] px-2.5 py-1 text-[11px] font-semibold uppercase tracking-[0.15em]" style={{ background: 'rgba(228, 179, 99, 0.12)', color: '#E4B363' }}>
          Regional analysis
        </span>
        <h2
          className="display-heading mt-3 text-2xl"
          style={{ color: 'var(--foreground)' }}
        >
          Revenue by State &amp; COVID Phase
        </h2>
        <p className="mt-1.5 text-sm" style={{ color: 'var(--secondary, #5D8FA3)' }}>
          Explore revenue distribution across Malaysian states and COVID-19 phases.{" "}
          <span className="font-semibold" style={{ color: '#D96C6C' }}>
            Look for the Sabah + CMCO anomaly.
          </span>
        </p>
        <div className="mt-4">
          <PhaseGlossary />
        </div>
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
