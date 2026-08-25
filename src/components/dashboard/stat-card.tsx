import { ArrowDownRight, ArrowUpRight, type LucideIcon } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

interface StatCardProps {
  label: string;
  value: string | number;
  icon: LucideIcon;
  suffix?: string;
  delta?: number;
  deltaLabel?: string;
  className?: string;
}

export function StatCard({
  label,
  value,
  icon: Icon,
  suffix,
  delta,
  deltaLabel = "vs last month",
  className,
}: StatCardProps) {
  const positive = (delta ?? 0) >= 0;
  const DeltaIcon = positive ? ArrowUpRight : ArrowDownRight;

  return (
    <Card className={cn("p-5", className)}>
      <div className="flex items-start justify-between gap-3">
        <p className="text-[13px] font-medium text-muted-foreground">{label}</p>
        <Icon className="size-4 shrink-0 text-muted-foreground" strokeWidth={1.9} />
      </div>
      <p className="mt-3 flex items-baseline gap-1">
        <span className="text-2xl font-semibold tracking-tight tabular-nums">{value}</span>
        {suffix ? <span className="text-sm text-muted-foreground">{suffix}</span> : null}
      </p>
      {typeof delta === "number" ? (
        <p className="mt-2 flex items-center gap-1 text-xs">
          <span
            className={cn(
              "inline-flex items-center gap-0.5 font-medium",
              positive ? "text-success" : "text-destructive",
            )}
          >
            <DeltaIcon className="size-3" />
            {Math.abs(delta)}%
          </span>
          <span className="text-muted-foreground">{deltaLabel}</span>
        </p>
      ) : null}
    </Card>
  );
}

export function StatCardSkeleton() {
  return (
    <Card className="p-5">
      <Skeleton className="h-3.5 w-24" />
      <Skeleton className="mt-4 h-7 w-16" />
      <Skeleton className="mt-3 h-3 w-28" />
    </Card>
  );
}
