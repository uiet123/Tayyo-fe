"use client";

import { Skeleton } from "@/components/ui/skeleton";
import { useApiResource, useMounted } from "@/hooks";
import { userApi } from "@/lib/api";
import { greetingFor } from "@/lib/format";

export function DashboardGreeting() {
  const mounted = useMounted();
  const { data: user, isLoading } = useApiResource(
    (signal) => userApi.getCurrentUser({ signal, latencyMs: 250 }),
    [],
    { subscribeToMutations: true },
  );

  if (!mounted || isLoading || !user) {
    return (
      <div className="space-y-2">
        <Skeleton className="h-8 w-64" />
        <Skeleton className="h-4 w-52" />
      </div>
    );
  }

  const firstName = user.name.split(" ")[0];

  return (
    <div>
      <h1 className="text-2xl font-semibold tracking-tight">
        {greetingFor()}, {firstName}
      </h1>
      <p className="mt-1 text-sm text-muted-foreground">Ready for your next interview?</p>
    </div>
  );
}
