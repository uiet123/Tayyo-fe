import Link from "next/link";
import { cn } from "@/lib/utils";

interface LogoProps {
  href?: string;
  className?: string;
  showWordmark?: boolean;
  size?: "sm" | "md";
}

/** Tayyo mark: a rounded square with a stylised T formed from two strokes. */
export function LogoMark({ className }: { className?: string }) {
  return (
    <span
      aria-hidden
      className={cn(
        "relative flex size-7 shrink-0 items-center justify-center rounded-[9px] bg-primary text-primary-foreground",
        className,
      )}
    >
      <svg viewBox="0 0 24 24" fill="none" className="size-4">
        <path d="M5 6.5h14" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" />
        <path d="M12 6.5v11" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" />
        <circle cx="18" cy="17.5" r="1.9" fill="currentColor" />
      </svg>
    </span>
  );
}

export function Logo({ href = "/", className, showWordmark = true, size = "md" }: LogoProps) {
  const content = (
    <span className={cn("flex items-center gap-2", className)}>
      <LogoMark className={size === "sm" ? "size-6 rounded-lg" : undefined} />
      {showWordmark ? (
        <span
          className={cn(
            "font-semibold tracking-tight text-foreground",
            size === "sm" ? "text-[15px]" : "text-base",
          )}
        >
          Tayyo
        </span>
      ) : null}
    </span>
  );

  if (!href) return content;

  return (
    <Link href={href} className="rounded-md outline-none transition-opacity hover:opacity-85">
      {content}
    </Link>
  );
}
