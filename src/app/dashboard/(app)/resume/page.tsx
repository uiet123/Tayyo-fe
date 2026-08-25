import type { Metadata } from "next";
import { PageHeader } from "@/components/shared/page-header";
import { ResumeManager } from "@/components/resume/resume-manager";

export const metadata: Metadata = {
  title: "Resume",
};

export default function ResumePage() {
  return (
    <div className="space-y-8">
      <PageHeader
        title="Resume"
        description="Tayyo reads your resume so interviewers can ask about your actual projects, stack and gaps."
      />
      <ResumeManager />
    </div>
  );
}
