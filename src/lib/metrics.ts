import { addDays, formatShortDate, startOfWeek } from "./dates";
import { getOrderTotal, roundCurrency } from "./orders";
import { ORDER_STATUSES, type Order, type OrderStatus } from "./types";

/**
 * Business rules (kept in one place so every screen agrees):
 * - Revenue = total value of COMPLETED orders only.
 * - Completion rate = completed / (all orders − cancelled orders).
 *   Cancelled orders are excluded because they can never be completed.
 */

export interface DashboardMetrics {
  totalOrders: number;
  totalRevenue: number;
  pendingOrders: number;
  processingOrders: number;
  completedOrders: number;
  cancelledOrders: number;
  /** Ratio between 0 and 1, or null when there are no non-cancelled orders. */
  completionRate: number | null;
  /** Average value of a completed order, or null when none are completed. */
  averageCompletedOrderValue: number | null;
}

export function countByStatus(orders: readonly Order[]): Record<OrderStatus, number> {
  const counts = Object.fromEntries(
    ORDER_STATUSES.map((status) => [status, 0]),
  ) as Record<OrderStatus, number>;
  for (const order of orders) counts[order.status] += 1;
  return counts;
}

export function calculateRevenue(orders: readonly Order[]): number {
  return roundCurrency(
    orders
      .filter((order) => order.status === "completed")
      .reduce((sum, order) => sum + getOrderTotal(order), 0),
  );
}

export function calculateMetrics(orders: readonly Order[]): DashboardMetrics {
  const counts = countByStatus(orders);
  const totalRevenue = calculateRevenue(orders);
  const eligible = orders.length - counts.cancelled;

  return {
    totalOrders: orders.length,
    totalRevenue,
    pendingOrders: counts.pending,
    processingOrders: counts.processing,
    completedOrders: counts.completed,
    cancelledOrders: counts.cancelled,
    completionRate: eligible > 0 ? counts.completed / eligible : null,
    averageCompletedOrderValue:
      counts.completed > 0 ? roundCurrency(totalRevenue / counts.completed) : null,
  };
}

export interface WeeklyPoint {
  /** Monday that starts the week (YYYY-MM-DD). */
  weekStart: string;
  /** Short axis label, e.g. "Nov 9". */
  label: string;
  /** Number of orders placed that week (all statuses). */
  orders: number;
  /** Value of completed orders placed that week. */
  revenue: number;
}

/**
 * Groups orders into consecutive Monday-based weeks, ending with the week
 * that contains `endDate`. Weeks without orders are included as zeros so
 * the chart's time axis stays continuous. Orders outside the window are
 * ignored.
 */
export function buildWeeklySeries(
  orders: readonly Order[],
  endDate: string,
  weeks: number,
): WeeklyPoint[] {
  const lastWeek = startOfWeek(endDate);
  const points: WeeklyPoint[] = [];
  const byWeek = new Map<string, WeeklyPoint>();

  for (let index = weeks - 1; index >= 0; index -= 1) {
    const weekStart = addDays(lastWeek, -index * 7);
    const point = { weekStart, label: formatShortDate(weekStart), orders: 0, revenue: 0 };
    points.push(point);
    byWeek.set(weekStart, point);
  }

  for (const order of orders) {
    const point = byWeek.get(startOfWeek(order.orderDate));
    if (!point) continue;
    point.orders += 1;
    if (order.status === "completed") point.revenue += getOrderTotal(order);
  }

  for (const point of points) point.revenue = roundCurrency(point.revenue);
  return points;
}

/** The most recent orders by date (newest first). */
export function getRecentOrders(orders: readonly Order[], limit: number): Order[] {
  return [...orders]
    .sort(
      (a, b) =>
        b.orderDate.localeCompare(a.orderDate) || b.id.localeCompare(a.id, "en", { numeric: true }),
    )
    .slice(0, limit);
}
