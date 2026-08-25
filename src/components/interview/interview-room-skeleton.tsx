import { Skeleton } from "@/components/ui/skeleton";

export function InterviewRoomSkeleton() {
  return (
    <div className="flex h-dvh flex-col overflow-hidden bg-canvas">
      <div className="flex h-14 shrink-0 items-center gap-4 border-b border-border bg-card px-5">
        <Skeleton className="size-6 rounded-lg" />
        <Skeleton className="h-6 w-40 rounded-full" />
        <div className="ml-auto flex items-center gap-4">
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-4 w-20" />
        </div>
      </div>

      <div className="grid min-h-0 flex-1 lg:grid-cols-[minmax(0,1fr)_380px]">
        <div className="border-r border-border bg-background px-8 py-8">
          <div className="mx-auto max-w-2xl space-y-6">
            <Skeleton className="h-5 w-36 rounded-full" />
            <Skeleton className="h-6 w-full" />
            <Skeleton className="h-6 w-4/5" />
            <div className="space-y-4 pt-6">
              {Array.from({ length: 3 }).map((_, index) => (
                <div key={index} className="flex gap-3">
                  <Skeleton className="size-7 rounded-full" />
                  <div className="flex-1 space-y-2">
                    <Skeleton className="h-3 w-24" />
                    <Skeleton className="h-4 w-full" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="hidden bg-card px-5 py-5 lg:block">
          <Skeleton className="h-4 w-24" />
          <div className="mt-6 space-y-3">
            {Array.from({ length: 3 }).map((_, index) => (
              <Skeleton key={index} className="h-16 rounded-lg" />
            ))}
          </div>
        </div>
      </div>

      <div className="flex h-16 shrink-0 items-center gap-3 border-t border-border bg-card px-5">
        <Skeleton className="size-9 rounded-full" />
        <Skeleton className="h-4 w-32" />
        <div className="ml-auto flex gap-2">
          <Skeleton className="h-8 w-20" />
          <Skeleton className="h-8 w-32" />
          <Skeleton className="h-8 w-32" />
        </div>
      </div>
    </div>
  );
}
