"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { ArrowRight, CheckCircle2, FileText, Upload } from "lucide-react";
import type { InterviewDuration, InterviewSetup, InterviewTypeId } from "@/types";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Field } from "@/components/ui/field";
import { Skeleton } from "@/components/ui/skeleton";
import { Separator } from "@/components/ui/separator";
import { OptionCard } from "./option-card";
import { CreditEstimatePanel } from "./credit-estimate-panel";
import { InterviewTypeIcon } from "./interview-type-badge";
import { useApiResource } from "@/hooks";
import { creditsApi, interviewsApi, resumeApi, toErrorMessage } from "@/lib/api";
import {
  EXPERIENCE_LEVELS,
  INTERVIEW_DURATIONS,
  INTERVIEW_TYPES,
  estimateInterviewCredits,
} from "@/lib/constants";
import { validateRequired } from "@/lib/validation";

const MAX_JD_LENGTH = 4000;

export function PracticeSetupForm() {
  const router = useRouter();

  const [type, setType] = useState<InterviewTypeId>("technical");
  const [level, setLevel] = useState<string>("mid");
  const [role, setRole] = useState("Software Engineer");
  const [company, setCompany] = useState("");
  const [jobDescription, setJobDescription] = useState("");
  const [duration, setDuration] = useState<InterviewDuration>(30);
  const [useResume, setUseResume] = useState(true);
  const [roleError, setRoleError] = useState<string | undefined>();
  const [starting, setStarting] = useState(false);

  const { data: resume, isLoading: resumeLoading } = useApiResource(
    (signal) => resumeApi.getPrimaryResume({ signal, latencyMs: 400 }),
    [],
    { subscribeToMutations: true },
  );
  const { data: credits } = useApiResource(
    (signal) => creditsApi.getCreditBalance({ signal, latencyMs: 300 }),
    [],
    { subscribeToMutations: true },
  );

  const estimate = estimateInterviewCredits(duration);
  const insufficient = typeof credits?.balance === "number" && credits.balance < estimate;

  async function handleStart(event: React.FormEvent) {
    event.preventDefault();

    const error = validateRequired(role, "Job role");
    setRoleError(error);
    if (error) return;

    const setup: InterviewSetup = {
      type,
      experienceLevel: level,
      role: role.trim(),
      company: company.trim() || undefined,
      jobDescription: jobDescription.trim() || undefined,
      resumeId: useResume ? resume?.id : undefined,
      duration,
    };

    setStarting(true);
    try {
      const session = await interviewsApi.createInterviewSession(setup, { latencyMs: 900 });
      toast.success("Interview room ready");
      router.push(`/dashboard/interview/${session.id}`);
    } catch (caught) {
      toast.error("Could not start the interview", { description: toErrorMessage(caught) });
      setStarting(false);
    }
  }

  return (
    <form
      onSubmit={handleStart}
      noValidate
      className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_320px]"
    >
      <div className="space-y-6">
        <Card className="p-5 sm:p-6">
          <SectionLabel title="Interview type" description="Pick the round you want to rehearse." />
          <div className="mt-4 grid gap-2.5 sm:grid-cols-2">
            {INTERVIEW_TYPES.map((item) => (
              <OptionCard
                key={item.id}
                selected={type === item.id}
                onSelect={() => setType(item.id)}
                title={item.label}
                description={item.description}
                icon={<InterviewTypeIcon type={item.id} className="size-4" />}
              />
            ))}
          </div>
        </Card>

        <Card className="p-5 sm:p-6">
          <SectionLabel
            title="Role details"
            description="The more specific this is, the closer the questions land."
          />

          <div className="mt-4 space-y-5">
            <div className="grid gap-5 sm:grid-cols-2">
              <Field id="role" label="Job role" error={roleError}>
                <Input
                  id="role"
                  placeholder="Software Engineer"
                  value={role}
                  invalid={Boolean(roleError)}
                  onChange={(event) => {
                    setRole(event.target.value);
                    if (roleError) setRoleError(undefined);
                  }}
                />
              </Field>

              <Field id="company" label="Company" optional>
                <Input
                  id="company"
                  placeholder="Razorpay"
                  value={company}
                  onChange={(event) => setCompany(event.target.value)}
                />
              </Field>
            </div>

            <div>
              <p className="text-sm font-medium">Experience level</p>
              <div className="mt-2.5 grid gap-2.5 sm:grid-cols-4">
                {EXPERIENCE_LEVELS.map((item) => (
                  <OptionCard
                    key={item.id}
                    selected={level === item.id}
                    onSelect={() => setLevel(item.id)}
                    title={item.label}
                    description={item.hint}
                  />
                ))}
              </div>
            </div>

            <Field
              id="jd"
              label="Job description"
              optional
              hint={`${jobDescription.length}/${MAX_JD_LENGTH} characters. Paste the posting and Tayyo will target its requirements.`}
            >
              <Textarea
                id="jd"
                rows={7}
                maxLength={MAX_JD_LENGTH}
                placeholder="Paste the job description here, including responsibilities, requirements and tech stack."
                value={jobDescription}
                onChange={(event) => setJobDescription(event.target.value)}
              />
            </Field>
          </div>
        </Card>

        <Card className="p-5 sm:p-6">
          <SectionLabel
            title="Resume"
            description="Let the interviewer ask about your actual projects."
          />

          <div className="mt-4">
            {resumeLoading ? (
              <Skeleton className="h-[74px] rounded-lg" />
            ) : resume ? (
              <div className="space-y-2.5">
                <OptionCard
                  selected={useResume}
                  onSelect={() => setUseResume(true)}
                  title={resume.fileName}
                  description="Questions will reference your experience and stack."
                  icon={<FileText className="size-4" />}
                />
                <OptionCard
                  selected={!useResume}
                  onSelect={() => setUseResume(false)}
                  title="Do not use my resume"
                  description="Run a generic round for this role instead."
                />
                {useResume ? (
                  <p className="flex items-center gap-1.5 pt-1 text-xs font-medium text-success">
                    <CheckCircle2 className="size-3.5" />
                    Resume connected
                  </p>
                ) : null}
              </div>
            ) : (
              <div className="flex flex-col items-start gap-3 rounded-lg border border-dashed border-border bg-muted/30 p-5 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <p className="text-sm font-medium">No resume connected</p>
                  <p className="mt-0.5 text-xs text-muted-foreground">
                    Upload one to get questions about your own projects.
                  </p>
                </div>
                <Button asChild size="sm" variant="secondary">
                  <Link href="/dashboard/resume">
                    <Upload />
                    Upload resume
                  </Link>
                </Button>
              </div>
            )}
          </div>
        </Card>

        <Card className="p-5 sm:p-6">
          <SectionLabel
            title="Interview duration"
            description="You can end the session early at any point."
          />
          <div className="mt-4 grid gap-2.5 sm:grid-cols-4">
            {INTERVIEW_DURATIONS.map((item) => (
              <OptionCard
                key={item.value}
                selected={duration === item.value}
                onSelect={() => setDuration(item.value)}
                title={item.label}
                description={item.hint}
              />
            ))}
          </div>
        </Card>
      </div>

      <div className="space-y-4 lg:sticky lg:top-24 lg:self-start">
        <CreditEstimatePanel durationMinutes={duration} balance={credits?.balance} />

        <Card className="p-5">
          <p className="text-[13px] font-medium text-muted-foreground">Session summary</p>
          <dl className="mt-4 space-y-2.5 text-sm">
            <SummaryRow label="Type" value={INTERVIEW_TYPES.find((t) => t.id === type)?.label} />
            <SummaryRow label="Level" value={EXPERIENCE_LEVELS.find((l) => l.id === level)?.label} />
            <SummaryRow label="Role" value={role.trim() || "Not set"} />
            <SummaryRow label="Company" value={company.trim() || "Any"} />
            <SummaryRow label="Duration" value={`${duration} minutes`} />
            <SummaryRow label="Resume" value={useResume && resume ? "Connected" : "Not used"} />
          </dl>

          <Separator className="my-5" />

          <Button
            type="submit"
            size="lg"
            className="w-full"
            loading={starting}
            disabled={insufficient}
          >
            {starting ? "Preparing room" : "Start Interview"}
            {starting ? null : <ArrowRight />}
          </Button>

          {insufficient ? (
            <p className="mt-3 text-center text-xs text-destructive">
              Not enough credits for this session.
            </p>
          ) : (
            <p className="mt-3 text-center text-xs text-muted-foreground">
              Credits are deducted as the session runs.
            </p>
          )}
        </Card>
      </div>
    </form>
  );
}

function SectionLabel({ title, description }: { title: string; description: string }) {
  return (
    <div>
      <h2 className="text-[15px] font-semibold tracking-tight">{title}</h2>
      <p className="mt-1 text-sm text-muted-foreground">{description}</p>
    </div>
  );
}

function SummaryRow({ label, value }: { label: string; value?: string }) {
  return (
    <div className="flex items-center justify-between gap-3">
      <dt className="text-muted-foreground">{label}</dt>
      <dd className="max-w-[60%] truncate text-right font-medium">{value ?? "Not set"}</dd>
    </div>
  );
}
