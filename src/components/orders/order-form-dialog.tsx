"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { todayIsoDate } from "@/lib/dates";
import { formatCurrency } from "@/lib/format";
import { orderActions } from "@/lib/order-store";
import { getOrderTotal } from "@/lib/orders";
import { isOrderStatus, ORDER_STATUSES, STATUS_LABELS, type Order } from "@/lib/types";
import {
  orderToFormValues,
  validateOrderForm,
  type OrderFormErrors,
  type OrderFormField,
  type OrderFormValues,
} from "@/lib/validation";
import { fieldA11y, FormField } from "./form-field";
import { StatusDot } from "./status-badge";

interface OrderFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  /** The order being edited, or null to create a new one. */
  order: Order | null;
  /** Existing names offered as autocomplete suggestions. */
  customerSuggestions: string[];
  productSuggestions: string[];
}

export function OrderFormDialog({
  open,
  onOpenChange,
  order,
  customerSuggestions,
  productSuggestions,
}: OrderFormDialogProps) {
  const isEditing = order !== null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[calc(100dvh-2rem)] gap-0 overflow-y-auto p-0 sm:max-w-lg">
        <DialogHeader className="border-b px-5 pt-5 pb-4">
          <DialogTitle className="text-lg">
            {isEditing ? `Edit order ${order.id}` : "New order"}
          </DialogTitle>
          <DialogDescription>
            {isEditing
              ? "Update the order details. The total is recalculated automatically."
              : "Add an order to the dashboard. The total is calculated automatically."}
          </DialogDescription>
        </DialogHeader>
        {/* Mounted only while open, so every opening starts with fresh state. */}
        <OrderForm
          order={order}
          customerSuggestions={customerSuggestions}
          productSuggestions={productSuggestions}
          onDone={() => onOpenChange(false)}
        />
      </DialogContent>
    </Dialog>
  );
}

const FIELD_ORDER: OrderFormField[] = [
  "customer",
  "product",
  "quantity",
  "unitPrice",
  "orderDate",
  "status",
];

function emptyValues(): OrderFormValues {
  return {
    customer: "",
    product: "",
    quantity: "1",
    unitPrice: "",
    orderDate: todayIsoDate(),
    status: "pending",
  };
}

function previewTotal(values: OrderFormValues): string {
  const quantity = Number(values.quantity);
  const unitPrice = Number(values.unitPrice);
  const valid =
    values.quantity.trim() !== "" &&
    values.unitPrice.trim() !== "" &&
    Number.isInteger(quantity) &&
    quantity > 0 &&
    Number.isFinite(unitPrice) &&
    unitPrice > 0;
  return valid ? formatCurrency(getOrderTotal({ quantity, unitPrice })) : "—";
}

interface OrderFormProps {
  order: Order | null;
  customerSuggestions: string[];
  productSuggestions: string[];
  onDone: () => void;
}

function OrderForm({ order, customerSuggestions, productSuggestions, onDone }: OrderFormProps) {
  const [values, setValues] = useState<OrderFormValues>(() =>
    order ? orderToFormValues(order) : emptyValues(),
  );
  const [errors, setErrors] = useState<OrderFormErrors>({});
  const [submitted, setSubmitted] = useState(false);

  function update<K extends OrderFormField>(field: K, value: OrderFormValues[K]) {
    const next = { ...values, [field]: value };
    setValues(next);
    // After the first submit attempt, re-validate live so errors clear as they are fixed.
    if (submitted) {
      const result = validateOrderForm(next);
      setErrors(result.ok ? {} : result.errors);
    }
  }

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmitted(true);
    const result = validateOrderForm(values);

    if (!result.ok) {
      setErrors(result.errors);
      const firstInvalid = FIELD_ORDER.find((field) => result.errors[field]);
      if (firstInvalid) document.getElementById(`order-${firstInvalid}`)?.focus();
      return;
    }

    if (order) {
      const { saved } = orderActions.update(order.id, result.data);
      notify(saved, `Order ${order.id} updated`);
    } else {
      const { saved, order: created } = orderActions.add(result.data);
      notify(saved, `Order ${created.id} created`, `${created.customer} · ${formatCurrency(getOrderTotal(created))}`);
    }
    onDone();
  }

  return (
    <form onSubmit={handleSubmit} noValidate>
      <div className="grid gap-4 px-5 py-5 sm:grid-cols-2">
        <FormField id="order-customer" label="Customer name" error={errors.customer} className="sm:col-span-2">
          <Input
            {...fieldA11y("order-customer", errors.customer)}
            value={values.customer}
            onChange={(event) => update("customer", event.target.value)}
            list="customer-suggestions"
            autoComplete="off"
            placeholder="e.g. Harbor & Pine Bakery"
            maxLength={120}
            className="h-9"
          />
          <datalist id="customer-suggestions">
            {customerSuggestions.map((name) => (
              <option key={name} value={name} />
            ))}
          </datalist>
        </FormField>

        <FormField id="order-product" label="Product or service" error={errors.product} className="sm:col-span-2">
          <Input
            {...fieldA11y("order-product", errors.product)}
            value={values.product}
            onChange={(event) => update("product", event.target.value)}
            list="product-suggestions"
            autoComplete="off"
            placeholder="e.g. Custom Printed Mailer Boxes"
            maxLength={120}
            className="h-9"
          />
          <datalist id="product-suggestions">
            {productSuggestions.map((name) => (
              <option key={name} value={name} />
            ))}
          </datalist>
        </FormField>

        <FormField id="order-quantity" label="Quantity" error={errors.quantity}>
          <Input
            {...fieldA11y("order-quantity", errors.quantity)}
            value={values.quantity}
            onChange={(event) => update("quantity", event.target.value)}
            inputMode="numeric"
            autoComplete="off"
            className="h-9 tabular-nums"
          />
        </FormField>

        <FormField id="order-unitPrice" label="Unit price (USD)" error={errors.unitPrice}>
          <div className="relative">
            <span
              aria-hidden="true"
              className="pointer-events-none absolute inset-y-0 left-3 flex items-center text-sm text-muted-foreground"
            >
              $
            </span>
            <Input
              {...fieldA11y("order-unitPrice", errors.unitPrice)}
              value={values.unitPrice}
              onChange={(event) => update("unitPrice", event.target.value)}
              inputMode="decimal"
              autoComplete="off"
              placeholder="0.00"
              className="h-9 pl-6 tabular-nums"
            />
          </div>
        </FormField>

        <FormField id="order-orderDate" label="Order date" error={errors.orderDate}>
          <Input
            {...fieldA11y("order-orderDate", errors.orderDate)}
            type="date"
            value={values.orderDate}
            onChange={(event) => update("orderDate", event.target.value)}
            className="h-9"
          />
        </FormField>

        <FormField id="order-status" label="Status" error={errors.status}>
          <Select
            value={values.status}
            onValueChange={(value) => {
              if (isOrderStatus(value)) update("status", value);
            }}
          >
            <SelectTrigger {...fieldA11y("order-status", errors.status)} className="h-9! w-full">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {ORDER_STATUSES.map((status) => (
                <SelectItem key={status} value={status}>
                  <StatusDot status={status} className="size-2" />
                  {STATUS_LABELS[status]}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </FormField>

        <div className="flex items-center justify-between rounded-lg border bg-muted/50 px-4 py-3 sm:col-span-2">
          <span className="text-sm text-muted-foreground">Order total</span>
          <output
            htmlFor="order-quantity order-unitPrice"
            aria-live="polite"
            className="text-lg font-semibold tabular-nums"
          >
            {previewTotal(values)}
          </output>
        </div>
      </div>

      <DialogFooter className="mx-0 mb-0 rounded-b-xl border-t bg-muted/30 px-5 py-4">
        <DialogClose asChild>
          <Button type="button" variant="outline" size="lg">
            Cancel
          </Button>
        </DialogClose>
        <Button type="submit" size="lg">
          {order ? "Save changes" : "Create order"}
        </Button>
      </DialogFooter>
    </form>
  );
}

function notify(saved: boolean, message: string, description?: string) {
  if (saved) toast.success(message, { description });
  else
    toast.warning(message, {
      description: "Not saved: browser storage is unavailable, so this change is temporary.",
    });
}
