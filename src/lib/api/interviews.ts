import type {
  Interview,
  InterviewQuery,
  InterviewReport,
  InterviewSetup,
  LiveInterviewSession,
  Paginated,
} from "@/types";
import { CREDIT_RATES, estimateInterviewCredits } from "@/lib/constants";
import { buildReport } from "@/lib/mock/reports";
import { questionsForType } from "@/lib/mock/questions";
import { ApiError, request, type RequestOptions } from "./client";
import { notifyStoreChanged, store } from "./store";

const DEFAULT_PAGE_SIZE = 8;

function matchesQuery(interview: Interview, query: InterviewQuery) {
  const search = query.search?.trim().toLowerCase();
  if (search) {
    const haystack = [interview.title, interview.role, interview.company ?? ""]
      .join(" ")
      .toLowerCase();
    if (!haystack.includes(search)) return false;
  }
  if (query.type && query.type !== "all" && interview.type !== query.type) return false;
  if (query.status && query.status !== "all" && interview.status !== query.status) return false;
  return true;
}

function sortInterviews(items: Interview[], sort: InterviewQuery["sort"] = "recent") {
  const sorted = [...items];
  switch (sort) {
    case "oldest":
      return sorted.sort((a, b) => +new Date(a.createdAt) - +new Date(b.createdAt));
    case "score-desc":
      return sorted.sort((a, b) => (b.score ?? -1) - (a.score ?? -1));
    case "score-asc":
      return sorted.sort((a, b) => (a.score ?? 101) - (b.score ?? 101));
    case "duration":
      return sorted.sort((a, b) => b.duration - a.duration);
    case "recent":
    default:
      return sorted.sort((a, b) => +new Date(b.createdAt) - +new Date(a.createdAt));
  }
}

export function listInterviews(
  query: InterviewQuery = {},
  options?: RequestOptions,
): Promise<Paginated<Interview>> {
  return request(() => {
    const page = Math.max(1, query.page ?? 1);
    const pageSize = query.pageSize ?? DEFAULT_PAGE_SIZE;
    const filtered = sortInterviews(
      store.interviews.filter((interview) => matchesQuery(interview, query)),
      query.sort,
    );
    const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
    const safePage = Math.min(page, totalPages);

    return {
      items: filtered.slice((safePage - 1) * pageSize, safePage * pageSize),
      total: filtered.length,
      page: safePage,
      pageSize,
      totalPages,
    };
  }, options);
}

export function getRecentInterviews(limit = 5, options?: RequestOptions): Promise<Interview[]> {
  return request(
    () =>
      sortInterviews(
        store.interviews.filter((interview) => interview.status !== "scheduled"),
        "recent",
      ).slice(0, limit),
    options,
  );
}

export function getInterview(id: string, options?: RequestOptions): Promise<Interview> {
  return request(() => {
    const interview = store.interviews.find((item) => item.id === id);
    if (!interview) throw new ApiError("Interview not found.", 404, "INTERVIEW_NOT_FOUND");
    return interview;
  }, options);
}

export function getInterviewReport(
  interviewId: string,
  options?: RequestOptions,
): Promise<InterviewReport> {
  return request(() => {
    const interview = store.interviews.find((item) => item.id === interviewId);
    if (!interview) throw new ApiError("Interview not found.", 404, "INTERVIEW_NOT_FOUND");
    if (interview.status !== "completed") {
      throw new ApiError(
        "This interview has no report yet. Reports are generated once a session ends.",
        409,
        "REPORT_NOT_READY",
      );
    }
    return buildReport(interview);
  }, options);
}

/**
 * Creates a session and returns the room payload. The real implementation will
 * also provision the realtime channel and the speech pipeline.
 */
export function createInterviewSession(
  setup: InterviewSetup,
  options?: RequestOptions,
): Promise<LiveInterviewSession> {
  return request(() => {
    const cost = estimateInterviewCredits(setup.duration);
    if (store.credits.balance < cost) {
      throw new ApiError(
        `You need ${cost} credits to start this interview and have ${store.credits.balance}.`,
        402,
        "INSUFFICIENT_CREDITS",
      );
    }

    const id = `int_${Math.random().toString(36).slice(2, 8)}`;
    const questions = questionsForType(setup.type);
    const interview: Interview = {
      id,
      title: `${setup.role} — ${setup.type.replace("-", " ")} round`,
      type: setup.type,
      role: setup.role,
      company: setup.company || undefined,
      duration: setup.duration,
      status: "in-progress",
      createdAt: new Date().toISOString(),
      questionCount: questions.length,
      creditsUsed: 0,
      experienceLevel: setup.experienceLevel,
    };

    store.interviews = [interview, ...store.interviews];
    notifyStoreChanged();

    return {
      id,
      interview,
      questions,
      status: "connecting" as const,
      creditRate: CREDIT_RATES.perInterviewMinute,
    };
  }, options);
}

export function getLiveSession(
  id: string,
  options?: RequestOptions,
): Promise<LiveInterviewSession> {
  return request(() => {
    const interview = store.interviews.find((item) => item.id === id);
    if (!interview) throw new ApiError("Session not found.", 404, "SESSION_NOT_FOUND");
    return {
      id,
      interview,
      questions: questionsForType(interview.type),
      status: "connecting" as const,
      creditRate: CREDIT_RATES.perInterviewMinute,
    };
  }, options);
}

export function endInterviewSession(
  id: string,
  elapsedSeconds: number,
  options?: RequestOptions,
): Promise<Interview> {
  return request(() => {
    const interview = store.interviews.find((item) => item.id === id);
    if (!interview) throw new ApiError("Session not found.", 404, "SESSION_NOT_FOUND");

    const minutes = Math.max(1, Math.ceil(elapsedSeconds / 60));
    const creditsUsed = minutes * CREDIT_RATES.perInterviewMinute + CREDIT_RATES.reportGeneration;

    interview.status = "completed";
    interview.completedAt = new Date().toISOString();
    interview.creditsUsed = creditsUsed;
    interview.score = 74;
    interview.reportId = `rep_${id}`;

    store.credits.balance = Math.max(0, store.credits.balance - creditsUsed);
    store.credits.usedThisMonth += creditsUsed;
    store.transactions = [
      {
        id: `txn_${Math.random().toString(36).slice(2, 8)}`,
        date: new Date().toISOString(),
        activity: `${interview.title}`,
        kind: "mock-interview",
        amount: -creditsUsed,
        balanceAfter: store.credits.balance,
        reference: id,
      },
      ...store.transactions,
    ];
    notifyStoreChanged();

    return interview;
  }, options);
}
