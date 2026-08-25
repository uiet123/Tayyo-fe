import type { PreparationStats, User } from "@/types";
import { daysAgo } from "./reference-time";

export const mockUser: User = {
  id: "usr_9f2c41",
  name: "Aarav Sharma",
  email: "aarav.sharma@gmail.com",
  jobTitle: "Software Engineer",
  targetRole: "Senior Backend Engineer",
  experienceLevel: "mid",
  timezone: "Asia/Kolkata",
  createdAt: daysAgo(112),
  preferences: {
    defaultInterviewType: "technical",
    defaultDurationMinutes: 30,
    theme: "light",
    emailReports: true,
    practiceReminders: true,
  },
};

export const mockPreparationStats: PreparationStats = {
  interviewsCompleted: 14,
  averageScore: 78,
  questionsPracticed: 186,
  currentStreakDays: 6,
  interviewsDelta: 27,
  scoreDelta: 6,
  questionsDelta: 41,
};
