"use client";

import { Mic, MicOff, Loader2 } from "lucide-react";
import type { MicStatus } from "@/types";
import { cn } from "@/lib/utils";

const LABELS: Record<MicStatus, string> = {
  idle: "Mic ready",
  listening: "Listening…",
  muted: "Microphone muted",
  processing: "Processing your answer…",
};

export function MicIndicator({ status, className }: { status: MicStatus; className?: string }) {
  const listening = status === "listening";

  return (
    <div className={cn("flex items-center gap-3", className)}>
      <span
        className={cn(
          "flex size-9 items-center justify-center rounded-full border transition-colors",
          listening
            ? "pulse-ring border-destructive/30 bg-destructive/10 text-destructive"
            : status === "muted"
              ? "border-border bg-muted text-muted-foreground"
              : "border-border bg-card text-foreground",
        )}
      >
        {status === "muted" ? (
          <MicOff className="size-4" />
        ) : status === "processing" ? (
          <Loader2 className="size-4 animate-spin" />
        ) : (
          <Mic className="size-4" />
        )}
      </span>

      <div className="min-w-0">
        <p className="text-sm font-medium text-foreground">{LABELS[status]}</p>
        <p className="hidden text-xs text-muted-foreground sm:block">
          Speech capture is simulated in this preview.
        </p>
      </div>

      {listening ? (
        <span className="ml-1 hidden h-5 items-end gap-[3px] sm:flex" aria-hidden>
          {[0, 1, 2, 3, 4, 5].map((index) => (
            <span
              key={index}
              className="w-[3px] origin-bottom rounded-full bg-destructive/70"
              style={{
                height: "100%",
                animation: `tayyo-bar 1.1s ease-in-out ${index * 0.1}s infinite`,
              }}
            />
          ))}
        </span>
      ) : null}
    </div>
  );
}
