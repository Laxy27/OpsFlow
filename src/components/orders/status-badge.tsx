import { cn } from "@/lib/utils";
import { STATUS_LABELS, type OrderStatus } from "@/lib/types";

/** Color tokens per status, shared by badges, filters and the dashboard. */
export const STATUS_STYLES: Record<OrderStatus, { badge: string; dot: string }> = {
  pending: {
    badge: "bg-amber-50 text-amber-800 ring-amber-200",
    dot: "bg-amber-500",
  },
  processing: {
    badge: "bg-blue-50 text-blue-800 ring-blue-200",
    dot: "bg-blue-500",
  },
  completed: {
    badge: "bg-emerald-50 text-emerald-800 ring-emerald-200",
    dot: "bg-emerald-500",
  },
  cancelled: {
    badge: "bg-slate-100 text-slate-700 ring-slate-200",
    dot: "bg-slate-400",
  },
};

export function StatusDot({ status, className }: { status: OrderStatus; className?: string }) {
  return (
    <span
      aria-hidden="true"
      className={cn("inline-block size-1.5 shrink-0 rounded-full", STATUS_STYLES[status].dot, className)}
    />
  );
}

export function StatusBadge({ status, className }: { status: OrderStatus; className?: string }) {
  return (
    <span
      className={cn(
        "inline-flex h-6 items-center gap-1.5 rounded-full px-2.5 text-xs font-medium whitespace-nowrap ring-1 ring-inset",
        STATUS_STYLES[status].badge,
        className,
      )}
    >
      <StatusDot status={status} />
      {STATUS_LABELS[status]}
    </span>
  );
}
