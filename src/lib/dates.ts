/**
 * Date helpers that work with plain calendar dates ("YYYY-MM-DD").
 *
 * All arithmetic happens in UTC so results never shift with the viewer's
 * time zone or daylight saving changes.
 */

const ISO_DATE_PATTERN = /^\d{4}-\d{2}-\d{2}$/;
const DAY_MS = 24 * 60 * 60 * 1000;

/** Returns true for a real calendar date in YYYY-MM-DD format. */
export function isValidIsoDate(value: string): boolean {
  if (!ISO_DATE_PATTERN.test(value)) return false;
  const date = new Date(`${value}T00:00:00Z`);
  return !Number.isNaN(date.getTime()) && toIsoDate(date) === value;
}

/** Parses a YYYY-MM-DD string into a Date at midnight UTC. */
export function parseIsoDate(value: string): Date {
  return new Date(`${value}T00:00:00Z`);
}

/** Formats a Date as YYYY-MM-DD using its UTC calendar date. */
export function toIsoDate(date: Date): string {
  return date.toISOString().slice(0, 10);
}

/** Today's date in the viewer's local calendar, as YYYY-MM-DD. */
export function todayIsoDate(now: Date = new Date()): string {
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

export function addDays(isoDate: string, days: number): string {
  return toIsoDate(new Date(parseIsoDate(isoDate).getTime() + days * DAY_MS));
}

/** Returns the Monday that starts the week containing `isoDate`. */
export function startOfWeek(isoDate: string): string {
  const day = parseIsoDate(isoDate).getUTCDay(); // 0 = Sunday
  const offset = (day + 6) % 7; // days since Monday
  return addDays(isoDate, -offset);
}

const longDateFormatter = new Intl.DateTimeFormat("en-US", {
  month: "short",
  day: "numeric",
  year: "numeric",
  timeZone: "UTC",
});

const shortDateFormatter = new Intl.DateTimeFormat("en-US", {
  month: "short",
  day: "numeric",
  timeZone: "UTC",
});

/** "Nov 11, 2026" */
export function formatDate(isoDate: string): string {
  return longDateFormatter.format(parseIsoDate(isoDate));
}

/** "Nov 11" */
export function formatShortDate(isoDate: string): string {
  return shortDateFormatter.format(parseIsoDate(isoDate));
}
