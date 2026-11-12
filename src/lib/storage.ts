import type { Order } from "./types";
import { isValidOrder } from "./validation";

/**
 * localStorage persistence for the demo.
 *
 * Data is stored under a single versioned key. Everything read back is
 * validated; corrupted or unexpected data is never trusted.
 */

export const STORAGE_KEY = "opsflow:orders";
export const STORAGE_VERSION = 1;

interface StoredPayload {
  version: typeof STORAGE_VERSION;
  orders: Order[];
}

/** Minimal storage interface so the logic can be tested without a browser. */
export type KeyValueStorage = Pick<Storage, "getItem" | "setItem">;

export type LoadStatus =
  /** Existing data was found and loaded. */
  | "stored"
  /** No data existed yet, so demo data was created and saved. */
  | "seeded"
  /** Stored data was unreadable and has been replaced with demo data. */
  | "recovered"
  /** Storage is blocked or full; data lives in memory only. */
  | "unavailable";

export interface LoadResult {
  orders: Order[];
  status: LoadStatus;
}

/**
 * Returns the browser's localStorage if it can actually be written to.
 * Access can throw in private browsing modes or when cookies are blocked.
 */
export function getBrowserStorage(): KeyValueStorage | null {
  try {
    if (typeof window === "undefined") return null;
    const storage = window.localStorage;
    const probeKey = `${STORAGE_KEY}:probe`;
    storage.setItem(probeKey, "1");
    storage.removeItem(probeKey);
    return storage;
  } catch {
    return null;
  }
}

/** Parses stored JSON. Returns null if anything about it is invalid. */
export function parseStoredOrders(raw: string): Order[] | null {
  let payload: unknown;
  try {
    payload = JSON.parse(raw);
  } catch {
    return null;
  }

  if (typeof payload !== "object" || payload === null) return null;
  const { version, orders } = payload as Partial<StoredPayload>;
  if (version !== STORAGE_VERSION || !Array.isArray(orders)) return null;
  if (!orders.every(isValidOrder)) return null;

  const ids = new Set(orders.map((order) => order.id));
  if (ids.size !== orders.length) return null;

  return orders;
}

export function serializeOrders(orders: readonly Order[]): string {
  const payload: StoredPayload = { version: STORAGE_VERSION, orders: [...orders] };
  return JSON.stringify(payload);
}

/** Saves orders. Returns false if the write failed (e.g. quota exceeded). */
export function saveOrders(
  storage: KeyValueStorage | null,
  orders: readonly Order[],
): boolean {
  if (!storage) return false;
  try {
    storage.setItem(STORAGE_KEY, serializeOrders(orders));
    return true;
  } catch {
    return false;
  }
}

/**
 * Loads orders from storage, seeding demo data only when nothing has been
 * stored yet. An intentionally empty list (all orders deleted) is kept as-is,
 * so demo records are never duplicated or silently re-added.
 */
export function loadOrders(
  storage: KeyValueStorage | null,
  createSeed: () => Order[],
): LoadResult {
  if (!storage) return { orders: createSeed(), status: "unavailable" };

  let raw: string | null;
  try {
    raw = storage.getItem(STORAGE_KEY);
  } catch {
    return { orders: createSeed(), status: "unavailable" };
  }

  if (raw !== null) {
    const stored = parseStoredOrders(raw);
    if (stored) return { orders: stored, status: "stored" };
  }

  const seed = createSeed();
  const saved = saveOrders(storage, seed);
  if (!saved) return { orders: seed, status: "unavailable" };
  return { orders: seed, status: raw === null ? "seeded" : "recovered" };
}
