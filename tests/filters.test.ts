import { describe, expect, it } from "vitest";
import {
  filterOrders,
  filtersFromSearchParams,
  filtersToSearchParams,
  hasActiveFilters,
} from "@/lib/filters";
import { DEFAULT_FILTERS, type OrderFilters } from "@/lib/types";
import { SAMPLE_ORDERS } from "./fixtures";

const ids = (orders: { id: string }[]) => orders.map((order) => order.id);

function filters(overrides: Partial<OrderFilters>): OrderFilters {
  return { ...DEFAULT_FILTERS, ...overrides };
}

describe("filterOrders", () => {
  it("searches customer names case-insensitively", () => {
    expect(ids(filterOrders(SAMPLE_ORDERS, filters({ query: "brightline" })))).toEqual([
      "ORD-1005",
      "ORD-1002",
    ]);
  });

  it("searches product names and order IDs", () => {
    expect(ids(filterOrders(SAMPLE_ORDERS, filters({ query: "label" })))).toEqual(["ORD-1004"]);
    expect(ids(filterOrders(SAMPLE_ORDERS, filters({ query: "ord-1003" })))).toEqual(["ORD-1003"]);
  });

  it("ignores surrounding whitespace in the query", () => {
    expect(filterOrders(SAMPLE_ORDERS, filters({ query: "  dental  " }))).toHaveLength(1);
  });

  it("filters by status", () => {
    expect(ids(filterOrders(SAMPLE_ORDERS, filters({ status: "completed" })))).toEqual([
      "ORD-1002",
      "ORD-1001",
    ]);
  });

  it("combines search and status filters", () => {
    const result = filterOrders(SAMPLE_ORDERS, filters({ query: "brightline", status: "pending" }));
    expect(ids(result)).toEqual(["ORD-1005"]);
  });

  it("returns an empty list when nothing matches", () => {
    expect(filterOrders(SAMPLE_ORDERS, filters({ query: "no such customer" }))).toEqual([]);
  });

  it("sorts by date in both directions", () => {
    expect(ids(filterOrders(SAMPLE_ORDERS, filters({ sort: "date-desc" })))[0]).toBe("ORD-1005");
    expect(ids(filterOrders(SAMPLE_ORDERS, filters({ sort: "date-asc" })))[0]).toBe("ORD-1001");
  });

  it("sorts by total amount in both directions", () => {
    // Totals: 1001=25, 1002=120, 1003=96, 1004=192, 1005=42
    expect(ids(filterOrders(SAMPLE_ORDERS, filters({ sort: "amount-desc" })))).toEqual([
      "ORD-1004",
      "ORD-1002",
      "ORD-1003",
      "ORD-1005",
      "ORD-1001",
    ]);
    expect(ids(filterOrders(SAMPLE_ORDERS, filters({ sort: "amount-asc" })))[0]).toBe("ORD-1001");
  });

  it("does not mutate the original array", () => {
    const original = [...SAMPLE_ORDERS];
    filterOrders(SAMPLE_ORDERS, filters({ sort: "amount-asc" }));
    expect(SAMPLE_ORDERS).toEqual(original);
  });
});

describe("URL search params", () => {
  it("round-trips filters", () => {
    const value = filters({ query: "boxes", status: "processing", sort: "amount-asc" });
    expect(filtersFromSearchParams(filtersToSearchParams(value))).toEqual(value);
  });

  it("omits default values from the URL", () => {
    expect(filtersToSearchParams(DEFAULT_FILTERS).toString()).toBe("");
  });

  it("falls back to defaults for invalid values", () => {
    const params = new URLSearchParams("status=shipped&sort=random");
    expect(filtersFromSearchParams(params)).toEqual(DEFAULT_FILTERS);
  });
});

describe("hasActiveFilters", () => {
  it("ignores sort order and blank queries", () => {
    expect(hasActiveFilters(filters({ sort: "amount-asc", query: "   " }))).toBe(false);
    expect(hasActiveFilters(filters({ status: "pending" }))).toBe(true);
  });
});
