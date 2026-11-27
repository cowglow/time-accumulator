import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { RANGE_KEYS, rangeStartSeconds } from './date-range';

describe('rangeStartSeconds', () => {
  beforeEach(() => {
    vi.useFakeTimers();
    // Thursday 2026-11-26, 15:30 local time
    vi.setSystemTime(new Date(2026, 10, 26, 15, 30));
  });

  afterEach(() => vi.useRealTimers());

  const local = (...args: [number, number, number]) =>
    Math.floor(new Date(...args).getTime() / 1000);

  it('offers four ranges in display order', () => {
    expect(RANGE_KEYS).toEqual(['today', 'week', 'month', 'all']);
  });

  it('today starts at local midnight', () => {
    expect(rangeStartSeconds('today')).toBe(local(2026, 10, 26));
  });

  it('this week starts on Monday', () => {
    expect(rangeStartSeconds('week')).toBe(local(2026, 10, 23));
  });

  it('current month starts on the 1st', () => {
    expect(rangeStartSeconds('month')).toBe(local(2026, 10, 1));
  });

  it('complete log includes everything', () => {
    expect(rangeStartSeconds('all')).toBe(0);
  });
});
