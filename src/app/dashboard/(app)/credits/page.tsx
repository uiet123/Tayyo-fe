import type { Metadata } from "next";
import { PageHeader } from "@/components/shared/page-header";
import { CreditsView } from "@/components/credits/credits-view";

export const metadata: Metadata = {
  title: "Credits",
};

export default function CreditsPage() {
  return (
    <div className="space-y-8">
      <PageHeader
        title="Credits"
        description="Top up, track usage, and see exactly where every credit went."
      />
      <CreditsView />
    </div>
  );
}
