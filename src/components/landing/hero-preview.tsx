import { Mic, Sparkles, Timer } from "lucide-react";

/**
 * A static, hand-built preview of the interview room. Deliberately not a
 * screenshot or stock illustration so it stays crisp and theme-aware.
 */
export function HeroPreview() {
  return (
    <div className="relative">
      <div className="pointer-events-none absolute -inset-x-8 -top-8 bottom-0 -z-10 rounded-[28px] bg-gradient-to-b from-primary/[0.07] to-transparent blur-2xl" />

      <div className="overflow-hidden rounded-2xl border border-border bg-card shadow-lg">
        {/* Window chrome */}
        <div className="flex items-center gap-3 border-b border-border bg-muted/40 px-4 py-3">
          <div className="flex gap-1.5">
            <span className="size-2.5 rounded-full bg-border-strong" />
            <span className="size-2.5 rounded-full bg-border-strong" />
            <span className="size-2.5 rounded-full bg-border-strong" />
          </div>
          <div className="flex flex-1 items-center justify-center gap-2">
            <span className="flex items-center gap-1.5 rounded-full border border-border bg-background px-2.5 py-1 text-[11px] font-medium text-muted-foreground">
              <span className="size-1.5 animate-pulse rounded-full bg-destructive" />
              Interview in progress
            </span>
          </div>
          <span className="flex items-center gap-1.5 font-mono text-[11px] tabular-nums text-muted-foreground">
            <Timer className="size-3" />
            42:18
          </span>
        </div>

        <div className="grid gap-px bg-border md:grid-cols-[1.55fr_1fr]">
          {/* Interviewer panel */}
          <div className="bg-card p-5 sm:p-6">
            <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-muted-foreground">
              Question 4 of 6
            </p>
            <p className="mt-3 text-[15px] font-medium leading-relaxed text-foreground">
              Walk me through what happens when a request hits your API, from the load balancer to
              the database and back.
            </p>

            <div className="mt-6 space-y-3">
              <TranscriptLine role="Interviewer" text="Take your time — narrate it layer by layer." />
              <TranscriptLine
                role="You"
                text="Sure. TLS terminates at the load balancer, which routes to one of N stateless pods…"
                self
              />
            </div>

            <div className="mt-6 flex items-center gap-2.5 rounded-lg border border-border bg-muted/40 px-3 py-2.5">
              <span className="flex size-7 items-center justify-center rounded-full bg-destructive/10">
                <Mic className="size-3.5 text-destructive" />
              </span>
              <span className="text-xs font-medium text-foreground">Listening…</span>
              <span className="ml-auto flex h-4 items-end gap-[3px]">
                {[0, 1, 2, 3, 4].map((i) => (
                  <span
                    key={i}
                    className="w-[3px] origin-bottom rounded-full bg-destructive/70"
                    style={{
                      height: "100%",
                      animation: `tayyo-bar 1.1s ease-in-out ${i * 0.12}s infinite`,
                    }}
                  />
                ))}
              </span>
            </div>
          </div>

          {/* Coach panel */}
          <div className="bg-card p-5 sm:p-6">
            <div className="flex items-center gap-2">
              <Sparkles className="size-3.5 text-primary" />
              <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-primary">
                AI Coach
              </p>
            </div>

            <div className="mt-4 rounded-lg border border-brand-border bg-brand-subtle p-3.5">
              <p className="text-[11px] font-semibold uppercase tracking-wide text-primary">
                Structure hint
              </p>
              <p className="mt-1.5 text-[13px] leading-relaxed text-foreground/80">
                You covered routing. Add where you set timeouts and how the pool is sized.
              </p>
            </div>

            <p className="mt-5 text-[11px] font-semibold uppercase tracking-[0.12em] text-muted-foreground">
              Suggested response
            </p>
            <p className="mt-2 text-[13px] leading-relaxed text-muted-foreground">
              Every hop has a timeout shorter than its caller, and only idempotent reads get
              retried…
            </p>

            <div className="mt-5 space-y-2.5 border-t border-border pt-4">
              <Meter label="Clarity" value={82} />
              <Meter label="Depth" value={68} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function TranscriptLine({ role, text, self }: { role: string; text: string; self?: boolean }) {
  return (
    <div className="flex gap-3">
      <span
        className={
          self
            ? "mt-0.5 w-16 shrink-0 text-[11px] font-semibold text-primary"
            : "mt-0.5 w-16 shrink-0 text-[11px] font-semibold text-muted-foreground"
        }
      >
        {role}
      </span>
      <p className="text-[13px] leading-relaxed text-muted-foreground">{text}</p>
    </div>
  );
}

function Meter({ label, value }: { label: string; value: number }) {
  return (
    <div className="flex items-center gap-3">
      <span className="w-14 shrink-0 text-[11px] text-muted-foreground">{label}</span>
      <span className="h-1 flex-1 overflow-hidden rounded-full bg-muted">
        <span className="block h-full rounded-full bg-primary" style={{ width: `${value}%` }} />
      </span>
      <span className="w-6 text-right font-mono text-[11px] tabular-nums text-muted-foreground">
        {value}
      </span>
    </div>
  );
}
