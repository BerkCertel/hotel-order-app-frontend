// types/date-fns-tz.d.ts
// Minimal type declarations for date-fns-tz used by the frontend util.
// Place this file at ./types/date-fns-tz.d.ts (not inside a .ts file).
// Ensure tsconfig.json includes "./types" in "typeRoots" if necessary.

declare module "date-fns-tz" {
  export function toDate(
    dateString: string,
    options?: { timeZone?: string }
  ): Date;
  export function fromZonedTime(dateString: string, timeZone: string): Date;
  export function formatInTimeZone(
    date: Date | number,
    timeZone: string,
    formatStr: string
  ): string;
  export function getTimezoneOffset(
    timeZone: string,
    date?: Date | number
  ): number;
  export function zonedTimeToUtc(dateString: string, timeZone: string): Date;
  export function utcToZonedTime(date: Date | number, timeZone: string): Date;

  const _default: {
    toDate: typeof toDate;
    fromZonedTime: typeof fromZonedTime;
    formatInTimeZone: typeof formatInTimeZone;
    getTimezoneOffset: typeof getTimezoneOffset;
    zonedTimeToUtc: typeof zonedTimeToUtc;
    utcToZonedTime: typeof utcToZonedTime;
  };
  export default _default;
}
