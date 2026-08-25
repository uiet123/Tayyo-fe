import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { DashboardGreeting } from "@/components/dashboard/dashboard-greeting";
import { QuickActions } from "@/components/dashboard/quick-actions";
import { RecentInterviews } from "@/components/dashboard/recent-interviews";
import { PreparationOverview } from "@/components/dashboard/preparation-overview";
import { CreditBalanceCard } from "@/components/credits/credit-balance-card";
import { ResumeStatusCard } from "@/components/resume/resume-status-card";

export const metadata: Metadata = {
  title: "Dashboard",
};

export default function DashboardPage() {
  return (
    <div className="space-y-10">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <DashboardGreeting />
        <Button asChild className="w-full sm:w-auto">
          <Link href="/dashboard/practice">
            Start Mock Interview
            <ArrowRight />
          </Link>
        </Button>
      </div>

      <section className="space-y-4">
        <h2 className="text-base font-semibold tracking-tight">Quick actions</h2>
        <QuickActions />
      </section>

      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_340px]">
        <div className="order-2 space-y-10 lg:order-1">
          <section className="space-y-4">
            <div>
              <h2 className="text-base font-semibold tracking-tight">Preparation overview</h2>
              <p className="mt-0.5 text-sm text-muted-foreground">
                How your practice is trending across all sessions.
              </p>
            </div>
            <PreparationOverview />
          </section>

          <RecentInterviews />
        </div>

        <div className="order-1 space-y-6 lg:order-2">
          <CreditBalanceCard />
          <ResumeStatusCard />
        </div>
      </div>
    </div>
  );
}
