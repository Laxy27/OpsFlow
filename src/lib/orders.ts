import type { Order, OrderInput, OrderStatus } from "./types";

/** Rounds a currency amount to whole cents, avoiding float artifacts. */
export function roundCurrency(value: number): number {
  return Math.round((value + Number.EPSILON) * 100) / 100;
}

/** Total order value: quantity × unit price, rounded to cents. */
export function getOrderTotal(order: Pick<Order, "quantity" | "unitPrice">): number {
  return roundCurrency(order.quantity * order.unitPrice);
}

const ID_PATTERN = /^ORD-(\d+)$/;

/**
 * Generates the next sequential order ID based on the highest existing one,
 * so IDs stay unique even after deletions.
 */
export function generateOrderId(orders: readonly Order[]): string {
  const highest = orders.reduce((max, order) => {
    const match = ID_PATTERN.exec(order.id);
    return match ? Math.max(max, Number(match[1])) : max;
  }, 1000);
  return `ORD-${highest + 1}`;
}

export function createOrder(
  orders: readonly Order[],
  input: OrderInput,
): { orders: Order[]; order: Order } {
  const order: Order = { ...input, id: generateOrderId(orders) };
  return { orders: [...orders, order], order };
}

export function updateOrder(
  orders: readonly Order[],
  id: string,
  input: OrderInput,
): Order[] {
  return orders.map((order) => (order.id === id ? { ...input, id } : order));
}

export function setOrderStatus(
  orders: readonly Order[],
  id: string,
  status: OrderStatus,
): Order[] {
  return orders.map((order) => (order.id === id ? { ...order, status } : order));
}

export function deleteOrder(orders: readonly Order[], id: string): Order[] {
  return orders.filter((order) => order.id !== id);
}
