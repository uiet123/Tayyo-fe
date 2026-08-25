"use client";

import Link from "next/link";
import { ArrowRight, MessagesSquare } from "lucide-react";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/empty-state";
import { ErrorState } from "@/components/ui/error-state";
import { InterviewCard, InterviewCardSkeleton } from "@/components/interview/interview-card";
import { useApiResource } from "@/hooks";
import { interviewsApi } from "@/lib/api";

export function RecentInterviews({ limit = 5 }: { limit?: number }) {
  const { data, error, isLoading, refetch } = useApiResource(
    (signal) => interviewsApi.getRecentInterviews(limit, { signal }),
    [limit],
    { subscribeToMutations: true },
  );

  return (
    <section className="space-y-4">
      <div className="flex items-center justify-between gap-3">
        <div>
          <h2 className="text-base font-semibold tracking-tight">Recent interviews</h2>
          <p className="mt-0.5 text-sm text-muted-foreground">
            Your latest sessions and how they scored.
          </p>
        </div>
        <Button asChild variant="ghost" size="sm">
          <Link href="/dashboard/interviews">
            View all
            <ArrowRight />
          </Link>
        </Button>
      </div>

      {error ? (
        <ErrorState compact message={error} onRetry={refetch} />
      ) : isLoading ? (
        <div className="space-y-3">
          {Array.from({ length: 3 }).map((_, index) => (
            <InterviewCardSkeleton key={index} />
          ))}
        </div>
      ) : data && data.length > 0 ? (
        <div className="space-y-3">
          {data.map((interview) => (
            <InterviewCard key={interview.id} interview={interview} />
          ))}
        </div>
      ) : (
        <EmptyState
          compact
          icon={MessagesSquare}
          title="No interviews yet"
          description="Run your first mock interview to see how your answers hold up under follow-up questions."
          action={
            <Button asChild size="sm">
              <Link href="/dashboard/practice">Start Mock Interview</Link>
            </Button>
          }
        />
      )}
    </section>
  );
}
