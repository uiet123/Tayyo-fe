import type {
  CreditBalance,
  CreditTransaction,
  Interview,
  Resume,
  User,
} from "@/types";
import { mockCreditBalance, mockCreditTransactions } from "@/lib/mock/credits";
import { mockInterviews } from "@/lib/mock/interviews";
import { mockResumes } from "@/lib/mock/resume";
import { mockUser } from "@/lib/mock/user";

/**
 * In-memory session store.
 *
 * Mock mutations (buying credits, deleting a resume, saving settings) write
 * here so the app behaves like a real product for the length of a session.
 * A page reload resets it. The real API replaces this file entirely.
 */
interface SessionStore {
  user: User;
  interviews: Interview[];
  resumes: Resume[];
  credits: CreditBalance;
  transactions: CreditTransaction[];
}

export const store: SessionStore = {
  user: structuredClone(mockUser),
  interviews: structuredClone(mockInterviews),
  resumes: structuredClone(mockResumes),
  credits: structuredClone(mockCreditBalance),
  transactions: structuredClone(mockCreditTransactions),
};

export function resetStore() {
  store.user = structuredClone(mockUser);
  store.interviews = structuredClone(mockInterviews);
  store.resumes = structuredClone(mockResumes);
  store.credits = structuredClone(mockCreditBalance);
  store.transactions = structuredClone(mockCreditTransactions);
}

/** Simple pub/sub so independent widgets stay in sync after a mutation. */
type Listener = () => void;
const listeners = new Set<Listener>();

export function subscribeToStore(listener: Listener) {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

export function notifyStoreChanged() {
  listeners.forEach((listener) => listener());
}
