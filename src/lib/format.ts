const currencyFormatter = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
});

const compactCurrencyFormatter = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  notation: "compact",
  maximumFractionDigits: 1,
});

const numberFormatter = new Intl.NumberFormat("en-US");

/** "$1,234.50" */
export function formatCurrency(value: number): string {
  return currencyFormatter.format(value);
}

/** "$12.3K" — used for chart axes where space is tight. */
export function formatCompactCurrency(value: number): string {
  return compactCurrencyFormatter.format(value);
}

/** "1,234" */
export function formatNumber(value: number): string {
  return numberFormatter.format(value);
}

/** 0.8125 -> "81.3%" */
export function formatPercent(ratio: number): string {
  return `${(ratio * 100).toFixed(1)}%`;
}
