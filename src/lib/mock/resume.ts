import type { Resume } from "@/types";
import { daysAgo } from "./reference-time";

export const mockResume: Resume = {
  id: "res_4a91cd",
  fileName: "Aarav_Sharma_Backend_Engineer.pdf",
  fileSize: 284_312,
  mimeType: "application/pdf",
  uploadedAt: daysAgo(9, 4),
  status: "ready",
  isPrimary: true,
  insights: {
    headline: "Backend engineer with payments and high-throughput API experience",
    yearsOfExperience: 4,
    skills: [
      { name: "TypeScript", category: "language", confidence: 96 },
      { name: "Node.js", category: "framework", confidence: 94 },
      { name: "PostgreSQL", category: "tool", confidence: 91 },
      { name: "Go", category: "language", confidence: 72 },
      { name: "Redis", category: "tool", confidence: 88 },
      { name: "Kafka", category: "tool", confidence: 79 },
      { name: "Docker", category: "tool", confidence: 85 },
      { name: "System design", category: "concept", confidence: 81 },
      { name: "AWS", category: "tool", confidence: 76 },
      { name: "GraphQL", category: "framework", confidence: 64 },
      { name: "Mentoring", category: "soft", confidence: 70 },
      { name: "Incident response", category: "concept", confidence: 83 },
    ],
    experience: [
      {
        id: "exp_1",
        company: "Finwise Technologies",
        role: "Software Engineer II",
        period: "2023 — Present",
        highlights: [
          "Owns the settlement service processing 2.4M transactions per day.",
          "Cut p99 latency on the reconciliation API from 1.8s to 340ms.",
          "Primary on-call for the payments domain for 14 months.",
        ],
      },
      {
        id: "exp_2",
        company: "Kestrel Labs",
        role: "Backend Engineer",
        period: "2022 — 2023",
        highlights: [
          "Built the billing and invoicing stack from scratch for 400+ merchants.",
          "Introduced idempotency keys, removing a class of duplicate-charge bugs.",
        ],
      },
    ],
    projects: [
      {
        id: "proj_1",
        name: "Ledger Reconciler",
        description:
          "Open-source double-entry reconciliation engine with pluggable adapters for payment gateways.",
        stack: ["TypeScript", "PostgreSQL", "Docker"],
      },
      {
        id: "proj_2",
        name: "Queue Inspector",
        description:
          "CLI for inspecting and replaying dead-letter messages across Redis and Kafka.",
        stack: ["Go", "Redis", "Kafka"],
      },
    ],
    strengths: [
      "Depth in payments domain, which is rare and highly transferable.",
      "Clear evidence of production ownership, including on-call.",
      "Quantified impact on two of three roles.",
    ],
    gaps: [
      "No Kubernetes or cluster-operations experience listed.",
      "Team leadership is implied but never stated explicitly.",
      "Education section sits above experience, which buries your strongest content.",
    ],
  },
};

/** All resumes on the account. Multi-resume support is already modelled. */
export const mockResumes: Resume[] = [mockResume];
