export const ORDER_STATUSES = [
  "pending",
  "processing",
  "completed",
  "cancelled",
] as const;

export type OrderStatus = (typeof ORDER_STATUSES)[number];

export const STATUS_LABELS: Record<OrderStatus, string> = {
  pending: "Pending",
  processing: "Processing",
  completed: "Completed",
  cancelled: "Cancelled",
};

/**
 * A single customer order.
 *
 * The total amount is intentionally not stored: it is always derived from
 * `quantity * unitPrice` (see `getOrderTotal`) so it can never drift.
 */
export interface Order {
  /** Human-readable unique identifier, e.g. "ORD-1041". */
  id: string;
  customer: string;
  product: string;
  /** Whole units, at least 1. */
  quantity: number;
  /** Price per unit in USD, up to two decimals. */
  unitPrice: number;
  /** Calendar date in ISO format (YYYY-MM-DD), without a time zone. */
  orderDate: string;
  status: OrderStatus;
}

/** The editable fields of an order (everything except the generated ID). */
export type OrderInput = Omit<Order, "id">;

export const SORT_OPTIONS = [
  "date-desc",
  "date-asc",
  "amount-desc",
  "amount-asc",
] as const;

export type SortOption = (typeof SORT_OPTIONS)[number];

export const SORT_LABELS: Record<SortOption, string> = {
  "date-desc": "Newest first",
  "date-asc": "Oldest first",
  "amount-desc": "Highest amount",
  "amount-asc": "Lowest amount",
};

export interface OrderFilters {
  /** Free-text search matched against customer, product and order ID. */
  query: string;
  status: OrderStatus | "all";
  sort: SortOption;
}

export const DEFAULT_FILTERS: OrderFilters = {
  query: "",
  status: "all",
  sort: "date-desc",
};

export function isOrderStatus(value: unknown): value is OrderStatus {
  return (
    typeof value === "string" &&
    (ORDER_STATUSES as readonly string[]).includes(value)
  );
}

export function isSortOption(value: unknown): value is SortOption {
  return (
    typeof value === "string" &&
    (SORT_OPTIONS as readonly string[]).includes(value)
  );
}
