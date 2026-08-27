import type {
  Interview,
  InterviewQuery,
  InterviewReport,
  InterviewSetup,
  LiveInterviewSession,
  Paginated,
  ScoreBreakdownItem,
} from "@/types";
import { CREDIT_RATES, SCORE_DIMENSION_LABELS } from "@/lib/constants";
import { questionsForType } from "@/lib/mock/questions";
import { request, type RequestOptions } from "./client";
import {
  mapInterview,
  toApiInterviewType,
  toApiStatus,
  type ApiInterview,
  type ApiPage,
  type ApiReport,
} from "./mappers";
import { notifyStoreChanged } from "./store";

function buildListParams(query: InterviewQuery = {}): string {
  const params = new URLSearchParams();
  if (query.page) params.set("page", String(query.page));
  if (query.pageSize) params.set("pageSize", String(query.pageSize));
  if (query.search?.trim()) params.set("search", query.search.trim());
  if (query.type && query.type !== "all") params.set("type", toApiInterviewType(query.type));
  if (query.status && query.status !== "all") params.set("status", toApiStatus(query.status));
  if (query.sort) params.set("sort", query.sort);
  const qs = params.toString();
  return qs ? `?${qs}` : "";
}

export async function listInterviews(
  query: InterviewQuery = {},
  options?: RequestOptions,
): Promise<Paginated<Interview>> {
  const data = await request<ApiPage<ApiInterview>>(
    `/interviews${buildListParams({ pageSize: 8, ...query })}`,
    {},
    options,
  );
  return { ...data, items: data.items.map(mapInterview) };
}

export async function getRecentInterviews(
  limit = 5,
  options?: RequestOptions,
): Promise<Interview[]> {
  const data = await request<ApiPage<ApiInterview>>(
    `/interviews?sort=recent&pageSize=${limit + 5}`,
    {},
    options,
  );
  return data.items
    .map(mapInterview)
    .filter((interview) => interview.status !== "scheduled")
    .slice(0, limit);
}

export async function getInterview(id: string, options?: RequestOptions): Promise<Interview> {
  const { interview } = await request<{ interview: ApiInterview }>(
    `/interviews/${id}`,
    {},
    options,
  );
  return mapInterview(interview);
}

export async function getInterviewReport(
  interviewId: string,
  options?: RequestOptions,
): Promise<InterviewReport> {
  const { report } = await request<{ report: ApiReport; interview: ApiInterview }>(
    `/interviews/${interviewId}/report`,
    {},
    options,
  );

  const dimensions: [keyof typeof SCORE_DIMENSION_LABELS, number][] = [
    ["communication", report.communicationScore],
    ["technical", report.technicalScore],
    ["confidence", report.confidenceScore],
    ["relevance", report.relevanceScore],
    ["structure", report.structureScore],
  ];
  const breakdown: ScoreBreakdownItem[] = dimensions.map(([dimension, score]) => ({
    dimension,
    label: SCORE_DIMENSION_LABELS[dimension],
    score,
    summary: "",
  }));

  return {
    id: report.id,
    interviewId,
    overallScore: report.overallScore,
    percentile: report.overallScore,
    summary: report.summary,
    breakdown,
    strengths: report.strengths ?? [],
    improvements: report.improvements ?? [],
    // Per-question reviews arrive with AI report generation.
    questions: [],
    generatedAt: report.createdAt,
  };
}

/** Create the interview server-side, start it, and open the room payload. */
export async function createInterviewSession(
  setup: InterviewSetup,
  options?: RequestOptions,
): Promise<LiveInterviewSession> {
  const { interview: created } = await request<{ interview: ApiInterview }>(
    "/interviews",
    {
      method: "POST",
      body: JSON.stringify({
        type: toApiInterviewType(setup.type),
        role: setup.role,
        company: setup.company || undefined,
        jobDescription: setup.jobDescription || undefined,
        experienceLevel: setup.experienceLevel,
        duration: setup.duration,
      }),
    },
    options,
  );

  // Start immediately — this is where the backend checks credits.
  const { interview: started } = await request<{ interview: ApiInterview }>(
    `/interviews/${created.id}/start`,
    { method: "POST" },
    options,
  );

  notifyStoreChanged();
  return {
    id: started.id,
    interview: mapInterview(started),
    questions: questionsForType(setup.type),
    status: "connecting",
    creditRate: CREDIT_RATES.perInterviewMinute,
  };
}

export async function getLiveSession(
  id: string,
  options?: RequestOptions,
): Promise<LiveInterviewSession> {
  const interview = await getInterview(id, options);
  return {
    id,
    interview,
    questions: questionsForType(interview.type),
    status: "connecting",
    creditRate: CREDIT_RATES.perInterviewMinute,
  };
}

export async function endInterviewSession(
  id: string,
  _elapsedSeconds: number,
  options?: RequestOptions,
): Promise<Interview> {
  // Billing is computed server-side from the recorded start time; the local
  // timer is display-only.
  const { interview } = await request<{ interview: ApiInterview }>(
    `/interviews/${id}/end`,
    { method: "POST" },
    options,
  );
  notifyStoreChanged();
  return mapInterview(interview);
}
