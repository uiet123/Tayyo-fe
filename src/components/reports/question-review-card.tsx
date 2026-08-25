"use client";

import { useState } from "react";
import { ChevronDown, MessageSquareQuote, Sparkles, User } from "lucide-react";
import type { QuestionReview } from "@/types";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ScoreBadge } from "./score-badge";
import { formatClock } from "@/lib/format";
import { cn } from "@/lib/utils";

export function QuestionReviewCard({
  review,
  defaultOpen = false,
}: {
  review: QuestionReview;
  defaultOpen?: boolean;
}) {
  const [open, setOpen] = useState(defaultOpen);
  const contentId = `question-review-${review.id}`;

  return (
    <Card className="overflow-hidden">
      <button
        type="button"
        onClick={() => setOpen((value) => !value)}
        aria-expanded={open}
        aria-controls={contentId}
        className="flex w-full items-start gap-4 p-5 text-left transition-colors hover:bg-muted/40"
      >
        <span className="mt-0.5 flex size-7 shrink-0 items-center justify-center rounded-full border border-border bg-muted font-mono text-xs font-medium text-muted-foreground">
          {review.index}
        </span>

        <span className="min-w-0 flex-1">
          <span className="block text-sm font-medium leading-relaxed text-foreground">
            {review.question}
          </span>
          <span className="mt-2 flex flex-wrap items-center gap-2">
            <Badge variant="outline">{review.category}</Badge>
            <span className="font-mono text-[11px] tabular-nums text-muted-foreground">
              {formatClock(review.durationSeconds)} spent
            </span>
          </span>
        </span>

        <span className="flex shrink-0 items-center gap-3">
          <ScoreBadge score={review.score} />
          <ChevronDown
            className={cn(
              "size-4 text-muted-foreground transition-transform duration-200",
              open && "rotate-180",
            )}
          />
        </span>
      </button>

      {open ? (
        <div id={contentId} className="space-y-5 border-t border-border p-5">
          <ReviewBlock
            icon={User}
            label="Your response"
            className="border-border bg-muted/40"
            text={review.userResponse}
          />
          <ReviewBlock
            icon={MessageSquareQuote}
            label="AI feedback"
            className="border-warning/20 bg-warning-subtle"
            iconClassName="text-warning"
            text={review.aiFeedback}
          />
          <ReviewBlock
            icon={Sparkles}
            label="Suggested improved response"
            className="border-brand-border bg-brand-subtle"
            iconClassName="text-primary"
            text={review.suggestedResponse}
          />
        </div>
      ) : null}
    </Card>
  );
}

function ReviewBlock({
  icon: Icon,
  label,
  text,
  className,
  iconClassName,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  text: string;
  className?: string;
  iconClassName?: string;
}) {
  return (
    <div className={cn("rounded-lg border p-4", className)}>
      <p className="flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.12em] text-muted-foreground">
        <Icon className={cn("size-3.5", iconClassName)} />
        {label}
      </p>
      <p className="mt-2.5 text-sm leading-relaxed text-foreground/85">{text}</p>
    </div>
  );
}
