"use client";

import { Flame, ListChecks, MessagesSquare, Target } from "lucide-react";
import { ErrorState } from "@/components/ui/error-state";
import { StatCard, StatCardSkeleton } from "./stat-card";
import { useApiResource } from "@/hooks";
import { userApi } from "@/lib/api";
import { formatNumber } from "@/lib/format";

export function PreparationOverview() {
  const { data, error, isLoading, refetch } = useApiResource(
    (signal) => userApi.getPreparationStats({ signal, latencyMs: 500 }),
    [],
  );

  if (error) return <ErrorState compact message={error} onRetry={refetch} />;

  if (isLoading || !data) {
    return (
      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        {Array.from({ length: 4 }).map((_, index) => (
          <StatCardSkeleton key={index} />
        ))}
      </div>
    );
  }

  return (
    <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
      <StatCard
        label="Interviews completed"
        value={data.interviewsCompleted}
        icon={MessagesSquare}
        delta={data.interviewsDelta}
      />
      <StatCard
        label="Average score"
        value={data.averageScore}
        suffix="/ 100"
        icon={Target}
        delta={data.scoreDelta}
      />
      <StatCard
        label="Questions practised"
        value={formatNumber(data.questionsPracticed)}
        icon={ListChecks}
        delta={data.questionsDelta}
      />
      <StatCard
        label="Current streak"
        value={data.currentStreakDays}
        suffix={data.currentStreakDays === 1 ? "day" : "days"}
        icon={Flame}
      />
    </div>
  );
}
