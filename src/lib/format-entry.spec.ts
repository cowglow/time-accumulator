import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { formatDurationShort, formatEntryDay, formatTimeOfDay } from './format-entry';

describe('formatTimeOfDay', () => {
  it('formats morning and afternoon times with am/pm, no leading zero on the hour', () => {
    expect(formatTimeOfDay(new Date('2021-03-07T09:05:00').getTime() / 1000)).toBe('9:05am');
    expect(formatTimeOfDay(new Date('2021-03-07T13:30:00').getTime() / 1000)).toBe('1:30pm');
  });

  it('formats midnight and noon as 12, not 0', () => {
    expect(formatTimeOfDay(new Date('2021-03-07T00:00:00').getTime() / 1000)).toBe('12:00am');
    expect(formatTimeOfDay(new Date('2021-03-07T12:00:00').getTime() / 1000)).toBe('12:00pm');
  });
});

describe('formatEntryDay', () => {
  const FIXED_NOW = new Date('2021-03-07T18:00:00');

  beforeEach(() => {
    vi.useFakeTimers();
    vi.setSystemTime(FIXED_NOW);
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('labels the current day as Today', () => {
    expect(formatEntryDay(new Date('2021-03-07T08:00:00').getTime() / 1000)).toBe('Today');
  });

  it('labels the previous day as Yesterday', () => {
    expect(formatEntryDay(new Date('2021-03-06T08:00:00').getTime() / 1000)).toBe('Yesterday');
  });

  it('falls back to a weekday/month/day label further back', () => {
    expect(formatEntryDay(new Date('2021-03-01T08:00:00').getTime() / 1000)).toBe('Mon, Mar 1');
  });
});

describe('formatDurationShort', () => {
  it('renders sub-hour durations in minutes', () => {
    expect(formatDurationShort(42 * 60_000)).toBe('42m');
  });

  it('renders hour-plus durations as h:mm', () => {
    expect(formatDurationShort((60 + 5) * 60_000)).toBe('1:05');
  });

  it('rounds to the nearest minute', () => {
    expect(formatDurationShort(90_000)).toBe('2m');
  });
});
