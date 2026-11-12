import { describe, expect, it } from "vitest";
import { CSV_HEADERS, escapeCsvText, ordersToCsv } from "@/lib/csv";
import { makeOrder } from "./fixtures";

describe("escapeCsvText", () => {
  it("leaves simple values untouched", () => {
    expect(escapeCsvText("Mailer Boxes")).toBe("Mailer Boxes");
  });

  it("quotes values containing commas", () => {
    expect(escapeCsvText("Boxes, large")).toBe('"Boxes, large"');
  });

  it("doubles embedded quotes", () => {
    expect(escapeCsvText('Banner 3" wide')).toBe('"Banner 3"" wide"');
  });

  it("quotes values with line breaks", () => {
    expect(escapeCsvText("Line one\nLine two")).toBe('"Line one\nLine two"');
  });

  it("quotes values with leading or trailing spaces", () => {
    expect(escapeCsvText(" padded ")).toBe('" padded "');
  });

  it("neutralizes spreadsheet formulas", () => {
    expect(escapeCsvText("=HYPERLINK(\"x\")")).toBe('"\'=HYPERLINK(""x"")"');
    expect(escapeCsvText("+1 555")).toBe("'+1 555");
    expect(escapeCsvText("@SUM(A1)")).toBe("'@SUM(A1)");
  });
});

describe("ordersToCsv", () => {
  const order = makeOrder({
    id: "ORD-1042",
    customer: 'Harbor & Pine "Bakery", LLC',
    product: "Mailer Boxes",
    quantity: 250,
    unitPrice: 2.85,
    orderDate: "2026-11-11",
    status: "completed",
  });

  it("starts with a header row", () => {
    const [header] = ordersToCsv([]).split("\r\n");
    expect(header).toBe(CSV_HEADERS.join(","));
  });

  it("writes one CRLF-terminated row per order", () => {
    const csv = ordersToCsv([order, makeOrder({ id: "ORD-1043" })]);
    expect(csv.endsWith("\r\n")).toBe(true);
    expect(csv.split("\r\n").filter(Boolean)).toHaveLength(3);
  });

  it("preserves and escapes all order fields", () => {
    const [, row] = ordersToCsv([order]).split("\r\n");
    expect(row).toBe(
      'ORD-1042,"Harbor & Pine ""Bakery"", LLC",Mailer Boxes,250,2.85,712.50,2026-11-11,Completed',
    );
  });

  it("formats amounts with two decimals", () => {
    const [, row] = ordersToCsv([makeOrder({ quantity: 2, unitPrice: 40 })]).split("\r\n");
    expect(row).toContain(",40.00,80.00,");
  });

  it("produces a header-only file for an empty list", () => {
    expect(ordersToCsv([])).toBe(`${CSV_HEADERS.join(",")}\r\n`);
  });
});
