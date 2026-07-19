"use client";
import { useMemo } from "react";
import { ShoppingBag, Truck, Star } from "lucide-react";
import { useDashboard } from "@/context/DashboardContext";
import { computeKPIs } from "@/lib/filters";
import { ChildScreen } from "./ChildScreen";
import { ChildKPITile } from "./ChildKPITile";
import { ChildOverviewChart } from "./ChildOverviewChart";
import { shortMoney } from "./format";

export function ChildOverview() {
  const { rawData, loading } = useDashboard();
  const kpis = useMemo(() => computeKPIs(rawData), [rawData]);
  const onTimeShare = useMemo(
    () => (rawData.length === 0 ? 0 : rawData.filter((r) => r.delivery_status === "On-Time").length / rawData.length),
    [rawData]
  );

  if (loading) {
    return (
      <ChildScreen title="How Much Did We Sell?" sentence="Counting the money…">
        <div className="h-[300px] w-full rounded-[2px] skeleton-shimmer" />
      </ChildScreen>
    );
  }

  return (
    <ChildScreen title="How Much Did We Sell?" sentence="We sold the most when everyone shopped from home!">
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
        <ChildKPITile
          icon={ShoppingBag}
          value={shortMoney(kpis.totalRevenue)}
          label="Money we made"
          color="var(--viz-good, #0CA678)"
          iconScale={1.3}
          detail={`Exactly RM ${kpis.totalRevenue.toLocaleString("en-MY", { maximumFractionDigits: 0 })}`}
        />
        <ChildKPITile
          icon={Truck}
          value={`${Math.round(kpis.avgDelivery)} days`}
          label="Time to arrive"
          color="var(--secondary, #5D8FA3)"
          iconScale={0.6 + onTimeShare * 0.8}
          detail={`On average ${kpis.avgDelivery.toFixed(1)} days · ${Math.round(onTimeShare * 100)}% on time`}
        />
        <ChildKPITile
          icon={Star}
          value={`${kpis.avgRating.toFixed(1)} ★`}
          label="Stars from customers"
          color="var(--viz-ok, #D98A00)"
          iconScale={0.6 + (kpis.avgRating / 5) * 0.8}
          detail={`Exactly ${kpis.avgRating.toFixed(2)} out of 5 stars`}
        />
      </div>
      <div className="mt-8">
        <ChildOverviewChart />
      </div>
    </ChildScreen>
  );
}
