import { isValidIsoDate } from "./dates";
import { isOrderStatus, type Order, type OrderInput, type OrderStatus } from "./types";

export const LIMITS = {
  textMin: 2,
  textMax: 80,
  quantityMax: 100_000,
  unitPriceMax: 1_000_000,
  yearMin: 2000,
  yearMax: 2100,
} as const;

/** Raw form values, as typed by the user. */
export interface OrderFormValues {
  customer: string;
  product: string;
  quantity: string;
  unitPrice: string;
  orderDate: string;
  status: OrderStatus;
}

export type OrderFormField = keyof OrderFormValues;
export type OrderFormErrors = Partial<Record<OrderFormField, string>>;

export type ValidationResult =
  | { ok: true; data: OrderInput }
  | { ok: false; errors: OrderFormErrors };

function validateText(value: string, label: string): string | undefined {
  const trimmed = value.trim();
  if (trimmed.length === 0) return `${label} is required.`;
  if (trimmed.length < LIMITS.textMin)
    return `${label} must be at least ${LIMITS.textMin} characters.`;
  if (trimmed.length > LIMITS.textMax)
    return `${label} must be ${LIMITS.textMax} characters or fewer.`;
  return undefined;
}

function validateQuantity(value: string): string | undefined {
  const trimmed = value.trim();
  if (trimmed === "") return "Quantity is required.";
  if (!/^\d+$/.test(trimmed)) return "Quantity must be a whole number.";
  const quantity = Number(trimmed);
  if (quantity < 1) return "Quantity must be at least 1.";
  if (quantity > LIMITS.quantityMax)
    return `Quantity cannot exceed ${LIMITS.quantityMax.toLocaleString("en-US")}.`;
  return undefined;
}

function validateUnitPrice(value: string): string | undefined {
  const trimmed = value.trim();
  if (trimmed === "") return "Unit price is required.";
  if (!/^\d+(\.\d{1,2})?$/.test(trimmed))
    return "Enter a price like 49 or 49.99 (up to two decimals).";
  const price = Number(trimmed);
  if (price <= 0) return "Unit price must be greater than 0.";
  if (price > LIMITS.unitPriceMax)
    return `Unit price cannot exceed $${LIMITS.unitPriceMax.toLocaleString("en-US")}.`;
  return undefined;
}

function validateDate(value: string): string | undefined {
  if (value.trim() === "") return "Order date is required.";
  if (!isValidIsoDate(value)) return "Enter a valid date.";
  const year = Number(value.slice(0, 4));
  if (year < LIMITS.yearMin || year > LIMITS.yearMax)
    return `Date must be between ${LIMITS.yearMin} and ${LIMITS.yearMax}.`;
  return undefined;
}

/** Validates raw form values and converts them into a clean `OrderInput`. */
export function validateOrderForm(values: OrderFormValues): ValidationResult {
  const errors: OrderFormErrors = {};

  const customer = validateText(values.customer, "Customer name");
  if (customer) errors.customer = customer;
  const product = validateText(values.product, "Product or service");
  if (product) errors.product = product;
  const quantity = validateQuantity(values.quantity);
  if (quantity) errors.quantity = quantity;
  const unitPrice = validateUnitPrice(values.unitPrice);
  if (unitPrice) errors.unitPrice = unitPrice;
  const orderDate = validateDate(values.orderDate);
  if (orderDate) errors.orderDate = orderDate;
  if (!isOrderStatus(values.status)) errors.status = "Choose a status.";

  if (Object.keys(errors).length > 0) return { ok: false, errors };

  return {
    ok: true,
    data: {
      customer: values.customer.trim(),
      product: values.product.trim(),
      quantity: Number(values.quantity.trim()),
      unitPrice: Number(values.unitPrice.trim()),
      orderDate: values.orderDate,
      status: values.status,
    },
  };
}

/** Converts an existing order into editable form values. */
export function orderToFormValues(order: OrderInput): OrderFormValues {
  return {
    customer: order.customer,
    product: order.product,
    quantity: String(order.quantity),
    unitPrice: String(order.unitPrice),
    orderDate: order.orderDate,
    status: order.status,
  };
}

/**
 * Runtime check for records loaded from storage. Anything that does not
 * match the Order shape exactly is treated as corrupted.
 */
export function isValidOrder(value: unknown): value is Order {
  if (typeof value !== "object" || value === null) return false;
  const record = value as Record<string, unknown>;
  return (
    typeof record.id === "string" &&
    record.id.length > 0 &&
    typeof record.customer === "string" &&
    typeof record.product === "string" &&
    typeof record.quantity === "number" &&
    Number.isInteger(record.quantity) &&
    record.quantity >= 1 &&
    typeof record.unitPrice === "number" &&
    Number.isFinite(record.unitPrice) &&
    record.unitPrice > 0 &&
    typeof record.orderDate === "string" &&
    isValidIsoDate(record.orderDate) &&
    isOrderStatus(record.status)
  );
}
