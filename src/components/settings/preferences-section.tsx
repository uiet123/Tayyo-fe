"use client";

import { useState } from "react";
import { toast } from "sonner";
import type { User } from "@/types";
import { Button } from "@/components/ui/button";
import { Field } from "@/components/ui/field";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { SettingsSection } from "./settings-section";
import { useApiResource } from "@/hooks";
import { userApi, toErrorMessage } from "@/lib/api";
import { INTERVIEW_DURATIONS, INTERVIEW_TYPES } from "@/lib/constants";

export function PreferencesSection() {
  const { data: user, isLoading } = useApiResource(
    (signal) => userApi.getCurrentUser({ signal, latencyMs: 400 }),
    [],
  );

  if (isLoading || !user) {
    return (
      <SettingsSection
        id="preferences"
        title="Preferences"
        description="Defaults applied every time you set up a new interview."
      >
        <div className="space-y-6">
          <div className="grid gap-5 sm:grid-cols-2">
            <Skeleton className="h-16" />
            <Skeleton className="h-16" />
          </div>
          <Skeleton className="h-32" />
        </div>
      </SettingsSection>
    );
  }

  return <PreferencesForm key={user.id} user={user} />;
}

function PreferencesForm({ user }: { user: User }) {
  const [defaultType, setDefaultType] = useState(user.preferences.defaultInterviewType);
  const [defaultDuration, setDefaultDuration] = useState(
    String(user.preferences.defaultDurationMinutes),
  );
  const [emailReports, setEmailReports] = useState(user.preferences.emailReports);
  const [reminders, setReminders] = useState(user.preferences.practiceReminders);
  const [saving, setSaving] = useState(false);

  async function handleSave() {
    setSaving(true);
    try {
      await userApi.updatePreferences(
        {
          defaultInterviewType: defaultType,
          defaultDurationMinutes: Number(defaultDuration),
          emailReports,
          practiceReminders: reminders,
        },
        { latencyMs: 600 },
      );
      toast.success("Preferences saved");
    } catch (error) {
      toast.error("Could not save preferences", { description: toErrorMessage(error) });
    } finally {
      setSaving(false);
    }
  }

  return (
    <SettingsSection
      id="preferences"
      title="Preferences"
      description="Defaults applied every time you set up a new interview."
      footer={
        <Button size="sm" loading={saving} onClick={handleSave}>
          Save preferences
        </Button>
      }
    >
      <div className="space-y-6">
        <div className="grid gap-5 sm:grid-cols-2">
          <Field id="default-type" label="Default interview type">
            <Select value={defaultType} onValueChange={setDefaultType}>
              <SelectTrigger id="default-type">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {INTERVIEW_TYPES.map((item) => (
                  <SelectItem key={item.id} value={item.id}>
                    {item.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </Field>

          <Field id="default-duration" label="Default interview duration">
            <Select value={defaultDuration} onValueChange={setDefaultDuration}>
              <SelectTrigger id="default-duration">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {INTERVIEW_DURATIONS.map((item) => (
                  <SelectItem key={item.value} value={String(item.value)}>
                    {item.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </Field>
        </div>

        <div className="divide-y divide-border rounded-lg border border-border">
          <ToggleRow
            id="email-reports"
            label="Email me my reports"
            description="Get the scored report in your inbox as soon as a session ends."
            checked={emailReports}
            onChange={setEmailReports}
          />
          <ToggleRow
            id="practice-reminders"
            label="Practice reminders"
            description="A nudge when you have not practised in three days."
            checked={reminders}
            onChange={setReminders}
          />
        </div>
      </div>
    </SettingsSection>
  );
}

function ToggleRow({
  id,
  label,
  description,
  checked,
  onChange,
}: {
  id: string;
  label: string;
  description: string;
  checked: boolean;
  onChange: (value: boolean) => void;
}) {
  return (
    <div className="flex items-start justify-between gap-6 p-4">
      <div className="min-w-0">
        <Label htmlFor={id}>{label}</Label>
        <p className="mt-1 text-xs leading-relaxed text-muted-foreground">{description}</p>
      </div>
      <Switch id={id} checked={checked} onCheckedChange={onChange} className="mt-0.5 shrink-0" />
    </div>
  );
}
