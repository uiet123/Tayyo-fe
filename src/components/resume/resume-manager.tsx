"use client";

import { useState } from "react";
import { toast } from "sonner";
import { CheckCircle2, FileText, Loader2, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { ErrorState } from "@/components/ui/error-state";
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
import { ResumeUploader } from "./resume-uploader";
import { ResumeInsightsPanel } from "./resume-insights";
import { useApiResource } from "@/hooks";
import { resumeApi, toErrorMessage } from "@/lib/api";
import { formatBytes, formatDate } from "@/lib/format";

export function ResumeManager() {
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const { data: resume, error, isLoading, refetch } = useApiResource(
    (signal) => resumeApi.getPrimaryResume({ signal, latencyMs: 500 }),
    [],
    { subscribeToMutations: true },
  );

  async function handleDelete() {
    if (!resume) return;
    setDeleting(true);
    setConfirmDelete(false);
    try {
      await resumeApi.deleteResume(resume.id);
      toast.success("Resume deleted", {
        description: "Interviews will no longer reference your experience.",
      });
      refetch();
    } catch (caught) {
      toast.error("Could not delete resume", { description: toErrorMessage(caught) });
    } finally {
      setDeleting(false);
    }
  }

  if (error) return <ErrorState message={error} onRetry={refetch} />;

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-[132px] rounded-xl" />
        <Skeleton className="h-[320px] rounded-xl" />
      </div>
    );
  }

  if (!resume) {
    return <ResumeUploader onUploaded={refetch} />;
  }

  const ready = resume.status === "ready";

  return (
    <div className="space-y-8">
      <Card className="p-5 sm:p-6">
        <div className="flex flex-col gap-5 sm:flex-row sm:items-center">
          <span className="flex size-12 shrink-0 items-center justify-center rounded-xl border border-border bg-muted">
            <FileText className="size-5 text-foreground" strokeWidth={1.75} />
          </span>

          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-semibold" title={resume.fileName}>
              {resume.fileName}
            </p>
            <p className="mt-1 text-xs text-muted-foreground">
              Uploaded {formatDate(resume.uploadedAt)} · {formatBytes(resume.fileSize)}
            </p>
            <div className="mt-2.5 flex flex-wrap items-center gap-2">
              {ready ? (
                <Badge variant="success">
                  <CheckCircle2 />
                  AI-ready
                </Badge>
              ) : resume.status === "processing" ? (
                <Badge variant="warning">
                  <Loader2 className="animate-spin" />
                  Analysing
                </Badge>
              ) : (
                <Badge variant="destructive">Analysis failed</Badge>
              )}
              {resume.isPrimary ? <Badge variant="outline">Primary resume</Badge> : null}
            </div>
          </div>

          <div className="flex shrink-0 items-center gap-2">
            <ResumeUploader variant="replace" onUploaded={refetch} />
            <Button
              variant="ghost"
              size="sm"
              loading={deleting}
              onClick={() => setConfirmDelete(true)}
              className="text-destructive hover:bg-destructive-subtle hover:text-destructive"
            >
              {deleting ? null : <Trash2 />}
              Delete
            </Button>
          </div>
        </div>
      </Card>

      {resume.insights ? (
        <ResumeInsightsPanel insights={resume.insights} />
      ) : (
        <Card className="flex items-center gap-3 p-6">
          <Loader2 className="size-4 animate-spin text-primary" />
          <p className="text-sm text-muted-foreground">
            Insights are being generated. This usually takes under a minute.
          </p>
        </Card>
      )}

      <AlertDialog open={confirmDelete} onOpenChange={setConfirmDelete}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete this resume?</AlertDialogTitle>
            <AlertDialogDescription>
              Interviews will stop referencing your projects and experience. You can upload a new
              resume at any time. This cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-destructive text-destructive-foreground hover:opacity-90"
            >
              Delete resume
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
