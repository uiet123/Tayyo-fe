/**
 * Interview domain types — sessions, live-room state and reports.
 */

export type InterviewTypeId =
  | "behavioral"
  | "technical"
  | "coding"
  | "hr"
  | "system-design"
  | "product"
  | "custom";

export type InterviewStatus = "completed" | "in-progress" | "scheduled" | "abandoned";

export type InterviewDuration = 15 | 30 | 45 | 60;

export interface InterviewTypeMeta {
  id: InterviewTypeId;
  label: string;
  description: string;
  /** Lucide icon name, resolved in the UI layer. */
  icon: string;
  sampleFocus: string[];
}

/**
 * The canonical interview record. `score` and `reportId` only exist once a
 * session has been completed and graded.
 */
export interface Interview {
  id: string;
  title: string;
  type: InterviewTypeId;
  role: string;
  company?: string;
  /** Duration in minutes. */
  duration: number;
  score?: number;
  status: InterviewStatus;
  createdAt: string;
  completedAt?: string;
  questionCount: number;
  creditsUsed: number;
  reportId?: string;
  experienceLevel?: string;
}

export interface InterviewSetup {
  type: InterviewTypeId;
  experienceLevel: string;
  role: string;
  company?: string;
  jobDescription?: string;
  resumeId?: string;
  duration: InterviewDuration;
}

export type TranscriptRole = "interviewer" | "candidate" | "system";

export interface TranscriptEntry {
  id: string;
  role: TranscriptRole;
  content: string;
  /** Seconds elapsed since the session started. */
  at: number;
}

export interface InterviewQuestion {
  id: string;
  index: number;
  prompt: string;
  category: string;
  difficulty: "easy" | "medium" | "hard";
  /** Coaching hints surfaced in the live AI panel. */
  hints: string[];
  suggestedAnswer: string;
}

export type MicStatus = "idle" | "listening" | "muted" | "processing";

export type LiveSessionStatus = "connecting" | "live" | "paused" | "ended";

export interface LiveInterviewSession {
  id: string;
  interview: Interview;
  questions: InterviewQuestion[];
  status: LiveSessionStatus;
  /** Credits consumed per minute of live session. */
  creditRate: number;
}

export type ScoreDimension =
  | "communication"
  | "technical"
  | "confidence"
  | "relevance"
  | "structure";

export interface ScoreBreakdownItem {
  dimension: ScoreDimension;
  label: string;
  score: number;
  summary: string;
}

export interface QuestionReview {
  id: string;
  index: number;
  question: string;
  category: string;
  userResponse: string;
  aiFeedback: string;
  suggestedResponse: string;
  score: number;
  durationSeconds: number;
}

export interface InterviewReport {
  id: string;
  interviewId: string;
  overallScore: number;
  /** Percentile against other Tayyo candidates for the same role. */
  percentile: number;
  summary: string;
  breakdown: ScoreBreakdownItem[];
  strengths: string[];
  improvements: string[];
  questions: QuestionReview[];
  generatedAt: string;
}

export type InterviewSortKey = "recent" | "oldest" | "score-desc" | "score-asc" | "duration";

export interface InterviewQuery {
  search?: string;
  type?: InterviewTypeId | "all";
  status?: InterviewStatus | "all";
  sort?: InterviewSortKey;
  page?: number;
  pageSize?: number;
}

export interface Paginated<T> {
  items: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}
