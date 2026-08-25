import type { Metadata } from "next";
import Link from "next/link";
import { LoginForm } from "@/components/auth/login-form";

export const metadata: Metadata = {
  title: "Sign in",
  description: "Sign in to your Tayyo AI account.",
};

export default function LoginPage() {
  return (
    <div>
      <h1 className="text-2xl font-semibold tracking-tight">Welcome back</h1>
      <p className="mt-2 text-sm text-muted-foreground">
        Sign in to pick up where your preparation left off.
      </p>

      <div className="mt-8">
        <LoginForm />
      </div>

      <p className="mt-8 text-center text-sm text-muted-foreground">
        New to Tayyo?{" "}
        <Link href="/signup" className="font-medium text-primary hover:underline">
          Create account
        </Link>
      </p>
    </div>
  );
}
