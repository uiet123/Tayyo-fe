import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { INTERVIEW_TYPES } from "@/lib/constants";
import { resolveIcon } from "@/components/shared/icon";
import { Section, SectionHeading } from "./section";

export function InterviewTypes() {
  return (
    <Section id="interview-types">
      <SectionHeading
        eyebrow="Interview types"
        title="Every round you are likely to face"
        description="From the HR screen to the final system design loop, tuned to fresher through senior level."
      />

      <div className="mt-14 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {INTERVIEW_TYPES.map((type) => {
          const Icon = resolveIcon(type.icon);
          return (
            <Link
              key={type.id}
              href="/signup"
              className="group flex flex-col rounded-xl border border-border bg-card p-6 transition-all hover:border-border-strong hover:shadow-sm"
            >
              <div className="flex items-center justify-between">
                <span className="flex size-9 items-center justify-center rounded-lg border border-border bg-muted">
                  <Icon className="size-4 text-foreground" strokeWidth={1.9} />
                </span>
                <ArrowRight className="size-4 -translate-x-1 text-muted-foreground opacity-0 transition-all group-hover:translate-x-0 group-hover:opacity-100" />
              </div>
              <h3 className="mt-5 text-[15px] font-semibold tracking-tight">{type.label}</h3>
              <p className="mt-2 flex-1 text-sm leading-relaxed text-muted-foreground">
                {type.description}
              </p>
              <div className="mt-5 flex flex-wrap gap-1.5">
                {type.sampleFocus.slice(0, 3).map((focus) => (
                  <span
                    key={focus}
                    className="rounded-full border border-border px-2 py-0.5 text-[11px] text-muted-foreground"
                  >
                    {focus}
                  </span>
                ))}
              </div>
            </Link>
          );
        })}
      </div>
    </Section>
  );
}
