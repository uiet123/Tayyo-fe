import {
  Coins,
  FileText,
  LayoutDashboard,
  MessagesSquare,
  Mic,
  PieChart,
  Settings,
  type LucideIcon,
} from "lucide-react";

export interface NavItem {
  href: string;
  label: string;
  icon: LucideIcon;
  /** Matches nested routes, e.g. /dashboard/interviews/abc/report. */
  matchNested?: boolean;
}

export const DASHBOARD_NAV: NavItem[] = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/dashboard/practice", label: "Practice", icon: Mic, matchNested: true },
  { href: "/dashboard/interviews", label: "Interviews", icon: MessagesSquare, matchNested: true },
  { href: "/dashboard/resume", label: "Resume", icon: FileText, matchNested: true },
  { href: "/dashboard/reports", label: "Reports", icon: PieChart, matchNested: true },
  { href: "/dashboard/credits", label: "Credits", icon: Coins, matchNested: true },
  { href: "/dashboard/settings", label: "Settings", icon: Settings, matchNested: true },
];

export function isNavItemActive(item: NavItem, pathname: string) {
  if (item.href === "/dashboard") return pathname === "/dashboard";
  return item.matchNested ? pathname.startsWith(item.href) : pathname === item.href;
}
