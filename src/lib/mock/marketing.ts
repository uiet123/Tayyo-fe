/** Marketing-surface content. Kept out of components so copy edits are cheap. */

export interface HowItWorksStep {
  step: number;
  title: string;
  description: string;
  icon: string;
}

export interface FeatureItem {
  title: string;
  description: string;
  icon: string;
}

export interface Testimonial {
  id: string;
  quote: string;
  name: string;
  role: string;
  outcome: string;
}

export interface FaqItem {
  question: string;
  answer: string;
}

export const howItWorksSteps: HowItWorksStep[] = [
  {
    step: 1,
    title: "Tell Tayyo about the role",
    description:
      "Pick an interview type, paste the job description and add your resume. Tayyo builds a round that matches the job you actually applied for.",
    icon: "Target",
  },
  {
    step: 2,
    title: "Sit the interview",
    description:
      "A realistic interviewer asks follow-ups, pushes back, and holds you to time — with a live coach panel you can lean on when you get stuck.",
    icon: "Mic",
  },
  {
    step: 3,
    title: "Read the report",
    description:
      "Scored on five dimensions, question by question, with a stronger version of every answer you gave. Then run it again.",
    icon: "LineChart",
  },
];

export const landingFeatures: FeatureItem[] = [
  {
    title: "AI mock interviews",
    description:
      "Full rounds with follow-up questions that react to what you actually said, not a fixed script.",
    icon: "MessagesSquare",
  },
  {
    title: "Real-time assistance",
    description:
      "A coach panel beside the interview surfaces structure hints and a suggested answer the moment you stall.",
    icon: "Sparkles",
  },
  {
    title: "Resume-aware answers",
    description:
      "Tayyo reads your resume and asks about your projects, your stack and the gaps a real interviewer would probe.",
    icon: "FileText",
  },
  {
    title: "Scored reports",
    description:
      "Communication, technical knowledge, confidence, relevance and structure — scored, with the evidence behind each number.",
    icon: "BarChart3",
  },
  {
    title: "Every round type",
    description:
      "Behavioral, technical, coding, HR, system design and product, tuned to fresher through senior levels.",
    icon: "Layers",
  },
  {
    title: "Progress you can see",
    description:
      "Track scores across sessions and watch your weakest dimension move, session over session.",
    icon: "TrendingUp",
  },
];

export const testimonials: Testimonial[] = [
  {
    id: "t1",
    quote:
      "I had done twenty practice questions on my own and still froze in the real thing. Two Tayyo rounds and I finally knew what my answers sounded like from the other side of the table.",
    name: "Priya Nair",
    role: "SDE-2",
    outcome: "Offer accepted",
  },
  {
    id: "t2",
    quote:
      "The report is the part that actually changed things. It told me my answers ran long and were unstructured, which nobody had ever said to me directly.",
    name: "Rahul Mehta",
    role: "Backend Engineer",
    outcome: "3 loops cleared",
  },
  {
    id: "t3",
    quote:
      "Credits made it easy to start. I did not want another monthly subscription for something I would use for six weeks.",
    name: "Ananya Iyer",
    role: "Product Analyst",
    outcome: "Switched domains",
  },
  {
    id: "t4",
    quote:
      "The system design round pushed back on my answer the way a real interviewer would. That is the part I could never rehearse alone.",
    name: "Karthik Reddy",
    role: "Senior Engineer",
    outcome: "Promoted internally",
  },
];

export const faqs: FaqItem[] = [
  {
    question: "How are credits used?",
    answer:
      "Credits are consumed per minute of live interview, plus a small one-time charge when your report is generated. A 30-minute mock interview costs about 70 credits. Practice questions cost 1 credit each, and credits never expire.",
  },
  {
    question: "Do I need a subscription?",
    answer:
      "No. Tayyo is credit-based on purpose. Most people prepare intensively for a few weeks and then stop, so you buy a pack, use it at your own pace, and top up only if you need to.",
  },
  {
    question: "How realistic are the interviews?",
    answer:
      "The interviewer asks follow-up questions based on what you actually said, holds you to the clock, and probes weak answers instead of moving on politely. It is closer to a real loop than reading a question list.",
  },
  {
    question: "What happens to my resume?",
    answer:
      "Your resume is used to tailor questions to your experience and to generate resume insights. It is never shared with recruiters or third parties, and you can delete it from the Resume page at any time.",
  },
  {
    question: "Which interview types are supported?",
    answer:
      "Behavioral, technical, coding, HR, system design and product rounds — plus a custom round where you paste a job description and Tayyo builds the interview around it.",
  },
  {
    question: "Can I use Tayyo during a real interview?",
    answer:
      "Real-time interview assistance is on the roadmap. Today Tayyo is built for preparation and practice, so you walk into the real thing already knowing what your answers sound like.",
  },
];

export const trustStats = [
  { value: "12,000+", label: "Mock interviews run" },
  { value: "4.8/5", label: "Average session rating" },
  { value: "18 pts", label: "Median score lift by session 3" },
  { value: "6", label: "Interview formats covered" },
];
