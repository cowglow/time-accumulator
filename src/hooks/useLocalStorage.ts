import { useEffect, useState, type Dispatch, type SetStateAction } from 'react';

export const useLocalStorage = <T,>(
  key: string,
  defaultValue: T
): [T, Dispatch<SetStateAction<T>>] => {
  const [value, setValue] = useState<T>(() => {
    try {
      const localValue = window.localStorage.getItem(key);
      return localValue !== null ? JSON.parse(localValue) : defaultValue;
    } catch {
      return defaultValue;
    }
  });

  useEffect(() => {
    try {
      window.localStorage.setItem(key, JSON.stringify(value));
    } catch {
      // storage unavailable (private mode, quota, disabled) — keep running in-memory
    }
  }, [key, value]);

  return [value, setValue];
};
