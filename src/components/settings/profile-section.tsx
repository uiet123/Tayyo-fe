"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Camera } from "lucide-react";
import type { User } from "@/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Field } from "@/components/ui/field";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";
import { ErrorState } from "@/components/ui/error-state";
import { SettingsSection } from "./settings-section";
import { useApiResource } from "@/hooks";
import { userApi, toErrorMessage } from "@/lib/api";
import { validateEmail, validateName, type FieldErrors } from "@/lib/validation";
import { initials } from "@/lib/utils";

type ProfileField = "name" | "email" | "jobTitle" | "targetRole";

export function ProfileSection() {
  const { data: user, error, isLoading, refetch } = useApiResource(
    (signal) => userApi.getCurrentUser({ signal, latencyMs: 400 }),
    [],
  );

  if (error) {
    return (
      <SettingsSection id="profile" title="Profile" description="Your account details.">
        <ErrorState compact message={error} onRetry={refetch} />
      </SettingsSection>
    );
  }

  if (isLoading || !user) {
    return (
      <SettingsSection
        id="profile"
        title="Profile"
        description="This is what appears on your reports and in the interview room."
      >
        <div className="space-y-6">
          <Skeleton className="h-16 w-full max-w-sm" />
          <div className="grid gap-5 sm:grid-cols-2">
            {Array.from({ length: 4 }).map((_, index) => (
              <Skeleton key={index} className="h-16" />
            ))}
          </div>
        </div>
      </SettingsSection>
    );
  }

  // Keyed so the form re-initialises cleanly if the account ever changes.
  return <ProfileForm key={user.id} user={user} />;
}

function ProfileForm({ user }: { user: User }) {
  const [values, setValues] = useState({
    name: user.name,
    email: user.email,
    jobTitle: user.jobTitle ?? "",
    targetRole: user.targetRole ?? "",
  });
  const [errors, setErrors] = useState<FieldErrors<ProfileField>>({});
  const [saving, setSaving] = useState(false);

  function setField(field: ProfileField, value: string) {
    setValues((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) setErrors((prev) => ({ ...prev, [field]: undefined }));
  }

  async function handleSave() {
    const nextErrors: FieldErrors<ProfileField> = {
      name: validateName(values.name),
      email: validateEmail(values.email),
    };
    setErrors(nextErrors);
    if (nextErrors.name || nextErrors.email) return;

    setSaving(true);
    try {
      await userApi.updateProfile(values, { latencyMs: 700 });
      toast.success("Profile updated");
    } catch (caught) {
      toast.error("Could not save your profile", { description: toErrorMessage(caught) });
    } finally {
      setSaving(false);
    }
  }

  return (
    <SettingsSection
      id="profile"
      title="Profile"
      description="This is what appears on your reports and in the interview room."
      footer={
        <Button size="sm" loading={saving} onClick={handleSave}>
          Save changes
        </Button>
      }
    >
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Avatar className="size-14">
            <AvatarFallback className="text-base">
              {initials(values.name || user.name)}
            </AvatarFallback>
          </Avatar>
          <div>
            <p className="text-sm font-medium">Profile picture</p>
            <p className="mt-0.5 text-xs text-muted-foreground">PNG or JPG, up to 2 MB.</p>
            <Button
              variant="secondary"
              size="sm"
              className="mt-2.5"
              onClick={() =>
                toast("Avatar uploads are coming soon", {
                  description: "Initials are used until file storage is connected.",
                })
              }
            >
              <Camera />
              Change photo
            </Button>
          </div>
        </div>

        <div className="grid gap-5 sm:grid-cols-2">
          <Field id="settings-name" label="Full name" error={errors.name}>
            <Input
              id="settings-name"
              value={values.name}
              invalid={Boolean(errors.name)}
              onChange={(event) => setField("name", event.target.value)}
            />
          </Field>

          <Field id="settings-email" label="Email" error={errors.email}>
            <Input
              id="settings-email"
              type="email"
              value={values.email}
              invalid={Boolean(errors.email)}
              onChange={(event) => setField("email", event.target.value)}
            />
          </Field>

          <Field id="settings-title" label="Current title" optional>
            <Input
              id="settings-title"
              placeholder="Software Engineer"
              value={values.jobTitle}
              onChange={(event) => setField("jobTitle", event.target.value)}
            />
          </Field>

          <Field id="settings-target" label="Target role" optional>
            <Input
              id="settings-target"
              placeholder="Senior Backend Engineer"
              value={values.targetRole}
              onChange={(event) => setField("targetRole", event.target.value)}
            />
          </Field>
        </div>
      </div>
    </SettingsSection>
  );
}
