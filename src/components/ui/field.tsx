import * as React from "react";
import { AlertCircle } from "lucide-react";
import { Label } from "./label";
import { cn } from "@/lib/utils";

interface FieldProps {
  id: string;
  label: string;
  error?: string;
  hint?: string;
  optional?: boolean;
  action?: React.ReactNode;
  className?: string;
  children: React.ReactNode;
}

/** Label + control + hint/error, so every form on Tayyo looks identical. */
export function Field({
  id,
  label,
  error,
  hint,
  optional,
  action,
  className,
  children,
}: FieldProps) {
  return (
    <div className={cn("space-y-1.5", className)}>
      <div className="flex items-center justify-between gap-3">
        <Label htmlFor={id}>
          {label}
          {optional ? (
            <span className="ml-1.5 text-xs font-normal text-muted-foreground">Optional</span>
          ) : null}
        </Label>
        {action}
      </div>
      {children}
      {error ? (
        <p id={`${id}-error`} className="flex items-center gap-1.5 text-xs text-destructive">
          <AlertCircle className="size-3.5 shrink-0" />
          {error}
        </p>
      ) : hint ? (
        <p className="text-xs text-muted-foreground">{hint}</p>
      ) : null}
    </div>
  );
}
