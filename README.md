# Tayyo AI — Frontend

**AI Interview Companion.** Be ready for what's next.

Next.js 16 (App Router) · React 19 · TypeScript · Tailwind CSS v4 · shadcn-style UI · Lucide icons.

This repo is **frontend only**. There is no LLM, speech-to-text, payment gateway, database or
auth backend. Every screen is driven by realistic mock data behind a typed API seam.

## Getting started

```bash
npm install
npm run dev     # http://localhost:3000
npm run build   # production build
npm run lint    # eslint
```

## Routes

| Route | Description |
| --- | --- |
| `/` | Landing page (hero, how it works, features, interview types, pricing, testimonials, FAQ, CTA) |
| `/pricing` | Credit-based pricing and rate card |
| `/login`, `/signup` | Auth screens with validation UI |
| `/dashboard` | Overview: credits, quick actions, recent interviews, preparation stats |
| `/dashboard/practice` | Mock interview setup with live credit estimate |
| `/dashboard/interview/[id]` | Full-screen live interview room (simulated) |
| `/dashboard/interviews` | History with search, filters, sort, pagination |
| `/dashboard/interviews/[id]/report` | Scored report with question-by-question review |
| `/dashboard/reports` | Index of all generated reports |
| `/dashboard/resume` | Upload, replace, delete, and resume insights |
| `/dashboard/credits` | Balance, packages, usage history |
| `/dashboard/settings` | Profile, preferences, appearance, security |

The interview room lives in the `(session)` route group so it renders full-bleed without the
dashboard sidebar, while keeping the `/dashboard/interview/[id]` URL.

## Architecture

```text
src/
├── app/
│   ├── (marketing)/          # public site + pricing
│   ├── (auth)/               # login + signup
│   └── dashboard/
│       ├── (app)/            # sidebar + topbar shell
│       └── (session)/        # full-screen interview room
├── components/
│   ├── ui/                   # shadcn-style primitives
│   ├── navbar/ sidebar/ landing/
│   ├── dashboard/ interview/ reports/ resume/ credits/ settings/ auth/ shared/
├── lib/
│   ├── api/                  # THE SEAM: every screen fetches through here
│   ├── mock/                 # fixtures (never imported by components)
│   ├── mock-data.ts          # fixture barrel
│   ├── constants.ts          # interview types, durations, credit rates
│   ├── format.ts  utils.ts  validation.ts
├── types/                    # user, interview, resume, credits
└── hooks/
```

### Swapping mock data for the real API

Components never import from `lib/mock/*`. They call `lib/api/*`, and every function there goes
through `request()` in `lib/api/client.ts`:

```ts
export async function request<T>(resolver, options): Promise<T> {
  await wait(options.latencyMs);   // simulated latency
  return resolver();               // reads from the in-memory store
}
```

To go live, replace that body with a real fetch:

```ts
const res = await fetch(`${API_BASE_URL}${path}`, init);
if (!res.ok) throw new ApiError(await res.text(), res.status);
return res.json() as Promise<T>;
```

No component, hook or page needs to change. `lib/api/store.ts` (the in-memory session store) is
deleted at that point.

Data fetching in the UI goes through `useApiResource()`, which gives every screen loading, error
and refetch behaviour. Swapping it for TanStack Query is a one-file change too.

### Design system

Tokens live in `src/app/globals.css` as CSS custom properties, mapped into Tailwind via
`@theme inline`. Light is the primary theme; **dark mode is fully tokenised** and switchable from
Settings → Appearance (`next-themes`, class strategy).

### What is intentionally not built

OpenAI/LLM calls, speech-to-text, real-time audio, screen capture, desktop overlay, Zoom/Meet/Teams
integrations, Razorpay, auth backend, database, resume parsing, real AI reports. The interfaces for
each of these already exist in `src/types` and `src/lib/api`.
