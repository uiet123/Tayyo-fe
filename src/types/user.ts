/**
 * User & account domain types.
 * These are the contracts the UI renders against. When the real API lands,
 * only `lib/api/*` changes — components stay untouched.
 */

export type ThemePreference = "light" | "dark" | "system";

export type ExperienceLevel = "fresher" | "junior" | "mid" | "senior";

export interface UserPreferences {
  defaultInterviewType: string;
  defaultDurationMinutes: number;
  theme: ThemePreference;
  emailReports: boolean;
  practiceReminders: boolean;
}

export interface User {
  id: string;
  name: string;
  email: string;
  avatarUrl?: string;
  jobTitle?: string;
  targetRole?: string;
  experienceLevel: ExperienceLevel;
  timezone: string;
  createdAt: string;
  preferences: UserPreferences;
}

export interface AuthSession {
  user: User;
  token: string;
  expiresAt: string;
}

export interface SignInPayload {
  email: string;
  password: string;
}

export interface SignUpPayload {
  name: string;
  email: string;
  password: string;
}

/** Aggregated preparation stats shown on the dashboard. */
export interface PreparationStats {
  interviewsCompleted: number;
  averageScore: number;
  questionsPracticed: number;
  currentStreakDays: number;
  /** Percentage deltas vs. the previous period. */
  interviewsDelta?: number;
  scoreDelta?: number;
  questionsDelta?: number;
}
