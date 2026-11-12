import { formatShortDate } from "@/lib/dates";
import { CHART_WEEKS } from "./chart-theme";
import type { WeeklyPoint } from "@/lib/metrics";

interface ChartCardProps {
  title: string;
  description: string;
  /** Headline figure for the visible period. */
  value: string;
  valueCaption: string;
  /** Data rendered as a screen-reader table so the chart is never visual-only. */
  series: WeeklyPoint[];
  tableValueHeader: string;
  formatTableValue: (point: WeeklyPoint) => string;
  children: React.ReactNode;
}

export function ChartCard({
  title,
  description,
  value,
  valueCaption,
  series,
  tableValueHeader,
  formatTableValue,
  children,
}: ChartCardProps) {
  const isEmpty = series.every((point) => point.orders === 0);

  return (
    <section aria-label={title} className="panel flex flex-col p-5">
      <h2 className="text-sm font-semibold text-foreground">{title}</h2>
      <p className="mt-0.5 text-xs text-muted-foreground">{description}</p>
      <p className="mt-3 flex flex-wrap items-baseline gap-x-2">
        <span className="text-2xl font-semibold tracking-tight text-foreground">{value}</span>
        <span className="text-xs text-muted-foreground">{valueCaption}</span>
      </p>

      <div className="mt-5" aria-hidden="true">
        {isEmpty ? (
          <div className="grid h-60 place-items-center rounded-lg border border-dashed text-sm text-muted-foreground">
            No orders in the last {CHART_WEEKS} weeks
          </div>
        ) : (
          children
        )}
      </div>

      <table className="sr-only">
        <caption>{title}, by week</caption>
        <thead>
          <tr>
            <th scope="col">Week starting</th>
            <th scope="col">{tableValueHeader}</th>
          </tr>
        </thead>
        <tbody>
          {series.map((point) => (
            <tr key={point.weekStart}>
              <th scope="row">{formatShortDate(point.weekStart)}</th>
              <td>{formatTableValue(point)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </section>
  );
}
