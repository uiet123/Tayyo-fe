import { howItWorksSteps } from "@/lib/mock-data";
import { resolveIcon } from "@/components/shared/icon";
import { Section, SectionHeading } from "./section";

export function HowItWorks() {
  return (
    <Section id="how-it-works">
      <SectionHeading
        eyebrow="How Tayyo works"
        title="Three steps between you and a better answer"
        description="Set up the round, sit it like the real thing, then read exactly what to fix. Most people see their weakest dimension move by the third session."
      />

      <ol className="mt-14 grid gap-px overflow-hidden rounded-xl border border-border bg-border md:grid-cols-3">
        {howItWorksSteps.map((step) => {
          const Icon = resolveIcon(step.icon);
          return (
            <li key={step.step} className="bg-card p-7">
              <div className="flex items-center gap-3">
                <span className="flex size-9 items-center justify-center rounded-lg border border-brand-border bg-brand-subtle">
                  <Icon className="size-4 text-primary" strokeWidth={1.9} />
                </span>
                <span className="font-mono text-xs font-medium text-muted-foreground">
                  0{step.step}
                </span>
              </div>
              <h3 className="mt-5 text-base font-semibold tracking-tight">{step.title}</h3>
              <p className="mt-2.5 text-sm leading-relaxed text-muted-foreground">
                {step.description}
              </p>
            </li>
          );
        })}
      </ol>
    </Section>
  );
}
