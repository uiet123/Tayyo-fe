"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import {
  ArrowUpDown,
  ChevronLeft,
  ChevronRight,
  FileBarChart,
  Filter,
  Search,
  X,
} from "lucide-react";
import type { InterviewQuery, InterviewSortKey, InterviewStatus, InterviewTypeId } from "@/types";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";
import { EmptyState } from "@/components/ui/empty-state";
import { ErrorState } from "@/components/ui/error-state";
import { InterviewStatusBadge } from "./interview-status-badge";
import { InterviewTypeBadge, InterviewTypeIcon } from "./interview-type-badge";
import { ScoreBadge } from "@/components/reports/score-badge";
import { useApiResource } from "@/hooks";
import { interviewsApi } from "@/lib/api";
import { formatDate, formatDuration } from "@/lib/format";
import { INTERVIEW_TYPES } from "@/lib/constants";

const SORT_OPTIONS: { value: InterviewSortKey; label: string }[] = [
  { value: "recent", label: "Newest first" },
  { value: "oldest", label: "Oldest first" },
  { value: "score-desc", label: "Highest score" },
  { value: "score-asc", label: "Lowest score" },
  { value: "duration", label: "Longest session" },
];

const STATUS_OPTIONS: { value: InterviewStatus | "all"; label: string }[] = [
  { value: "all", label: "All statuses" },
  { value: "completed", label: "Completed" },
  { value: "in-progress", label: "In progress" },
  { value: "scheduled", label: "Scheduled" },
  { value: "abandoned", label: "Abandoned" },
];

const PAGE_SIZE = 8;

export function InterviewsTable() {
  const [searchInput, setSearchInput] = useState("");
  const [search, setSearch] = useState("");
  const [type, setType] = useState<InterviewTypeId | "all">("all");
  const [status, setStatus] = useState<InterviewStatus | "all">("all");
  const [sort, setSort] = useState<InterviewSortKey>("recent");
  const [page, setPage] = useState(1);

  useEffect(() => {
    const timer = setTimeout(() => {
      setSearch(searchInput);
      setPage(1);
    }, 300);
    return () => clearTimeout(timer);
  }, [searchInput]);

  const query = useMemo<InterviewQuery>(
    () => ({ search, type, status, sort, page, pageSize: PAGE_SIZE }),
    [search, type, status, sort, page],
  );

  const { data, error, isLoading, refetch } = useApiResource(
    (signal) => interviewsApi.listInterviews(query, { signal, latencyMs: 400 }),
    [query],
    { subscribeToMutations: true },
  );

  const filtersActive = Boolean(search) || type !== "all" || status !== "all";

  function resetFilters() {
    setSearchInput("");
    setSearch("");
    setType("all");
    setStatus("all");
    setPage(1);
  }

  return (
    <div className="space-y-4">
      {/* Toolbar */}
      <div className="flex flex-col gap-3 lg:flex-row lg:items-center">
        <div className="relative lg:max-w-xs lg:flex-1">
          <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={searchInput}
            onChange={(event) => setSearchInput(event.target.value)}
            placeholder="Search by title, role or company"
            className="pl-9 pr-9"
            aria-label="Search interviews"
          />
          {searchInput ? (
            <button
              type="button"
              onClick={() => setSearchInput("")}
              aria-label="Clear search"
              className="absolute right-2 top-1/2 flex size-6 -translate-y-1/2 items-center justify-center rounded text-muted-foreground hover:text-foreground"
            >
              <X className="size-3.5" />
            </button>
          ) : null}
        </div>

        <div className="flex flex-wrap items-center gap-2 lg:ml-auto">
          <Select
            value={type}
            onValueChange={(value) => {
              setType(value as InterviewTypeId | "all");
              setPage(1);
            }}
          >
            <SelectTrigger className="h-10 w-[150px]" aria-label="Filter by type">
              <span className="flex items-center gap-2 truncate">
                <Filter className="size-3.5 shrink-0 text-muted-foreground" />
                <SelectValue />
              </span>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All types</SelectItem>
              {INTERVIEW_TYPES.map((item) => (
                <SelectItem key={item.id} value={item.id}>
                  {item.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select
            value={status}
            onValueChange={(value) => {
              setStatus(value as InterviewStatus | "all");
              setPage(1);
            }}
          >
            <SelectTrigger className="h-10 w-[150px]" aria-label="Filter by status">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {STATUS_OPTIONS.map((item) => (
                <SelectItem key={item.value} value={item.value}>
                  {item.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={sort} onValueChange={(value) => setSort(value as InterviewSortKey)}>
            <SelectTrigger className="h-10 w-[160px]" aria-label="Sort interviews">
              <span className="flex items-center gap-2 truncate">
                <ArrowUpDown className="size-3.5 shrink-0 text-muted-foreground" />
                <SelectValue />
              </span>
            </SelectTrigger>
            <SelectContent>
              {SORT_OPTIONS.map((item) => (
                <SelectItem key={item.value} value={item.value}>
                  {item.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {filtersActive ? (
            <Button variant="ghost" size="sm" onClick={resetFilters}>
              <X />
              Clear
            </Button>
          ) : null}
        </div>
      </div>

      {error ? (
        <ErrorState message={error} onRetry={refetch} />
      ) : isLoading ? (
        <Card className="overflow-hidden">
          <div className="divide-y divide-border">
            {Array.from({ length: 6 }).map((_, index) => (
              <div key={index} className="flex items-center gap-4 px-4 py-4">
                <Skeleton className="size-9 rounded-lg" />
                <div className="flex-1 space-y-2">
                  <Skeleton className="h-4 w-56 max-w-full" />
                  <Skeleton className="h-3 w-40" />
                </div>
                <Skeleton className="hidden h-6 w-24 rounded-full sm:block" />
                <Skeleton className="h-6 w-12 rounded-md" />
              </div>
            ))}
          </div>
        </Card>
      ) : !data || data.items.length === 0 ? (
        <EmptyState
          icon={FileBarChart}
          title={filtersActive ? "No interviews match those filters" : "No interviews yet"}
          description={
            filtersActive
              ? "Try a different search term, or clear the filters to see everything."
              : "Run your first mock interview and it will show up here with a full report."
          }
          action={
            filtersActive ? (
              <Button variant="secondary" size="sm" onClick={resetFilters}>
                Clear filters
              </Button>
            ) : (
              <Button asChild size="sm">
                <Link href="/dashboard/practice">Start Mock Interview</Link>
              </Button>
            )
          }
        />
      ) : (
        <>
          <Card className="hidden overflow-hidden md:block">
            <Table>
              <TableHeader>
                <TableRow className="hover:bg-transparent">
                  <TableHead>Interview</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Duration</TableHead>
                  <TableHead>Score</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Report</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {data.items.map((interview) => (
                  <TableRow key={interview.id}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <span className="flex size-8 shrink-0 items-center justify-center rounded-lg border border-border bg-muted">
                          <InterviewTypeIcon type={interview.type} className="size-3.5" />
                        </span>
                        <div className="min-w-0">
                          <p className="truncate text-sm font-medium">{interview.title}</p>
                          <p className="truncate text-xs text-muted-foreground">
                            {interview.role}
                            {interview.company ? ` at ${interview.company}` : ""}
                          </p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <InterviewTypeBadge type={interview.type} />
                    </TableCell>
                    <TableCell className="whitespace-nowrap text-sm text-muted-foreground">
                      {formatDate(interview.createdAt)}
                    </TableCell>
                    <TableCell className="whitespace-nowrap text-sm text-muted-foreground">
                      {formatDuration(interview.duration)}
                    </TableCell>
                    <TableCell>
                      <ScoreBadge score={interview.score} />
                    </TableCell>
                    <TableCell>
                      <InterviewStatusBadge status={interview.status} />
                    </TableCell>
                    <TableCell className="text-right">
                      {interview.status === "completed" ? (
                        <Button asChild variant="ghost" size="sm">
                          <Link href={`/dashboard/interviews/${interview.id}/report`}>
                            View report
                            <ChevronRight />
                          </Link>
                        </Button>
                      ) : interview.status === "in-progress" ? (
                        <Button asChild variant="ghost" size="sm">
                          <Link href={`/dashboard/interview/${interview.id}`}>
                            Resume
                            <ChevronRight />
                          </Link>
                        </Button>
                      ) : (
                        <span className="text-xs text-muted-foreground">Not available</span>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Card>

          <div className="space-y-3 md:hidden">
            {data.items.map((interview) => (
              <Card key={interview.id} className="p-4">
                <div className="flex items-start gap-3">
                  <span className="flex size-9 shrink-0 items-center justify-center rounded-lg border border-border bg-muted">
                    <InterviewTypeIcon type={interview.type} className="size-4" />
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium">{interview.title}</p>
                    <p className="truncate text-xs text-muted-foreground">
                      {interview.role}
                      {interview.company ? ` at ${interview.company}` : ""}
                    </p>
                  </div>
                  <ScoreBadge score={interview.score} />
                </div>

                <div className="mt-3 flex flex-wrap items-center gap-x-3 gap-y-2 text-xs text-muted-foreground">
                  <InterviewStatusBadge status={interview.status} />
                  <span>{formatDate(interview.createdAt)}</span>
                  <span>{formatDuration(interview.duration)}</span>
                </div>

                {interview.status === "completed" ? (
                  <Button asChild variant="secondary" size="sm" className="mt-4 w-full">
                    <Link href={`/dashboard/interviews/${interview.id}/report`}>View report</Link>
                  </Button>
                ) : interview.status === "in-progress" ? (
                  <Button asChild variant="secondary" size="sm" className="mt-4 w-full">
                    <Link href={`/dashboard/interview/${interview.id}`}>Resume interview</Link>
                  </Button>
                ) : null}
              </Card>
            ))}
          </div>

          <div className="flex flex-col items-center justify-between gap-3 sm:flex-row">
            <p className="text-sm text-muted-foreground">
              Showing{" "}
              <span className="font-medium text-foreground">
                {(data.page - 1) * data.pageSize + 1}
                {"-"}
                {Math.min(data.page * data.pageSize, data.total)}
              </span>{" "}
              of <span className="font-medium text-foreground">{data.total}</span> interviews
            </p>

            <div className="flex items-center gap-1">
              <Button
                variant="secondary"
                size="icon-sm"
                aria-label="Previous page"
                disabled={data.page <= 1}
                onClick={() => setPage((value) => Math.max(1, value - 1))}
              >
                <ChevronLeft />
              </Button>

              {Array.from({ length: data.totalPages }).map((_, index) => {
                const pageNumber = index + 1;
                return (
                  <Button
                    key={pageNumber}
                    variant={pageNumber === data.page ? "default" : "ghost"}
                    size="icon-sm"
                    aria-label={`Page ${pageNumber}`}
                    aria-current={pageNumber === data.page ? "page" : undefined}
                    onClick={() => setPage(pageNumber)}
                  >
                    {pageNumber}
                  </Button>
                );
              })}

              <Button
                variant="secondary"
                size="icon-sm"
                aria-label="Next page"
                disabled={data.page >= data.totalPages}
                onClick={() => setPage((value) => Math.min(data.totalPages, value + 1))}
              >
                <ChevronRight />
              </Button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
