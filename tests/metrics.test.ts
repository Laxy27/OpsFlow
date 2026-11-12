import { describe, expect, it } from "vitest";
import { CHART_WEEKS } from "@/components/dashboard/chart-theme";
import { createDemoOrders } from "@/lib/demo-data";
import {
  buildWeeklySeries,
  calculateMetrics,
  calculateRevenue,
  getRecentOrders,
} from "@/lib/metrics";
import { getOrderTotal } from "@/lib/orders";
import { makeOrder, SAMPLE_ORDERS } from "./fixtures";

describe("getOrderTotal", () => {
  it("multiplies quantity by unit price", () => {
    expect(getOrderTotal({ quantity: 3, unitPrice: 64 })).toBe(192);
  });

  it("rounds to cents without floating point artifacts", () => {
    expect(getOrderTotal({ quantity: 3, unitPrice: 0.1 })).toBe(0.3);
    expect(getOrderTotal({ quantity: 250, unitPrice: 2.85 })).toBe(712.5);
  });
});

describe("calculateMetrics", () => {
  it("computes KPIs from the dataset", () => {
    const metrics = calculateMetrics(SAMPLE_ORDERS);
    expect(metrics.totalOrders).toBe(5);
    expect(metrics.pendingOrders).toBe(1);
    expect(metrics.processingOrders).toBe(1);
    expect(metrics.completedOrders).toBe(2);
    expect(metrics.cancelledOrders).toBe(1);
  });

  it("counts revenue from completed orders only", () => {
    // 10 × 2.50 + 4 × 30 = 145. Cancelled, pending and processing are excluded.
    expect(calculateMetrics(SAMPLE_ORDERS).totalRevenue).toBe(145);
    expect(calculateRevenue(SAMPLE_ORDERS)).toBe(145);
  });

  it("excludes cancelled orders from the completion rate", () => {
    // 2 completed out of 4 non-cancelled orders.
    expect(calculateMetrics(SAMPLE_ORDERS).completionRate).toBe(0.5);
  });

  it("averages the value of completed orders", () => {
    expect(calculateMetrics(SAMPLE_ORDERS).averageCompletedOrderValue).toBe(72.5);
  });

  it("handles an empty dataset", () => {
    const metrics = calculateMetrics([]);
    expect(metrics.totalOrders).toBe(0);
    expect(metrics.totalRevenue).toBe(0);
    expect(metrics.completionRate).toBeNull();
    expect(metrics.averageCompletedOrderValue).toBeNull();
  });

  it("returns null completion rate when every order is cancelled", () => {
    const metrics = calculateMetrics([makeOrder({ status: "cancelled" })]);
    expect(metrics.completionRate).toBeNull();
  });
});

describe("buildWeeklySeries", () => {
  it("creates continuous Monday-based weeks ending at the given date", () => {
    // 2026-11-11 is a Wednesday; its week starts Monday 2026-11-09.
    const series = buildWeeklySeries([], "2026-11-11", 4);
    expect(series.map((point) => point.weekStart)).toEqual([
      "2026-10-19",
      "2026-10-26",
      "2026-11-02",
      "2026-11-09",
    ]);
    expect(series.every((point) => point.orders === 0 && point.revenue === 0)).toBe(true);
  });

  it("counts every order but only completed revenue per week", () => {
    const series = buildWeeklySeries(SAMPLE_ORDERS, "2026-11-11", 6);
    const byWeek = Object.fromEntries(series.map((point) => [point.weekStart, point]));

    expect(byWeek["2026-10-05"]).toMatchObject({ orders: 1, revenue: 25 });
    expect(byWeek["2026-10-12"]).toMatchObject({ orders: 1, revenue: 120 });
    expect(byWeek["2026-10-19"]).toMatchObject({ orders: 1, revenue: 0 }); // cancelled
    expect(byWeek["2026-11-02"]).toMatchObject({ orders: 1, revenue: 0 }); // processing
    // 2026-11-09 is a Monday, so that order starts the final week.
    expect(byWeek["2026-11-09"]).toMatchObject({ orders: 1, revenue: 0 });
  });

  it("keeps totals consistent with the KPI cards", () => {
    const series = buildWeeklySeries(SAMPLE_ORDERS, "2026-11-11", 12);
    const seriesRevenue = series.reduce((sum, point) => sum + point.revenue, 0);
    const seriesOrders = series.reduce((sum, point) => sum + point.orders, 0);
    expect(seriesRevenue).toBe(calculateRevenue(SAMPLE_ORDERS));
    expect(seriesOrders).toBe(SAMPLE_ORDERS.length);
  });

  it("ignores orders outside the window", () => {
    const series = buildWeeklySeries(
      [makeOrder({ orderDate: "2025-01-01", status: "completed" })],
      "2026-11-11",
      12,
    );
    expect(series.reduce((sum, point) => sum + point.orders, 0)).toBe(0);
  });
});

describe("getRecentOrders", () => {
  it("returns the newest orders first", () => {
    const recent = getRecentOrders(SAMPLE_ORDERS, 2);
    expect(recent.map((order) => order.id)).toEqual(["ORD-1005", "ORD-1004"]);
  });
});

describe("demo data and dashboard window", () => {
  it("fits entirely inside the chart window on every weekday", () => {
    // 2026-11-09 is a Monday; check a full week of possible seed dates.
    for (let offset = 0; offset < 7; offset += 1) {
      const seedDate = `2026-11-${String(9 + offset).padStart(2, "0")}`;
      const orders = createDemoOrders(seedDate);
      const series = buildWeeklySeries(orders, seedDate, CHART_WEEKS);
      expect(series.reduce((sum, point) => sum + point.orders, 0)).toBe(orders.length);
      expect(series.reduce((sum, point) => sum + point.revenue, 0)).toBeCloseTo(
        calculateRevenue(orders),
        2,
      );
    }
  });
});
