"use client";

import { useEffect } from "react";
import Link from "next/link";
import { AlertTriangle, RotateCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Logo } from "@/components/shared/logo";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Wire this to the error reporting service when the backend lands.
    console.error(error);
  }, [error]);

  return (
    <main className="flex min-h-dvh flex-col items-center justify-center px-6 text-center">
      <Logo />
      <div className="mt-10 flex size-12 items-center justify-center rounded-full border border-destructive/25 bg-destructive-subtle">
        <AlertTriangle className="size-5 text-destructive" strokeWidth={1.75} />
      </div>
      <h1 className="mt-6 text-2xl font-semibold tracking-tight">Something went wrong</h1>
      <p className="mt-2 max-w-sm text-sm leading-relaxed text-muted-foreground">
        An unexpected error interrupted this page. Retrying usually fixes it.
      </p>
      {error.digest ? (
        <p className="mt-3 font-mono text-xs text-muted-foreground">Ref: {error.digest}</p>
      ) : null}
      <div className="mt-7 flex flex-wrap items-center justify-center gap-3">
        <Button onClick={reset}>
          <RotateCw />
          Try again
        </Button>
        <Button asChild variant="secondary">
          <Link href="/dashboard">Back to dashboard</Link>
        </Button>
      </div>
    </main>
  );
}
