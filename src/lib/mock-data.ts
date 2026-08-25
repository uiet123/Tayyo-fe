/**
 * Centralised mock data barrel.
 *
 * Components never import from `lib/mock/*` directly — they go through
 * `lib/api/*`, which is the seam that will be swapped for real HTTP calls.
 * This file exists so mock fixtures are discoverable in one place.
 */

export { mockUser, mockPreparationStats } from "./mock/user";
export { mockInterviews } from "./mock/interviews";
export { mockQuestions, QUESTION_BANK, questionsForType } from "./mock/questions";
export { mockReports, buildReport, findReportByInterviewId } from "./mock/reports";
export { mockResume, mockResumes } from "./mock/resume";
export {
  mockCreditBalance as mockCredits,
  mockCreditPackages,
  mockCreditTransactions,
} from "./mock/credits";
export {
  howItWorksSteps,
  landingFeatures,
  testimonials,
  faqs,
  trustStats,
} from "./mock/marketing";
export type { HowItWorksStep, FeatureItem, Testimonial, FaqItem } from "./mock/marketing";
