"use client";

import { Toaster as SonnerToaster } from "sonner";

/**
 * Toast host. Mounted once in the root layout; call `toast()` from anywhere.
 */
export function Toaster() {
  return (
    <SonnerToaster
      position="bottom-right"
      gap={10}
      toastOptions={{
        classNames: {
          toast:
            "!bg-popover !text-popover-foreground !border-border !shadow-pop !rounded-lg !text-sm",
          description: "!text-muted-foreground",
          actionButton: "!bg-primary !text-primary-foreground",
          cancelButton: "!bg-muted !text-muted-foreground",
          error: "!text-destructive",
          success: "!text-success",
        },
      }}
    />
  );
}
