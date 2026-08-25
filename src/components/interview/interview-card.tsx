import Link from "next/link";
import { ArrowRight, Building2, Clock } from "lucide-react";
import type { Interview } from "@/types";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { formatDate, formatDuration } from "@/lib/format";
import { InterviewStatusBadge } from "./interview-status-badge";
import { InterviewTypeBadge, InterviewTypeIcon } from "./interview-type-badge";
import { ScoreBadge } from "@/components/reports/score-badge";

/** Row used on the dashboard and anywhere a compact interview summary is needed. */
export function InterviewCard({ interview }: { interview: Interview }) {
  const href =
    interview.status === "completed"
      ? `/dashboard/interviews/${interview.id}/report`
      : interview.status === "in-progress"
        ? `/dashboard/interview/${interview.id}`
        : `/dashboard/interviews`;

  return (
    <Link href={href} className="group block">
      <Card className="p-4 transition-all hover:border-border-strong hover:shadow-sm">
        <div className="flex items-center gap-4">
          <span className="flex size-10 shrink-0 items-center justify-center rounded-lg border border-border bg-muted">
            <InterviewTypeIcon type={interview.type} className="size-4 text-foreground" />
          </span>

          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-medium text-foreground">{interview.title}</p>
            <div className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-muted-foreground">
              <InterviewTypeBadge type={interview.type} />
              {interview.company ? (
                <span className="flex items-center gap-1.5">
                  <Building2 className="size-3.5" />
                  {interview.company}
                </span>
              ) : null}
              <span className="flex items-center gap-1.5">
                <Clock className="size-3.5" />
                {formatDuration(interview.duration)}
              </span>
              <span className="hidden sm:inline">{formatDate(interview.createdAt)}</span>
            </div>
          </div>

          <div className="hidden shrink-0 sm:block">
            <InterviewStatusBadge status={interview.status} />
          </div>

          <div className="flex shrink-0 items-center gap-3">
            <ScoreBadge score={interview.score} />
            <ArrowRight className="size-4 text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100" />
          </div>
        </div>
      </Card>
    </Link>
  );
}

export function InterviewCardSkeleton() {
  return (
    <Card className="p-4">
      <div className="flex items-center gap-4">
        <Skeleton className="size-10 rounded-lg" />
        <div className="min-w-0 flex-1 space-y-2">
          <Skeleton className="h-4 w-52 max-w-full" />
          <Skeleton className="h-3 w-72 max-w-full" />
        </div>
        <Skeleton className="hidden h-6 w-24 rounded-full sm:block" />
        <Skeleton className="h-6 w-10 rounded-md" />
      </div>
    </Card>
  );
}
