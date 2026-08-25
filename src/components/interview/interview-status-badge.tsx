import { CheckCircle2, CircleDashed, CircleDot, XCircle } from "lucide-react";
import type { InterviewStatus } from "@/types";
import { Badge } from "@/components/ui/badge";

const STATUS_CONFIG = {
  completed: { label: "Completed", variant: "success", Icon: CheckCircle2 },
  "in-progress": { label: "In progress", variant: "brand", Icon: CircleDot },
  scheduled: { label: "Scheduled", variant: "info", Icon: CircleDashed },
  abandoned: { label: "Abandoned", variant: "outline", Icon: XCircle },
} as const;

export function InterviewStatusBadge({ status }: { status: InterviewStatus }) {
  const config = STATUS_CONFIG[status];
  return (
    <Badge variant={config.variant}>
      <config.Icon />
      {config.label}
    </Badge>
  );
}
