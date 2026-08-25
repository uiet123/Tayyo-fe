import { DashboardShell } from "@/components/dashboard/dashboard-shell";

export default function DashboardAppLayout({ children }: { children: React.ReactNode }) {
  return <DashboardShell>{children}</DashboardShell>;
}
