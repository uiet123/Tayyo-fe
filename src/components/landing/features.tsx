import { landingFeatures } from "@/lib/mock-data";
import { resolveIcon } from "@/components/shared/icon";
import { Section, SectionHeading } from "./section";

export function Features() {
  return (
    <Section id="features" className="bg-card">
      <SectionHeading
        eyebrow="Key features"
        title="Everything you need to walk in prepared"
        description="Built for candidates who want honest feedback, not encouragement."
      />

      <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {landingFeatures.map((feature) => {
          const Icon = resolveIcon(feature.icon);
          return (
            <div
              key={feature.title}
              className="group rounded-xl border border-border bg-background p-6 transition-colors hover:border-border-strong"
            >
              <span className="flex size-9 items-center justify-center rounded-lg border border-border bg-muted transition-colors group-hover:border-brand-border group-hover:bg-brand-subtle">
                <Icon
                  className="size-4 text-muted-foreground transition-colors group-hover:text-primary"
                  strokeWidth={1.9}
                />
              </span>
              <h3 className="mt-5 text-[15px] font-semibold tracking-tight">{feature.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                {feature.description}
              </p>
            </div>
          );
        })}
      </div>
    </Section>
  );
}
