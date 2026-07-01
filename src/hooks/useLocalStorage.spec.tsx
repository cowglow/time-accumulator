import { act } from 'react';
import { beforeEach, describe, expect, it } from 'vitest';
import { useLocalStorage } from './useLocalStorage';
import { renderHook } from '../test/renderHook';

describe('useLocalStorage', () => {
  const KEY = 'test-key';

  beforeEach(() => {
    localStorage.clear();
  });

  it('falls back to the provided default when nothing is stored', () => {
    const { result } = renderHook(() => useLocalStorage(KEY, 'default'));
    expect(result.current[0]).toBe('default');
  });

  it('lazily initializes from an existing localStorage value instead of the default', () => {
    localStorage.setItem(KEY, JSON.stringify('stored-value'));
    const { result } = renderHook(() => useLocalStorage(KEY, 'default'));
    expect(result.current[0]).toBe('stored-value');
  });

  it('persists updates to localStorage as JSON', () => {
    const { result } = renderHook(() => useLocalStorage(KEY, 'default'));

    act(() => {
      result.current[1]('updated-value');
    });

    expect(result.current[0]).toBe('updated-value');
    expect(localStorage.getItem(KEY)).toBe(JSON.stringify('updated-value'));
  });
});
