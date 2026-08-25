"use client";

import { useCallback, useSyncExternalStore } from "react";

/**
 * localStorage-backed boolean that stays in sync across components and does
 * not trip hydration (server and first client render use `fallback`).
 */
const listeners = new Map<string, Set<() => void>>();

function subscribeTo(key: string, listener: () => void) {
  const set = listeners.get(key) ?? new Set();
  set.add(listener);
  listeners.set(key, set);
  return () => {
    set.delete(listener);
  };
}

export function usePersistentBoolean(key: string, fallback = false) {
  const subscribe = useCallback((listener: () => void) => subscribeTo(key, listener), [key]);

  const value = useSyncExternalStore(
    subscribe,
    () => window.localStorage.getItem(key) === "true",
    () => fallback,
  );

  const setValue = useCallback(
    (next: boolean) => {
      window.localStorage.setItem(key, String(next));
      listeners.get(key)?.forEach((listener) => listener());
    },
    [key],
  );

  return [value, setValue] as const;
}
