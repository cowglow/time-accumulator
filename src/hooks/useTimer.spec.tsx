import { act } from 'react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { computeElapsed, useTimer } from './useTimer';
import { AppStateContext } from '../contexts/AppStateContext';
import { renderHook } from '../test/renderHook';

const FIXED_NOW_MS = 1_615_114_800_000; // 2021-03-07T07:00:00.000Z

describe('computeElapsed', () => {
  beforeEach(() => {
    vi.useFakeTimers();
    vi.setSystemTime(FIXED_NOW_MS);
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('returns all zeros when the start time is now', () => {
    const startSeconds = FIXED_NOW_MS / 1000;
    expect(computeElapsed(startSeconds)).toEqual({
      hour: 0,
      minute: 0,
      seconds: 0,
      milliseconds: 0,
    });
  });

  it('computes hour/minute/second/centisecond components from an elapsed duration', () => {
    // 1h 2m 3.4s ago. The "milliseconds" field is actually hundredths of a
    // second (0-99), matching the pre-existing Math.floor(ms * 0.1) math.
    const elapsedMs = ((1 * 60 + 2) * 60 + 3) * 1000 + 400;
    const startSeconds = (FIXED_NOW_MS - elapsedMs) / 1000;
    expect(computeElapsed(startSeconds)).toEqual({
      hour: 1,
      minute: 2,
      seconds: 3,
      milliseconds: 40,
    });
  });

  it('wraps hours modulo 24 for elapsed durations over a day (documented pre-existing behavior)', () => {
    const elapsedMs = (25 * 3600 + 5 * 60 + 6) * 1000; // 25h 5m 6s
    const startSeconds = (FIXED_NOW_MS - elapsedMs) / 1000;
    expect(computeElapsed(startSeconds)).toEqual({
      hour: 1,
      minute: 5,
      seconds: 6,
      milliseconds: 0,
    });
  });
});

describe('useTimer', () => {
  beforeEach(() => {
    vi.useFakeTimers();
    vi.setSystemTime(FIXED_NOW_MS);
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  const wrapperWithTimestamp = (timestamp: false | string) => {
    return ({ children }: { children: React.ReactNode }) => (
      <AppStateContext.Provider
        value={{
          timestamp,
          log: [],
          actionToggle: () => {},
          resetLog: () => {},
        }}
      >
        {children}
      </AppStateContext.Provider>
    );
  };

  it('reports zero elapsed time while stopped', () => {
    const { result } = renderHook(() => useTimer(), {
      wrapper: wrapperWithTimestamp(false),
    });

    act(() => {
      vi.advanceTimersByTime(100);
    });

    expect(result.current).toEqual({
      hour: 0,
      minute: 0,
      seconds: 0,
      milliseconds: 0,
    });
  });

  it('counts up from a running start timestamp', () => {
    const startedSecondsAgo = 5;
    const startTimestamp = (FIXED_NOW_MS / 1000 - startedSecondsAgo).toString();

    const { result } = renderHook(() => useTimer(), {
      wrapper: wrapperWithTimestamp(startTimestamp),
    });

    act(() => {
      vi.advanceTimersByTime(100);
    });

    // advancing fake timers by 100ms also advances the faked Date.now(),
    // so the observed elapsed time is (5s + the 100ms tick) later.
    expect(result.current).toMatchObject({
      hour: 0,
      minute: 0,
      seconds: 5,
    });
  });

  it('resumes an in-progress timer from a persisted start timestamp instead of resetting to zero', () => {
    // Simulates a page reload while a timer was already running: the
    // persisted checkin timestamp is from well in the past, and the hook
    // should reflect the real elapsed time on its very first tick, not
    // start counting from zero.
    const startedSecondsAgo = 3 * 3600 + 15 * 60; // 3h15m ago
    const startTimestamp = (FIXED_NOW_MS / 1000 - startedSecondsAgo).toString();

    const { result } = renderHook(() => useTimer(), {
      wrapper: wrapperWithTimestamp(startTimestamp),
    });

    act(() => {
      vi.advanceTimersByTime(100);
    });

    expect(result.current).toMatchObject({
      hour: 3,
      minute: 15,
      seconds: 0,
    });
  });
});
