"use client";

import { useEffect, useRef } from "react";
import type { TranscriptEntry } from "@/types";
import { formatClock } from "@/lib/format";
import { cn } from "@/lib/utils";

export function TranscriptPanel({ entries }: { entries: TranscriptEntry[] }) {
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
  }, [entries.length]);

  return (
    <div className="space-y-4">
      <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-muted-foreground">
        Transcript
      </p>

      <div className="space-y-4">
        {entries.map((entry) => (
          <TranscriptRow key={entry.id} entry={entry} />
        ))}
        <div ref={endRef} />
      </div>
    </div>
  );
}

function TranscriptRow({ entry }: { entry: TranscriptEntry }) {
  if (entry.role === "system") {
    return (
      <p className="flex items-center gap-3 py-1 text-xs text-muted-foreground">
        <span className="h-px flex-1 bg-border" />
        {entry.content}
        <span className="h-px flex-1 bg-border" />
      </p>
    );
  }

  const isCandidate = entry.role === "candidate";

  return (
    <div className="flex gap-3">
      <span
        className={cn(
          "mt-0.5 flex size-7 shrink-0 items-center justify-center rounded-full text-[10px] font-semibold",
          isCandidate
            ? "bg-brand-subtle text-primary"
            : "border border-border bg-muted text-muted-foreground",
        )}
      >
        {isCandidate ? "You" : "AI"}
      </span>

      <div className="min-w-0 flex-1">
        <p className="flex items-baseline gap-2">
          <span className="text-xs font-medium text-foreground">
            {isCandidate ? "You" : "Interviewer"}
          </span>
          <span className="font-mono text-[11px] tabular-nums text-muted-foreground">
            {formatClock(entry.at)}
          </span>
        </p>
        <p
          className={cn(
            "mt-1 text-sm leading-relaxed",
            isCandidate ? "text-foreground/90" : "text-muted-foreground",
          )}
        >
          {entry.content}
        </p>
      </div>
    </div>
  );
}
