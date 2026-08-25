import Link from "next/link";
import { ArrowUpRight, FileText, ListChecks, Mic, PieChart } from "lucide-react";
import { Card } from "@/components/ui/card";

const ACTIONS = [
  {
    href: "/dashboard/practice",
    title: "Start Mock Interview",
    description: "Full AI round with follow-ups",
    icon: Mic,
    primary: true,
  },
  {
    href: "/dashboard/practice?mode=questions",
    title: "Practice Questions",
    description: "One question at a time",
    icon: ListChecks,
  },
  {
    href: "/dashboard/resume",
    title: "Upload Resume",
    description: "Make questions role-aware",
    icon: FileText,
  },
  {
    href: "/dashboard/reports",
    title: "View Reports",
    description: "Scores and feedback",
    icon: PieChart,
  },
];

export function QuickActions() {
  return (
    <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
      {ACTIONS.map((action) => (
        <Link key={action.href} href={action.href} className="group">
          <Card
            className={
              action.primary
                ? "h-full border-primary/30 p-5 transition-all hover:border-primary/50 hover:shadow-sm"
                : "h-full p-5 transition-all hover:border-border-strong hover:shadow-sm"
            }
          >
            <div className="flex items-start justify-between gap-3">
              <span
                className={
                  action.primary
                    ? "flex size-9 items-center justify-center rounded-lg bg-primary text-primary-foreground"
                    : "flex size-9 items-center justify-center rounded-lg border border-border bg-muted text-foreground"
                }
              >
                <action.icon className="size-4" strokeWidth={1.9} />
              </span>
              <ArrowUpRight className="size-4 text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100" />
            </div>
            <p className="mt-4 text-sm font-semibold tracking-tight">{action.title}</p>
            <p className="mt-1 text-xs text-muted-foreground">{action.description}</p>
          </Card>
        </Link>
      ))}
    </div>
  );
}
