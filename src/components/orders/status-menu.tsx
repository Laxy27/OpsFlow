"use client";

import { ChevronDownIcon } from "lucide-react";
import { toast } from "sonner";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { orderActions } from "@/lib/order-store";
import { cn } from "@/lib/utils";
import { isOrderStatus, ORDER_STATUSES, STATUS_LABELS, type Order } from "@/lib/types";
import { StatusDot, STATUS_STYLES } from "./status-badge";

/** A status badge that opens a menu for changing the order's status. */
export function StatusMenu({ order }: { order: Order }) {
  function handleChange(value: string) {
    if (!isOrderStatus(value) || value === order.status) return;
    const { saved } = orderActions.setStatus(order.id, value);
    const message = `${order.id} marked as ${STATUS_LABELS[value]}`;
    if (saved) toast.success(message);
    else toast.warning(message, { description: "Not saved: browser storage is unavailable." });
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        aria-label={`Status: ${STATUS_LABELS[order.status]}. Change status for ${order.id}`}
        className={cn(
          "inline-flex h-6 items-center gap-1.5 rounded-full pr-1.5 pl-2.5 text-xs font-medium whitespace-nowrap ring-1 ring-inset transition-shadow outline-none hover:shadow-sm focus-visible:ring-2 focus-visible:ring-ring",
          STATUS_STYLES[order.status].badge,
        )}
      >
        <StatusDot status={order.status} />
        {STATUS_LABELS[order.status]}
        <ChevronDownIcon aria-hidden="true" className="size-3 opacity-60" />
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" className="w-44">
        <DropdownMenuLabel className="text-xs text-muted-foreground">Change status</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuRadioGroup value={order.status} onValueChange={handleChange}>
          {ORDER_STATUSES.map((status) => (
            <DropdownMenuRadioItem key={status} value={status}>
              <StatusDot status={status} className="size-2" />
              {STATUS_LABELS[status]}
            </DropdownMenuRadioItem>
          ))}
        </DropdownMenuRadioGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
