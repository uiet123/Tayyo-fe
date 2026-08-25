import type { Metadata } from "next";
import Link from "next/link";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PageHeader } from "@/components/shared/page-header";
import { InterviewsTable } from "@/components/interview/interviews-table";

export const metadata: Metadata = {
  title: "Interviews",
};

export default function InterviewsPage() {
  return (
    <div className="space-y-8">
      <PageHeader
        title="Interviews"
        description="Every session you have run, with scores and full reports."
        actions={
          <Button asChild>
            <Link href="/dashboard/practice">
              <Plus />
              New interview
            </Link>
          </Button>
        }
      />
      <InterviewsTable />
    </div>
  );
}
