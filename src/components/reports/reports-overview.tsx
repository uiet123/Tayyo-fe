"use client";

import Link from "next/link";
import { ArrowRight, PieChart, TrendingUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { EmptyState } from "@/components/ui/empty-state";
import { ErrorState } from "@/components/ui/error-state";
import { ScoreBadge, SCORE_BAR_CLASSES, scoreTone } from "./score-badge";
import { InterviewTypeIcon } from "@/components/interview/interview-type-badge";
import { useApiResource } from "@/hooks";
import { interviewsApi } from "@/lib/api";
import { formatDate, formatDuration } from "@/lib/format";
import { cn } from "@/lib/utils";

export function ReportsOverview() {
  const { data, error, isLoading, refetch } = useApiResource(
    (signal) =>
      interviewsApi.listInterviews(
        { status: "completed", sort: "recent", pageSize: 50 },
        { signal, latencyMs: 450 },
      ),
    [],
    { subscribeToMutations: true },
  );

  if (error) return <ErrorState message={error} onRetry={refetch} />;

  if (isLoading || !data) {
    return (
      <div className="space-y-3">
        {Array.from({ length: 5 }).map((_, index) => (
          <Skeleton key={index} className="h-[86px] rounded-xl" />
        ))}
      </div>
    );
  }

  if (data.items.length === 0) {
    return (
      <EmptyState
        icon={PieChart}
        title="No reports yet"
        description="Reports are generated automatically the moment a mock interview ends."
        action={
          <Button asChild size="sm">
            <Link href="/dashboard/practice">Start Mock Interview</Link>
          </Button>
        }
      />
    );
  }

  const scores = data.items.map((item) => item.score ?? 0);
  const average = Math.round(scores.reduce((sum, value) => sum + value, 0) / scores.length);
  const best = Math.max(...scores);

  return (
    <div className="space-y-6">
      <div className="grid gap-3 sm:grid-cols-3">
        <SummaryTile label="Reports available" value={data.items.length} />
        <SummaryTile label="Average score" value={average} suffix="/ 100" />
        <SummaryTile label="Best score" value={best} suffix="/ 100" icon />
      </div>

      <div className="space-y-3">
        {data.items.map((interview) => (
          <Link key={interview.id} href={`/dashboard/interviews/${interview.id}/report`}>
            <Card className="group p-4 transition-all hover:border-border-strong hover:shadow-sm">
              <div className="flex items-center gap-4">
                <span className="flex size-10 shrink-0 items-center justify-center rounded-lg border border-border bg-muted">
                  <InterviewTypeIcon type={interview.type} className="size-4" />
                </span>

                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium">{interview.title}</p>
                  <p className="mt-0.5 truncate text-xs text-muted-foreground">
                    {formatDate(interview.completedAt ?? interview.createdAt)} ·{" "}
                    {formatDuration(interview.duration)} · {interview.questionCount} questions
                  </p>
                  <div className="mt-2 h-1 max-w-[220px] overflow-hidden rounded-full bg-muted">
                    <div
                      className={cn(
                        "h-full rounded-full",
                        SCORE_BAR_CLASSES[scoreTone(interview.score ?? 0)],
                      )}
                      style={{ width: `${interview.score ?? 0}%` }}
                    />
                  </div>
                </div>

                <ScoreBadge score={interview.score} showTotal />
                <ArrowRight className="size-4 shrink-0 text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100" />
              </div>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}

function SummaryTile({
  label,
  value,
  suffix,
  icon,
}: {
  label: string;
  value: number;
  suffix?: string;
  icon?: boolean;
}) {
  return (
    <Card className="p-5">
      <p className="flex items-center gap-2 text-[13px] font-medium text-muted-foreground">
        {icon ? <TrendingUp className="size-4" strokeWidth={1.9} /> : null}
        {label}
      </p>
      <p className="mt-3 flex items-baseline gap-1">
        <span className="text-2xl font-semibold tracking-tight tabular-nums">{value}</span>
        {suffix ? <span className="text-sm text-muted-foreground">{suffix}</span> : null}
      </p>
    </Card>
  );
}
