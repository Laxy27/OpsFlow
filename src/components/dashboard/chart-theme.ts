/**
 * Chart colors as literal values: SVG presentation attributes used by
 * Recharts do not reliably resolve CSS custom properties.
 * Keep in sync with --chart-1 / --chart-2 in globals.css.
 */
export const CHART_COLORS = {
  revenue: "#0d9488", // teal-600
  orders: "#2563eb", // blue-600
  grid: "#e5e9f0",
  axis: "#64748b", // slate-500
  surface: "#ffffff",
  cursor: "#f1f5f9", // slate-100
} as const;

export const CHART_HEIGHT = 240;

/** Number of weekly buckets shown in the dashboard charts. */
export const CHART_WEEKS = 13;
