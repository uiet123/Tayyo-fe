import Link from "next/link";
import { ArrowLeft, Compass } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Logo } from "@/components/shared/logo";

export default function NotFound() {
  return (
    <main className="flex min-h-dvh flex-col items-center justify-center px-6 text-center">
      <Logo />
      <div className="mt-10 flex size-12 items-center justify-center rounded-full border border-border bg-muted">
        <Compass className="size-5 text-muted-foreground" strokeWidth={1.75} />
      </div>
      <p className="mt-6 text-sm font-medium text-muted-foreground">404</p>
      <h1 className="mt-2 text-2xl font-semibold tracking-tight">This page does not exist</h1>
      <p className="mt-2 max-w-sm text-sm leading-relaxed text-muted-foreground">
        The link may be outdated, or the page may have moved. Head back and pick up where you left
        off.
      </p>
      <div className="mt-7 flex flex-wrap items-center justify-center gap-3">
        <Button asChild>
          <Link href="/dashboard">
            <ArrowLeft />
            Back to dashboard
          </Link>
        </Button>
        <Button asChild variant="secondary">
          <Link href="/">Go to homepage</Link>
        </Button>
      </div>
    </main>
  );
}
