import { CheckCircle2, TrendingUp } from "lucide-react";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface FeedbackListProps {
  variant: "strengths" | "improvements";
  items: string[];
}

const CONFIG = {
  strengths: {
    title: "Strengths",
    description: "Keep doing these.",
    Icon: CheckCircle2,
    iconClass: "text-success",
    badgeClass: "border-success/20 bg-success-subtle",
  },
  improvements: {
    title: "Areas to improve",
    description: "The fastest wins for your next session.",
    Icon: TrendingUp,
    iconClass: "text-warning",
    badgeClass: "border-warning/20 bg-warning-subtle",
  },
} as const;

export function FeedbackList({ variant, items }: FeedbackListProps) {
  const config = CONFIG[variant];

  return (
    <Card className="p-5 sm:p-6">
      <div className="flex items-start gap-3">
        <span
          className={cn(
            "flex size-8 shrink-0 items-center justify-center rounded-lg border",
            config.badgeClass,
          )}
        >
          <config.Icon className={cn("size-4", config.iconClass)} strokeWidth={2} />
        </span>
        <div>
          <h2 className="text-[15px] font-semibold tracking-tight">{config.title}</h2>
          <p className="mt-0.5 text-sm text-muted-foreground">{config.description}</p>
        </div>
      </div>

      <ul className="mt-5 space-y-3">
        {items.map((item) => (
          <li key={item} className="flex items-start gap-3">
            <span
              className={cn(
                "mt-[7px] size-1.5 shrink-0 rounded-full",
                variant === "strengths" ? "bg-success" : "bg-warning",
              )}
            />
            <span className="text-sm leading-relaxed text-muted-foreground">{item}</span>
          </li>
        ))}
      </ul>
    </Card>
  );
}
