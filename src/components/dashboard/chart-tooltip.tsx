import { addDays, formatShortDate } from "@/lib/dates";
import type { WeeklyPoint } from "@/lib/metrics";

interface ChartTooltipProps {
  active?: boolean;
  payload?: ReadonlyArray<{ payload?: WeeklyPoint }>;
  /** Series color, shown as a key beside the value (text stays neutral). */
  color: string;
  label: string;
  format: (point: WeeklyPoint) => string;
}

/** Shared tooltip for the weekly dashboard charts. */
export function ChartTooltip({ active, payload, color, label, format }: ChartTooltipProps) {
  const point = payload?.[0]?.payload;
  if (!active || !point) return null;

  return (
    <div className="min-w-40 rounded-lg border bg-popover px-3 py-2 text-xs shadow-md">
      <p className="font-medium text-foreground">
        Week of {formatShortDate(point.weekStart)} – {formatShortDate(addDays(point.weekStart, 6))}
      </p>
      <div className="mt-1.5 flex items-center gap-2">
        <span aria-hidden="true" className="size-2 rounded-full" style={{ backgroundColor: color }} />
        <span className="text-muted-foreground">{label}</span>
        <span className="ml-auto font-semibold text-foreground tabular-nums">{format(point)}</span>
      </div>
    </div>
  );
}
