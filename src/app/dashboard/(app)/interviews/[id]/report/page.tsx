import type { Metadata } from "next";
import { ReportView } from "@/components/reports/report-view";

export const metadata: Metadata = {
  title: "Interview report",
};

export default async function InterviewReportPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return <ReportView interviewId={id} />;
}
