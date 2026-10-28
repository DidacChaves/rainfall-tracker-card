export const DEFAULT_MAX_MM = 50;
export const DEFAULT_MAX_IN = 2;

/** Number of the entity state, or `null` when it is missing, `unavailable`, `unknown` or not numeric. */
export const parseState = (state: string | undefined): number | null => {
  if (state === undefined || state === '' || state === 'unavailable' || state === 'unknown') return null;
  const value = Number(state);
  return Number.isFinite(value) ? value : null;
};

/** Validates the configured max level; returns `undefined` for anything that is not a positive number. */
export const parseMaxLevel = (value: unknown): number | undefined => {
  const parsed = typeof value === 'string' ? Number(value.replace(',', '.')) : Number(value);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : undefined;
};

export const isImperialUnit = (unit: string | undefined): boolean => unit?.toLowerCase().startsWith('in') ?? false;

/** Default "full card" level for the unit of the sensor (50 mm or 2 in). */
export const defaultMaxLevel = (unit: string | undefined): number =>
  isImperialUnit(unit) ? DEFAULT_MAX_IN : DEFAULT_MAX_MM;

/**
 * Fill level of the card (0-100) for a rainfall value.
 * The scale is not linear, so small amounts are still visible:
 * - 0 -> 20 %   : 0 to 20 % of `max`
 * - 20 -> 50 %  : 20 % to 50 % of `max`
 * - 50 -> 100 % : 50 % to 100 % of `max` (the card is full at `max`)
 */
export const levelPercentage = (value: number, max: number): number => {
  if (!(max > 0) || !(value > 0)) return 0;
  const v = Math.min(value, max);
  const ratio = v / max;

  if (ratio <= 0.2) return (ratio / 0.2) * 20;
  if (ratio <= 0.5) return 20 + ((ratio - 0.2) / 0.3) * 30;
  return 50 + ((ratio - 0.5) / 0.5) * 50;
};

export interface Drop {
  /** Horizontal position, % of the card width */
  left: number;
  /** Animation duration, seconds */
  duration: number;
  /** Animation delay, seconds */
  delay: number;
}

/** Random raindrops; computed once so the animation is not restarted on every render. */
export const createDrops = (count = 20, random: () => number = Math.random): Drop[] =>
  Array.from({length: count}, () => ({
    left: random() * 100,
    duration: 0.2 + random() * 0.9,
    delay: random() * 2,
  }));
