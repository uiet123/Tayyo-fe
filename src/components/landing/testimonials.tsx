import { testimonials } from "@/lib/mock-data";
import { initials } from "@/lib/utils";
import { Section, SectionHeading } from "./section";

export function Testimonials() {
  return (
    <Section className="bg-card">
      <SectionHeading
        eyebrow="Social proof"
        title="What candidates say after their first loop"
        description="Early access feedback from candidates preparing across engineering and product roles."
      />

      <div className="mt-14 grid gap-5 md:grid-cols-2">
        {testimonials.map((item) => (
          <figure
            key={item.id}
            className="flex flex-col justify-between rounded-xl border border-border bg-background p-6"
          >
            <blockquote className="text-[15px] leading-relaxed text-foreground/90">
              {item.quote}
            </blockquote>
            <figcaption className="mt-6 flex items-center gap-3 border-t border-border pt-5">
              <span className="flex size-9 items-center justify-center rounded-full bg-brand-subtle text-xs font-semibold text-primary">
                {initials(item.name)}
              </span>
              <span className="min-w-0">
                <span className="block text-sm font-medium text-foreground">{item.name}</span>
                <span className="block text-xs text-muted-foreground">{item.role}</span>
              </span>
              <span className="ml-auto shrink-0 rounded-full border border-border px-2.5 py-1 text-[11px] text-muted-foreground">
                {item.outcome}
              </span>
            </figcaption>
          </figure>
        ))}
      </div>
    </Section>
  );
}
