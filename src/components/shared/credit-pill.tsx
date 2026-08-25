"use client";

import Link from "next/link";
import { Coins } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { useApiResource } from "@/hooks";
import { creditsApi } from "@/lib/api";
import { formatNumber } from "@/lib/format";
import { cn } from "@/lib/utils";

/** Always-visible credit balance in the dashboard topbar. */
export function CreditPill({ className }: { className?: string }) {
  const { data, isLoading } = useApiResource(
    (signal) => creditsApi.getCreditBalance({ signal, latencyMs: 200 }),
    [],
    { subscribeToMutations: true },
  );

  if (isLoading || !data) return <Skeleton className={cn("h-8 w-28 rounded-full", className)} />;

  const low = data.balance <= data.lowBalanceThreshold;

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Link
          href="/dashboard/credits"
          className={cn(
            "flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-sm font-medium transition-colors",
            low
              ? "border-warning/30 bg-warning-subtle text-warning hover:border-warning/50"
              : "border-border bg-card text-foreground hover:border-border-strong",
            className,
          )}
        >
          <Coins className="size-3.5" strokeWidth={2} />
          <span className="tabular-nums">{formatNumber(data.balance)}</span>
          <span className="hidden text-muted-foreground sm:inline">credits</span>
        </Link>
      </TooltipTrigger>
      <TooltipContent>
        {low ? "Running low — top up to keep practising" : "View credits and usage"}
      </TooltipContent>
    </Tooltip>
  );
}
