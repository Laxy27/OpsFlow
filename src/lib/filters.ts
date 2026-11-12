import { getOrderTotal } from "./orders";
import {
  DEFAULT_FILTERS,
  isOrderStatus,
  isSortOption,
  type Order,
  type OrderFilters,
  type SortOption,
} from "./types";

function matchesQuery(order: Order, query: string): boolean {
  if (query === "") return true;
  return (
    order.customer.toLowerCase().includes(query) ||
    order.product.toLowerCase().includes(query) ||
    order.id.toLowerCase().includes(query)
  );
}

function compareIds(a: Order, b: Order): number {
  return a.id.localeCompare(b.id, "en", { numeric: true });
}

const comparators: Record<SortOption, (a: Order, b: Order) => number> = {
  "date-desc": (a, b) => b.orderDate.localeCompare(a.orderDate) || compareIds(b, a),
  "date-asc": (a, b) => a.orderDate.localeCompare(b.orderDate) || compareIds(a, b),
  "amount-desc": (a, b) =>
    getOrderTotal(b) - getOrderTotal(a) || b.orderDate.localeCompare(a.orderDate),
  "amount-asc": (a, b) =>
    getOrderTotal(a) - getOrderTotal(b) || a.orderDate.localeCompare(b.orderDate),
};

/** Applies search, status filter and sorting. Never mutates the input. */
export function filterOrders(orders: readonly Order[], filters: OrderFilters): Order[] {
  const query = filters.query.trim().toLowerCase();
  return orders
    .filter((order) => filters.status === "all" || order.status === filters.status)
    .filter((order) => matchesQuery(order, query))
    .sort(comparators[filters.sort]);
}

export function hasActiveFilters(filters: OrderFilters): boolean {
  return filters.query.trim() !== "" || filters.status !== "all";
}

/** Reads filters from URL search params, ignoring invalid values. */
export function filtersFromSearchParams(
  params: Pick<URLSearchParams, "get">,
): OrderFilters {
  const status = params.get("status");
  const sort = params.get("sort");
  return {
    query: params.get("q") ?? DEFAULT_FILTERS.query,
    status: isOrderStatus(status) ? status : DEFAULT_FILTERS.status,
    sort: isSortOption(sort) ? sort : DEFAULT_FILTERS.sort,
  };
}

/** Serializes filters into a query string, omitting default values. */
export function filtersToSearchParams(filters: OrderFilters): URLSearchParams {
  const params = new URLSearchParams();
  if (filters.query !== "") params.set("q", filters.query);
  if (filters.status !== DEFAULT_FILTERS.status) params.set("status", filters.status);
  if (filters.sort !== DEFAULT_FILTERS.sort) params.set("sort", filters.sort);
  return params;
}
