import type { Metadata } from "next";
import { PageHeader } from "@/components/shared/page-header";
import { ProfileSection } from "@/components/settings/profile-section";
import { PreferencesSection } from "@/components/settings/preferences-section";
import { AppearanceSection } from "@/components/settings/appearance-section";
import { SecuritySection } from "@/components/settings/security-section";

export const metadata: Metadata = {
  title: "Settings",
};

const SECTIONS = [
  { id: "profile", label: "Profile" },
  { id: "preferences", label: "Preferences" },
  { id: "appearance", label: "Appearance" },
  { id: "security", label: "Security" },
];

export default function SettingsPage() {
  return (
    <div className="space-y-8">
      <PageHeader
        title="Settings"
        description="Manage your account, interview defaults and appearance."
      />

      <div className="grid gap-8 lg:grid-cols-[180px_minmax(0,1fr)]">
        <nav className="hidden lg:block">
          <ul className="sticky top-24 space-y-1">
            {SECTIONS.map((section) => (
              <li key={section.id}>
                <a
                  href={`#${section.id}`}
                  className="block rounded-md px-3 py-2 text-sm text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                >
                  {section.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        <div className="space-y-6">
          <ProfileSection />
          <PreferencesSection />
          <AppearanceSection />
          <SecuritySection />
        </div>
      </div>
    </div>
  );
}
