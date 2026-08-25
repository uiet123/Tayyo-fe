"use client";

import { useEffect, useState } from "react";
import { X } from "lucide-react";
import { DashboardSidebar } from "@/components/sidebar/dashboard-sidebar";
import { DashboardTopbar } from "@/components/navbar/dashboard-topbar";
import { usePersistentBoolean } from "@/hooks";

const STORAGE_KEY = "tayyo:sidebar-collapsed";

export function DashboardShell({ children }: { children: React.ReactNode }) {
  const [collapsed, setCollapsed] = usePersistentBoolean(STORAGE_KEY);
  const [mobileOpen, setMobileOpen] = useState(false);

  const toggleCollapsed = () => setCollapsed(!collapsed);

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileOpen]);

  return (
    <div className="flex min-h-dvh bg-canvas">
      <div className="sticky top-0 hidden h-dvh shrink-0 lg:block">
        <DashboardSidebar collapsed={collapsed} onToggleCollapsed={toggleCollapsed} />
      </div>

      {mobileOpen ? (
        <div className="fixed inset-0 z-50 lg:hidden">
          <button
            type="button"
            aria-label="Close navigation"
            onClick={() => setMobileOpen(false)}
            className="absolute inset-0 bg-foreground/25 backdrop-blur-[2px]"
          />
          <div className="animate-in-up absolute inset-y-0 left-0 w-[248px]">
            <DashboardSidebar
              variant="mobile"
              collapsed={false}
              onToggleCollapsed={toggleCollapsed}
              onNavigate={() => setMobileOpen(false)}
            />
          </div>
          <button
            type="button"
            aria-label="Close navigation"
            onClick={() => setMobileOpen(false)}
            className="absolute left-[260px] top-4 flex size-9 items-center justify-center rounded-md bg-card text-foreground shadow-sm"
          >
            <X className="size-4" />
          </button>
        </div>
      ) : null}

      <div className="flex min-w-0 flex-1 flex-col">
        <DashboardTopbar onOpenMobileNav={() => setMobileOpen(true)} />
        <main className="flex-1 px-4 py-6 sm:px-6 sm:py-8">
          <div className="mx-auto w-full max-w-[1180px]">{children}</div>
        </main>
      </div>
    </div>
  );
}
