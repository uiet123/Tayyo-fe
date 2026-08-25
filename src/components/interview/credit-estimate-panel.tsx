import Link from "next/link";
import { AlertTriangle, Coins, Info } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { CREDIT_RATES } from "@/lib/constants";
import { formatNumber } from "@/lib/format";
import { cn } from "@/lib/utils";

interface CreditEstimatePanelProps {
  durationMinutes: number;
  balance?: number;
  className?: string;
}

export function CreditEstimatePanel({
  durationMinutes,
  balance,
  className,
}: CreditEstimatePanelProps) {
  const sessionCost = durationMinutes * CREDIT_RATES.perInterviewMinute;
  const total = sessionCost + CREDIT_RATES.reportGeneration;
  const insufficient = typeof balance === "number" && balance < total;

  return (
    <Card className={cn("p-5", className)}>
      <p className="flex items-center gap-2 text-[13px] font-medium text-muted-foreground">
        <Coins className="size-4" strokeWidth={1.9} />
        Estimated cost
      </p>

      <p className="mt-3 flex items-baseline gap-1.5">
        <span className="text-3xl font-semibold tracking-tight tabular-nums">{total}</span>
        <span className="text-sm text-muted-foreground">credits</span>
      </p>

      <dl className="mt-5 space-y-2 text-sm">
        <div className="flex items-center justify-between gap-3">
          <dt className="text-muted-foreground">
            Session ({durationMinutes} min &times; {CREDIT_RATES.perInterviewMinute})
          </dt>
          <dd className="tabular-nums">{sessionCost}</dd>
        </div>
        <div className="flex items-center justify-between gap-3">
          <dt className="text-muted-foreground">Report generation</dt>
          <dd className="tabular-nums">{CREDIT_RATES.reportGeneration}</dd>
        </div>
      </dl>

      <Separator className="my-4" />

      {typeof balance === "number" ? (
        <div className="flex items-center justify-between gap-3 text-sm">
          <span className="text-muted-foreground">Balance after</span>
          <span
            className={cn(
              "font-medium tabular-nums",
              insufficient ? "text-destructive" : "text-foreground",
            )}
          >
            {formatNumber(Math.max(0, balance - total))}
          </span>
        </div>
      ) : null}

      {insufficient ? (
        <p className="mt-4 flex items-start gap-2 rounded-lg bg-destructive-subtle p-3 text-xs leading-relaxed text-destructive">
          <AlertTriangle className="mt-0.5 size-3.5 shrink-0" />
          <span>
            You need {total - (balance ?? 0)} more credits.{" "}
            <Link href="/dashboard/credits" className="font-medium underline underline-offset-2">
              Buy credits
            </Link>
          </span>
        </p>
      ) : (
        <p className="mt-4 flex items-start gap-2 text-xs leading-relaxed text-muted-foreground">
          <Info className="mt-0.5 size-3.5 shrink-0" />
          You are only charged for the minutes you actually use. End early and the rest stays in
          your balance.
        </p>
      )}
    </Card>
  );
}
