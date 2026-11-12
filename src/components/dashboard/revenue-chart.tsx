"use client";

import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { formatCompactCurrency, formatCurrency } from "@/lib/format";
import type { WeeklyPoint } from "@/lib/metrics";
import { roundCurrency } from "@/lib/orders";
import { ChartCard } from "./chart-card";
import { CHART_COLORS, CHART_HEIGHT, CHART_WEEKS } from "./chart-theme";
import { ChartTooltip } from "./chart-tooltip";

const formatRevenue = (point: WeeklyPoint) => formatCurrency(point.revenue);

export function RevenueChart({ series }: { series: WeeklyPoint[] }) {
  const total = roundCurrency(series.reduce((sum, point) => sum + point.revenue, 0));

  return (
    <ChartCard
      title="Revenue"
      description="Value of completed orders per week, by order date"
      value={formatCurrency(total)}
      valueCaption={`Last ${CHART_WEEKS} weeks`}
      series={series}
      tableValueHeader="Completed revenue"
      formatTableValue={formatRevenue}
    >
      <ResponsiveContainer width="100%" height={CHART_HEIGHT}>
        <AreaChart data={series} margin={{ top: 4, right: 8, bottom: 0, left: -12 }}>
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
            tickLine={false}
            axisLine={false}
            tick={{ fill: CHART_COLORS.axis, fontSize: 12 }}
            tickFormatter={(value: number) => formatCompactCurrency(value)}
            width={56}
          />
          <Tooltip
            cursor={{ stroke: CHART_COLORS.axis, strokeWidth: 1 }}
            content={(props) => (
              <ChartTooltip
                active={props.active}
                payload={props.payload as ReadonlyArray<{ payload?: WeeklyPoint }>}
                color={CHART_COLORS.revenue}
                label="Revenue"
                format={formatRevenue}
              />
            )}
          />
          <Area
            type="monotone"
            dataKey="revenue"
            stroke={CHART_COLORS.revenue}
            strokeWidth={2}
            fill={CHART_COLORS.revenue}
            fillOpacity={0.1}
            dot={false}
            activeDot={{ r: 4, fill: CHART_COLORS.revenue, stroke: CHART_COLORS.surface, strokeWidth: 2 }}
            isAnimationActive={false}
          />
        </AreaChart>
      </ResponsiveContainer>
    </ChartCard>
  );
}
