import { isWithinInterval, addDays } from "date-fns";
import * as dateFnsTz from "date-fns-tz";

type PriceSchedule = {
  activeFrom?: string;
  activeTo?: string;
  [k: string]: any;
};

// Güvenli referanslar (varsa kullanacağız) — backend ile aynı yaklaşım
const toDateFn =
  dateFnsTz && typeof (dateFnsTz as any).toDate === "function"
    ? (dateFnsTz as any).toDate
    : null;
const fromZonedTimeFn =
  dateFnsTz && typeof (dateFnsTz as any).fromZonedTime === "function"
    ? (dateFnsTz as any).fromZonedTime
    : null;
const formatInTimeZone =
  dateFnsTz && typeof (dateFnsTz as any).formatInTimeZone === "function"
    ? (dateFnsTz as any).formatInTimeZone
    : null;

export function makeUtcDateFromLocalTime(
  dateYmd: string,
  timeHhMm: string,
  timeZone: string
): Date {
  // 1) toDate varsa deneyelim
  if (toDateFn) {
    try {
      // toDate supports string + options { timeZone } (backend ortamına göre)
      return toDateFn(`${dateYmd} ${timeHhMm}`, { timeZone });
    } catch (err) {
      // fallback'e düşecek
      // eslint-disable-next-line no-console
      console.warn(
        "makeUtcDateFromLocalTime: toDate failed, falling back:",
        (err as any) || err
      );
    }
  }

  // 2) fromZonedTime varsa deneyelim
  if (fromZonedTimeFn) {
    try {
      // fromZonedTime(localString, timeZone)
      return fromZonedTimeFn(`${dateYmd} ${timeHhMm}`, timeZone);
    } catch (err) {
      // eslint-disable-next-line no-console
      console.warn(
        "makeUtcDateFromLocalTime: fromZonedTime failed, falling back:",
        (err as any) || err
      );
    }
  }

  // 3) formatInTimeZone ile offset alıp ISO oluştur
  if (formatInTimeZone) {
    try {
      const offset = formatInTimeZone(new Date(), timeZone, "xxx"); // örn "+03:00"
      const iso = `${dateYmd}T${timeHhMm}:00${offset}`; // "2025-10-19T09:30:00+03:00"
      return new Date(iso);
    } catch (err) {
      // eslint-disable-next-line no-console
      console.warn(
        "makeUtcDateFromLocalTime: formatInTimeZone fallback failed:",
        (err as any) || err
      );
    }
  }

  // 4) Çok kaba fallback: UTC Z ekle (doğru olmayabilir ama sonuç verir)
  return new Date(`${dateYmd}T${timeHhMm}:00Z`);
}

/**
 * priceSchedule: { activeFrom: "HH:mm", activeTo: "HH:mm" }
 * Türkiye timezone: Europe/Istanbul
 * Returns true if current time (UTC) is within the schedule (accounting for timezone).
 */
export function isPriceActive(priceSchedule?: PriceSchedule | null): boolean {
  if (!priceSchedule || !priceSchedule.activeFrom || !priceSchedule.activeTo)
    return false;

  const timeZone = "Europe/Istanbul";
  const nowUtc = new Date();

  // Bugünün Türkiye tarihini almalıyız. formatInTimeZone varsa doğru lokal tarihi verir.
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

  // cross-midnight: toUtc <= fromUtc ise toUtc'u bir gün ileri al
  if (toUtc <= fromUtc) {
    toUtc = addDays(toUtc, 1);
  }

  return isWithinInterval(nowUtc, { start: fromUtc, end: toUtc });
}

/**
 * Display price hesaplama:
 * - price yok/0 => 0
 * - priceSchedule yok => price (daima geçerli)
 * - priceSchedule varsa => isPriceActive ? price : 0
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
 * Eğer priceSchedule string olarak gelebiliyorsa normalize etmek için.
 * - raw: object veya JSON-string veya ""/null/undefined
 * - return: object | undefined
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
    } catch (err) {
      // eslint-disable-next-line no-console
      console.warn("normalizePriceSchedule: JSON parse failed for:", raw);
      return undefined;
    }
  }
  // zaten obje ise
  return raw as PriceSchedule;
}
