"use client";

import Link from "next/link";
import { Coins, Plus, TrendingDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { ErrorState } from "@/components/ui/error-state";
import { useApiResource } from "@/hooks";
import { creditsApi } from "@/lib/api";
import { formatNumber } from "@/lib/format";
import { CREDIT_RATES } from "@/lib/constants";
import { cn } from "@/lib/utils";

export function CreditBalanceCard({ className }: { className?: string }) {
  const { data, error, isLoading, refetch } = useApiResource(
    (signal) => creditsApi.getCreditBalance({ signal }),
    [],
    { subscribeToMutations: true },
  );

  if (error) {
    return <ErrorState compact message={error} onRetry={refetch} className={className} />;
  }

  if (isLoading || !data) {
    return (
      <Card className={cn("p-6", className)}>
        <Skeleton className="h-3.5 w-28" />
        <Skeleton className="mt-4 h-9 w-32" />
        <Skeleton className="mt-4 h-1.5 w-full" />
        <Skeleton className="mt-5 h-9 w-32" />
      </Card>
    );
  }

  const low = data.balance <= data.lowBalanceThreshold;
  const total = Math.max(data.balance + data.usedThisMonth, 1);
  const remainingPct = Math.round((data.balance / total) * 100);
  const approxMinutes = Math.floor(data.balance / CREDIT_RATES.perInterviewMinute);

  return (
    <Card className={cn("relative overflow-hidden p-6", className)}>
      <div
        aria-hidden
        className="pointer-events-none absolute -right-16 -top-16 size-48 rounded-full bg-brand-subtle opacity-70 blur-2xl"
      />

      <div className="relative">
        <div className="flex items-center justify-between gap-3">
          <p className="flex items-center gap-2 text-[13px] font-medium text-muted-foreground">
            <Coins className="size-4" strokeWidth={1.9} />
            Credit balance
          </p>
          {low ? (
            <span className="flex items-center gap-1 rounded-full bg-warning-subtle px-2 py-0.5 text-[11px] font-medium text-warning">
              <TrendingDown className="size-3" />
              Running low
            </span>
          ) : null}
        </div>

        <p className="mt-4 flex items-baseline gap-2">
          <span className="text-4xl font-semibold tracking-tight tabular-nums">
            {formatNumber(data.balance)}
          </span>
          <span className="text-sm text-muted-foreground">credits remaining</span>
        </p>

        <p className="mt-1.5 text-xs text-muted-foreground">
          About {approxMinutes} minutes of live interview time.
        </p>

        <div className="mt-5">
          <div className="h-1.5 overflow-hidden rounded-full bg-muted">
            <div
              className={cn("h-full rounded-full", low ? "bg-warning" : "bg-primary")}
              style={{ width: `${remainingPct}%` }}
            />
          </div>
          <div className="mt-2 flex items-center justify-between text-xs text-muted-foreground">
            <span>{formatNumber(data.usedThisMonth)} used this month</span>
            <span>{formatNumber(data.lifetimePurchased)} lifetime</span>
          </div>
        </div>

        <Button asChild className="mt-6" size="sm">
          <Link href="/dashboard/credits">
            <Plus />
            Buy Credits
          </Link>
        </Button>
      </div>
    </Card>
  );
}
