import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import storageReducer from './storage-reducer';
import { formatTimestamp } from '../format-timestamp/format-timestamp';

describe('storage-reducer', () => {
  beforeEach(() => {
    vi.useFakeTimers();
    vi.setSystemTime(1615114800000);
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('appends a START_RECORDING entry built from the current time', () => {
    const foo = storageReducer([], {
      type: 'START_RECORDING',
      payload: 'working on it',
    });

    expect(foo).toEqual([
      {
        comment: 'working on it',
        start: formatTimestamp(new Date().getTime()),
      },
    ]);
  });

  it('returns state unchanged for an unknown action type', () => {
    const state = [{ comment: 'existing', start: 'x' }];
    // @ts-expect-error exercising the default branch with a bogus action type
    expect(storageReducer(state, { type: 'NOT_A_REAL_ACTION' })).toBe(state);
  });
});
