"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { KeyRound, LogOut, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Field } from "@/components/ui/field";
import { PasswordInput } from "@/components/auth/password-input";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { SettingsSection } from "./settings-section";
import { userApi } from "@/lib/api";
import { validatePassword, type FieldErrors } from "@/lib/validation";

type PasswordField = "current" | "next" | "confirm";

export function SecuritySection() {
  const router = useRouter();
  const [values, setValues] = useState({ current: "", next: "", confirm: "" });
  const [errors, setErrors] = useState<FieldErrors<PasswordField>>({});
  const [saving, setSaving] = useState(false);
  const [confirmLogout, setConfirmLogout] = useState(false);

  function setField(field: PasswordField, value: string) {
    setValues((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) setErrors((prev) => ({ ...prev, [field]: undefined }));
  }

  async function handleChangePassword() {
    const nextErrors: FieldErrors<PasswordField> = {
      current: values.current ? undefined : "Enter your current password.",
      next: validatePassword(values.next),
      confirm:
        values.confirm !== values.next ? "Passwords do not match." : undefined,
    };
    setErrors(nextErrors);
    if (Object.values(nextErrors).some(Boolean)) return;

    setSaving(true);
    setTimeout(() => {
      setSaving(false);
      setValues({ current: "", next: "", confirm: "" });
      toast("Password changes are coming soon", {
        description: "This lands with the authentication backend.",
      });
    }, 700);
  }

  async function handleLogoutEverywhere() {
    setConfirmLogout(false);
    await userApi.signOut();
    toast.success("Signed out of all devices");
    router.push("/login");
  }

  return (
    <>
      <SettingsSection
        id="security"
        title="Security"
        description="Keep your account locked down."
        footer={
          <Button size="sm" loading={saving} onClick={handleChangePassword}>
            <KeyRound />
            Change password
          </Button>
        }
      >
        <div className="grid gap-5 sm:grid-cols-3">
          <Field id="current-password" label="Current password" error={errors.current}>
            <PasswordInput
              id="current-password"
              autoComplete="current-password"
              value={values.current}
              invalid={Boolean(errors.current)}
              onChange={(event) => setField("current", event.target.value)}
            />
          </Field>

          <Field id="new-password" label="New password" error={errors.next}>
            <PasswordInput
              id="new-password"
              autoComplete="new-password"
              value={values.next}
              invalid={Boolean(errors.next)}
              onChange={(event) => setField("next", event.target.value)}
            />
          </Field>

          <Field id="confirm-new-password" label="Confirm new password" error={errors.confirm}>
            <PasswordInput
              id="confirm-new-password"
              autoComplete="new-password"
              value={values.confirm}
              invalid={Boolean(errors.confirm)}
              onChange={(event) => setField("confirm", event.target.value)}
            />
          </Field>
        </div>

        <div className="mt-6 flex flex-col gap-4 rounded-lg border border-border p-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-start gap-3">
            <ShieldCheck className="mt-0.5 size-4 shrink-0 text-muted-foreground" strokeWidth={1.9} />
            <div>
              <p className="text-sm font-medium">Active sessions</p>
              <p className="mt-0.5 text-xs leading-relaxed text-muted-foreground">
                Signing out everywhere ends every session except this one.
              </p>
            </div>
          </div>
          <Button
            variant="secondary"
            size="sm"
            className="shrink-0"
            onClick={() => setConfirmLogout(true)}
          >
            <LogOut />
            Logout from all devices
          </Button>
        </div>
      </SettingsSection>

      <AlertDialog open={confirmLogout} onOpenChange={setConfirmLogout}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Sign out of all devices?</AlertDialogTitle>
            <AlertDialogDescription>
              You will need to sign in again everywhere, including here. Any interview in progress
              will be ended.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleLogoutEverywhere}>Sign out</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
