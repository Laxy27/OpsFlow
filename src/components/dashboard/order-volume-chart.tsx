"use client";

import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { formatNumber } from "@/lib/format";
import type { WeeklyPoint } from "@/lib/metrics";
import { ChartCard } from "./chart-card";
import { CHART_COLORS, CHART_HEIGHT } from "./chart-theme";
import { ChartTooltip } from "./chart-tooltip";

const formatOrders = (point: WeeklyPoint) =>
  `${formatNumber(point.orders)} ${point.orders === 1 ? "order" : "orders"}`;

export function OrderVolumeChart({ series }: { series: WeeklyPoint[] }) {
  const total = series.reduce((sum, point) => sum + point.orders, 0);
  const average = series.length > 0 ? total / series.length : 0;

  return (
    <ChartCard
      title="Order volume"
      description="Orders placed per week, all statuses"
      value={formatNumber(total)}
      valueCaption={`${average.toFixed(1)} per week on average`}
      series={series}
      tableValueHeader="Orders"
      formatTableValue={formatOrders}
    >
      <ResponsiveContainer width="100%" height={CHART_HEIGHT}>
        <BarChart data={series} margin={{ top: 4, right: 4, bottom: 0, left: -20 }}>
          <CartesianGrid vertical={false} stroke={CHART_COLORS.grid} />
          <XAxis
            dataKey="label"
            tickLine={false}
            axisLine={false}
            tick={{ fill: CHART_COLORS.axis, fontSize: 12 }}
            tickMargin={8}
            minTickGap={16}
          />
          <YAxis
            allowDecimals={false}
            tickLine={false}
            axisLine={false}
            tick={{ fill: CHART_COLORS.axis, fontSize: 12 }}
            width={48}
          />
          <Tooltip
            cursor={{ fill: CHART_COLORS.cursor }}
            content={(props) => (
              <ChartTooltip
                active={props.active}
                payload={props.payload as ReadonlyArray<{ payload?: WeeklyPoint }>}
                color={CHART_COLORS.orders}
                label="Orders"
                format={(point) => formatNumber(point.orders)}
              />
            )}
          />
          <Bar
            dataKey="orders"
            fill={CHART_COLORS.orders}
            radius={[4, 4, 0, 0]}
            maxBarSize={24}
            isAnimationActive={false}
          />
        </BarChart>
      </ResponsiveContainer>
    </ChartCard>
  );
}
