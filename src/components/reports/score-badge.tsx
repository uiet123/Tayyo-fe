import { cn } from "@/lib/utils";

export function scoreTone(score: number) {
  if (score >= 85) return "success" as const;
  if (score >= 70) return "brand" as const;
  if (score >= 55) return "warning" as const;
  return "destructive" as const;
}

const TONE_CLASSES = {
  success: "border-success/25 bg-success-subtle text-success",
  brand: "border-brand-border bg-brand-subtle text-primary",
  warning: "border-warning/25 bg-warning-subtle text-warning",
  destructive: "border-destructive/25 bg-destructive-subtle text-destructive",
} as const;

export const SCORE_BAR_CLASSES = {
  success: "bg-success",
  brand: "bg-primary",
  warning: "bg-warning",
  destructive: "bg-destructive",
} as const;

export function ScoreBadge({
  score,
  className,
  showTotal = false,
}: {
  score?: number;
  className?: string;
  showTotal?: boolean;
}) {
  if (typeof score !== "number") {
    return <span className={cn("text-sm text-muted-foreground", className)}>&mdash;</span>;
  }

  return (
    <span
      className={cn(
        "inline-flex items-baseline gap-0.5 rounded-md border px-2 py-0.5 text-sm font-semibold tabular-nums",
        TONE_CLASSES[scoreTone(score)],
        className,
      )}
    >
      {score}
      {showTotal ? <span className="text-[11px] font-medium opacity-70">/100</span> : null}
    </span>
  );
}
