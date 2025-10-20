// utils/SubcategoryUtils.ts
// Frontend util (TypeScript) — aligned with backend SubcategoryUtils.js logic.
// Requires: npm i date-fns date-fns-tz
// Make sure types/date-fns-tz.d.ts exists separately as shown above.

import { isWithinInterval, addDays } from "date-fns";
// Use named imports so we get proper types from the .d.ts
import {
  toDate as toDateExport,
  fromZonedTime as fromZonedTimeExport,
  formatInTimeZone as formatInTimeZoneExport,
} from "date-fns-tz";

export type PriceSchedule = {
  activeFrom?: string;
  activeTo?: string;
  /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
  [k: string]: any;
};

// Local typed aliases for the functions we may use
type ToDateFn = (dateString: string, options?: { timeZone?: string }) => Date;
type FromZonedTimeFn = (dateString: string, timeZone: string) => Date;
type FormatInTimeZoneFn = (
  date: Date | number,
  timeZone: string,
  formatStr: string
) => string;

// Safe references (use when available) — no explicit any usage
const toDateFn: ToDateFn | undefined =
  typeof toDateExport === "function" ? toDateExport : undefined;
const fromZonedTimeFn: FromZonedTimeFn | undefined =
  typeof fromZonedTimeExport === "function" ? fromZonedTimeExport : undefined;
const formatInTimeZone: FormatInTimeZoneFn | undefined =
  typeof formatInTimeZoneExport === "function"
    ? formatInTimeZoneExport
    : undefined;

/**
 * Helper: "YYYY-MM-DD" + "HH:mm" + timeZone -> UTC Date
 * Priority:
 * 1) toDate (if available)
 * 2) fromZonedTime
 * 3) formatInTimeZone -> offset -> new Date(iso)
 * 4) fallback: new Date(`${ymd}T${hhmm}:00Z`)
 */
export function makeUtcDateFromLocalTime(
  dateYmd: string,
  timeHhMm: string,
  timeZone: string
): Date {
  // 1) toDate
  if (toDateFn) {
    try {
      return toDateFn(`${dateYmd} ${timeHhMm}`, { timeZone });
    } catch (err: unknown) {
      // use err so ESLint won't complain about unused vars

      console.warn(
        "makeUtcDateFromLocalTime: toDate failed, falling back:",
        err
      );
    }
  }

  // 2) fromZonedTime
  if (fromZonedTimeFn) {
    try {
      return fromZonedTimeFn(`${dateYmd} ${timeHhMm}`, timeZone);
    } catch (err: unknown) {
      console.warn(
        "makeUtcDateFromLocalTime: fromZonedTime failed, falling back:",
        err
      );
    }
  }

  // 3) formatInTimeZone -> offset -> new Date(iso)
  if (formatInTimeZone) {
    try {
      const offset = formatInTimeZone(new Date(), timeZone, "xxx"); // e.g. "+03:00"
      const iso = `${dateYmd}T${timeHhMm}:00${offset}`; // "2025-10-19T09:30:00+03:00"
      return new Date(iso);
    } catch (err: unknown) {
      console.warn(
        "makeUtcDateFromLocalTime: formatInTimeZone fallback failed:",
        err
      );
    }
  }

  // 4) fallback
  return new Date(`${dateYmd}T${timeHhMm}:00Z`);
}

/**
 * priceSchedule: { activeFrom: "HH:mm", activeTo: "HH:mm" }
 * Türkiye timezone: Europe/Istanbul
 */
export function isPriceActive(priceSchedule?: PriceSchedule | null): boolean {
  if (!priceSchedule || !priceSchedule.activeFrom || !priceSchedule.activeTo)
    return false;

  const timeZone = "Europe/Istanbul";
  const nowUtc = new Date();

  const todayTurkey = formatInTimeZone
    ? formatInTimeZone(nowUtc, timeZone, "yyyy-MM-dd")
    : nowUtc.toISOString().slice(0, 10);

  const fromUtc = makeUtcDateFromLocalTime(
    todayTurkey,
    priceSchedule.activeFrom!,
    timeZone
  );
  let toUtc = makeUtcDateFromLocalTime(
    todayTurkey,
    priceSchedule.activeTo!,
    timeZone
  );

  if (toUtc <= fromUtc) {
    toUtc = addDays(toUtc, 1);
  }

  return isWithinInterval(nowUtc, { start: fromUtc, end: toUtc });
}

/**
 * getActualPrice: same logic as backend
 */
export function getActualPrice(
  price?: number | null,
  priceSchedule?: PriceSchedule | string | null
): number {
  if (!price || price === 0) return 0;
  const schedule = normalizePriceSchedule(priceSchedule);
  if (!schedule || !schedule.activeFrom || !schedule.activeTo) return price;
  return isPriceActive(schedule) ? price : 0;
}

/**
 * normalizePriceSchedule: object | JSON-string | ""/null/undefined -> object | undefined
 */
export function normalizePriceSchedule(
  raw?: PriceSchedule | string | null
): PriceSchedule | undefined {
  if (raw === null || typeof raw === "undefined") return undefined;
  if (typeof raw === "string") {
    const trimmed = raw.trim();
    if (trimmed === "") return undefined;
    try {
      const parsed = JSON.parse(trimmed);
      if (
        parsed &&
        (parsed.activeFrom !== undefined || parsed.activeTo !== undefined)
      ) {
        return parsed as PriceSchedule;
      }
      return undefined;
    } catch (err: unknown) {
      console.warn("normalizePriceSchedule: JSON parse failed for:", raw, err);
      return undefined;
    }
  }
  return raw as PriceSchedule;
}
