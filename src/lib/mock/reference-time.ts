/**
 * All mock timestamps are derived from a fixed reference instant so server and
 * client render identical markup (no hydration drift) and demo data is stable.
 */
export const REFERENCE_DATE = new Date("2026-08-25T09:30:00.000Z");

export function daysAgo(days: number, hoursOffset = 0): string {
  const date = new Date(REFERENCE_DATE);
  date.setDate(date.getDate() - days);
  date.setHours(date.getHours() - hoursOffset);
  return date.toISOString();
}

export function hoursAgo(hours: number): string {
  const date = new Date(REFERENCE_DATE);
  date.setHours(date.getHours() - hours);
  return date.toISOString();
}

export function daysFromNow(days: number, hoursOffset = 0): string {
  return daysAgo(-days, -hoursOffset);
}

/** Deterministic 0-1 hash so derived mock values never change between renders. */
export function seededUnit(seed: string): number {
  let hash = 2166136261;
  for (let i = 0; i < seed.length; i += 1) {
    hash ^= seed.charCodeAt(i);
    hash = Math.imul(hash, 16777619);
  }
  return ((hash >>> 0) % 10000) / 10000;
}

export function seededInt(seed: string, min: number, max: number): number {
  return min + Math.floor(seededUnit(seed) * (max - min + 1));
}
