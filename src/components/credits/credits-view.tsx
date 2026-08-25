"use client";

import { useState } from "react";
import { toast } from "sonner";
import { ArrowDownRight, ArrowUpRight, Coins, History } from "lucide-react";
import type { CreditActivityKind } from "@/types";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { EmptyState } from "@/components/ui/empty-state";
import { ErrorState } from "@/components/ui/error-state";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { CreditPackageCard } from "./credit-package-card";
import { CreditBalanceCard } from "./credit-balance-card";
import { useApiResource } from "@/hooks";
import { creditsApi, toErrorMessage } from "@/lib/api";
import { formatDate, formatNumber } from "@/lib/format";
import { CREDIT_RATES } from "@/lib/constants";
import { cn } from "@/lib/utils";

const KIND_LABEL: Record<CreditActivityKind, string> = {
  "mock-interview": "Mock interview",
  "practice-questions": "Practice",
  "report-generation": "Report",
  "resume-analysis": "Resume",
  purchase: "Purchase",
  bonus: "Bonus",
};

export function CreditsView() {
  const [buying, setBuying] = useState<string | null>(null);

  const packages = useApiResource(
    (signal) => creditsApi.getCreditPackages({ signal, latencyMs: 350 }),
    [],
  );
  const history = useApiResource(
    (signal) => creditsApi.getCreditTransactions({ signal, latencyMs: 550 }),
    [],
    { subscribeToMutations: true },
  );

  async function handleBuy(packageId: string) {
    setBuying(packageId);
    try {
      await creditsApi.purchaseCredits(packageId, { latencyMs: 700 });
    } catch (error) {
      toast("Payments are not live yet", { description: toErrorMessage(error) });
    } finally {
      setBuying(null);
    }
  }

  return (
    <div className="space-y-10">
      <div className="grid gap-6 lg:grid-cols-[340px_minmax(0,1fr)]">
        <CreditBalanceCard />

        <Card className="p-5 sm:p-6">
          <p className="flex items-center gap-2 text-[13px] font-medium text-muted-foreground">
            <Coins className="size-4" strokeWidth={1.9} />
            How credits are spent
          </p>
          <dl className="mt-5 grid gap-x-8 gap-y-3 sm:grid-cols-2">
            <RateRow label="Live interview" value={`${CREDIT_RATES.perInterviewMinute} / min`} />
            <RateRow label="Report generation" value={`${CREDIT_RATES.reportGeneration} each`} />
            <RateRow label="Practice question" value={`${CREDIT_RATES.practiceQuestion} each`} />
            <RateRow label="Resume analysis" value={`${CREDIT_RATES.resumeAnalysis} each`} />
          </dl>
          <p className="mt-6 rounded-lg bg-muted/50 p-3.5 text-xs leading-relaxed text-muted-foreground">
            You are only charged for the minutes you actually use. Credits never expire, and unused
            credits carry forward indefinitely.
          </p>
        </Card>
      </div>

      <section className="space-y-4">
        <div>
          <h2 className="text-base font-semibold tracking-tight">Credit packages</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Pay only for what you use. No subscription, no auto-renewal.
          </p>
        </div>

        {packages.error ? (
          <ErrorState compact message={packages.error} onRetry={packages.refetch} />
        ) : packages.isLoading || !packages.data ? (
          <div className="grid gap-5 lg:grid-cols-3">
            {Array.from({ length: 3 }).map((_, index) => (
              <Skeleton key={index} className="h-[420px] rounded-xl" />
            ))}
          </div>
        ) : (
          <div className="grid gap-5 lg:grid-cols-3">
            {packages.data.map((pack) => (
              <CreditPackageCard
                key={pack.id}
                pack={pack}
                action={
                  <Button
                    className="w-full"
                    size="lg"
                    variant={pack.popular ? "default" : "secondary"}
                    loading={buying === pack.id}
                    onClick={() => handleBuy(pack.id)}
                  >
                    Buy Credits
                  </Button>
                }
              />
            ))}
          </div>
        )}
      </section>

      <section className="space-y-4">
        <div>
          <h2 className="text-base font-semibold tracking-tight">Credit usage history</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Every credit movement on your account.
          </p>
        </div>

        {history.error ? (
          <ErrorState compact message={history.error} onRetry={history.refetch} />
        ) : history.isLoading || !history.data ? (
          <Card className="divide-y divide-border">
            {Array.from({ length: 6 }).map((_, index) => (
              <div key={index} className="flex items-center gap-4 px-4 py-4">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-4 flex-1" />
                <Skeleton className="h-4 w-16" />
                <Skeleton className="h-4 w-16" />
              </div>
            ))}
          </Card>
        ) : history.data.length === 0 ? (
          <EmptyState
            compact
            icon={History}
            title="No credit activity yet"
            description="Purchases and interview usage will appear here."
          />
        ) : (
          <Card className="overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow className="hover:bg-transparent">
                  <TableHead>Date</TableHead>
                  <TableHead>Activity</TableHead>
                  <TableHead className="text-right">Credits used</TableHead>
                  <TableHead className="text-right">Balance</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {history.data.map((transaction) => {
                  const credit = transaction.amount > 0;
                  return (
                    <TableRow key={transaction.id}>
                      <TableCell className="whitespace-nowrap text-sm text-muted-foreground">
                        {formatDate(transaction.date)}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2.5">
                          <span className="min-w-0 truncate text-sm">{transaction.activity}</span>
                          <Badge variant="outline" className="hidden shrink-0 sm:inline-flex">
                            {KIND_LABEL[transaction.kind]}
                          </Badge>
                        </div>
                      </TableCell>
                      <TableCell className="text-right">
                        <span
                          className={cn(
                            "inline-flex items-center gap-1 text-sm font-medium tabular-nums",
                            credit ? "text-success" : "text-foreground",
                          )}
                        >
                          {credit ? (
                            <ArrowUpRight className="size-3.5" />
                          ) : (
                            <ArrowDownRight className="size-3.5 text-muted-foreground" />
                          )}
                          {credit ? "+" : ""}
                          {transaction.amount}
                        </span>
                      </TableCell>
                      <TableCell className="text-right text-sm tabular-nums text-muted-foreground">
                        {formatNumber(transaction.balanceAfter)}
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </Card>
        )}
      </section>
    </div>
  );
}

function RateRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between gap-3 border-b border-border pb-3">
      <dt className="text-sm text-muted-foreground">{label}</dt>
      <dd className="text-sm font-medium tabular-nums">{value}</dd>
    </div>
  );
}
