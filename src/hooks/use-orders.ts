"use client";

import { useSyncExternalStore } from "react";
import { orderActions, ordersStore, type OrdersState } from "@/lib/order-store";

/** Subscribes a component to the shared order data. */
export function useOrders(): OrdersState & { actions: typeof orderActions } {
  const state = useSyncExternalStore(
    ordersStore.subscribe,
    ordersStore.getSnapshot,
    ordersStore.getServerSnapshot,
  );
  return { ...state, actions: orderActions };
}
