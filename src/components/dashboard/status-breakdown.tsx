import Link from "next/link";
import { StatusDot, STATUS_STYLES } from "@/components/orders/status-badge";
import { formatNumber } from "@/lib/format";
import { cn } from "@/lib/utils";
import { ORDER_STATUSES, STATUS_LABELS, type OrderStatus } from "@/lib/types";

interface StatusBreakdownProps {
  counts: Record<OrderStatus, number>;
  total: number;
}

/** Share of orders in each status, each row labeled and linked to a filtered list. */
export function StatusBreakdown({ counts, total }: StatusBreakdownProps) {
  return (
    <section aria-labelledby="status-breakdown-title" className="panel p-5">
      <h2 id="status-breakdown-title" className="text-sm font-semibold text-foreground">
        Orders by status
      </h2>
      <p className="mt-0.5 text-xs text-muted-foreground">Current pipeline across all orders</p>

      <ul className="mt-5 space-y-4">
        {ORDER_STATUSES.map((status) => {
          const count = counts[status];
          const share = total > 0 ? count / total : 0;
          return (
            <li key={status}>
              <Link
                href={`/orders?status=${status}`}
                className="group block rounded-md outline-none focus-visible:ring-3 focus-visible:ring-ring/50"
              >
                <div className="flex items-center gap-2 text-sm">
                  <StatusDot status={status} className="size-2" />
                  <span className="font-medium text-foreground group-hover:underline group-hover:underline-offset-2">
                    {STATUS_LABELS[status]}
                  </span>
                  <span className="ml-auto text-foreground tabular-nums">{formatNumber(count)}</span>
                  <span className="w-11 text-right text-xs text-muted-foreground tabular-nums">
                    {Math.round(share * 100)}%
                  </span>
                </div>
                <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-muted">
                  <div
                    className={cn("h-full rounded-full", STATUS_STYLES[status].dot)}
                    style={{ width: `${share * 100}%` }}
                  />
                </div>
              </Link>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
