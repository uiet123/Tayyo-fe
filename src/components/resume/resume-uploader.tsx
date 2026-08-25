"use client";

import { useRef, useState } from "react";
import { toast } from "sonner";
import { FileUp, Loader2, Upload } from "lucide-react";
import { Button } from "@/components/ui/button";
import { resumeApi, toErrorMessage } from "@/lib/api";
import { ACCEPTED_RESUME_TYPES, MAX_RESUME_SIZE_BYTES } from "@/lib/constants";
import { formatBytes } from "@/lib/format";
import { cn } from "@/lib/utils";

interface ResumeUploaderProps {
  onUploaded: () => void;
  variant?: "empty" | "replace";
}

export function ResumeUploader({ onUploaded, variant = "empty" }: ResumeUploaderProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [dragging, setDragging] = useState(false);
  const [uploading, setUploading] = useState(false);

  async function upload(file: File) {
    setUploading(true);
    try {
      const resume = await resumeApi.uploadResume(file);
      toast.success("Resume uploaded", {
        description: `${resume.fileName} is being analysed.`,
      });
      onUploaded();
    } catch (error) {
      toast.error("Upload failed", { description: toErrorMessage(error) });
    } finally {
      setUploading(false);
    }
  }

  function handleFiles(files: FileList | null) {
    const file = files?.[0];
    if (file) void upload(file);
  }

  if (variant === "replace") {
    return (
      <>
        <input
          ref={inputRef}
          type="file"
          className="sr-only"
          accept={ACCEPTED_RESUME_TYPES.join(",")}
          onChange={(event) => handleFiles(event.target.files)}
        />
        <Button
          variant="secondary"
          size="sm"
          loading={uploading}
          onClick={() => inputRef.current?.click()}
        >
          {uploading ? null : <Upload />}
          Replace
        </Button>
      </>
    );
  }

  return (
    <div
      onDragOver={(event) => {
        event.preventDefault();
        setDragging(true);
      }}
      onDragLeave={() => setDragging(false)}
      onDrop={(event) => {
        event.preventDefault();
        setDragging(false);
        handleFiles(event.dataTransfer.files);
      }}
      className={cn(
        "flex flex-col items-center justify-center rounded-xl border border-dashed px-6 py-14 text-center transition-colors",
        dragging ? "border-primary bg-brand-subtle" : "border-border bg-card",
      )}
    >
      <input
        ref={inputRef}
        type="file"
        className="sr-only"
        accept={ACCEPTED_RESUME_TYPES.join(",")}
        onChange={(event) => handleFiles(event.target.files)}
      />

      <span className="flex size-11 items-center justify-center rounded-full border border-border bg-muted">
        {uploading ? (
          <Loader2 className="size-5 animate-spin text-primary" />
        ) : (
          <FileUp className="size-5 text-muted-foreground" strokeWidth={1.75} />
        )}
      </span>

      <h3 className="mt-4 text-sm font-semibold">
        {uploading ? "Uploading your resume" : "Upload your resume"}
      </h3>
      <p className="mt-1.5 max-w-sm text-sm leading-relaxed text-muted-foreground">
        {uploading
          ? "Hang tight, this only takes a moment."
          : "Drag and drop it here, or choose a file. Tayyo uses it to ask about your real projects."}
      </p>

      <Button className="mt-5" loading={uploading} onClick={() => inputRef.current?.click()}>
        {uploading ? null : <Upload />}
        Choose file
      </Button>

      <p className="mt-4 text-xs text-muted-foreground">
        {ACCEPTED_RESUME_TYPES.join(", ")} up to {formatBytes(MAX_RESUME_SIZE_BYTES)}
      </p>
    </div>
  );
}
