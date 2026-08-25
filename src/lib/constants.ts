import type {
  CreditRateCard,
  InterviewDuration,
  InterviewTypeId,
  InterviewTypeMeta,
} from "@/types";

export const BRAND = {
  name: "Tayyo",
  productName: "Tayyo AI",
  positioning: "AI Interview Companion",
  tagline: "Be ready for what's next.",
  subheadline:
    "Practice smarter, prepare better, and walk into every interview with confidence.",
} as const;

/**
 * Single source of truth for interview types. Icon names are resolved to
 * Lucide components in `components/interview/interview-type-icon.tsx`.
 */
export const INTERVIEW_TYPES: InterviewTypeMeta[] = [
  {
    id: "behavioral",
    label: "Behavioral",
    description: "STAR-method questions on ownership, conflict and impact.",
    icon: "MessagesSquare",
    sampleFocus: ["Ownership", "Conflict", "Leadership", "Failure"],
  },
  {
    id: "technical",
    label: "Technical",
    description: "Depth checks across your stack, architecture and trade-offs.",
    icon: "Cpu",
    sampleFocus: ["Fundamentals", "Trade-offs", "Debugging", "Best practices"],
  },
  {
    id: "coding",
    label: "Coding",
    description: "Live problem solving with reasoning read aloud.",
    icon: "Code2",
    sampleFocus: ["Data structures", "Complexity", "Edge cases", "Testing"],
  },
  {
    id: "hr",
    label: "HR",
    description: "Motivation, culture fit, notice period and compensation.",
    icon: "UserRound",
    sampleFocus: ["Motivation", "Culture fit", "Expectations", "Availability"],
  },
  {
    id: "system-design",
    label: "System Design",
    description: "Scale, storage, bottlenecks and clear architectural narration.",
    icon: "Network",
    sampleFocus: ["Scale", "Storage", "Caching", "Failure modes"],
  },
  {
    id: "product",
    label: "Product",
    description: "Product sense, metrics, prioritisation and user empathy.",
    icon: "Lightbulb",
    sampleFocus: ["Metrics", "Prioritisation", "User empathy", "Trade-offs"],
  },
  {
    id: "custom",
    label: "Custom",
    description: "Paste a job description and Tayyo builds the round for you.",
    icon: "Sparkles",
    sampleFocus: ["Role specific", "JD aligned", "Mixed format"],
  },
];

export const INTERVIEW_TYPE_MAP: Record<InterviewTypeId, InterviewTypeMeta> =
  INTERVIEW_TYPES.reduce(
    (acc, type) => ({ ...acc, [type.id]: type }),
    {} as Record<InterviewTypeId, InterviewTypeMeta>,
  );

export const EXPERIENCE_LEVELS = [
  { id: "fresher", label: "Fresher", hint: "0-1 years" },
  { id: "junior", label: "Junior", hint: "1-3 years" },
  { id: "mid", label: "Mid-level", hint: "3-6 years" },
  { id: "senior", label: "Senior", hint: "6+ years" },
] as const;

export const INTERVIEW_DURATIONS: {
  value: InterviewDuration;
  label: string;
  hint: string;
}[] = [
  { value: 15, label: "15 minutes", hint: "Quick warm-up" },
  { value: 30, label: "30 minutes", hint: "Standard round" },
  { value: 45, label: "45 minutes", hint: "Full loop" },
  { value: 60, label: "60 minutes", hint: "Deep dive" },
];

/** Credit pricing. Kept here so estimates never drift between screens. */
export const CREDIT_RATES: CreditRateCard = {
  perInterviewMinute: 2,
  practiceQuestion: 1,
  reportGeneration: 10,
  resumeAnalysis: 5,
};

export function estimateInterviewCredits(durationMinutes: number) {
  return durationMinutes * CREDIT_RATES.perInterviewMinute + CREDIT_RATES.reportGeneration;
}

export const SCORE_DIMENSION_LABELS = {
  communication: "Communication",
  technical: "Technical knowledge",
  confidence: "Confidence",
  relevance: "Relevance",
  structure: "Structure",
} as const;

export const ACCEPTED_RESUME_TYPES = [".pdf", ".doc", ".docx"] as const;
export const MAX_RESUME_SIZE_BYTES = 5 * 1024 * 1024;
