"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { PanelLeftClose, PanelLeftOpen } from "lucide-react";
import { Logo, LogoMark } from "@/components/shared/logo";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import { DASHBOARD_NAV, isNavItemActive } from "./nav-items";
import { SidebarUser } from "./sidebar-user";

interface DashboardSidebarProps {
  collapsed: boolean;
  onToggleCollapsed: () => void;
  onNavigate?: () => void;
  /** Mobile drawer renders without the collapse control. */
  variant?: "desktop" | "mobile";
}

export function DashboardSidebar({
  collapsed,
  onToggleCollapsed,
  onNavigate,
  variant = "desktop",
}: DashboardSidebarProps) {
  const pathname = usePathname();
  const isCollapsed = variant === "desktop" && collapsed;

  return (
    <aside
      className={cn(
        "flex h-full flex-col border-r border-border bg-card transition-[width] duration-200 ease-out",
        isCollapsed ? "w-[68px]" : "w-[248px]",
      )}
    >
      <div
        className={cn(
          "flex h-16 shrink-0 items-center border-b border-border",
          isCollapsed ? "justify-center px-3" : "justify-between px-5",
        )}
      >
        {isCollapsed ? <LogoMark /> : <Logo size="sm" href="/dashboard" />}
        {variant === "desktop" ? (
          <Tooltip>
            <TooltipTrigger asChild>
              <button
                type="button"
                onClick={onToggleCollapsed}
                aria-label={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
                className={cn(
                  "flex size-7 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-muted hover:text-foreground",
                  isCollapsed && "absolute left-1/2 top-[68px] -translate-x-1/2",
                )}
              >
                {isCollapsed ? (
                  <PanelLeftOpen className="size-4" />
                ) : (
                  <PanelLeftClose className="size-4" />
                )}
              </button>
            </TooltipTrigger>
            <TooltipContent side="right">
              {isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
            </TooltipContent>
          </Tooltip>
        ) : null}
      </div>

      <nav className={cn("flex-1 overflow-y-auto py-4", isCollapsed ? "px-2.5 pt-8" : "px-3")}>
        <ul className="space-y-0.5">
          {DASHBOARD_NAV.map((item) => {
            const active = isNavItemActive(item, pathname);
            const link = (
              <Link
                href={item.href}
                onClick={onNavigate}
                aria-current={active ? "page" : undefined}
                className={cn(
                  "group flex items-center gap-3 rounded-lg text-sm font-medium transition-colors",
                  isCollapsed ? "justify-center px-0 py-2.5" : "px-3 py-2",
                  active
                    ? "bg-brand-subtle text-primary"
                    : "text-muted-foreground hover:bg-muted hover:text-foreground",
                )}
              >
                <item.icon className="size-4 shrink-0" strokeWidth={active ? 2.2 : 1.9} />
                {isCollapsed ? null : <span className="truncate">{item.label}</span>}
              </Link>
            );

            return (
              <li key={item.href}>
                {isCollapsed ? (
                  <Tooltip>
                    <TooltipTrigger asChild>{link}</TooltipTrigger>
                    <TooltipContent side="right">{item.label}</TooltipContent>
                  </Tooltip>
                ) : (
                  link
                )}
              </li>
            );
          })}
        </ul>
      </nav>

      <SidebarUser collapsed={isCollapsed} />
    </aside>
  );
}
