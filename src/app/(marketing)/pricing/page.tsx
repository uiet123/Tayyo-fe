import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PricingSection } from "@/components/landing/pricing-section";
import { Faq } from "@/components/landing/faq";
import { CREDIT_RATES } from "@/lib/constants";

export const metadata: Metadata = {
  title: "Pricing",
  description:
    "Credit-based pricing for Tayyo AI. Pay only for what you use, with credits that never expire.",
};

const RATE_ROWS = [
  {
    activity: "Live mock interview",
    cost: `${CREDIT_RATES.perInterviewMinute} credits / minute`,
    note: "Charged only for the minutes you actually use.",
  },
  {
    activity: "Interview report",
    cost: `${CREDIT_RATES.reportGeneration} credits`,
    note: "One-time, when your scored report is generated.",
  },
  {
    activity: "Practice question",
    cost: `${CREDIT_RATES.practiceQuestion} credit`,
    note: "Single question with instant feedback.",
  },
  {
    activity: "Resume analysis",
    cost: `${CREDIT_RATES.resumeAnalysis} credits`,
    note: "Run once per resume upload.",
  },
];

export default function PricingPage() {
  return (
    <>
      <section className="mx-auto w-full max-w-6xl px-6 pb-4 pt-16 text-center sm:pt-20">
        <p className="text-xs font-semibold uppercase tracking-[0.14em] text-primary">Pricing</p>
        <h1 className="mx-auto mt-4 max-w-2xl text-4xl font-semibold tracking-[-0.03em] sm:text-5xl">
          Pay only for what you use.
        </h1>
        <p className="mx-auto mt-5 max-w-xl text-[17px] leading-relaxed text-muted-foreground">
          Most people prepare hard for a few weeks and then stop. Tayyo is credit-based so you are
          never paying for a month you did not use.
        </p>
      </section>

      <PricingSection standalone />

      <section className="border-t border-border py-20 sm:py-24">
        <div className="mx-auto w-full max-w-3xl px-6">
          <h2 className="text-2xl font-semibold tracking-tight">How credits are spent</h2>
          <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
            Credits can be used across every AI interview session on Tayyo. They never expire, and
            unused credits carry forward indefinitely.
          </p>

          <div className="mt-8 overflow-hidden rounded-xl border border-border">
            {RATE_ROWS.map((row, index) => (
              <div
                key={row.activity}
                className={`flex flex-col gap-1 bg-card px-5 py-4 sm:flex-row sm:items-center sm:justify-between sm:gap-6 ${
                  index === 0 ? "" : "border-t border-border"
                }`}
              >
                <div className="min-w-0">
                  <p className="text-sm font-medium text-foreground">{row.activity}</p>
                  <p className="mt-0.5 text-xs text-muted-foreground">{row.note}</p>
                </div>
                <p className="shrink-0 text-sm font-medium tabular-nums text-foreground">
                  {row.cost}
                </p>
              </div>
            ))}
          </div>

          <div className="mt-10 flex flex-col items-start gap-4 rounded-xl border border-border bg-card p-6 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-sm font-medium">Not sure how many credits you need?</p>
              <p className="mt-1 text-sm text-muted-foreground">
                Start with the Starter pack. One full round is usually enough to see the gap.
              </p>
            </div>
            <Button asChild className="shrink-0">
              <Link href="/signup">
                Start Practicing
                <ArrowRight />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      <Faq />
    </>
  );
}
