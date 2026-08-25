/**
 * Credit and billing domain types. Payments are intentionally not wired up —
 * `CreditPackage.id` is what the future checkout call will take.
 */

export interface CreditBalance {
  balance: number;
  /** Credits consumed in the current calendar month. */
  usedThisMonth: number;
  /** Lifetime credits purchased. */
  lifetimePurchased: number;
  lowBalanceThreshold: number;
}

export interface CreditPackage {
  id: string;
  name: string;
  priceLabel: string;
  priceValue: number;
  currency: "INR";
  credits: number;
  /** Extra credits granted on top of the base amount. */
  bonusCredits?: number;
  description: string;
  perks: string[];
  popular?: boolean;
  approxInterviews: string;
}

export type CreditActivityKind =
  | "mock-interview"
  | "practice-questions"
  | "report-generation"
  | "resume-analysis"
  | "purchase"
  | "bonus";

export interface CreditTransaction {
  id: string;
  date: string;
  activity: string;
  kind: CreditActivityKind;
  /** Negative for spend, positive for top-ups. */
  amount: number;
  balanceAfter: number;
  reference?: string;
}

/** Per-activity credit pricing used to estimate cost before a session starts. */
export interface CreditRateCard {
  perInterviewMinute: number;
  practiceQuestion: number;
  reportGeneration: number;
  resumeAnalysis: number;
}
