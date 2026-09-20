import { useState, useEffect } from 'react';

/**
 * useDebounce Hook
 * Debounces a fast-changing value (e.g. search queries) to optimize
 * rendering performance and improve Core Web Vitals (INP - Interaction to Next Paint).
 *
 * @param value The value to debounce
 * @param delayMs Delay in milliseconds (default 250ms)
 */
export function useDebounce<T>(value: T, delayMs: number = 250): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delayMs);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delayMs]);

  return debouncedValue;
}
