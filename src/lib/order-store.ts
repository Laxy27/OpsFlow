import { todayIsoDate } from "./dates";
import { createDemoOrders } from "./demo-data";
import {
  createOrder,
  deleteOrder as removeOrder,
  setOrderStatus,
  updateOrder as replaceOrder,
} from "./orders";
import {
  getBrowserStorage,
  loadOrders,
  parseStoredOrders,
  saveOrders,
  STORAGE_KEY,
  type KeyValueStorage,
} from "./storage";
import type { Order, OrderInput, OrderStatus } from "./types";

/**
 * The single source of truth for order data.
 *
 * A tiny external store consumed through `useSyncExternalStore`. On the
 * server (and during hydration) it reports `ready: false`, so the first
 * client render matches the server HTML exactly and there are no hydration
 * mismatches. The browser then switches to the real data from localStorage.
 */

export interface OrdersState {
  /** False until data has been loaded in the browser. */
  ready: boolean;
  orders: Order[];
  /** "local" = saved to localStorage; "memory" = changes are lost on refresh. */
  persistence: "local" | "memory";
  /** Set when stored data was corrupted and has been replaced. */
  recoveredFromCorruption: boolean;
}

export interface MutationResult {
  /** Whether the change was written to localStorage. */
  saved: boolean;
}

const SERVER_STATE: OrdersState = Object.freeze({
  ready: false,
  orders: [],
  persistence: "local",
  recoveredFromCorruption: false,
}) as OrdersState;

let state: OrdersState | null = null;
let storage: KeyValueStorage | null = null;
const listeners = new Set<() => void>();

function createSeed(): Order[] {
  return createDemoOrders(todayIsoDate());
}

function initialize(): OrdersState {
  storage = getBrowserStorage();
  const result = loadOrders(storage, createSeed);
  return {
    ready: true,
    orders: result.orders,
    persistence: result.status === "unavailable" ? "memory" : "local",
    recoveredFromCorruption: result.status === "recovered",
  };
}

function setState(next: OrdersState) {
  state = next;
  listeners.forEach((listener) => listener());
}

function getState(): OrdersState {
  if (typeof window === "undefined") return SERVER_STATE;
  if (state === null) state = initialize();
  return state;
}

function commit(orders: Order[]): MutationResult {
  const current = getState();
  const saved = saveOrders(storage, orders);
  setState({ ...current, orders, persistence: saved ? "local" : "memory" });
  return { saved };
}

/** Keeps several open tabs in sync when one of them changes the data. */
function handleStorageEvent(event: StorageEvent) {
  if (event.key !== STORAGE_KEY || event.newValue === null) return;
  const orders = parseStoredOrders(event.newValue);
  if (orders) setState({ ...getState(), orders });
}

export const ordersStore = {
  subscribe(listener: () => void): () => void {
    listeners.add(listener);
    if (listeners.size === 1) window.addEventListener("storage", handleStorageEvent);
    return () => {
      listeners.delete(listener);
      if (listeners.size === 0)
        window.removeEventListener("storage", handleStorageEvent);
    };
  },
  getSnapshot: getState,
  getServerSnapshot: (): OrdersState => SERVER_STATE,
};

export const orderActions = {
  add(input: OrderInput): MutationResult & { order: Order } {
    const { orders, order } = createOrder(getState().orders, input);
    return { ...commit(orders), order };
  },
  update(id: string, input: OrderInput): MutationResult {
    return commit(replaceOrder(getState().orders, id, input));
  },
  setStatus(id: string, status: OrderStatus): MutationResult {
    return commit(setOrderStatus(getState().orders, id, status));
  },
  remove(id: string): MutationResult {
    return commit(removeOrder(getState().orders, id));
  },
  resetDemoData(): MutationResult {
    const result = commit(createSeed());
    setState({ ...getState(), recoveredFromCorruption: false });
    return result;
  },
  dismissRecoveryNotice() {
    setState({ ...getState(), recoveredFromCorruption: false });
  },
};
