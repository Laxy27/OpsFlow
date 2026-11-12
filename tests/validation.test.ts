import { describe, expect, it } from "vitest";
import { validateOrderForm, type OrderFormValues } from "@/lib/validation";

const valid: OrderFormValues = {
  customer: "  Harbor & Pine Bakery ",
  product: "Mailer Boxes",
  quantity: "250",
  unitPrice: "2.85",
  orderDate: "2026-11-11",
  status: "pending",
};

describe("validateOrderForm", () => {
  it("accepts valid input and normalizes it", () => {
    const result = validateOrderForm(valid);
    expect(result).toEqual({
      ok: true,
      data: {
        customer: "Harbor & Pine Bakery",
        product: "Mailer Boxes",
        quantity: 250,
        unitPrice: 2.85,
        orderDate: "2026-11-11",
        status: "pending",
      },
    });
  });

  it("reports every missing required field", () => {
    const result = validateOrderForm({
      ...valid,
      customer: " ",
      product: "",
      quantity: "",
      unitPrice: "",
      orderDate: "",
    });
    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(Object.keys(result.errors).sort()).toEqual(
        ["customer", "orderDate", "product", "quantity", "unitPrice"].sort(),
      );
    }
  });

  it.each([
    ["quantity", "0"],
    ["quantity", "1.5"],
    ["quantity", "-3"],
    ["quantity", "abc"],
    ["unitPrice", "0"],
    ["unitPrice", "12.345"],
    ["unitPrice", "-5"],
    ["orderDate", "2026-02-30"],
    ["orderDate", "1999-12-31"],
  ] as const)("rejects %s = %s", (field, value) => {
    const result = validateOrderForm({ ...valid, [field]: value });
    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.errors[field]).toBeDefined();
  });
});
