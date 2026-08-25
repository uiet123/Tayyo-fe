import type { ScoreBreakdownItem } from "@/types";
import { Card } from "@/components/ui/card";
import { SCORE_BAR_CLASSES, scoreTone } from "./score-badge";
import { cn } from "@/lib/utils";

export function ScoreBreakdown({ items }: { items: ScoreBreakdownItem[] }) {
  return (
    <Card className="p-5 sm:p-6">
      <div>
        <h2 className="text-[15px] font-semibold tracking-tight">Performance breakdown</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Scored across the five dimensions interviewers actually weigh.
        </p>
      </div>

      <dl className="mt-6 space-y-5">
        {items.map((item) => (
          <div key={item.dimension}>
            <div className="flex items-baseline justify-between gap-4">
              <dt className="text-sm font-medium text-foreground">{item.label}</dt>
              <dd className="text-sm font-semibold tabular-nums text-foreground">{item.score}</dd>
            </div>
            <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-muted">
              <div
                className={cn(
                  "h-full rounded-full transition-[width] duration-700 ease-out",
                  SCORE_BAR_CLASSES[scoreTone(item.score)],
                )}
                style={{ width: `${item.score}%` }}
              />
            </div>
            <p className="mt-1.5 text-xs leading-relaxed text-muted-foreground">{item.summary}</p>
          </div>
        ))}
      </dl>
    </Card>
  );
}
