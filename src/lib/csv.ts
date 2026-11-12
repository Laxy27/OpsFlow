import { getOrderTotal } from "./orders";
import { STATUS_LABELS, type Order } from "./types";

/**
 * CSV generation following RFC 4180, tuned to open cleanly in Excel:
 * - CRLF line endings
 * - Fields with commas, quotes, line breaks or edge whitespace are quoted,
 *   and quotes inside them are doubled
 * - A UTF-8 byte order mark is added on download so Excel detects encoding
 * - Text starting with = + - @ is prefixed with an apostrophe so spreadsheet
 *   apps never run it as a formula (CSV injection protection)
 */

const LINE_BREAK = "\r\n";
const UTF8_BOM = "﻿";
const FORMULA_TRIGGER = /^[=+\-@\t\r]/;

export const CSV_HEADERS = [
  "Order ID",
  "Customer",
  "Product / Service",
  "Quantity",
  "Unit Price (USD)",
  "Total (USD)",
  "Order Date",
  "Status",
] as const;

/** Escapes a text value for safe inclusion in a CSV cell. */
export function escapeCsvText(value: string): string {
  const safe = FORMULA_TRIGGER.test(value) ? `'${value}` : value;
  const needsQuotes = /[",\r\n]/.test(safe) || safe !== safe.trim();
  return needsQuotes ? `"${safe.replace(/"/g, '""')}"` : safe;
}

function formatAmount(value: number): string {
  return value.toFixed(2);
}

function orderToRow(order: Order): string[] {
  return [
    escapeCsvText(order.id),
    escapeCsvText(order.customer),
    escapeCsvText(order.product),
    String(order.quantity),
    formatAmount(order.unitPrice),
    formatAmount(getOrderTotal(order)),
    order.orderDate,
    STATUS_LABELS[order.status],
  ];
}

/** Builds the CSV text (header row + one row per order). */
export function ordersToCsv(orders: readonly Order[]): string {
  const rows = [CSV_HEADERS.map(escapeCsvText), ...orders.map(orderToRow)];
  return rows.map((row) => row.join(",")).join(LINE_BREAK) + LINE_BREAK;
}

/** Triggers a browser download of the given orders as a CSV file. */
export function downloadOrdersCsv(orders: readonly Order[], fileName: string): void {
  const blob = new Blob([UTF8_BOM + ordersToCsv(orders)], {
    type: "text/csv;charset=utf-8",
  });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = fileName;
  document.body.appendChild(link);
  link.click();
  link.remove();
  // Revoke on the next tick so the download has started in every browser.
  setTimeout(() => URL.revokeObjectURL(url), 0);
}
