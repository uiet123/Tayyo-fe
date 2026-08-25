import type {
  Interview,
  InterviewReport,
  InterviewTypeId,
  QuestionReview,
  ScoreBreakdownItem,
  ScoreDimension,
} from "@/types";
import { mockInterviews } from "./interviews";
import { questionsForType } from "./questions";
import { seededInt, seededUnit } from "./reference-time";

/**
 * Recorded answers and coach feedback, keyed by question id. Keeping these in
 * one place means a report and the live room never disagree about a question.
 */
const REVIEW_BANK: Record<string, { userResponse: string; aiFeedback: string }> = {
  q_beh_1: {
    userResponse:
      "I worked on our checkout service when it was having issues. I added logging and some alerts, and after that we caught problems faster. It was a good project and the team was happy with it.",
    aiFeedback:
      "The situation is clear but the impact is vague. Replace phrases like the team was happy with a number: how many failures, how much faster. Also make your individual contribution explicit, since you said we three times and I once.",
  },
  q_beh_2: {
    userResponse:
      "A senior engineer wanted Kafka and I thought Redis streams were enough. We talked about it and eventually went with Kafka because it handled replay better. I ended up owning the migration.",
    aiFeedback:
      "Strong ending. You showed you can change your mind on evidence, which interviewers weigh heavily. What is missing is the how: name the constraints you wrote down and the benchmark you ran, because that is what proves the disagreement was resolved with data rather than seniority.",
  },
  q_beh_3: {
    userResponse:
      "I once ran a migration that locked a big table during the day. It caused downtime for about ten minutes. After that we were more careful with migrations and I wrote up what happened.",
    aiFeedback:
      "Good instinct picking a failure with real consequences. Spend two thirds of the answer on the correction instead of the incident. Wrote up what happened is passive: say you introduced a migration checklist and that N migrations have run since without customer-visible locking.",
  },
  q_beh_4: {
    userResponse:
      "Before a launch I had a compliance task and a performance bug. I did the compliance one first because it was blocking the launch, and I told the PM the other one would come later.",
    aiFeedback:
      "The decision was right and you communicated it, which is the hard part. Add the framework you used to rank them, such as customer impact against reversibility, so the answer generalises beyond this one story.",
  },
  q_beh_5: {
    userResponse:
      "I would set up a one-on-one and be honest but respectful. I try to focus on the work rather than the person and stay open to their side of it.",
    aiFeedback:
      "This is a philosophy, not an example. Interviewers cannot score intent. Anchor it in one real instance: what behaviour you observed, the exact sentence you opened with, and what changed afterwards.",
  },
  q_tec_1: {
    userResponse:
      "The request goes through the load balancer to one of our servers. The controller validates it, calls the service layer, and the repository queries the database. Then we serialise the response and send it back.",
    aiFeedback:
      "Accurate and well sequenced. To move from correct to senior, add the operational layer: where TLS terminates, how the connection pool is sized relative to pods, and where you set timeouts and retries. That is what distinguishes someone who has run this in production.",
  },
  q_tec_2: {
    userResponse:
      "I would check the logs and the APM traces to see which part is slow. Usually it is a database query, so I would look at the query plan and add an index if one is missing.",
    aiFeedback:
      "Right first move: measure before you change anything. Sharpen it by separating p50 from p99. A flat median with a spiking tail points at contention such as pool saturation or locking, which an index will not fix.",
  },
  q_tec_3: {
    userResponse:
      "Pessimistic locking locks the row so nobody else can write. Optimistic uses a version number and fails if someone else updated it first. Optimistic is better for performance in most cases.",
    aiFeedback:
      "The definitions are correct. The missing half is when: tie the choice to contention rate and to the cost of a lost update. Naming one case where you would deliberately accept the slower option, such as a ledger write, shows judgement rather than preference.",
  },
  q_tec_4: {
    userResponse:
      "I write unit tests for functions with logic and integration tests for the parts that touch the database or external services. I try to keep coverage reasonably high.",
    aiFeedback:
      "Solid heuristic. Drop the coverage framing, which senior interviewers read as a proxy metric, and replace it with cost of change: a test should fail when behaviour changes, not when structure changes.",
  },
  q_tec_5: {
    userResponse:
      "Idempotency means you can send the same request twice and it only takes effect once. For payments you send an idempotency key and the server checks whether it has seen that key before.",
    aiFeedback:
      "Correct definition and the right mechanism. The detail that matters in a payments interview is atomicity: the key insert and the charge have to be in the same transaction, otherwise a crash between them reintroduces the double charge you were preventing.",
  },
};

Object.assign(REVIEW_BANK, {
  q_cod_1: {
    userResponse:
      "I would use a hash map. Go through the array, and for each number check if target minus that number is in the map. If it is, return both indices. That is O(n).",
    aiFeedback:
      "Correct approach and correct complexity. You skipped the brute force baseline, which costs you nothing to state and shows the interviewer how you reason toward an optimisation instead of pattern-matching.",
  },
  q_cod_2: {
    userResponse:
      "Use two pointers and a set. Move the right pointer and add characters. If you hit a duplicate, move the left pointer forward until the duplicate is gone, tracking the maximum length.",
    aiFeedback:
      "Works, and it is O(n) amortised. The map-of-last-index variant lets you jump the left pointer directly instead of stepping it, which is cleaner to reason about and easier to defend under follow-up questions.",
  },
  q_cod_3: {
    userResponse:
      "I would put the head of every list into a min heap, pop the smallest one each time, add it to the result and push the next node from that list. That gives O(N log k).",
    aiFeedback:
      "Clean and correct. You were not asked for alternatives, but offering divide and conquer as a second option with its space trade-off is a cheap way to demonstrate breadth in a hard question.",
  },
  q_cod_4: {
    userResponse:
      "Do a DFS and keep a visited set. If you reach a node that is already visited, there is a cycle.",
    aiFeedback:
      "This is the common trap: a plain visited set produces false positives on a DAG with a diamond shape. You need to distinguish nodes on the current recursion stack from nodes fully explored, which is what the three-colour variant does.",
  },
  q_hr_1: {
    userResponse:
      "I am a software engineer with around four years of experience. I have worked mostly on backend systems, payments and APIs. Currently I am at my company working on the settlement service, and before that I was at a startup.",
    aiFeedback:
      "Good length and good order. Close the loop by connecting it to this role in one sentence, because interviewers use this answer to decide which parts of your background to probe next.",
  },
  q_hr_2: {
    userResponse:
      "There is not much growth left for me there. Most of my work is maintenance now and I want to work on something more challenging.",
    aiFeedback:
      "The reason is legitimate but the framing is negative and slightly vague. Point it forward: name the specific kind of problem you want next and tie it to something this team is actually working on.",
  },
  q_hr_3: {
    userResponse:
      "I am open to whatever the company thinks is fair for the role. I am mainly focused on the work rather than the money.",
    aiFeedback:
      "Deferring entirely weakens your position and is often read as unprepared. Give a researched range, then state your flexibility on the base and equity split. Flexibility after a number lands very differently from flexibility instead of one.",
  },
  q_hr_4: {
    userResponse:
      "I want to grow technically and take on more responsibility, maybe lead a team eventually. I am not in a rush, I just want to keep learning.",
    aiFeedback:
      "Honest but generic enough to fit any company. Anchor it to something specific here, like owning a domain end to end or mentoring, so it reads as considered rather than polite.",
  },
  q_hr_5: {
    userResponse:
      "It is 60 days, but I might be able to negotiate it down a bit depending on how things go.",
    aiFeedback:
      "Clear and honest, which is all this question needs. Add the condition that unlocks the shorter timeline, such as a written offer, so the recruiter can plan around it.",
  },
});

Object.assign(REVIEW_BANK, {
  q_sys_1: {
    userResponse:
      "I would generate a short code by hashing the URL, store the mapping in a database, and put a cache in front of it since reads are much higher than writes. I would shard the database by the short code.",
    aiFeedback:
      "The shape is right and you correctly identified this as read-dominated. Hashing invites collisions you then have to handle; a pre-allocated counter range per node avoids both collisions and cross-node coordination. Also state your capacity numbers out loud before designing.",
  },
  q_sys_2: {
    userResponse:
      "I would have a service that receives events and pushes them to a queue. Workers pick them up per channel and call the provider. If the provider fails we retry.",
    aiFeedback:
      "Correct decomposition. Two additions raise this to a senior answer: publish semantic events rather than pre-formed messages so producers do not need to know about channels, and pair retries with a dead-letter queue so a poisoned message cannot block the partition.",
  },
  q_sys_3: {
    userResponse:
      "Probably the database would be the bottleneck if traffic increases a lot. We would see it in the monitoring dashboards and could add replicas.",
    aiFeedback:
      "Too general to be convincing. Name the component and the specific leading signal. Queue lag and stage p99 tell you the routing service is saturating well before error rate does, and that difference is the whole point of the question.",
  },
  q_sys_4: {
    userResponse:
      "I would set a TTL on the cache and update it when data changes. For the replica, reads would just be slightly behind, which is usually acceptable.",
    aiFeedback:
      "Reasonable default. Lead with the staleness budget rather than the mechanism, because usually acceptable is exactly the assumption an interviewer will attack. Also prefer invalidate-on-write over update-in-place: in-place updates race with concurrent writers.",
  },
  q_pro_1: {
    userResponse:
      "I would look at the analytics to see where users are dropping off and check if anything changed in the product recently. Then I would probably talk to some users.",
    aiFeedback:
      "The right three moves in roughly the right order. What is missing is the first one: confirm the metric is real before investigating it. A tracking or bot-filter change manufactures drops of exactly this size, and checking costs ten minutes.",
  },
  q_pro_2: {
    userResponse:
      "It depends on what the company needs at the time. If users are asking for something new we build it, otherwise we improve what is already there.",
    aiFeedback:
      "This defers the decision instead of making it. Bring a framework such as reach, impact, confidence and effort, then name your tiebreaker. Interviewers are testing whether you can defend a call, not whether you can list inputs.",
  },
  q_pro_3: {
    userResponse:
      "Probably how many interviews people complete, and revenue from credits. Those show that people are using the product and paying for it.",
    aiFeedback:
      "Both are reasonable but neither is a north star. Pick one, defend it against the other, and add a guardrail. Revenue can rise while the product gets worse, which is exactly the failure a guardrail metric on score improvement would catch.",
  },
  q_pro_4: {
    userResponse:
      "I would show them their weak areas from previous reports and suggest practice questions in those areas, maybe with some kind of progress tracking.",
    aiFeedback:
      "Good product instinct: diagnose before prescribing. Tighten the scope, since a full course reads as a roadmap rather than a feature. Define success as a measurable movement in the weak dimension within a set number of sessions.",
  },
  q_cus_1: {
    userResponse:
      "The role is about backend services and being on call. I have done both. At my current company I own a service and I am part of the on-call rotation, so I think it lines up well.",
    aiFeedback:
      "The mapping is correct but stated at too high a level. Pick one system, quote the language from the posting, and go deep on a single incident and what you changed structurally afterwards. Depth beats coverage on this question.",
  },
  q_cus_2: {
    userResponse:
      "Probably Kubernetes. I have used it but I have not managed clusters myself. I am sure I could pick it up quickly though.",
    aiFeedback:
      "Naming a real gap is the hard part and you did it. I could pick it up quickly undercuts it. Replace that with a concrete ramp with a timeline, ideally one modelled on a skill you have already picked up this way.",
  },
  q_cus_3: {
    userResponse:
      "I wanted to ask about the team structure and what the tech stack looks like. Also what the growth opportunities are.",
    aiFeedback:
      "Fine but forgettable, and the stack is usually answerable from the posting. Ask about on-call reality, the technical debt the team most wants to pay down, and what a strong first 90 days looks like. Those signal that you are evaluating the role too.",
  },
});

const STRENGTH_POOL: Record<InterviewTypeId, string[]> = {
  behavioral: [
    "Strong, specific stories with a clear beginning, middle and end.",
    "You consistently separated what the team did from what you did.",
    "Comfortable admitting a wrong call and showing what changed after it.",
  ],
  technical: [
    "Strong technical explanations, especially around data access and failure handling.",
    "You reason from first principles instead of reciting definitions.",
    "Good instinct to measure before changing anything.",
  ],
  coding: [
    "You state the approach and its complexity before writing code.",
    "Edge cases were considered without being prompted.",
    "Clean, readable implementations that were easy to follow out loud.",
  ],
  hr: [
    "Warm, natural delivery that keeps the conversation moving.",
    "Honest answers without over-explaining or getting defensive.",
    "Clear on what you want next and why.",
  ],
  "system-design": [
    "You framed the problem and its scale before proposing a design.",
    "Comfortable discussing trade-offs rather than defending one answer.",
    "Good narration: the interviewer could follow the design as it was built.",
  ],
  product: [
    "You segment a problem before theorising about causes.",
    "Metrics are chosen with an eye on what they might distort.",
    "Genuine empathy for the user in the scenario.",
  ],
  custom: [
    "You clearly read the job description and mapped experience to it.",
    "Willing to name a real gap instead of deflecting.",
    "Questions at the end showed you were evaluating the role too.",
  ],
};

const IMPROVEMENT_POOL: Record<InterviewTypeId, string[]> = {
  behavioral: [
    "Answers could be more concise. Several ran past two minutes without adding new information.",
    "Quantify outcomes. Numbers turn a good story into a memorable one.",
    "Reduce the use of we when describing your own contribution.",
  ],
  technical: [
    "Add the operational layer: timeouts, pool sizing and what you would monitor.",
    "Answers could be more concise before you reach the key point.",
    "When you say it depends, immediately name the variable it depends on.",
  ],
  coding: [
    "Say the brute force baseline out loud before optimising.",
    "Verify with one small example before declaring the solution done.",
    "Keep narrating while you type. Long silences read as being stuck.",
  ],
  hr: [
    "Give a researched range on compensation rather than deferring entirely.",
    "Point reasons for leaving forward instead of framing them as complaints.",
    "Close open-ended answers by tying them back to this specific role.",
  ],
  "system-design": [
    "State capacity numbers early. They should drive the design, not follow it.",
    "Name where the design breaks first, before the interviewer asks.",
    "Spend less time on the happy path and more on failure modes.",
  ],
  product: [
    "Commit to a recommendation. It depends on context is not an answer.",
    "Validate the instrumentation before investigating a metric drop.",
    "Pair every north star metric with a guardrail.",
  ],
  custom: [
    "Go deeper on one example rather than covering three at surface level.",
    "Replace I could pick it up quickly with a concrete ramp and timeline.",
    "Quote the job description language back more directly.",
  ],
};

const DIMENSIONS: { dimension: ScoreDimension; label: string; offset: number }[] = [
  { dimension: "communication", label: "Communication", offset: 4 },
  { dimension: "technical", label: "Technical knowledge", offset: 2 },
  { dimension: "confidence", label: "Confidence", offset: -3 },
  { dimension: "relevance", label: "Relevance", offset: 5 },
  { dimension: "structure", label: "Structure", offset: -6 },
];

function band(score: number) {
  if (score >= 85) return "excellent" as const;
  if (score >= 72) return "solid" as const;
  if (score >= 60) return "developing" as const;
  return "needs-work" as const;
}

const DIMENSION_SUMMARY: Record<ScoreDimension, Record<string, string>> = {
  communication: {
    excellent: "Clear, paced and easy to follow throughout.",
    solid: "Generally clear, with a few answers that ran long.",
    developing: "Understandable, but filler words diluted several answers.",
    "needs-work": "Answers wandered before reaching the point.",
  },
  technical: {
    excellent: "Depth was consistent, including on follow-up probes.",
    solid: "Correct fundamentals with room to go one layer deeper.",
    developing: "Definitions were right; application was thinner.",
    "needs-work": "Several answers stopped at the surface level.",
  },
  confidence: {
    excellent: "Steady and composed, even on the hardest question.",
    solid: "Confident overall, with brief hesitation under pressure.",
    developing: "Hedging language undercut otherwise correct answers.",
    "needs-work": "Frequent qualifiers made strong answers sound uncertain.",
  },
  relevance: {
    excellent: "Every answer stayed tightly on the question asked.",
    solid: "Mostly on target, with one answer that drifted.",
    developing: "Some answers addressed an adjacent question.",
    "needs-work": "Answers often missed what was actually being asked.",
  },
  structure: {
    excellent: "Consistently structured with a clear close.",
    solid: "Good structure early, looser toward the end.",
    developing: "Stories had the parts but not always in order.",
    "needs-work": "Answers lacked a repeatable structure.",
  },
};

function pick<T>(pool: T[], seed: string, count: number): T[] {
  if (pool.length <= count) return pool;
  const start = seededInt(seed, 0, pool.length - 1);
  return Array.from({ length: count }, (_, i) => pool[(start + i) % pool.length]);
}

function clampScore(value: number) {
  return Math.min(98, Math.max(38, Math.round(value)));
}

/**
 * Builds a report deterministically from an interview so every completed
 * session in the history has a working report route.
 */
export function buildReport(interview: Interview): InterviewReport {
  const overall = interview.score ?? 70;
  const bank = questionsForType(interview.type);
  const questionCount = Math.min(interview.questionCount, bank.length);

  const breakdown: ScoreBreakdownItem[] = DIMENSIONS.map(({ dimension, label, offset }) => {
    const jitter = seededInt(`${interview.id}:${dimension}`, -5, 5);
    const score = clampScore(overall + offset + jitter);
    return {
      dimension,
      label,
      score,
      summary: DIMENSION_SUMMARY[dimension][band(score)],
    };
  });

  const questions: QuestionReview[] = bank.slice(0, questionCount).map((question, i) => {
    const entry = REVIEW_BANK[question.id];
    return {
      id: `${interview.id}_${question.id}`,
      index: i + 1,
      question: question.prompt,
      category: question.category,
      userResponse:
        entry?.userResponse ??
        "No transcript was captured for this answer. Re-run the round to generate one.",
      aiFeedback:
        entry?.aiFeedback ??
        "Feedback for this answer is still being generated. Check back shortly.",
      suggestedResponse: question.suggestedAnswer,
      score: clampScore(overall + seededInt(`${interview.id}:${question.id}`, -13, 11)),
      durationSeconds: seededInt(`${interview.id}:${question.id}:t`, 65, 240),
    };
  });

  const strengths = pick(STRENGTH_POOL[interview.type], `${interview.id}:s`, 3);
  const improvements = pick(IMPROVEMENT_POOL[interview.type], `${interview.id}:i`, 3);
  const weakest = [...breakdown].sort((a, b) => a.score - b.score)[0];
  const strongest = [...breakdown].sort((a, b) => b.score - a.score)[0];

  return {
    id: interview.reportId ?? `rep_${interview.id}`,
    interviewId: interview.id,
    overallScore: overall,
    percentile: Math.min(99, Math.max(12, Math.round(overall * 0.95 + seededUnit(interview.id) * 8))),
    summary: `A ${band(overall).replace("-", " ")} ${interview.duration}-minute round for ${
      interview.role
    }${interview.company ? ` at ${interview.company}` : ""}. ${
      strongest.label
    } was your strongest dimension; ${weakest.label.toLowerCase()} is where the next point of improvement is.`,
    breakdown,
    strengths,
    improvements,
    questions,
    generatedAt: interview.completedAt ?? interview.createdAt,
  };
}

export const mockReports: InterviewReport[] = mockInterviews
  .filter((interview) => interview.status === "completed")
  .map(buildReport);

export function findReportByInterviewId(interviewId: string) {
  return mockReports.find((report) => report.interviewId === interviewId);
}
