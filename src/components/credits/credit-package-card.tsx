import { Check, Sparkles } from "lucide-react";
import type { CreditPackage } from "@/types";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface CreditPackageCardProps {
  pack: CreditPackage;
  /** Rendered as the card CTA so marketing (Link) and app (onClick) can differ. */
  action: React.ReactNode;
  className?: string;
}

export function CreditPackageCard({ pack, action, className }: CreditPackageCardProps) {
  const totalCredits = pack.credits + (pack.bonusCredits ?? 0);

  return (
    <div
      className={cn(
        "relative flex flex-col rounded-xl border bg-card p-6 transition-shadow",
        pack.popular
          ? "border-primary/40 shadow-md ring-1 ring-primary/10"
          : "border-border hover:shadow-sm",
        className,
      )}
    >
      {pack.popular ? (
        <Badge variant="brand" className="absolute -top-2.5 left-6">
          <Sparkles />
          Most popular
        </Badge>
      ) : null}

      <div className="flex items-baseline justify-between gap-3">
        <h3 className="text-base font-semibold tracking-tight">{pack.name}</h3>
        <span className="text-xs text-muted-foreground">{pack.approxInterviews}</span>
      </div>

      <p className="mt-4 flex items-baseline gap-1">
        <span className="text-3xl font-semibold tracking-tight">&#8377;{pack.priceLabel}</span>
        <span className="text-sm text-muted-foreground">one-time</span>
      </p>

      <p className="mt-3 flex flex-wrap items-center gap-2">
        <span className="text-sm font-medium text-foreground">
          {totalCredits.toLocaleString("en-IN")} credits
        </span>
        {pack.bonusCredits ? (
          <Badge variant="success">+{pack.bonusCredits} bonus</Badge>
        ) : null}
      </p>

      <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{pack.description}</p>

      <ul className="mt-6 flex-1 space-y-2.5">
        {pack.perks.map((perk) => (
          <li key={perk} className="flex items-start gap-2.5 text-sm text-muted-foreground">
            <Check className="mt-0.5 size-3.5 shrink-0 text-primary" strokeWidth={2.5} />
            <span>{perk}</span>
          </li>
        ))}
      </ul>

      <div className="mt-7">{action}</div>
    </div>
  );
}
