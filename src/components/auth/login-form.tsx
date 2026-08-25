"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Field } from "@/components/ui/field";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { PasswordInput } from "./password-input";
import { GoogleButton } from "./google-button";
import { userApi, toErrorMessage } from "@/lib/api";
import { validateEmail, validatePassword, type FieldErrors } from "@/lib/validation";

type LoginField = "email" | "password";

export function LoginForm() {
  const router = useRouter();
  const [email, setEmail] = useState("aarav.sharma@gmail.com");
  const [password, setPassword] = useState("");
  const [remember, setRemember] = useState(true);
  const [errors, setErrors] = useState<FieldErrors<LoginField>>({});
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();

    const nextErrors: FieldErrors<LoginField> = {
      email: validateEmail(email),
      password: validatePassword(password),
    };
    setErrors(nextErrors);
    if (nextErrors.email || nextErrors.password) return;

    setSubmitting(true);
    try {
      const user = await userApi.signIn(email, password);
      toast.success(`Welcome back, ${user.name.split(" ")[0]}`);
      router.push("/dashboard");
    } catch (error) {
      toast.error("Could not sign you in", { description: toErrorMessage(error) });
      setSubmitting(false);
    }
  }

  return (
    <div className="space-y-6">
      <GoogleButton label="Continue with Google" />

      <div className="flex items-center gap-4">
        <span className="h-px flex-1 bg-border" />
        <span className="text-xs text-muted-foreground">or continue with email</span>
        <span className="h-px flex-1 bg-border" />
      </div>

      <form onSubmit={handleSubmit} noValidate className="space-y-5">
        <Field id="email" label="Email" error={errors.email}>
          <Input
            id="email"
            name="email"
            type="email"
            autoComplete="email"
            placeholder="you@example.com"
            value={email}
            invalid={Boolean(errors.email)}
            aria-describedby={errors.email ? "email-error" : undefined}
            onChange={(event) => setEmail(event.target.value)}
          />
        </Field>

        <Field
          id="password"
          label="Password"
          error={errors.password}
          action={
            <Link
              href="/login"
              onClick={(event) => {
                event.preventDefault();
                toast("Password reset is coming soon", {
                  description: "Email-based reset lands with the auth backend.",
                });
              }}
              className="text-xs font-medium text-primary hover:underline"
            >
              Forgot password?
            </Link>
          }
        >
          <PasswordInput
            id="password"
            name="password"
            autoComplete="current-password"
            placeholder="Enter your password"
            value={password}
            invalid={Boolean(errors.password)}
            aria-describedby={errors.password ? "password-error" : undefined}
            onChange={(event) => setPassword(event.target.value)}
          />
        </Field>

        <div className="flex items-center gap-2">
          <Checkbox
            id="remember"
            checked={remember}
            onCheckedChange={(value) => setRemember(value === true)}
          />
          <Label htmlFor="remember" className="text-sm font-normal text-muted-foreground">
            Keep me signed in
          </Label>
        </div>

        <Button type="submit" size="lg" className="w-full" loading={submitting}>
          {submitting ? "Signing in" : "Sign in"}
          {submitting ? null : <ArrowRight />}
        </Button>
      </form>
    </div>
  );
}
