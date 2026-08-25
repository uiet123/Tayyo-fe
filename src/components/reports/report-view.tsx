"use client";

import Link from "next/link";
import { ArrowLeft, Download, RotateCw, Share2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { ErrorState } from "@/components/ui/error-state";
import { ScoreOverview } from "./score-overview";
import { ScoreBreakdown } from "./score-breakdown";
import { FeedbackList } from "./feedback-list";
import { QuestionReviewCard } from "./question-review-card";
import { useApiResource } from "@/hooks";
import { interviewsApi } from "@/lib/api";

export function ReportView({ interviewId }: { interviewId: string }) {
  const {
    data: interview,
    error: interviewError,
    isLoading: interviewLoading,
    refetch: refetchInterview,
  } = useApiResource(
    (signal) => interviewsApi.getInterview(interviewId, { signal, latencyMs: 350 }),
    [interviewId],
  );

  const {
    data: report,
    error: reportError,
    isLoading: reportLoading,
    refetch: refetchReport,
  } = useApiResource(
    (signal) => interviewsApi.getInterviewReport(interviewId, { signal, latencyMs: 650 }),
    [interviewId],
  );

  const error = interviewError ?? reportError;

  if (error) {
    return (
      <div className="space-y-6">
        <BackLink />
        <ErrorState
          title="Report unavailable"
          message={error}
          onRetry={() => {
            refetchInterview();
            refetchReport();
          }}
        />
      </div>
    );
  }

  if (interviewLoading || reportLoading || !report || !interview) {
    return <ReportSkeleton />;
  }

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <BackLink />

        <div className="flex flex-wrap items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() =>
              toast("Sharing is coming soon", {
                description: "You will be able to send a read-only report link.",
              })
            }
          >
            <Share2 />
            Share
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() =>
              toast("PDF export is coming soon", {
                description: "Reports will be downloadable once exports ship.",
              })
            }
          >
            <Download />
            Export
          </Button>
          <Button asChild size="sm">
            <Link href="/dashboard/practice">
              <RotateCw />
              Practice Again
            </Link>
          </Button>
        </div>
      </div>

      <ScoreOverview report={report} interview={interview} />

      <div className="grid gap-6 lg:grid-cols-[minmax(0,1.15fr)_minmax(0,1fr)]">
        <ScoreBreakdown items={report.breakdown} />
        <div className="space-y-6">
          <FeedbackList variant="strengths" items={report.strengths} />
          <FeedbackList variant="improvements" items={report.improvements} />
        </div>
      </div>

      <section className="space-y-4">
        <div>
          <h2 className="text-base font-semibold tracking-tight">Question-by-question review</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Expand any question to see what you said, what to fix, and a stronger version of the
            answer.
          </p>
        </div>

        <div className="space-y-3">
          {report.questions.map((review, index) => (
            <QuestionReviewCard key={review.id} review={review} defaultOpen={index === 0} />
          ))}
        </div>
      </section>

      <Card className="flex flex-col items-start gap-4 p-6 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-sm font-semibold tracking-tight">Run this round again</p>
          <p className="mt-1 text-sm text-muted-foreground">
            The fastest way to move a weak dimension is to repeat the same round within a week.
          </p>
        </div>
        <Button asChild className="shrink-0">
          <Link href="/dashboard/practice">
            <RotateCw />
            Practice Again
          </Link>
        </Button>
      </Card>
    </div>
  );
}

function BackLink() {
  return (
    <Link
      href="/dashboard/interviews"
      className="inline-flex items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground"
    >
      <ArrowLeft className="size-3.5" />
      All interviews
    </Link>
  );
}

function ReportSkeleton() {
  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <Skeleton className="h-4 w-28" />
        <Skeleton className="h-8 w-40" />
      </div>

      <Card className="p-8">
        <div className="flex flex-col items-center gap-8 sm:flex-row sm:items-start">
          <Skeleton className="size-[148px] rounded-full" />
          <div className="flex-1 space-y-3">
            <Skeleton className="h-5 w-40" />
            <Skeleton className="h-6 w-64" />
            <Skeleton className="h-4 w-full max-w-lg" />
            <Skeleton className="h-4 w-3/4 max-w-md" />
          </div>
        </div>
      </Card>

      <div className="grid gap-6 lg:grid-cols-2">
        <Skeleton className="h-[380px] rounded-xl" />
        <div className="space-y-6">
          <Skeleton className="h-[180px] rounded-xl" />
          <Skeleton className="h-[180px] rounded-xl" />
        </div>
      </div>

      <div className="space-y-3">
        {Array.from({ length: 4 }).map((_, index) => (
          <Skeleton key={index} className="h-[92px] rounded-xl" />
        ))}
      </div>
    </div>
  );
}
