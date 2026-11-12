import { CircleCheckIcon, ClipboardListIcon, ClockIcon, DollarSignIcon } from "lucide-react";
import { formatCurrency, formatNumber, formatPercent } from "@/lib/format";
import type { DashboardMetrics } from "@/lib/metrics";
import { KpiCard } from "./kpi-card";

export function KpiGrid({ metrics }: { metrics: DashboardMetrics }) {
  const activeOrders = metrics.totalOrders - metrics.cancelledOrders;

  return (
    <dl className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
      <KpiCard
        label="Total orders"
        value={formatNumber(metrics.totalOrders)}
        detail={`Across all statuses · ${formatNumber(metrics.cancelledOrders)} cancelled`}
        icon={ClipboardListIcon}
        tone="bg-blue-50 text-blue-600"
      />
      <KpiCard
        label="Total revenue"
        value={formatCurrency(metrics.totalRevenue)}
        detail={`From ${formatNumber(metrics.completedOrders)} completed ${
          metrics.completedOrders === 1 ? "order" : "orders"
        }`}
        icon={DollarSignIcon}
        tone="bg-teal-50 text-teal-700"
      />
      <KpiCard
        label="Pending orders"
        value={formatNumber(metrics.pendingOrders)}
        detail={`Awaiting work · ${formatNumber(metrics.processingOrders)} in processing`}
        icon={ClockIcon}
        tone="bg-amber-50 text-amber-600"
      />
      <KpiCard
        label="Completion rate"
        value={metrics.completionRate === null ? "—" : formatPercent(metrics.completionRate)}
        detail={
          activeOrders > 0
            ? `${formatNumber(metrics.completedOrders)} of ${formatNumber(activeOrders)} orders, excluding cancelled`
            : "No active orders yet"
        }
        icon={CircleCheckIcon}
        tone="bg-emerald-50 text-emerald-600"
      />
    </dl>
  );
}
