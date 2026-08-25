"use client";

import { useCallback, useEffect, useState } from "react";

/** Ticking session timer used by the live interview room. */
export function useElapsedTimer(running: boolean, initialSeconds = 0) {
  const [seconds, setSeconds] = useState(initialSeconds);

  useEffect(() => {
    if (!running) return;
    const id = setInterval(() => setSeconds((value) => value + 1), 1000);
    return () => clearInterval(id);
  }, [running]);

  const reset = useCallback(() => setSeconds(initialSeconds), [initialSeconds]);

  return { seconds, reset };
}
