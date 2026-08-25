import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

export function CallToAction() {
  return (
    <section className="border-t border-border bg-card">
      <div className="mx-auto w-full max-w-6xl px-6 py-20 sm:py-24">
        <div className="relative overflow-hidden rounded-2xl border border-border bg-background px-8 py-14 text-center sm:px-14">
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 bg-dots opacity-[0.35] [mask-image:radial-gradient(ellipse_50%_60%_at_50%_50%,black,transparent)]"
          />
          <div className="relative">
            <h2 className="text-3xl font-semibold tracking-tight sm:text-4xl">
              Your next interview is closer than you think.
            </h2>
            <p className="mx-auto mt-4 max-w-lg text-[15px] leading-relaxed text-muted-foreground">
              Run your first mock interview today and find out what your answers actually sound like
              from the other side of the table.
            </p>
            <div className="mt-9 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <Button asChild size="lg" className="w-full sm:w-auto">
                <Link href="/signup">
                  Start Practicing
                  <ArrowRight />
                </Link>
              </Button>
              <Button asChild size="lg" variant="secondary" className="w-full sm:w-auto">
                <Link href="/pricing">View pricing</Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
