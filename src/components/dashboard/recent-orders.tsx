import { ArrowRightIcon } from "lucide-react";
import Link from "next/link";
import { StatusBadge } from "@/components/orders/status-badge";
import { formatDate } from "@/lib/dates";
import { formatCurrency } from "@/lib/format";
import { getOrderTotal } from "@/lib/orders";
import type { Order } from "@/lib/types";

export function RecentOrders({ orders }: { orders: Order[] }) {
  return (
    <section aria-labelledby="recent-orders-title" className="panel overflow-hidden">
      <div className="flex items-center justify-between gap-4 p-5 pb-3">
        <div>
          <h2 id="recent-orders-title" className="text-sm font-semibold text-foreground">
            Recent orders
          </h2>
          <p className="mt-0.5 text-xs text-muted-foreground">The latest orders by date</p>
        </div>
        <Link
          href="/orders"
          className="inline-flex items-center gap-1 rounded-md text-sm font-medium text-primary outline-none hover:underline hover:underline-offset-2 focus-visible:ring-3 focus-visible:ring-ring/50"
        >
          View all
          <ArrowRightIcon aria-hidden="true" className="size-3.5" />
        </Link>
      </div>

      {orders.length === 0 ? (
        <p className="px-5 pt-2 pb-8 text-sm text-muted-foreground">
          No orders yet.{" "}
          <Link
            href="/orders?new=1"
            className="font-medium text-primary underline-offset-2 outline-none hover:underline focus-visible:underline"
          >
            Create your first order
          </Link>
        </p>
      ) : (
        <ul className="divide-y border-t">
          {orders.map((order) => (
            <li key={order.id} className="flex items-center gap-4 px-5 py-3">
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium text-foreground">{order.customer}</p>
                <p className="truncate text-xs text-muted-foreground">
                  <span className="font-mono">{order.id}</span> · {order.product}
                </p>
              </div>
              <span className="hidden text-xs text-muted-foreground sm:block">
                {formatDate(order.orderDate)}
              </span>
              <StatusBadge status={order.status} className="hidden sm:inline-flex" />
              <span className="w-24 text-right text-sm font-semibold tabular-nums">
                {formatCurrency(getOrderTotal(order))}
              </span>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
