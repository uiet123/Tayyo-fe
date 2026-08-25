"use client";

import { Check } from "lucide-react";
import { cn } from "@/lib/utils";

interface OptionCardProps {
  selected: boolean;
  onSelect: () => void;
  title: string;
  description?: string;
  icon?: React.ReactNode;
  className?: string;
  disabled?: boolean;
}

/** Selectable tile used across the practice setup screen. */
export function OptionCard({
  selected,
  onSelect,
  title,
  description,
  icon,
  className,
  disabled,
}: OptionCardProps) {
  return (
    <button
      type="button"
      role="radio"
      aria-checked={selected}
      disabled={disabled}
      onClick={onSelect}
      className={cn(
        "group relative flex w-full items-start gap-3 rounded-lg border p-3.5 text-left transition-all",
        selected
          ? "border-primary bg-brand-subtle shadow-xs"
          : "border-border bg-card hover:border-border-strong hover:bg-muted/40",
        disabled && "cursor-not-allowed opacity-50",
        className,
      )}
    >
      {icon ? (
        <span
          className={cn(
            "flex size-8 shrink-0 items-center justify-center rounded-md border transition-colors",
            selected ? "border-primary/25 bg-background text-primary" : "border-border bg-muted",
          )}
        >
          {icon}
        </span>
      ) : null}

      <span className="min-w-0 flex-1">
        <span
          className={cn(
            "block text-sm font-medium",
            selected ? "text-primary" : "text-foreground",
          )}
        >
          {title}
        </span>
        {description ? (
          <span className="mt-0.5 block text-xs leading-relaxed text-muted-foreground">
            {description}
          </span>
        ) : null}
      </span>

      {selected ? (
        <Check className="size-4 shrink-0 text-primary" strokeWidth={2.5} />
      ) : null}
    </button>
  );
}
