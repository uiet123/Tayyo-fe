"use client";

import { useState } from "react";
import { Eye, EyeOff, Lightbulb, Sparkles } from "lucide-react";
import type { InterviewQuestion } from "@/types";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface AiCoachPanelProps {
  question?: InterviewQuestion;
  className?: string;
}

/**
 * Live coaching rail. Suggestions are mock content — the real panel will stream
 * from the model as the candidate speaks.
 */
export function AiCoachPanel({ question, className }: AiCoachPanelProps) {
  const [revealed, setRevealed] = useState(false);

  return (
    <div className={cn("flex h-full flex-col bg-card", className)}>
      <div className="flex shrink-0 items-center justify-between gap-3 border-b border-border px-5 py-3.5">
        <p className="flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.12em] text-primary">
          <Sparkles className="size-3.5" />
          AI Coach
        </p>
        <Badge variant="outline">Live</Badge>
      </div>

      <div className="thin-scrollbar min-h-0 flex-1 space-y-6 overflow-y-auto px-5 py-5">
        {question ? (
          <>
            <section>
              <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-muted-foreground">
                What good looks like
              </p>
              <ul className="mt-3 space-y-2.5">
                {question.hints.map((hint) => (
                  <li
                    key={hint}
                    className="flex items-start gap-2.5 rounded-lg border border-brand-border bg-brand-subtle p-3"
                  >
                    <Lightbulb className="mt-0.5 size-3.5 shrink-0 text-primary" />
                    <span className="text-[13px] leading-relaxed text-foreground/85">{hint}</span>
                  </li>
                ))}
              </ul>
            </section>

            <section>
              <div className="flex items-center justify-between gap-3">
                <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-muted-foreground">
                  Suggested response
                </p>
                <Button
                  type="button"
                  size="sm"
                  variant="ghost"
                  onClick={() => setRevealed((value) => !value)}
                >
                  {revealed ? <EyeOff /> : <Eye />}
                  {revealed ? "Hide" : "Reveal"}
                </Button>
              </div>

              <div className="relative mt-3">
                <p
                  className={cn(
                    "rounded-lg border border-border bg-muted/40 p-4 text-[13px] leading-relaxed text-muted-foreground transition-all",
                    revealed ? "" : "select-none blur-[5px]",
                  )}
                >
                  {question.suggestedAnswer}
                </p>
                {revealed ? null : (
                  <button
                    type="button"
                    onClick={() => setRevealed(true)}
                    className="absolute inset-0 flex items-center justify-center rounded-lg text-xs font-medium text-foreground"
                  >
                    <span className="rounded-full border border-border bg-card px-3 py-1.5 shadow-sm">
                      Tap to reveal
                    </span>
                  </button>
                )}
              </div>

              <p className="mt-3 text-[11px] leading-relaxed text-muted-foreground">
                Try answering first. Revealing early is the fastest way to sound rehearsed instead
                of prepared.
              </p>
            </section>

            <section className="rounded-lg border border-border p-4">
              <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-muted-foreground">
                Question focus
              </p>
              <div className="mt-3 flex flex-wrap gap-1.5">
                <Badge variant="default">{question.category}</Badge>
                <Badge variant="outline">{question.difficulty}</Badge>
              </div>
            </section>
          </>
        ) : (
          <p className="text-sm text-muted-foreground">Waiting for the interviewer…</p>
        )}
      </div>
    </div>
  );
}
