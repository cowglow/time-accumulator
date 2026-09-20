import { act } from 'react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { AppStateProvider, useAppState } from './AppStateContext';
import {
  LOCALSTORAGE_CHECKIN_KEY,
  LOCALSTORAGE_ENTRIES_KEY,
  LOCALSTORAGE_LOG_KEY,
  LOCALSTORAGE_POOLS_KEY,
  LOCALSTORAGE_RUNNING_KEY,
} from '../lib/constants';
import { renderHook } from '../test/renderHook';

const FIXED_NOW_MS = 1_615_114_800_000; // 2021-03-07T07:00:00.000Z
const FIXED_NOW_S = (FIXED_NOW_MS / 1000).toString();

describe('AppStateContext', () => {
  beforeEach(() => {
    localStorage.clear();
    vi.useFakeTimers();
    vi.setSystemTime(FIXED_NOW_MS);
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('starts empty when localStorage is empty', () => {
    const { result } = renderHook(() => useAppState(), {
      wrapper: AppStateProvider,
    });

    expect(result.current.pools).toEqual([]);
    expect(result.current.entries).toEqual([]);
    expect(result.current.running).toBe(false);
  });

  it('startTimer starts an untagged or tagged running timer and opens the overlay', () => {
    const { result } = renderHook(() => useAppState(), {
      wrapper: AppStateProvider,
    });

    act(() => {
      result.current.startTimer('gym');
    });

    expect(result.current.running).toEqual({ poolId: 'gym', timestamp: FIXED_NOW_S });
    expect(result.current.overlayOpen).toBe(true);
    expect(JSON.parse(localStorage.getItem(LOCALSTORAGE_RUNNING_KEY) as string)).toEqual(
      result.current.running
    );
  });

  it('stopTimer appends a counted entry for the running pool and clears running state', () => {
    const { result } = renderHook(() => useAppState(), {
      wrapper: AppStateProvider,
    });

    act(() => {
      result.current.startTimer('gym');
    });
    act(() => {
      vi.setSystemTime(FIXED_NOW_MS + 60_000);
      result.current.stopTimer();
    });

    expect(result.current.running).toBe(false);
    expect(result.current.overlayOpen).toBe(false);
    expect(result.current.entries).toEqual([
      expect.objectContaining({
        poolId: 'gym',
        timeIn: FIXED_NOW_S,
        timeOut: ((FIXED_NOW_MS + 60_000) / 1000).toString(),
        state: 'counted',
      }),
    ]);
  });

  it('retagRunning changes the pool of a running timer without stopping it', () => {
    const { result } = renderHook(() => useAppState(), {
      wrapper: AppStateProvider,
    });

    act(() => {
      result.current.startTimer(null);
    });
    act(() => {
      result.current.retagRunning('water');
    });

    expect(result.current.running).toEqual({ poolId: 'water', timestamp: FIXED_NOW_S });
  });

  it('addPool creates a pool and deletePool cascades to remove its entries', () => {
    const { result } = renderHook(() => useAppState(), {
      wrapper: AppStateProvider,
    });

    act(() => {
      result.current.addPool('Gym');
    });
    const poolId = result.current.pools[0].id;
    expect(result.current.pools).toEqual([{ id: poolId, name: 'Gym' }]);

    act(() => {
      result.current.startTimer(poolId);
    });
    act(() => {
      result.current.stopTimer();
    });
    expect(result.current.entries).toHaveLength(1);

    act(() => {
      result.current.deletePool(poolId);
    });

    expect(result.current.pools).toEqual([]);
    expect(result.current.entries).toEqual([]);
  });

  it('setEntriesState toggles entries between counted and omitted', () => {
    const { result } = renderHook(() => useAppState(), {
      wrapper: AppStateProvider,
    });

    act(() => {
      result.current.startTimer('gym');
    });
    act(() => {
      result.current.stopTimer();
    });
    const entryId = result.current.entries[0].id;

    act(() => {
      result.current.setEntriesState([entryId], 'omitted');
    });
    expect(result.current.entries[0].state).toBe('omitted');

    act(() => {
      result.current.setEntriesState([entryId], 'counted');
    });
    expect(result.current.entries[0].state).toBe('counted');
  });

  it('deleteEntry permanently removes it', () => {
    const { result } = renderHook(() => useAppState(), {
      wrapper: AppStateProvider,
    });

    act(() => {
      result.current.startTimer(null);
    });
    act(() => {
      result.current.stopTimer();
    });
    const entryId = result.current.entries[0].id;

    act(() => {
      result.current.deleteEntry(entryId);
    });

    expect(result.current.entries).toEqual([]);
  });

  it('assignPool tags one or more untagged entries and forces them counted', () => {
    const { result } = renderHook(() => useAppState(), {
      wrapper: AppStateProvider,
    });

    act(() => {
      result.current.startTimer(null);
    });
    act(() => {
      result.current.stopTimer();
    });
    const entryId = result.current.entries[0].id;

    act(() => {
      result.current.assignPool([entryId], 'gym');
    });

    expect(result.current.entries[0]).toMatchObject({ poolId: 'gym', state: 'counted' });
  });

  it('poolTotalMs sums only counted entries for that pool at or after the given time', () => {
    const { result } = renderHook(() => useAppState(), {
      wrapper: AppStateProvider,
    });

    act(() => {
      result.current.startTimer('gym');
    });
    act(() => {
      vi.setSystemTime(FIXED_NOW_MS + 60_000); // 1 minute later
      result.current.stopTimer();
    });

    const total = result.current.poolTotalMs('gym', FIXED_NOW_MS / 1000);
    expect(total).toBe(60_000);

    const totalAfterStop = result.current.poolTotalMs(
      'gym',
      FIXED_NOW_MS / 1000 + 120
    );
    expect(totalAfterStop).toBe(0);
  });

  it('migrates a legacy stopped log into untagged counted entries on first read', () => {
    localStorage.setItem(
      LOCALSTORAGE_LOG_KEY,
      JSON.stringify([{ timeIn: '1615000000', timeOut: '1615003600' }])
    );

    const { result } = renderHook(() => useAppState(), {
      wrapper: AppStateProvider,
    });

    expect(result.current.entries).toEqual([
      expect.objectContaining({
        poolId: null,
        timeIn: '1615000000',
        timeOut: '1615003600',
        state: 'counted',
      }),
    ]);
  });

  it('migrates a legacy in-progress checkin into an untagged running timer on first read', () => {
    localStorage.setItem(LOCALSTORAGE_CHECKIN_KEY, JSON.stringify('1615100000'));

    const { result } = renderHook(() => useAppState(), {
      wrapper: AppStateProvider,
    });

    expect(result.current.running).toEqual({ poolId: null, timestamp: '1615100000' });
  });

  it('does not re-run legacy migration once the new keys already exist', () => {
    localStorage.setItem(LOCALSTORAGE_POOLS_KEY, JSON.stringify([]));
    localStorage.setItem(LOCALSTORAGE_ENTRIES_KEY, JSON.stringify([]));
    localStorage.setItem(LOCALSTORAGE_RUNNING_KEY, JSON.stringify(false));
    localStorage.setItem(
      LOCALSTORAGE_LOG_KEY,
      JSON.stringify([{ timeIn: '1615000000', timeOut: '1615003600' }])
    );

    const { result } = renderHook(() => useAppState(), {
      wrapper: AppStateProvider,
    });

    expect(result.current.entries).toEqual([]);
  });
});
