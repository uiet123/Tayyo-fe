import type { Interview, InterviewReport } from "@/types";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ScoreRing } from "./score-ring";
import { InterviewTypeBadge } from "@/components/interview/interview-type-badge";
import { formatDateTime, formatDuration } from "@/lib/format";

export function ScoreOverview({
  report,
  interview,
}: {
  report: InterviewReport;
  interview: Interview;
}) {
  return (
    <Card className="p-6 sm:p-8">
      <div className="flex flex-col items-center gap-8 sm:flex-row sm:items-start">
        <ScoreRing score={report.overallScore} />

        <div className="min-w-0 flex-1 text-center sm:text-left">
          <div className="flex flex-wrap items-center justify-center gap-2 sm:justify-start">
            <Badge variant="brand">Overall score</Badge>
            <Badge variant="outline">Top {100 - report.percentile}% for this role</Badge>
          </div>

          <h2 className="mt-4 text-xl font-semibold tracking-tight">{interview.title}</h2>
          <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{report.summary}</p>

          <dl className="mt-6 grid grid-cols-2 gap-x-6 gap-y-4 sm:grid-cols-4">
            <Meta label="Type">
              <InterviewTypeBadge type={interview.type} className="text-foreground" />
            </Meta>
            <Meta label="Duration">{formatDuration(interview.duration)}</Meta>
            <Meta label="Questions">{report.questions.length}</Meta>
            <Meta label="Credits used">{interview.creditsUsed}</Meta>
          </dl>

          <p className="mt-6 text-xs text-muted-foreground">
            Generated {formatDateTime(report.generatedAt)}
          </p>
        </div>
      </div>
    </Card>
  );
}

function Meta({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <dt className="text-[11px] font-medium uppercase tracking-wide text-muted-foreground">
        {label}
      </dt>
      <dd className="mt-1 text-sm font-medium text-foreground">{children}</dd>
    </div>
  );
}
