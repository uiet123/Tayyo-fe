"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { isAbortError, subscribeToStore, toErrorMessage } from "@/lib/api";

interface State<T> {
  data: T | null;
  error: string | null;
  isLoading: boolean;
}

/**
 * Minimal data-fetching hook so every screen gets loading, error and refetch
 * behaviour for free. Swap for TanStack Query later without touching callers.
 */
export function useApiResource<T>(
  fetcher: (signal: AbortSignal) => Promise<T>,
  deps: unknown[] = [],
  options: { subscribeToMutations?: boolean } = {},
) {
  const { subscribeToMutations = false } = options;
  const [state, setState] = useState<State<T>>({ data: null, error: null, isLoading: true });
  const [nonce, setNonce] = useState(0);

  // Latest-ref pattern: assigned in an effect, never during render.
  const fetcherRef = useRef(fetcher);
  useEffect(() => {
    fetcherRef.current = fetcher;
  });

  const refetch = useCallback(() => setNonce((value) => value + 1), []);

  useEffect(() => {
    const controller = new AbortController();
    let active = true;

    // Flipping to "loading" is part of subscribing to the request, so the
    // synchronous set here is intentional.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setState((prev) => ({ ...prev, isLoading: true, error: null }));

    fetcherRef
      .current(controller.signal)
      .then((data) => {
        if (!active) return;
        setState({ data, error: null, isLoading: false });
      })
      .catch((error: unknown) => {
        if (!active || isAbortError(error)) return;
        setState({ data: null, error: toErrorMessage(error), isLoading: false });
      });

    return () => {
      active = false;
      controller.abort();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [...deps, nonce]);

  useEffect(() => {
    if (!subscribeToMutations) return;
    const unsubscribe = subscribeToStore(refetch);
    return () => {
      unsubscribe();
    };
  }, [subscribeToMutations, refetch]);

  return { ...state, refetch };
}
