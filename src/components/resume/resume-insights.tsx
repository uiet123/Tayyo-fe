import { Briefcase, FolderGit2, Sparkles, TriangleAlert } from "lucide-react";
import type { ResumeInsights } from "@/types";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

const CATEGORY_LABELS = {
  language: "Languages",
  framework: "Frameworks",
  tool: "Tools",
  concept: "Concepts",
  soft: "Soft skills",
} as const;

export function ResumeInsightsPanel({ insights }: { insights: ResumeInsights }) {
  const grouped = insights.skills.reduce<Record<string, typeof insights.skills>>((acc, skill) => {
    acc[skill.category] = [...(acc[skill.category] ?? []), skill];
    return acc;
  }, {});

  return (
    <section className="space-y-4">
      <div>
        <h2 className="text-base font-semibold tracking-tight">Resume insights</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          What Tayyo picked up from your resume. Full parsing lands with the analysis engine.
        </p>
      </div>

      <Card className="p-5 sm:p-6">
        <p className="text-[15px] font-medium leading-relaxed">{insights.headline}</p>
        <p className="mt-2 text-sm text-muted-foreground">
          Approximately {insights.yearsOfExperience} years of experience detected.
        </p>

        <Separator className="my-6" />

        <h3 className="text-[11px] font-semibold uppercase tracking-[0.12em] text-muted-foreground">
          Skills detected
        </h3>
        <div className="mt-4 space-y-4">
          {Object.entries(grouped).map(([category, skills]) => (
            <div key={category}>
              <p className="text-xs font-medium text-muted-foreground">
                {CATEGORY_LABELS[category as keyof typeof CATEGORY_LABELS] ?? category}
              </p>
              <div className="mt-2 flex flex-wrap gap-1.5">
                {skills.map((skill) => (
                  <span
                    key={skill.name}
                    title={`${skill.confidence}% confidence`}
                    className="inline-flex items-center gap-1.5 rounded-full border border-border bg-card px-2.5 py-1 text-xs"
                  >
                    {skill.name}
                    <span className="text-[10px] tabular-nums text-muted-foreground">
                      {skill.confidence}
                    </span>
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </Card>

      <div className="grid gap-4 lg:grid-cols-2">
        <Card className="p-5 sm:p-6">
          <h3 className="flex items-center gap-2 text-[15px] font-semibold tracking-tight">
            <Briefcase className="size-4 text-muted-foreground" strokeWidth={1.9} />
            Experience
          </h3>
          <ol className="mt-5 space-y-5">
            {insights.experience.map((item) => (
              <li key={item.id} className="border-l-2 border-border pl-4">
                <p className="text-sm font-medium">{item.role}</p>
                <p className="text-xs text-muted-foreground">
                  {item.company} · {item.period}
                </p>
                <ul className="mt-2.5 space-y-1.5">
                  {item.highlights.map((highlight) => (
                    <li key={highlight} className="text-xs leading-relaxed text-muted-foreground">
                      {highlight}
                    </li>
                  ))}
                </ul>
              </li>
            ))}
          </ol>
        </Card>

        <Card className="p-5 sm:p-6">
          <h3 className="flex items-center gap-2 text-[15px] font-semibold tracking-tight">
            <FolderGit2 className="size-4 text-muted-foreground" strokeWidth={1.9} />
            Projects
          </h3>
          <ul className="mt-5 space-y-5">
            {insights.projects.map((project) => (
              <li key={project.id}>
                <p className="text-sm font-medium">{project.name}</p>
                <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
                  {project.description}
                </p>
                <div className="mt-2.5 flex flex-wrap gap-1.5">
                  {project.stack.map((tech) => (
                    <Badge key={tech} variant="outline">
                      {tech}
                    </Badge>
                  ))}
                </div>
              </li>
            ))}
          </ul>
        </Card>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <Card className="p-5 sm:p-6">
          <h3 className="flex items-center gap-2 text-[15px] font-semibold tracking-tight">
            <Sparkles className="size-4 text-success" strokeWidth={1.9} />
            Strengths
          </h3>
          <ul className="mt-4 space-y-3">
            {insights.strengths.map((item) => (
              <li key={item} className="flex items-start gap-3">
                <span className="mt-[7px] size-1.5 shrink-0 rounded-full bg-success" />
                <span className="text-sm leading-relaxed text-muted-foreground">{item}</span>
              </li>
            ))}
          </ul>
        </Card>

        <Card className="p-5 sm:p-6">
          <h3 className="flex items-center gap-2 text-[15px] font-semibold tracking-tight">
            <TriangleAlert className="size-4 text-warning" strokeWidth={1.9} />
            Worth fixing
          </h3>
          <ul className="mt-4 space-y-3">
            {insights.gaps.map((item) => (
              <li key={item} className="flex items-start gap-3">
                <span className="mt-[7px] size-1.5 shrink-0 rounded-full bg-warning" />
                <span className="text-sm leading-relaxed text-muted-foreground">{item}</span>
              </li>
            ))}
          </ul>
        </Card>
      </div>
    </section>
  );
}
