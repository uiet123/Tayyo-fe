import type { Metadata } from "next";
import { PageHeader } from "@/components/shared/page-header";
import { PracticeSetupForm } from "@/components/interview/practice-setup-form";

export const metadata: Metadata = {
  title: "Practice",
};

export default function PracticePage() {
  return (
    <div className="space-y-8">
      <PageHeader
        title="Start a mock interview"
        description="Set up the round the way the real one will run. Tayyo adapts its questions and follow-ups to everything you set here."
      />
      <PracticeSetupForm />
    </div>
  );
}
