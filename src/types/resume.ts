/**
 * Resume domain types. Parsing is not implemented yet — `insights` describes
 * the shape the parser will eventually return.
 */

export type ResumeStatus = "processing" | "ready" | "failed";

export interface ResumeSkill {
  name: string;
  category: "language" | "framework" | "tool" | "concept" | "soft";
  /** Parser confidence, 0 to 100. */
  confidence: number;
}

export interface ResumeExperience {
  id: string;
  company: string;
  role: string;
  period: string;
  highlights: string[];
}

export interface ResumeProject {
  id: string;
  name: string;
  description: string;
  stack: string[];
}

export interface ResumeInsights {
  headline: string;
  yearsOfExperience: number;
  skills: ResumeSkill[];
  experience: ResumeExperience[];
  projects: ResumeProject[];
  strengths: string[];
  gaps: string[];
}

export interface Resume {
  id: string;
  fileName: string;
  fileSize: number;
  mimeType: string;
  uploadedAt: string;
  status: ResumeStatus;
  isPrimary: boolean;
  insights?: ResumeInsights;
}
