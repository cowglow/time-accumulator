import { useState } from 'react';

export const useLocalStorage = (
  key: string,
  defaultValue: boolean | string | object
) => {
  const [value, setValue] = useState(() => {
    const localValue = window.localStorage.getItem(key);
    return localValue !== null ? JSON.parse(localValue) : defaultValue;
  });

  window.localStorage.setItem(key, JSON.stringify(value));

  return [value, setValue];
};
