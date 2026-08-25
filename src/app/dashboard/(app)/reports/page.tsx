import type { Metadata } from "next";
import { PageHeader } from "@/components/shared/page-header";
import { ReportsOverview } from "@/components/reports/reports-overview";

export const metadata: Metadata = {
  title: "Reports",
};

export default function ReportsPage() {
  return (
    <div className="space-y-8">
      <PageHeader
        title="Reports"
        description="Scored feedback from every completed session, newest first."
      />
      <ReportsOverview />
    </div>
  );
}
