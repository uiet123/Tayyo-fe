import type { InterviewQuestion, InterviewTypeId } from "@/types";

/**
 * The question bank powers both the live interview room and the report
 * question-by-question review, so a session and its report stay consistent.
 */
export const QUESTION_BANK: Record<InterviewTypeId, InterviewQuestion[]> = {
  behavioral: [
    {
      id: "q_beh_1",
      index: 1,
      prompt:
        "Tell me about a time you owned a project end to end. What was the situation, and what did you personally do?",
      category: "Ownership",
      difficulty: "easy",
      hints: [
        "Open with one line of context, then move quickly to your actions.",
        "Name the specific decision only you could have made.",
        "Close with a measurable outcome.",
      ],
      suggestedAnswer:
        "At my last role our checkout service was failing silently during peak hours and nobody owned alerting. I volunteered to take it end to end: I instrumented the payment path with structured logs, added four SLO-backed alerts, and ran a weekly triage. Within six weeks silent failures dropped from roughly 40 a week to under 3, and mean time to detection went from hours to under 4 minutes.",
    },
    {
      id: "q_beh_2",
      index: 2,
      prompt:
        "Describe a disagreement with a teammate about a technical decision. How did you resolve it?",
      category: "Conflict",
      difficulty: "medium",
      hints: [
        "Stay factual about the other person, never dismissive.",
        "Show how you separated the decision from the relationship.",
        "State what you would do the same way again.",
      ],
      suggestedAnswer:
        "A senior teammate wanted to move our job queue to Kafka; I felt Redis streams covered our volume at a fraction of the operational cost. Instead of debating in the abstract, I proposed we write down the three constraints that actually mattered: throughput ceiling, replay needs, and on-call load. We benchmarked both for two days. Kafka won on replay, which turned out to matter more than I had assumed, so we shipped Kafka and I owned the migration runbook.",
    },
    {
      id: "q_beh_3",
      index: 3,
      prompt: "Tell me about a time you failed. What did you learn?",
      category: "Failure",
      difficulty: "medium",
      hints: [
        "Pick a real failure with real consequences, not a humblebrag.",
        "Spend most of the answer on the correction, not the mistake.",
      ],
      suggestedAnswer:
        "I shipped a schema migration without a backfill plan and locked a 40 million row table for 11 minutes during business hours. I owned the incident review, and the concrete change was a migration checklist that now requires an online-migration tool and a rollback path before review. We have run 60+ migrations since with zero customer-visible locking.",
    },
    {
      id: "q_beh_4",
      index: 4,
      prompt:
        "Give me an example of how you handled competing priorities with a tight deadline.",
      category: "Prioritisation",
      difficulty: "medium",
      hints: [
        "Show the framework you used to choose, not just the outcome.",
        "Mention who you communicated the trade-off to.",
      ],
      suggestedAnswer:
        "Two weeks before a launch I had a compliance blocker and a performance regression. I scored both on customer impact and reversibility: the compliance item was a hard launch blocker, the regression was measurable but degraded gracefully. I finished compliance, shipped a feature flag to cap the blast radius, and told the PM in writing what we were deferring and when it would land. Both closed within the sprint after launch.",
    },
    {
      id: "q_beh_5",
      index: 5,
      prompt: "How do you give difficult feedback to someone more senior than you?",
      category: "Communication",
      difficulty: "hard",
      hints: [
        "Anchor the feedback on observable behaviour and shared goals.",
        "Show that you invited a response rather than delivered a verdict.",
      ],
      suggestedAnswer:
        "I ask for a private slot, lead with the shared goal, and stick to what I observed rather than what I inferred. When a staff engineer kept merging without review, I said: the last four merges skipped review, and it means the team cannot catch regressions early. What is making review hard right now? It turned out our CI took 40 minutes. We fixed CI, and review compliance went back to 100%.",
    },
  ],
  technical: [
    {
      id: "q_tec_1",
      index: 1,
      prompt:
        "Walk me through what happens when a request hits your API, from the load balancer to the database and back.",
      category: "Fundamentals",
      difficulty: "medium",
      hints: [
        "Narrate layer by layer instead of jumping to details.",
        "Call out where you would put timeouts and retries.",
      ],
      suggestedAnswer:
        "TLS terminates at the load balancer, which health-checks and routes to one of N stateless app pods. The pod authenticates the request, validates input at the edge of the handler, then goes through a service layer that owns business rules. Data access sits behind a repository with a connection pool sized to the database, not the pod count. Every hop has a timeout shorter than its caller, and only idempotent reads get retried. On the way out I serialise a versioned DTO so I never leak internal columns.",
    },
    {
      id: "q_tec_2",
      index: 2,
      prompt:
        "How would you find and fix a slow endpoint that only degrades under production load?",
      category: "Debugging",
      difficulty: "hard",
      hints: [
        "Measure first. Name the specific signal you would look at.",
        "Distinguish between p50 and p99 causes.",
      ],
      suggestedAnswer:
        "I start with the trace, not the code. If p50 is flat and p99 is spiking, that points at contention: connection pool saturation, a lock, or a noisy neighbour. I check pool wait time and slow query logs, then look for N+1 access patterns that are invisible at low volume. Typical fixes in order of cost: add the missing composite index, batch the N+1, then cache. I only add caching once the underlying query is actually fast.",
    },
    {
      id: "q_tec_3",
      index: 3,
      prompt:
        "Explain the difference between optimistic and pessimistic locking, and when you would pick each.",
      category: "Databases",
      difficulty: "medium",
      hints: [
        "Tie the choice to contention rate.",
        "Mention the failure UX for each.",
      ],
      suggestedAnswer:
        "Pessimistic locking takes the lock up front, which is correct under high contention but it serialises work and risks deadlocks. Optimistic locking uses a version column and fails at write time if someone else won. I default to optimistic for user-facing edits where conflicts are rare, because it keeps reads cheap and the retry is a clean 409. I reach for pessimistic locking on inventory decrements or ledger writes where a lost update is unacceptable.",
    },
    {
      id: "q_tec_4",
      index: 4,
      prompt:
        "How do you decide what to unit test versus what to cover with integration tests?",
      category: "Best practices",
      difficulty: "easy",
      hints: ["Talk about cost of change, not coverage percentage."],
      suggestedAnswer:
        "Unit tests go where the logic is dense and the dependencies are few: pricing rules, state machines, parsers. Integration tests go where the risk is in the wiring: migrations, auth middleware, third-party contracts. I avoid unit-testing thin pass-through layers because those tests break on every refactor without catching real bugs. My rule is that a test should fail when behaviour changes, not when structure changes.",
    },
    {
      id: "q_tec_5",
      index: 5,
      prompt:
        "What is idempotency and how would you implement it for a payments endpoint?",
      category: "Trade-offs",
      difficulty: "hard",
      hints: ["Name where the key comes from and how long it lives."],
      suggestedAnswer:
        "Idempotency means retrying a request produces the same result as sending it once. For payments the client generates an idempotency key per intent and sends it as a header. Server-side I insert the key into a unique-constrained table inside the same transaction as the charge; a duplicate insert means I return the stored response instead of charging again. Keys expire after 24 hours, and I store the full response body so retries are byte-identical.",
    },
  ],
  coding: [
    {
      id: "q_cod_1",
      index: 1,
      prompt:
        "Given an array of integers and a target, return the indices of the two numbers that add up to the target. Talk through your approach before coding.",
      category: "Arrays and hashing",
      difficulty: "easy",
      hints: [
        "State the brute force, then the improvement, then code.",
        "Say the complexity out loud before you type.",
      ],
      suggestedAnswer:
        "Brute force is two nested loops at O(n squared). I can do better by trading space for time: walk the array once keeping a hash map from value to index, and at each element check whether target minus the current value is already in the map. That is O(n) time and O(n) space, single pass. Duplicates are handled because I check before inserting, and I return immediately on the first valid pair.",
    },
    {
      id: "q_cod_2",
      index: 2,
      prompt: "Find the length of the longest substring without repeating characters.",
      category: "Sliding window",
      difficulty: "medium",
      hints: ["Name the pattern, sliding window, before implementing."],
      suggestedAnswer:
        "This is a sliding window with a last-seen map. I move the right pointer forward, and whenever I see a character already inside the window I jump the left pointer to one past its previous index rather than shrinking one step at a time. I track the max width as I go. O(n) time, O(min(n, charset)) space. Empty string returns 0, and an all-unique string returns its full length.",
    },
    {
      id: "q_cod_3",
      index: 3,
      prompt: "Merge k sorted linked lists into one sorted list.",
      category: "Heaps",
      difficulty: "hard",
      hints: ["Compare the heap and divide-and-conquer approaches out loud."],
      suggestedAnswer:
        "Two good options. A min-heap of the k current heads gives O(N log k) time and O(k) space; I pop the smallest, append it, and push its successor. Divide and conquer pairs the lists and merges repeatedly, also O(N log k) but O(1) extra space if merging iteratively. I would take divide and conquer here because it avoids the heap overhead and the code is short. Watch for an empty input array and individually null lists.",
    },
    {
      id: "q_cod_4",
      index: 4,
      prompt: "Detect whether a directed graph contains a cycle.",
      category: "Graphs",
      difficulty: "medium",
      hints: ["Three-colour DFS or topological sort. Pick one and justify it."],
      suggestedAnswer:
        "I would use a three-colour DFS: white unvisited, grey on the current recursion stack, black fully explored. If I reach a grey node I have found a back edge, which means a cycle. That is O(V + E). The alternative is a topological sort, where a sorted output shorter than V implies a cycle. I prefer the topological sort when I also need the ordering, and DFS when I only need a yes or no and want an early exit.",
    },
  ],
  hr: [
    {
      id: "q_hr_1",
      index: 1,
      prompt: "Tell me about yourself.",
      category: "Introduction",
      difficulty: "easy",
      hints: [
        "Keep it under 90 seconds.",
        "Present, then past, then why this role, in that order.",
      ],
      suggestedAnswer:
        "I am a backend engineer with about four years on payments and high-throughput APIs, currently owning the settlement service at my company. Before that I was at a smaller startup where I built the billing stack from scratch, which is where I learned to care about idempotency and observability. I am looking at this role because the scale of your ledger work is the exact problem I want to go deeper on.",
    },
    {
      id: "q_hr_2",
      index: 2,
      prompt: "Why are you looking to leave your current company?",
      category: "Motivation",
      difficulty: "medium",
      hints: ["Frame it as moving toward something, never away from someone."],
      suggestedAnswer:
        "I have had a good run there and shipped work I am proud of, but the platform has stabilised and most of my week is now maintenance. I want to be back on problems where the architecture is still being decided, and your team is rebuilding the reconciliation pipeline this year. That is the kind of work I do my best thinking on.",
    },
    {
      id: "q_hr_3",
      index: 3,
      prompt: "What are your compensation expectations?",
      category: "Expectations",
      difficulty: "hard",
      hints: [
        "Give a researched range, not a single number.",
        "Anchor on total compensation and stay flexible on the mix.",
      ],
      suggestedAnswer:
        "Based on what I have seen for senior backend roles at this stage and location, I am targeting a total compensation in the range of X to Y. I am flexible about the split between base and equity, and I care more about the scope of the role than about hitting an exact number. If the level lands differently after the loop, I am happy to revisit.",
    },
    {
      id: "q_hr_4",
      index: 4,
      prompt: "Where do you see yourself in three years?",
      category: "Growth",
      difficulty: "easy",
      hints: ["Be concrete and tie the answer to this company trajectory."],
      suggestedAnswer:
        "In three years I want to be the person the team trusts with the hardest parts of the system, owning a domain end to end and mentoring two or three engineers into it. I am not chasing a management title for its own sake. I want depth first, and if leading a team is the best way to increase that impact here, I am open to it.",
    },
    {
      id: "q_hr_5",
      index: 5,
      prompt: "What is your notice period and when can you join?",
      category: "Availability",
      difficulty: "easy",
      hints: ["Be precise and mention any flexibility you genuinely have."],
      suggestedAnswer:
        "My notice period is 60 days from resignation. I have a good relationship with my manager and there is a real chance of buying out or negotiating down to about 45 days once I have a written offer. I would want to leave a clean handover either way.",
    },
  ],
  "system-design": [
    {
      id: "q_sys_1",
      index: 1,
      prompt:
        "Design a URL shortener that handles 10,000 writes per second and 100,000 reads per second.",
      category: "Scale",
      difficulty: "hard",
      hints: [
        "Clarify requirements and scale before drawing anything.",
        "Say the read to write ratio out loud. It drives the whole design.",
      ],
      suggestedAnswer:
        "First the numbers: this is 10 to 1 read-heavy, so it is a caching problem more than a storage problem. For ID generation I would avoid a central counter and use a pre-allocated key range per node, base62 encoded, which removes coordination from the write path. Storage is a simple key-value store partitioned by short code. Reads go cache-first with a very high hit rate because access is Zipfian; misses fall through and populate. Redirects are 301 only if I never need analytics, otherwise 302.",
    },
    {
      id: "q_sys_2",
      index: 2,
      prompt:
        "How would you design a notification system that supports email, SMS and push?",
      category: "Architecture",
      difficulty: "medium",
      hints: ["Separate the trigger, the routing, and the delivery."],
      suggestedAnswer:
        "Three decoupled stages. Producers publish a semantic event, not a message: order.shipped, not send_email. A routing service resolves user preferences, quiet hours and locale into zero or more channel jobs. Channel workers own provider integration and retries with exponential backoff plus a dead-letter queue. Templates are versioned and rendered in the worker so a template change never requires a producer deploy. Idempotency keys on the event prevent duplicate sends when the queue redelivers.",
    },
    {
      id: "q_sys_3",
      index: 3,
      prompt: "Where does your design break first, and how would you know?",
      category: "Failure modes",
      difficulty: "hard",
      hints: ["Name a specific component and a specific signal."],
      suggestedAnswer:
        "The routing service breaks first, because it does a database read per event and sits in the synchronous path. I would know from queue lag and from p99 on the routing stage, not from error rate, because it degrades long before it fails. The fix in order: cache preferences with a short TTL, batch the lookups, then shard the queue by user ID so one hot tenant cannot starve everyone else.",
    },
    {
      id: "q_sys_4",
      index: 4,
      prompt:
        "How would you keep a read replica and a cache consistent with the primary?",
      category: "Consistency",
      difficulty: "hard",
      hints: ["Be explicit about what staleness you are willing to accept."],
      suggestedAnswer:
        "I start by stating the tolerance: for a product catalogue, seconds of staleness are fine; for a balance, they are not. For the tolerant case I use replica reads plus cache-aside with a short TTL, and I invalidate on write rather than updating the cache in place, because in-place updates invite races. For the intolerant case I read the primary on that specific path, or use change-data-capture to invalidate deterministically instead of hoping the TTL is short enough.",
    },
  ],
  product: [
    {
      id: "q_pro_1",
      index: 1,
      prompt:
        "Our onboarding completion rate dropped from 62% to 48% in two weeks. How do you investigate?",
      category: "Metrics",
      difficulty: "medium",
      hints: [
        "Segment before you theorise.",
        "Rule out instrumentation first.",
      ],
      suggestedAnswer:
        "First I confirm the metric is real, because a tracking change or a bot filter can manufacture a drop like this. Then I segment by platform, acquisition channel, geography and cohort start date. A uniform drop points at a product change or an outage; a concentrated drop points at one channel or one release. I overlay the deploy timeline on the step-by-step funnel to find which step lost users, then talk to five users who abandoned at that step.",
    },
    {
      id: "q_pro_2",
      index: 2,
      prompt:
        "How would you decide between shipping a new feature and improving an existing one?",
      category: "Prioritisation",
      difficulty: "medium",
      hints: ["Give a real framework and name the counter-argument."],
      suggestedAnswer:
        "I size both on reach, impact, confidence and effort, but the tiebreaker is which one moves the activation metric we are currently accountable for. New features look better in a roadmap review and usually lose on confidence. If retention is the constraint, improving something users already touch daily almost always wins. The counter-argument is that a portfolio of only improvements loses on positioning, so I keep roughly one bet per quarter.",
    },
    {
      id: "q_pro_3",
      index: 3,
      prompt: "What metric would you use to measure the success of a product like this one?",
      category: "User empathy",
      difficulty: "hard",
      hints: ["Pick one north star and defend it against an obvious alternative."],
      suggestedAnswer:
        "The north star is the share of users who complete a second mock interview within seven days, because the product only works if practice becomes a habit. Credits purchased is the obvious alternative, but it is a lagging revenue metric that can rise while the product gets worse. I would guardrail the north star with average score improvement between a first and third session, so we do not optimise for volume over actual readiness.",
    },
    {
      id: "q_pro_4",
      index: 4,
      prompt:
        "Design a feature for candidates who keep failing at the same interview stage.",
      category: "Product sense",
      difficulty: "medium",
      hints: ["Start from the emotional state of the user, not the feature list."],
      suggestedAnswer:
        "This user is discouraged and does not know what to fix, so the feature has to be diagnostic before it is prescriptive. I would surface a pattern card: across your last five sessions, structure scored lowest on behavioural questions. Then one targeted drill, not a whole course: five questions in the weak dimension with immediate scoring. Success looks like that weak dimension rising above their own average within three sessions.",
    },
  ],
  custom: [
    {
      id: "q_cus_1",
      index: 1,
      prompt:
        "Based on the job description you pasted, walk me through the part of your experience that maps most closely to this role.",
      category: "Role specific",
      difficulty: "medium",
      hints: [
        "Quote the job description language back. It signals you read it.",
        "Pick one deep example over three shallow ones.",
      ],
      suggestedAnswer:
        "The posting leads with event-driven services and on-call ownership, so I would go straight to the settlement pipeline I owned. It was six consumers off a single event stream, and I carried the pager for it for 14 months. I would cover one concrete incident, what I changed structurally afterwards, and the metric that moved, because that is the same shape of work this role is describing.",
    },
    {
      id: "q_cus_2",
      index: 2,
      prompt:
        "Which requirement in this job description are you weakest on, and what is your plan?",
      category: "Self-awareness",
      difficulty: "hard",
      hints: ["Pick a real gap, then show the concrete ramp."],
      suggestedAnswer:
        "Kubernetes operations. I have deployed to clusters other people ran, but I have not owned cluster upgrades or autoscaling policy. My plan is the same one that worked when I picked up Kafka: shadow the current owner for a quarter, take the low-risk runbooks first, and be primary on non-critical upgrades by month three. I would rather flag it now than discover it during on-call.",
    },
    {
      id: "q_cus_3",
      index: 3,
      prompt: "What questions do you have about the team and the role?",
      category: "Closing",
      difficulty: "easy",
      hints: ["Ask about the work, not the perks. Two or three questions, not ten."],
      suggestedAnswer:
        "Three things. First, what does the on-call rotation actually look like week to week? Second, what is the biggest piece of technical debt the team wishes it could pay down this year? And third, for someone joining at this level, what would a strong first 90 days look like to you?",
    },
  ],
};

/** Flat list used by the practice and question-bank surfaces. */
export const mockQuestions: InterviewQuestion[] = Object.values(QUESTION_BANK).flat();

export function questionsForType(type: InterviewTypeId, count?: number) {
  const bank = QUESTION_BANK[type] ?? QUESTION_BANK.behavioral;
  return typeof count === "number" ? bank.slice(0, count) : bank;
}
