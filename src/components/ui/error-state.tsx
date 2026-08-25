"use client";

import { AlertTriangle, RotateCw } from "lucide-react";
import { Button } from "./button";
import { cn } from "@/lib/utils";

interface ErrorStateProps {
  title?: string;
  message: string;
  onRetry?: () => void;
  className?: string;
  compact?: boolean;
}

export function ErrorState({
  title = "Could not load this",
  message,
  onRetry,
  className,
  compact = false,
}: ErrorStateProps) {
  return (
    <div
      role="alert"
      className={cn(
        "flex flex-col items-center justify-center rounded-xl border border-destructive/25 bg-destructive-subtle text-center",
        compact ? "px-6 py-8" : "px-6 py-14",
        className,
      )}
    >
      <div className="flex size-11 items-center justify-center rounded-full border border-destructive/25 bg-background">
        <AlertTriangle className="size-5 text-destructive" strokeWidth={1.75} />
      </div>
      <h3 className="mt-4 text-sm font-semibold text-foreground">{title}</h3>
      <p className="mt-1.5 max-w-sm text-sm leading-relaxed text-muted-foreground">{message}</p>
      {onRetry ? (
        <Button variant="secondary" size="sm" className="mt-5" onClick={onRetry}>
          <RotateCw />
          Try again
        </Button>
      ) : null}
    </div>
  );
}
