// hooks/useDebouncedCallback.ts
import { useRef, useEffect, useCallback } from "react";

export function useDebouncedCallback<T extends (...args: any[]) => void>(
  callback: T,
  delay: number,
) {
  const timeoutId = useRef<ReturnType<typeof setTimeout> | null>(null);
  const stableCallback = useRef(callback);

  // Keep the latest callback function reference fresh
  useEffect(() => {
    stableCallback.current = callback;
  }, [callback]);

  // Clean up the timer when the component unmounts
  useEffect(() => {
    return () => {
      if (timeoutId.current) clearTimeout(timeoutId.current);
    };
  }, []);

  return useCallback(
    (...args: Parameters<T>) => {
      if (timeoutId.current) {
        clearTimeout(timeoutId.current);
      }

      timeoutId.current = setTimeout(() => {
        stableCallback.current(...args);
      }, delay);
    },
    [delay],
  );
}
