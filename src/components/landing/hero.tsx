import Link from "next/link";
import { ArrowRight, PlayCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { BRAND } from "@/lib/constants";
import { trustStats } from "@/lib/mock-data";
import { HeroPreview } from "./hero-preview";

export function Hero() {
  return (
    <section className="relative overflow-hidden">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-[520px] bg-grid [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,black,transparent)]"
      />

      <div className="mx-auto w-full max-w-6xl px-6 pb-20 pt-16 sm:pt-24">
        <div className="mx-auto max-w-3xl text-center">
          <Link
            href="/#how-it-works"
            className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-3 py-1.5 text-xs font-medium text-muted-foreground shadow-xs transition-colors hover:border-border-strong hover:text-foreground"
          >
            <span className="size-1.5 rounded-full bg-primary" />
            {BRAND.positioning}
            <ArrowRight className="size-3" />
          </Link>

          <h1 className="mt-7 text-[2.75rem] font-semibold leading-[1.05] tracking-[-0.035em] sm:text-6xl">
            {BRAND.tagline}
          </h1>

          <p className="mx-auto mt-6 max-w-xl text-balance text-[17px] leading-relaxed text-muted-foreground">
            {BRAND.subheadline}
          </p>

          <div className="mt-9 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Button asChild size="lg" className="w-full sm:w-auto">
              <Link href="/signup">
                Start Practicing
                <ArrowRight />
              </Link>
            </Button>
            <Button asChild size="lg" variant="secondary" className="w-full sm:w-auto">
              <Link href="/#how-it-works">
                <PlayCircle />
                See How It Works
              </Link>
            </Button>
          </div>

          <p className="mt-5 text-xs text-muted-foreground">
            No subscription. Buy credits, use them at your pace.
          </p>
        </div>

        <div className="mt-16 sm:mt-20">
          <HeroPreview />
        </div>

        <dl className="mt-16 grid grid-cols-2 gap-x-6 gap-y-8 border-t border-border pt-10 sm:mt-20 lg:grid-cols-4">
          {trustStats.map((stat) => (
            <div key={stat.label}>
              <dt className="text-2xl font-semibold tracking-tight tabular-nums">{stat.value}</dt>
              <dd className="mt-1 text-[13px] text-muted-foreground">{stat.label}</dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}
