"use client";

import { Coins, Timer } from "lucide-react";
import type { LiveSessionStatus } from "@/types";
import { LogoMark } from "@/components/shared/logo";
import { formatClock } from "@/lib/format";
import { cn } from "@/lib/utils";

interface SessionTopbarProps {
  status: LiveSessionStatus;
  elapsedSeconds: number;
  durationMinutes: number;
  creditsUsed: number;
  title: string;
}

const STATUS_LABEL: Record<LiveSessionStatus, string> = {
  connecting: "Connecting…",
  live: "Interview in progress",
  paused: "Paused",
  ended: "Interview ended",
};

export function SessionTopbar({
  status,
  elapsedSeconds,
  durationMinutes,
  creditsUsed,
  title,
}: SessionTopbarProps) {
  const totalSeconds = durationMinutes * 60;
  const progress = Math.min(100, (elapsedSeconds / totalSeconds) * 100);
  const overtime = elapsedSeconds > totalSeconds;

  return (
    <header className="relative z-20 shrink-0 border-b border-border bg-card">
      <div className="flex h-14 items-center gap-4 px-4 sm:px-5">
        <div className="flex items-center gap-2.5">
          <LogoMark className="size-6 rounded-lg" />
          <span className="hidden text-sm font-semibold tracking-tight sm:inline">Tayyo</span>
        </div>

        <div className="flex min-w-0 items-center gap-2.5">
          <span
            className={cn(
              "flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[11px] font-medium",
              status === "live"
                ? "border-destructive/25 bg-destructive-subtle text-destructive"
                : "border-border bg-muted text-muted-foreground",
            )}
          >
            <span
              className={cn(
                "size-1.5 rounded-full",
                status === "live" ? "animate-pulse bg-destructive" : "bg-muted-foreground",
              )}
            />
            {STATUS_LABEL[status]}
          </span>
          <span className="hidden truncate text-sm text-muted-foreground lg:inline">{title}</span>
        </div>

        <div className="ml-auto flex items-center gap-3 sm:gap-4">
          <span className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <Coins className="size-3.5" />
            <span className="tabular-nums">{creditsUsed}</span>
            <span className="hidden sm:inline">credits used</span>
          </span>

          <span
            className={cn(
              "flex items-center gap-1.5 font-mono text-sm tabular-nums",
              overtime ? "text-destructive" : "text-foreground",
            )}
          >
            <Timer className="size-3.5" />
            {formatClock(elapsedSeconds)}
            <span className="hidden text-muted-foreground sm:inline">
              / {formatClock(totalSeconds)}
            </span>
          </span>
        </div>
      </div>

      <div className="h-0.5 w-full bg-muted">
        <div
          className={cn(
            "h-full transition-[width] duration-1000 ease-linear",
            overtime ? "bg-destructive" : "bg-primary",
          )}
          style={{ width: `${progress}%` }}
        />
      </div>
    </header>
  );
}
