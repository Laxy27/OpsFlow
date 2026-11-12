import type { Order } from "@/lib/types";

/** Builds an order with sensible defaults for tests. */
export function makeOrder(overrides: Partial<Order> = {}): Order {
  return {
    id: "ORD-1001",
    customer: "Test Customer",
    product: "Test Product",
    quantity: 1,
    unitPrice: 100,
    orderDate: "2026-11-02",
    status: "pending",
    ...overrides,
  };
}

/** Small mixed dataset used across test files. */
export const SAMPLE_ORDERS: Order[] = [
  makeOrder({ id: "ORD-1001", customer: "Harbor & Pine Bakery", product: "Mailer Boxes", quantity: 10, unitPrice: 2.5, orderDate: "2026-10-05", status: "completed" }),
  makeOrder({ id: "ORD-1002", customer: "Brightline Fitness", product: "Polo Shirts", quantity: 4, unitPrice: 30, orderDate: "2026-10-14", status: "completed" }),
  makeOrder({ id: "ORD-1003", customer: "Copperleaf Dental", product: "Business Cards", quantity: 2, unitPrice: 48, orderDate: "2026-10-20", status: "cancelled" }),
  makeOrder({ id: "ORD-1004", customer: "Ironclad Brewing", product: "Label Rolls", quantity: 3, unitPrice: 64, orderDate: "2026-11-03", status: "processing" }),
  makeOrder({ id: "ORD-1005", customer: "Brightline Fitness", product: "Window Decals", quantity: 1, unitPrice: 42, orderDate: "2026-11-09", status: "pending" }),
];
