/**
 * Transport layer.
 *
 * Every screen talks to `lib/api/*`, and every `lib/api/*` function goes
 * through `request()`, which calls the Tayyo backend (proxied through
 * `/api/*` — see next.config.ts) and unwraps its response envelope:
 *   { success: true, data } | { success: false, error: { code, message } }
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
  /** Kept for call-site compatibility; real requests have real latency. */
  latencyMs?: number;
  /** Abort signal, forwarded to fetch. */
  signal?: AbortSignal;
}

interface Envelope<T> {
  success: boolean;
  data?: T;
  error?: { code?: string; message?: string };
}

export async function request<T>(
  path: string,
  init: RequestInit = {},
  options: RequestOptions = {},
): Promise<T> {
  const res = await fetch(`${API_BASE_URL}${path}`, {
    credentials: "include",
    ...init,
    headers: {
      ...(init.body ? { "Content-Type": "application/json" } : {}),
      ...init.headers,
    },
    signal: options.signal,
  });

  let envelope: Envelope<T>;
  try {
    envelope = (await res.json()) as Envelope<T>;
  } catch {
    throw new ApiError("Unexpected response from the server.", res.status);
  }

  if (!res.ok || !envelope.success) {
    throw new ApiError(
      envelope.error?.message ?? "Something went wrong.",
      res.status,
      envelope.error?.code,
    );
  }
  return envelope.data as T;
}

export function isAbortError(error: unknown) {
  return error instanceof DOMException && error.name === "AbortError";
}

export function toErrorMessage(error: unknown, fallback = "Something went wrong.") {
  if (error instanceof ApiError) return error.message;
  if (error instanceof Error) return error.message;
  return fallback;
}
