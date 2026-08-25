"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { ChevronRight, Loader2, Mic, MicOff, PhoneOff, SkipForward } from "lucide-react";
import type { LiveInterviewSession, LiveSessionStatus, MicStatus, TranscriptEntry } from "@/types";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ErrorState } from "@/components/ui/error-state";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { SessionTopbar } from "./session-topbar";
import { TranscriptPanel } from "./transcript-panel";
import { AiCoachPanel } from "./ai-coach-panel";
import { MicIndicator } from "./mic-indicator";
import { InterviewRoomSkeleton } from "./interview-room-skeleton";
import { useElapsedTimer } from "@/hooks";
import { interviewsApi, toErrorMessage } from "@/lib/api";
import { CREDIT_RATES } from "@/lib/constants";

/** First sentences of the model answer, used as the simulated spoken reply. */
function excerpt(text: string, sentences = 2) {
  return text
    .split(/(?<=\.)\s+/)
    .slice(0, sentences)
    .join(" ");
}

export function InterviewRoom({ sessionId }: { sessionId: string }) {
  const router = useRouter();

  const [session, setSession] = useState<LiveInterviewSession | null>(null);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [status, setStatus] = useState<LiveSessionStatus>("connecting");
  const [micStatus, setMicStatus] = useState<MicStatus>("idle");
  const [questionIndex, setQuestionIndex] = useState(0);
  const [transcript, setTranscript] = useState<TranscriptEntry[]>([]);
  const [confirmEnd, setConfirmEnd] = useState(false);
  const [ending, setEnding] = useState(false);

  const entryId = useRef(0);
  const nextEntryId = () => `entry_${(entryId.current += 1)}`;

  const [reloadNonce, setReloadNonce] = useState(0);
  const retry = useCallback(() => setReloadNonce((value) => value + 1), []);

  useEffect(() => {
    let cancelled = false;

    interviewsApi
      .getLiveSession(sessionId, { latencyMs: 600 })
      .then((result) => {
        if (cancelled) return;
        setLoadError(null);
        setSession(result);
        setStatus("connecting");
        setTranscript([
          {
            id: nextEntryId(),
            role: "system",
            content: "Session started. Speak naturally, the interviewer will follow up.",
            at: 0,
          },
        ]);
      })
      .catch((error: unknown) => {
        if (!cancelled) setLoadError(toErrorMessage(error));
      });

    return () => {
      cancelled = true;
    };
  }, [sessionId, reloadNonce]);

  useEffect(() => {
    if (!session || status !== "connecting") return;
    const timer = setTimeout(() => {
      setStatus("live");
      setMicStatus("listening");
      const first = session.questions[0];
      if (first) {
        setTranscript((prev) => [
          ...prev,
          { id: nextEntryId(), role: "interviewer", content: first.prompt, at: 0 },
        ]);
      }
    }, 1400);
    return () => clearTimeout(timer);
  }, [session, status]);

  const { seconds: elapsed } = useElapsedTimer(status === "live");
  const questions = useMemo(() => session?.questions ?? [], [session]);
  const currentQuestion = questions[questionIndex];
  const creditsUsed = useMemo(
    () => Math.ceil(elapsed / 60) * CREDIT_RATES.perInterviewMinute,
    [elapsed],
  );

  function handleNextQuestion() {
    if (!session || !currentQuestion) return;

    const answered = currentQuestion;
    setMicStatus("processing");

    setTranscript((prev) => [
      ...prev,
      {
        id: nextEntryId(),
        role: "candidate",
        content: excerpt(answered.suggestedAnswer),
        at: elapsed,
      },
    ]);

    const isLast = questionIndex >= questions.length - 1;

    setTimeout(() => {
      if (isLast) {
        setMicStatus("idle");
        setTranscript((prev) => [
          ...prev,
          {
            id: nextEntryId(),
            role: "system",
            content: "That was the last question. End the interview to generate your report.",
            at: elapsed,
          },
        ]);
        toast("All questions covered", { description: "End the interview to get your report." });
        return;
      }

      const next = questions[questionIndex + 1];
      setQuestionIndex((value) => value + 1);
      setMicStatus("listening");
      setTranscript((prev) => [
        ...prev,
        { id: nextEntryId(), role: "interviewer", content: next.prompt, at: elapsed + 2 },
      ]);
    }, 1100);
  }

  function toggleMic() {
    setMicStatus((value) => (value === "muted" ? "listening" : "muted"));
  }

  async function handleEnd() {
    if (!session) return;
    setEnding(true);
    setConfirmEnd(false);
    try {
      await interviewsApi.endInterviewSession(session.id, elapsed, { latencyMs: 1100 });
      setStatus("ended");
      toast.success("Interview complete", { description: "Your report is ready." });
      router.push(`/dashboard/interviews/${session.id}/report`);
    } catch (error) {
      toast.error("Could not end the session", { description: toErrorMessage(error) });
      setEnding(false);
    }
  }

  if (loadError) {
    return (
      <div className="flex min-h-dvh items-center justify-center p-6">
        <ErrorState
          title="Interview room unavailable"
          message={loadError}
          onRetry={retry}
          className="max-w-md"
        />
      </div>
    );
  }

  if (!session) return <InterviewRoomSkeleton />;

  const questionPanel = (
    <div className="space-y-6">
      <div>
        <div className="flex flex-wrap items-center gap-2">
          <Badge variant="brand">
            Question {questionIndex + 1} of {questions.length}
          </Badge>
          {currentQuestion ? <Badge variant="outline">{currentQuestion.category}</Badge> : null}
        </div>
        <p className="mt-4 text-lg font-medium leading-relaxed tracking-tight text-foreground sm:text-xl">
          {status === "connecting" ? (
            <span className="flex items-center gap-2 text-muted-foreground">
              <Loader2 className="size-4 animate-spin" />
              Connecting to your interviewer...
            </span>
          ) : (
            currentQuestion?.prompt
          )}
        </p>
      </div>

      <TranscriptPanel entries={transcript} />
    </div>
  );

  return (
    <div className="flex h-dvh flex-col overflow-hidden bg-canvas">
      <SessionTopbar
        status={status}
        elapsedSeconds={elapsed}
        durationMinutes={session.interview.duration}
        creditsUsed={creditsUsed}
        title={session.interview.title}
      />

      <div className="hidden min-h-0 flex-1 lg:grid lg:grid-cols-[minmax(0,1fr)_380px]">
        <div className="thin-scrollbar min-h-0 overflow-y-auto border-r border-border bg-background px-8 py-8">
          <div className="mx-auto max-w-2xl">{questionPanel}</div>
        </div>
        <AiCoachPanel question={currentQuestion} />
      </div>

      <div className="min-h-0 flex-1 overflow-hidden lg:hidden">
        <Tabs defaultValue="interview" className="flex h-full flex-col">
          <div className="shrink-0 border-b border-border bg-background px-4 py-2.5">
            <TabsList className="w-full">
              <TabsTrigger value="interview" className="flex-1">
                Interview
              </TabsTrigger>
              <TabsTrigger value="coach" className="flex-1">
                AI Coach
              </TabsTrigger>
            </TabsList>
          </div>
          <TabsContent
            value="interview"
            className="thin-scrollbar mt-0 min-h-0 flex-1 overflow-y-auto bg-background px-4 py-6"
          >
            {questionPanel}
          </TabsContent>
          <TabsContent value="coach" className="mt-0 min-h-0 flex-1 overflow-hidden">
            <AiCoachPanel question={currentQuestion} />
          </TabsContent>
        </Tabs>
      </div>

      <footer className="z-20 shrink-0 border-t border-border bg-card px-4 py-3 sm:px-5">
        <div className="flex items-center gap-3">
          <MicIndicator status={micStatus} />

          <div className="ml-auto flex items-center gap-2">
            <Button
              type="button"
              variant="secondary"
              size="sm"
              onClick={toggleMic}
              disabled={status !== "live"}
            >
              {micStatus === "muted" ? <Mic /> : <MicOff />}
              <span className="hidden sm:inline">{micStatus === "muted" ? "Unmute" : "Mute"}</span>
            </Button>

            <Button
              type="button"
              variant="secondary"
              size="sm"
              onClick={handleNextQuestion}
              disabled={status !== "live" || micStatus === "processing"}
            >
              <SkipForward />
              <span className="hidden sm:inline">Next question</span>
              <ChevronRight className="sm:hidden" />
            </Button>

            <Button
              type="button"
              variant="destructive"
              size="sm"
              loading={ending}
              onClick={() => setConfirmEnd(true)}
              disabled={status === "ended"}
            >
              {ending ? null : <PhoneOff />}
              End Interview
            </Button>
          </div>
        </div>
      </footer>

      <AlertDialog open={confirmEnd} onOpenChange={setConfirmEnd}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>End this interview?</AlertDialogTitle>
            <AlertDialogDescription>
              You have reached question {questionIndex + 1} of {questions.length}. Ending now
              charges {creditsUsed + CREDIT_RATES.reportGeneration} credits and generates your
              report immediately.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Keep going</AlertDialogCancel>
            <AlertDialogAction onClick={handleEnd}>End and get report</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
