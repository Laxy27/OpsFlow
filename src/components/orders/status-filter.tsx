"use client";

import { cn } from "@/lib/utils";
import { ORDER_STATUSES, STATUS_LABELS, type OrderFilters, type OrderStatus } from "@/lib/types";
import { StatusDot } from "./status-badge";

interface StatusFilterProps {
  value: OrderFilters["status"];
  counts: Record<OrderStatus, number>;
  total: number;
  onChange: (value: OrderFilters["status"]) => void;
}

/** Segmented status filter with live counts for each status. */
export function StatusFilter({ value, counts, total, onChange }: StatusFilterProps) {
  const options: { value: OrderFilters["status"]; label: string; count: number }[] = [
    { value: "all", label: "All orders", count: total },
    ...ORDER_STATUSES.map((status) => ({
      value: status,
      label: STATUS_LABELS[status],
      count: counts[status],
    })),
  ];

  return (
    <div
      role="group"
      aria-label="Filter by status"
      className="-mx-4 -my-1 flex gap-1.5 overflow-x-auto px-4 py-1 [scrollbar-width:none] sm:mx-0 sm:flex-wrap sm:px-0 [&::-webkit-scrollbar]:hidden"
    >
      {options.map((option) => {
        const active = option.value === value;
        return (
          <button
            key={option.value}
            type="button"
            aria-pressed={active}
            onClick={() => onChange(option.value)}
            className={cn(
              "inline-flex h-8 shrink-0 items-center gap-2 rounded-lg border px-3 text-sm font-medium transition-colors outline-none focus-visible:ring-3 focus-visible:ring-ring/50",
              active
                ? "border-primary/30 bg-accent text-accent-foreground"
                : "border-border bg-card text-muted-foreground hover:bg-muted hover:text-foreground",
            )}
          >
            {option.value !== "all" && <StatusDot status={option.value} />}
            {option.label}
            <span
              className={cn(
                "rounded px-1.5 text-xs tabular-nums",
                active ? "bg-card text-accent-foreground" : "bg-muted text-muted-foreground",
              )}
            >
              {option.count}
            </span>
          </button>
        );
      })}
    </div>
  );
}
