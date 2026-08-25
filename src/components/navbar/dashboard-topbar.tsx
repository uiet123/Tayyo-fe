"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Logo } from "@/components/shared/logo";
import { CreditPill } from "@/components/shared/credit-pill";
import { DASHBOARD_NAV, isNavItemActive } from "@/components/sidebar/nav-items";

/** Derives the topbar title from the active route so pages stay declarative. */
function useSectionTitle() {
  const pathname = usePathname();
  const match = DASHBOARD_NAV.find((item) => isNavItemActive(item, pathname));
  return match?.label ?? "Dashboard";
}

export function DashboardTopbar({ onOpenMobileNav }: { onOpenMobileNav: () => void }) {
  const title = useSectionTitle();

  return (
    <header className="sticky top-0 z-30 flex h-16 shrink-0 items-center gap-3 border-b border-border bg-background/85 px-4 backdrop-blur-md sm:px-6">
      <button
        type="button"
        onClick={onOpenMobileNav}
        aria-label="Open navigation"
        className="flex size-9 items-center justify-center rounded-md border border-border text-foreground lg:hidden"
      >
        <Menu className="size-4" />
      </button>

      <div className="lg:hidden">
        <Logo size="sm" href="/dashboard" showWordmark={false} />
      </div>

      <h1 className="truncate text-sm font-semibold text-foreground">{title}</h1>

      <div className="ml-auto flex items-center gap-2 sm:gap-3">
        <Button asChild size="sm" className="hidden sm:inline-flex">
          <Link href="/dashboard/practice">
            <Plus />
            New interview
          </Link>
        </Button>
        <CreditPill />
      </div>
    </header>
  );
}
