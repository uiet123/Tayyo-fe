import { createElement } from "react";
import type { InterviewTypeId } from "@/types";
import { INTERVIEW_TYPE_MAP } from "@/lib/constants";
import { resolveIcon } from "@/components/shared/icon";
import { cn } from "@/lib/utils";

export function InterviewTypeIcon({
  type,
  className,
}: {
  type: InterviewTypeId;
  className?: string;
}) {
  return createElement(resolveIcon(INTERVIEW_TYPE_MAP[type]?.icon ?? "Sparkles"), {
    className,
    strokeWidth: 1.9,
  });
}

export function InterviewTypeBadge({
  type,
  className,
}: {
  type: InterviewTypeId;
  className?: string;
}) {
  const meta = INTERVIEW_TYPE_MAP[type];
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 text-xs font-medium text-muted-foreground",
        className,
      )}
    >
      <InterviewTypeIcon type={type} className="size-3.5" />
      {meta?.label ?? "Interview"}
    </span>
  );
}
