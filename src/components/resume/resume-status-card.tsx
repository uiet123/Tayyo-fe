"use client";

import Link from "next/link";
import { CheckCircle2, FileText, Upload } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useApiResource } from "@/hooks";
import { resumeApi } from "@/lib/api";
import { formatDate } from "@/lib/format";

/** Compact resume state for the dashboard rail. */
export function ResumeStatusCard() {
  const { data, isLoading } = useApiResource(
    (signal) => resumeApi.getPrimaryResume({ signal, latencyMs: 550 }),
    [],
    { subscribeToMutations: true },
  );

  if (isLoading) {
    return (
      <Card className="p-5">
        <Skeleton className="h-3.5 w-20" />
        <Skeleton className="mt-4 h-4 w-44" />
        <Skeleton className="mt-2 h-3 w-32" />
        <Skeleton className="mt-5 h-8 w-28" />
      </Card>
    );
  }

  if (!data) {
    return (
      <Card className="p-5">
        <p className="flex items-center gap-2 text-[13px] font-medium text-muted-foreground">
          <FileText className="size-4" strokeWidth={1.9} />
          Resume
        </p>
        <p className="mt-3 text-sm font-medium">No resume connected</p>
        <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
          Upload one so Tayyo can ask about your actual projects and stack.
        </p>
        <Button asChild size="sm" variant="secondary" className="mt-5">
          <Link href="/dashboard/resume">
            <Upload />
            Upload resume
          </Link>
        </Button>
      </Card>
    );
  }

  return (
    <Card className="p-5">
      <p className="flex items-center gap-2 text-[13px] font-medium text-muted-foreground">
        <FileText className="size-4" strokeWidth={1.9} />
        Resume
      </p>
      <p className="mt-3 truncate text-sm font-medium" title={data.fileName}>
        {data.fileName}
      </p>
      <p className="mt-1 text-xs text-muted-foreground">
        Uploaded {formatDate(data.uploadedAt)}
      </p>
      <p className="mt-3 inline-flex items-center gap-1.5 rounded-full bg-success-subtle px-2.5 py-1 text-[11px] font-medium text-success">
        <CheckCircle2 className="size-3" />
        Resume connected
      </p>
      <Button asChild size="sm" variant="secondary" className="mt-5">
        <Link href="/dashboard/resume">Manage resume</Link>
      </Button>
    </Card>
  );
}
