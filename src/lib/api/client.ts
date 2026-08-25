/**
 * Transport layer.
 *
 * Every screen talks to `lib/api/*`, and every `lib/api/*` function goes
 * through `request()`. When the real backend lands, the body of `request()`
 * becomes a `fetch` call and nothing above it changes.
 *
 *   // future implementation
 *   const res = await fetch(`${API_BASE_URL}${path}`, init);
 *   if (!res.ok) throw new ApiError(await res.text(), res.status);
 *   return res.json() as Promise<T>;
 */

export const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL ?? "/api";

export class ApiError extends Error {
  readonly status: number;
  readonly code?: string;

  constructor(message: string, status = 500, code?: string) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.code = code;
  }
}

export interface RequestOptions {
  /** Simulated latency in ms. Keeps loading and skeleton states honest. */
  latencyMs?: number;
  /** Abort signal, forwarded to fetch once this is a real network call. */
  signal?: AbortSignal;
}

const DEFAULT_LATENCY = 420;

function wait(ms: number, signal?: AbortSignal) {
  return new Promise<void>((resolve, reject) => {
    if (signal?.aborted) {
      reject(new DOMException("Aborted", "AbortError"));
      return;
    }
    const timer = setTimeout(resolve, ms);
    signal?.addEventListener(
      "abort",
      () => {
        clearTimeout(timer);
        reject(new DOMException("Aborted", "AbortError"));
      },
      { once: true },
    );
  });
}

export async function request<T>(
  resolver: () => T | Promise<T>,
  options: RequestOptions = {},
): Promise<T> {
  const { latencyMs = DEFAULT_LATENCY, signal } = options;
  await wait(latencyMs, signal);
  return resolver();
}

export function isAbortError(error: unknown) {
  return error instanceof DOMException && error.name === "AbortError";
}

export function toErrorMessage(error: unknown, fallback = "Something went wrong.") {
  if (error instanceof ApiError) return error.message;
  if (error instanceof Error) return error.message;
  return fallback;
}
