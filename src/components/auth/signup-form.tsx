"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { ArrowRight, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Field } from "@/components/ui/field";
import { PasswordInput } from "./password-input";
import { GoogleButton } from "./google-button";
import { userApi, toErrorMessage } from "@/lib/api";
import {
  passwordStrength,
  validateEmail,
  validateName,
  validatePassword,
  type FieldErrors,
} from "@/lib/validation";
import { cn } from "@/lib/utils";

type SignupField = "name" | "email" | "password" | "confirmPassword";

const STRENGTH_LABELS = ["Too short", "Weak", "Fair", "Good", "Strong"];

export function SignupForm() {
  const router = useRouter();
  const [values, setValues] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [errors, setErrors] = useState<FieldErrors<SignupField>>({});
  const [submitting, setSubmitting] = useState(false);

  const strength = passwordStrength(values.password);

  function setField(field: SignupField, value: string) {
    setValues((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) setErrors((prev) => ({ ...prev, [field]: undefined }));
  }

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();

    const nextErrors: FieldErrors<SignupField> = {
      name: validateName(values.name),
      email: validateEmail(values.email),
      password: validatePassword(values.password),
      confirmPassword: !values.confirmPassword
        ? "Confirm your password."
        : values.confirmPassword !== values.password
          ? "Passwords do not match."
          : undefined,
    };
    setErrors(nextErrors);
    if (Object.values(nextErrors).some(Boolean)) return;

    setSubmitting(true);
    try {
      await userApi.signUp(values.name, values.email, values.password);
      toast.success("Account created", { description: "60 free credits added to your balance." });
      router.push("/dashboard");
    } catch (error) {
      toast.error("Could not create your account", { description: toErrorMessage(error) });
      setSubmitting(false);
    }
  }

  return (
    <div className="space-y-6">
      <GoogleButton label="Sign up with Google" />

      <div className="flex items-center gap-4">
        <span className="h-px flex-1 bg-border" />
        <span className="text-xs text-muted-foreground">or sign up with email</span>
        <span className="h-px flex-1 bg-border" />
      </div>

      <form onSubmit={handleSubmit} noValidate className="space-y-5">
        <Field id="name" label="Full name" error={errors.name}>
          <Input
            id="name"
            autoComplete="name"
            placeholder="Aarav Sharma"
            value={values.name}
            invalid={Boolean(errors.name)}
            onChange={(event) => setField("name", event.target.value)}
          />
        </Field>

        <Field id="signup-email" label="Email" error={errors.email}>
          <Input
            id="signup-email"
            type="email"
            autoComplete="email"
            placeholder="you@example.com"
            value={values.email}
            invalid={Boolean(errors.email)}
            onChange={(event) => setField("email", event.target.value)}
          />
        </Field>

        <Field
          id="signup-password"
          label="Password"
          error={errors.password}
          hint="At least 8 characters."
        >
          <PasswordInput
            id="signup-password"
            autoComplete="new-password"
            placeholder="Create a password"
            value={values.password}
            invalid={Boolean(errors.password)}
            onChange={(event) => setField("password", event.target.value)}
          />
          {values.password ? (
            <div className="flex items-center gap-2 pt-1">
              <div className="flex flex-1 gap-1">
                {[0, 1, 2, 3].map((index) => (
                  <span
                    key={index}
                    className={cn(
                      "h-1 flex-1 rounded-full transition-colors",
                      index < strength ? "bg-primary" : "bg-muted",
                    )}
                  />
                ))}
              </div>
              <span className="w-14 text-right text-xs text-muted-foreground">
                {STRENGTH_LABELS[strength]}
              </span>
            </div>
          ) : null}
        </Field>

        <Field id="confirm-password" label="Confirm password" error={errors.confirmPassword}>
          <PasswordInput
            id="confirm-password"
            autoComplete="new-password"
            placeholder="Re-enter your password"
            value={values.confirmPassword}
            invalid={Boolean(errors.confirmPassword)}
            onChange={(event) => setField("confirmPassword", event.target.value)}
          />
        </Field>

        <Button type="submit" size="lg" className="w-full" loading={submitting}>
          {submitting ? "Creating account" : "Create account"}
          {submitting ? null : <ArrowRight />}
        </Button>

        <ul className="space-y-1.5 pt-1">
          {["60 free credits to start", "No credit card required", "Credits never expire"].map(
            (perk) => (
              <li key={perk} className="flex items-center gap-2 text-xs text-muted-foreground">
                <Check className="size-3.5 text-primary" strokeWidth={2.5} />
                {perk}
              </li>
            ),
          )}
        </ul>
      </form>
    </div>
  );
}
