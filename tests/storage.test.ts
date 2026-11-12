import { describe, expect, it, vi } from "vitest";
import { createDemoOrders } from "@/lib/demo-data";
import { createOrder, deleteOrder, generateOrderId, setOrderStatus } from "@/lib/orders";
import {
  loadOrders,
  parseStoredOrders,
  saveOrders,
  serializeOrders,
  STORAGE_KEY,
  type KeyValueStorage,
} from "@/lib/storage";
import { makeOrder, SAMPLE_ORDERS } from "./fixtures";

class MemoryStorage implements KeyValueStorage {
  private data = new Map<string, string>();
  getItem(key: string) {
    return this.data.get(key) ?? null;
  }
  setItem(key: string, value: string) {
    this.data.set(key, value);
  }
}

class FullStorage extends MemoryStorage {
  setItem(): void {
    throw new Error("QuotaExceededError");
  }
}

const seed = () => createDemoOrders("2026-11-11");

describe("loadOrders", () => {
  it("seeds demo data on the first visit and saves it", () => {
    const storage = new MemoryStorage();
    const result = loadOrders(storage, seed);
    expect(result.status).toBe("seeded");
    expect(result.orders).toHaveLength(40);
    expect(storage.getItem(STORAGE_KEY)).not.toBeNull();
  });

  it("does not seed again on later visits", () => {
    const storage = new MemoryStorage();
    loadOrders(storage, seed);
    const createSeed = vi.fn(seed);
    const second = loadOrders(storage, createSeed);
    expect(second.status).toBe("stored");
    expect(second.orders).toHaveLength(40);
    expect(createSeed).not.toHaveBeenCalled();
  });

  it("keeps user changes across reloads", () => {
    const storage = new MemoryStorage();
    const { orders } = loadOrders(storage, seed);
    saveOrders(storage, setOrderStatus(deleteOrder(orders, "ORD-1001"), "ORD-1002", "cancelled"));
    const reloaded = loadOrders(storage, seed).orders;
    expect(reloaded).toHaveLength(39);
    expect(reloaded.find((order) => order.id === "ORD-1002")?.status).toBe("cancelled");
  });

  it("keeps an intentionally empty list instead of re-seeding", () => {
    const storage = new MemoryStorage();
    saveOrders(storage, []);
    const result = loadOrders(storage, seed);
    expect(result).toEqual({ orders: [], status: "stored" });
  });

  it("recovers from corrupted JSON", () => {
    const storage = new MemoryStorage();
    storage.setItem(STORAGE_KEY, "{not json");
    const result = loadOrders(storage, seed);
    expect(result.status).toBe("recovered");
    expect(result.orders).toHaveLength(40);
    expect(parseStoredOrders(storage.getItem(STORAGE_KEY)!)).toHaveLength(40);
  });

  it("works in memory when storage is unavailable", () => {
    expect(loadOrders(null, seed).status).toBe("unavailable");
    expect(loadOrders(new FullStorage(), seed).status).toBe("unavailable");
  });
});

describe("parseStoredOrders", () => {
  it("accepts valid data", () => {
    expect(parseStoredOrders(serializeOrders(SAMPLE_ORDERS))).toEqual(SAMPLE_ORDERS);
  });

  it.each([
    ["wrong version", JSON.stringify({ version: 99, orders: [] })],
    ["missing orders", JSON.stringify({ version: 1 })],
    ["not an object", JSON.stringify("orders")],
    ["invalid status", serializeOrders([{ ...makeOrder(), status: "shipped" as never }])],
    ["negative quantity", serializeOrders([makeOrder({ quantity: -1 })])],
    ["invalid date", serializeOrders([makeOrder({ orderDate: "2026-02-31" })])],
    ["duplicate IDs", serializeOrders([makeOrder(), makeOrder()])],
  ])("rejects %s", (_label, raw) => {
    expect(parseStoredOrders(raw)).toBeNull();
  });
});

describe("order IDs", () => {
  it("increments from the highest existing ID", () => {
    expect(generateOrderId(SAMPLE_ORDERS)).toBe("ORD-1006");
    expect(generateOrderId([])).toBe("ORD-1001");
  });

  it("stays unique after deleting an order and ignores stray id fields", () => {
    const withoutLast = deleteOrder(SAMPLE_ORDERS, "ORD-1004");
    const { order } = createOrder(withoutLast, makeOrder());
    expect(order.id).toBe("ORD-1006");
  });
});

describe("demo data", () => {
  it("has unique IDs, varied statuses and dates relative to the seed date", () => {
    const orders = seed();
    expect(new Set(orders.map((order) => order.id)).size).toBe(orders.length);
    expect(new Set(orders.map((order) => order.status)).size).toBe(4);
    expect(orders.at(-1)?.orderDate).toBe("2026-11-11");
    expect(parseStoredOrders(serializeOrders(orders))).not.toBeNull();
  });
});
