import { act } from 'react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { AppStateProvider, useAppState } from './AppStateContext';
import {
  LOCALSTORAGE_CHECKIN_KEY,
  LOCALSTORAGE_LOG_KEY,
} from '../lib/constants';
import { renderHook } from '../test/renderHook';

const FIXED_NOW_MS = 1_615_114_800_000; // 2021-03-07T07:00:00.000Z

describe('AppStateContext', () => {
  beforeEach(() => {
    localStorage.clear();
    vi.useFakeTimers();
    vi.setSystemTime(FIXED_NOW_MS);
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('starts stopped with an empty log when localStorage is empty', () => {
    const { result } = renderHook(() => useAppState(), {
      wrapper: AppStateProvider,
    });

    expect(result.current.timestamp).toBe(false);
    expect(result.current.log).toEqual([]);
  });

  it('actionToggle starts a timer, stamping the checkin and persisting it', () => {
    const { result } = renderHook(() => useAppState(), {
      wrapper: AppStateProvider,
    });

    act(() => {
      result.current.actionToggle();
    });

    const expectedTimestamp = (FIXED_NOW_MS / 1000).toString();
    expect(result.current.timestamp).toBe(expectedTimestamp);
    expect(localStorage.getItem(LOCALSTORAGE_CHECKIN_KEY)).toBe(
      JSON.stringify(expectedTimestamp)
    );
  });

  it('actionToggle stops a running timer, appending a log entry and clearing the checkin', () => {
    const { result } = renderHook(() => useAppState(), {
      wrapper: AppStateProvider,
    });

    act(() => {
      result.current.actionToggle(); // start
    });
    const startedAt = (FIXED_NOW_MS / 1000).toString();

    act(() => {
      vi.setSystemTime(FIXED_NOW_MS + 60_000); // 1 minute later
      result.current.actionToggle(); // stop
    });

    expect(result.current.timestamp).toBe(false);
    expect(result.current.log).toEqual([
      { timeIn: startedAt, timeOut: ((FIXED_NOW_MS + 60_000) / 1000).toString() },
    ]);
    expect(JSON.parse(localStorage.getItem(LOCALSTORAGE_LOG_KEY) as string)).toEqual(
      result.current.log
    );
  });

  it('resetLog clears the entire log', () => {
    const { result } = renderHook(() => useAppState(), {
      wrapper: AppStateProvider,
    });

    act(() => {
      result.current.actionToggle(); // start
    });
    act(() => {
      vi.setSystemTime(FIXED_NOW_MS + 60_000);
      result.current.actionToggle(); // stop, creates one log entry
    });
    expect(result.current.log).toHaveLength(1);

    act(() => {
      result.current.resetLog();
    });

    expect(result.current.log).toEqual([]);
    expect(JSON.parse(localStorage.getItem(LOCALSTORAGE_LOG_KEY) as string)).toEqual(
      []
    );
  });

  it('hydrates an in-progress timer and existing log from localStorage on mount (reload resume)', () => {
    localStorage.setItem(
      LOCALSTORAGE_CHECKIN_KEY,
      JSON.stringify('1615100000')
    );
    localStorage.setItem(
      LOCALSTORAGE_LOG_KEY,
      JSON.stringify([{ timeIn: '1615000000', timeOut: '1615003600' }])
    );

    const { result } = renderHook(() => useAppState(), {
      wrapper: AppStateProvider,
    });

    expect(result.current.timestamp).toBe('1615100000');
    expect(result.current.log).toEqual([
      { timeIn: '1615000000', timeOut: '1615003600' },
    ]);
  });
});
