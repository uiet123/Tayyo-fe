import type {
  CreditActivityKind,
  CreditTransaction,
  Interview,
  InterviewStatus,
  InterviewTypeId,
  Resume,
  User,
} from "@/types";
import { INTERVIEW_TYPE_MAP } from "@/lib/constants";

/**
 * Wire types returned by the Tayyo backend and their mapping into the
 * frontend's UI domain types. Fields the backend does not model yet
 * (preferences, job title, resume insights…) get sensible defaults so no
 * component needs to change.
 */

// --- Backend wire shapes ---------------------------------------------------

export interface ApiUser {
  id: string;
  name: string;
  email: string;
  avatarUrl: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface ApiInterview {
  id: string;
  userId: string;
  type: string;
  role: string;
  company: string | null;
  jobDescription: string | null;
  experienceLevel: string | null;
  duration: number;
  creditsUsed: number;
  status: "CREATED" | "IN_PROGRESS" | "COMPLETED" | "CANCELLED";
  startedAt: string | null;
  endedAt: string | null;
  createdAt: string;
  updatedAt: string;
  report?: { id: string; overallScore: number } | null;
  _count?: { messages: number };
}

export interface ApiTransaction {
  id: string;
  type: "PURCHASE" | "INTERVIEW_USAGE" | "REFUND" | "BONUS" | "ADJUSTMENT";
  amount: number;
  balanceBefore: number;
  balanceAfter: number;
  referenceId: string | null;
  description: string | null;
  createdAt: string;
}

export interface ApiResume {
  id: string;
  fileName: string;
  fileUrl: string | null;
  fileSize: number;
  mimeType: string;
  isPrimary: boolean;
  structuredData: unknown;
  createdAt: string;
  updatedAt: string;
}

export interface ApiPage<T> {
  items: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

export interface ApiReport {
  id: string;
  sessionId: string;
  overallScore: number;
  communicationScore: number;
  technicalScore: number;
  confidenceScore: number;
  relevanceScore: number;
  structureScore: number;
  strengths: string[];
  improvements: string[];
  summary: string;
  createdAt: string;
}

// --- Enum mappings ---------------------------------------------------------

const TYPE_TO_API: Record<InterviewTypeId, string> = {
  behavioral: "BEHAVIORAL",
  technical: "TECHNICAL",
  coding: "CODING",
  hr: "HR",
  "system-design": "SYSTEM_DESIGN",
  product: "PRODUCT",
  custom: "CUSTOM",
};
const TYPE_FROM_API = Object.fromEntries(
  Object.entries(TYPE_TO_API).map(([ui, api]) => [api, ui]),
) as Record<string, InterviewTypeId>;

export const toApiInterviewType = (type: InterviewTypeId) => TYPE_TO_API[type];
export const fromApiInterviewType = (type: string): InterviewTypeId =>
  TYPE_FROM_API[type] ?? "custom";

const STATUS_TO_API: Record<InterviewStatus, ApiInterview["status"]> = {
  scheduled: "CREATED",
  "in-progress": "IN_PROGRESS",
  completed: "COMPLETED",
  abandoned: "CANCELLED",
};
const STATUS_FROM_API: Record<ApiInterview["status"], InterviewStatus> = {
  CREATED: "scheduled",
  IN_PROGRESS: "in-progress",
  COMPLETED: "completed",
  CANCELLED: "abandoned",
};

export const toApiStatus = (status: InterviewStatus) => STATUS_TO_API[status];

const TXN_KIND: Record<ApiTransaction["type"], CreditActivityKind> = {
  PURCHASE: "purchase",
  BONUS: "bonus",
  REFUND: "bonus",
  INTERVIEW_USAGE: "mock-interview",
  ADJUSTMENT: "bonus",
};

// --- Mappers ---------------------------------------------------------------

export function mapUser(user: ApiUser): User {
  return {
    id: user.id,
    name: user.name,
    email: user.email,
    avatarUrl: user.avatarUrl ?? undefined,
    experienceLevel: "mid",
    timezone: Intl.DateTimeFormat().resolvedOptions().timeZone ?? "UTC",
    createdAt: user.createdAt,
    preferences: {
      defaultInterviewType: "technical",
      defaultDurationMinutes: 30,
      theme: "system",
      emailReports: true,
      practiceReminders: true,
    },
  };
}

export function mapInterview(api: ApiInterview): Interview {
  const type = fromApiInterviewType(api.type);
  const label = INTERVIEW_TYPE_MAP[type]?.label ?? "Interview";
  return {
    id: api.id,
    title: `${api.role} — ${label} round`,
    type,
    role: api.role,
    company: api.company ?? undefined,
    duration: api.duration,
    score: api.report?.overallScore,
    status: STATUS_FROM_API[api.status] ?? "scheduled",
    createdAt: api.createdAt,
    completedAt: api.endedAt ?? undefined,
    questionCount: api._count?.messages ?? 0,
    creditsUsed: api.creditsUsed,
    reportId: api.report?.id,
    experienceLevel: api.experienceLevel ?? undefined,
  };
}

export function mapTransaction(api: ApiTransaction): CreditTransaction {
  return {
    id: api.id,
    date: api.createdAt,
    activity: api.description ?? api.type.replaceAll("_", " ").toLowerCase(),
    kind: TXN_KIND[api.type] ?? "bonus",
    amount: api.amount,
    balanceAfter: api.balanceAfter,
    reference: api.referenceId ?? undefined,
  };
}

export function mapResume(api: ApiResume): Resume {
  return {
    id: api.id,
    fileName: api.fileName,
    fileSize: api.fileSize,
    mimeType: api.mimeType,
    uploadedAt: api.createdAt,
    status: "ready",
    isPrimary: api.isPrimary,
    // Parsed insights arrive once AI resume parsing ships.
    insights: undefined,
  };
}
