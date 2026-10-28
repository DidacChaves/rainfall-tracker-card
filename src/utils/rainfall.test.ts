import {describe, expect, it} from 'vitest';
import {
  createDrops,
  defaultMaxLevel,
  isImperialUnit,
  levelPercentage,
  parseMaxLevel,
  parseState,
} from './rainfall';

describe('parseState', () => {
  it('parses numeric states', () => {
    expect(parseState('3.5')).toBe(3.5);
    expect(parseState('0')).toBe(0);
  });

  it.each([undefined, '', 'unavailable', 'unknown', 'abc'])('returns null for %s', (state) => {
    expect(parseState(state)).toBeNull();
  });
});

describe('parseMaxLevel', () => {
  it('accepts positive numbers and numeric strings', () => {
    expect(parseMaxLevel(25)).toBe(25);
    expect(parseMaxLevel('40')).toBe(40);
    expect(parseMaxLevel('2,5')).toBe(2.5);
  });

  it.each([0, -3, '0', 'abc', null, undefined, NaN])('rejects %s', (value) => {
    expect(parseMaxLevel(value)).toBeUndefined();
  });
});

describe('units', () => {
  it('detects imperial units', () => {
    expect(isImperialUnit('in')).toBe(true);
    expect(isImperialUnit('in/h')).toBe(true);
    expect(isImperialUnit('mm')).toBe(false);
    expect(isImperialUnit(undefined)).toBe(false);
  });

  it('gives a default max level per unit', () => {
    expect(defaultMaxLevel('mm')).toBe(50);
    expect(defaultMaxLevel('in')).toBe(2);
    expect(defaultMaxLevel(undefined)).toBe(50);
  });
});

describe('levelPercentage', () => {
  it('follows the three segments of the scale', () => {
    expect(levelPercentage(0, 50)).toBe(0);
    expect(levelPercentage(10, 50)).toBeCloseTo(20); // 20 % of max -> 20 %
    expect(levelPercentage(25, 50)).toBeCloseTo(50); // 50 % of max -> 50 %
    expect(levelPercentage(50, 50)).toBeCloseTo(100);
    expect(levelPercentage(5, 50)).toBeCloseTo(10);
    expect(levelPercentage(17.5, 50)).toBeCloseTo(35);
  });

  it('is capped at 100', () => {
    expect(levelPercentage(500, 50)).toBe(100);
  });

  it('is safe with invalid input', () => {
    expect(levelPercentage(-5, 50)).toBe(0);
    expect(levelPercentage(5, 0)).toBe(0);
    expect(levelPercentage(5, -1)).toBe(0);
    expect(levelPercentage(NaN, 50)).toBe(0);
  });

  it('is monotonic', () => {
    let previous = 0;
    for (let v = 0; v <= 60; v += 0.5) {
      const current = levelPercentage(v, 50);
      expect(current).toBeGreaterThanOrEqual(previous);
      previous = current;
    }
  });
});

describe('createDrops', () => {
  it('creates the requested number of drops within range', () => {
    const drops = createDrops(10, () => 0.5);
    expect(drops).toHaveLength(10);
    expect(drops[0]).toEqual({left: 50, duration: 0.65, delay: 1});
  });
});
