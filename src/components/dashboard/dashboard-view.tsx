"use client";

import { ClipboardListIcon, PlusIcon } from "lucide-react";
import Link from "next/link";
import { useMemo } from "react";
import { PageHeader } from "@/components/layout/page-header";
import { Button } from "@/components/ui/button";
import { useOrders } from "@/hooks/use-orders";
import { todayIsoDate } from "@/lib/dates";
import { buildWeeklySeries, calculateMetrics, countByStatus, getRecentOrders } from "@/lib/metrics";
import { CHART_WEEKS } from "./chart-theme";
import { DashboardSkeleton } from "./dashboard-skeleton";
import { KpiGrid } from "./kpi-grid";
import { OrderVolumeChart } from "./order-volume-chart";
import { RecentOrders } from "./recent-orders";
import { RevenueChart } from "./revenue-chart";
import { StatusBreakdown } from "./status-breakdown";

export function DashboardView() {
  const { ready, orders } = useOrders();

  // Everything below is derived from the same order list, so the KPIs,
  // charts and lists always agree and update together.
  const metrics = useMemo(() => calculateMetrics(orders), [orders]);
  const counts = useMemo(() => countByStatus(orders), [orders]);
  const recent = useMemo(() => getRecentOrders(orders, 5), [orders]);
  const series = useMemo(
    () => (ready ? buildWeeklySeries(orders, todayIsoDate(), CHART_WEEKS) : []),
    [orders, ready],
  );

  return (
    <>
      <PageHeader
        title="Dashboard"
        description="Orders, revenue and fulfillment at a glance."
        actions={
          <>
            <Button variant="outline" size="lg" asChild>
              <Link href="/orders">
                <ClipboardListIcon aria-hidden="true" />
                View orders
              </Link>
            </Button>
            <Button size="lg" asChild>
              <Link href="/orders?new=1">
                <PlusIcon aria-hidden="true" />
                New order
              </Link>
            </Button>
          </>
        }
      />

      {!ready ? (
        <DashboardSkeleton />
      ) : (
        <div className="space-y-4">
          <KpiGrid metrics={metrics} />
          <div className="grid gap-4 xl:grid-cols-2 [&>*]:min-w-0">
            <RevenueChart series={series} />
            <OrderVolumeChart series={series} />
          </div>
          <div className="grid gap-4 xl:grid-cols-3">
            <div className="min-w-0 xl:col-span-2">
              <RecentOrders orders={recent} />
            </div>
            <StatusBreakdown counts={counts} total={orders.length} />
          </div>
        </div>
      )}
    </>
  );
}
