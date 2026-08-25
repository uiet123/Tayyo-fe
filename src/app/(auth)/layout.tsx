import Link from "next/link";
import { ArrowLeft, Quote } from "lucide-react";
import { Logo } from "@/components/shared/logo";
import { BRAND } from "@/lib/constants";
import { testimonials, trustStats } from "@/lib/mock-data";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  const highlight = testimonials[0];

  return (
    <div className="grid min-h-dvh lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
      <div className="flex flex-col px-6 py-8 sm:px-10">
        <div className="flex items-center justify-between">
          <Logo />
          <Link
            href="/"
            className="flex items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground"
          >
            <ArrowLeft className="size-3.5" />
            Back to home
          </Link>
        </div>

        <div className="flex flex-1 items-center justify-center py-12">
          <div className="w-full max-w-sm">{children}</div>
        </div>

        <p className="text-center text-xs text-muted-foreground">
          By continuing you agree to the Tayyo Terms of Service and Privacy Policy.
        </p>
      </div>

      {/* Brand panel — desktop only, deliberately typographic rather than illustrated. */}
      <div className="relative hidden flex-col justify-between overflow-hidden border-l border-border bg-card p-12 lg:flex">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 bg-grid opacity-70 [mask-image:radial-gradient(ellipse_70%_60%_at_50%_20%,black,transparent)]"
        />

        <div className="relative">
          <p className="text-xs font-semibold uppercase tracking-[0.14em] text-primary">
            {BRAND.positioning}
          </p>
          <p className="mt-6 max-w-md text-3xl font-semibold leading-tight tracking-[-0.03em]">
            {BRAND.tagline}
          </p>
          <p className="mt-4 max-w-sm text-[15px] leading-relaxed text-muted-foreground">
            {BRAND.subheadline}
          </p>
        </div>

        <div className="relative">
          <figure className="max-w-md rounded-xl border border-border bg-background p-6">
            <Quote className="size-4 text-primary" />
            <blockquote className="mt-4 text-[15px] leading-relaxed text-foreground/90">
              {highlight.quote}
            </blockquote>
            <figcaption className="mt-5 border-t border-border pt-4 text-sm">
              <span className="font-medium text-foreground">{highlight.name}</span>
              <span className="text-muted-foreground"> · {highlight.role}</span>
            </figcaption>
          </figure>

          <dl className="mt-10 grid grid-cols-3 gap-6">
            {trustStats.slice(0, 3).map((stat) => (
              <div key={stat.label}>
                <dt className="text-xl font-semibold tracking-tight tabular-nums">{stat.value}</dt>
                <dd className="mt-1 text-xs text-muted-foreground">{stat.label}</dd>
              </div>
            ))}
          </dl>
        </div>
      </div>
    </div>
  );
}
