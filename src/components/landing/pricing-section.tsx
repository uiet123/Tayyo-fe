import Link from "next/link";
import { Coins, Infinity as InfinityIcon, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { CreditPackageCard } from "@/components/credits/credit-package-card";
import { mockCreditPackages } from "@/lib/mock-data";
import { CREDIT_RATES } from "@/lib/constants";
import { Section, SectionHeading } from "./section";

const GUARANTEES = [
  { icon: InfinityIcon, label: "Credits never expire" },
  { icon: Coins, label: "No monthly subscription" },
  { icon: ShieldCheck, label: "Only charged for what you use" },
];

export function PricingSection({ standalone = false }: { standalone?: boolean }) {
  return (
    <Section id="pricing" className={standalone ? "border-t-0 pt-10" : undefined}>
      <SectionHeading
        eyebrow="Credit-based pricing"
        title="Pay only for what you use."
        description={`Credits are spent per minute of live interview (${CREDIT_RATES.perInterviewMinute} credits/min) plus ${CREDIT_RATES.reportGeneration} credits when your report is generated. No plans to cancel.`}
      />

      <div className="mt-14 grid gap-5 lg:grid-cols-3">
        {mockCreditPackages.map((pack) => (
          <CreditPackageCard
            key={pack.id}
            pack={pack}
            action={
              <Button
                asChild
                className="w-full"
                variant={pack.popular ? "default" : "secondary"}
                size="lg"
              >
                <Link href="/signup">Get {pack.name}</Link>
              </Button>
            }
          />
        ))}
      </div>

      <ul className="mt-10 flex flex-wrap items-center justify-center gap-x-8 gap-y-3">
        {GUARANTEES.map((item) => (
          <li key={item.label} className="flex items-center gap-2 text-sm text-muted-foreground">
            <item.icon className="size-4 text-primary" strokeWidth={1.9} />
            {item.label}
          </li>
        ))}
      </ul>
    </Section>
  );
}
