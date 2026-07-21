# Workout-logging PWA — design

Date: 2026-07-21. Built autonomously from the user's PRD; interactive design
approval was not possible, so decisions and deviations are recorded here.

## Goal

Mobile-first PWA that guides a fixed Mon–Fri gym plan set-by-set (weight/reps
inputs, rest timer, wake lock) and appends the finished session as a tagged
markdown-table block to the Logseq `vault` graph's today journal page.

## Architecture

Follows `logseq-todo-pwa` (see its `SIDECAR_ARCHITECTURE.md`):

- React 18 + TypeScript + Vite + Tailwind 4 + vite-plugin-pwa, Bun tooling.
- Bun sidecar on :12316 shells out to the `logseq` CLI; Vite proxies
  `/logseq-cli/*` to it; service worker treats `/logseq-cli` as NetworkOnly.
- `sidecar/serve.ts` serves `dist/` + API on one port for production hosting.

Deviations from the reference stack, with reasons:

- No TanStack React Query / persist-client: this app never reads from Logseq.
  The only network interaction is the single session write, which lives in the
  outbox. Local state is a React reducer mirrored to IndexedDB.
- No wretch, no Radix: one POST endpoint and plain buttons/inputs suffice.

## Data model

Hard-coded weekly plan (`src/plan.ts`) per the PRD table. Session state:

```
Session {
  id, startedAt, dateISO, dayTitle,
  exercises: [{ name, reps, sets: n, restSec, logs: [{ weight, reps, done }] }],
  activeExercise, activeSet, phase: 'set' | 'resting' | 'complete',
  setInProgress, restEndsAt, restTotalSec
}
```

Pure reducer in `src/lib/session.ts` (unit-tested). Every transition is
mirrored to IndexedDB (`active` store) so refresh/backgrounding resumes
mid-session. Completed sessions go to a `sessions` store with a sync flag.

## Flow

1. Home: today's plan by weekday; weekend shows rest-day notice + day picker
   (any day previewable/loggable, always written to today's journal).
2. Start from any exercise; a jump list allows reordering mid-session when a
   machine is occupied.
3. Set screen: "Set k of n", target reps, rest; weight+reps inputs; Start marks
   the set in progress; Rest logs the set and starts the countdown.
4. Rest screen: countdown from `restEndsAt` (timestamp-based, so background
   throttling cannot drift it), prominent "next up" (next set or next
   exercise), skip and +30s controls, beep + vibration on zero, then advance.
   After the final set's rest, auto-advance to the next unfinished exercise;
   when none remain, the session completes.
5. Completion: summary + sync status; a "Finish early" control exists so a
   partial session can still be written.

Wake lock held while a session is active, re-acquired on visibilitychange,
released on completion.

## Logseq write

On completion the app builds one multi-line block:

```
**Monday — chest and triceps**
| Exercise | Reps | Sets | Rest | Weight | Reps done |
|----------|------|------|------|--------|-----------|
| Smith incline press | 8–12 | 4 | 90s | 8kg | 12, 11, 10, 8 |
```

Per-set weights are comma-joined unless uniform. The `#Workout` tag is applied
as a real DB tag via `--update-tags` (verified live: inline `#tag` text would
not create a tag). The write targets `--target-page <YYYY-MM-DD>`, which the
CLI normalizes to the journal page (verified live on a scratch graph).

Offline-first: completion enqueues `{ page, content }` into an IndexedDB
outbox; flush runs on enqueue, app foreground, `online`, and a 20s interval.
Network/5xx halts the queue for retry; 4xx drops the op. The sidecar dedupes by
exact content match on the target page so retries never double-append, and
lazily ensures the `Workout` tag exists once per process.

Sidecar endpoints: `GET /graph`, `POST /workout { page, content }`.

## Testing

`bun test` over the pure cores: session reducer, markdown builder, outbox
(fake-indexeddb), sidecar handler (stub `runLogseq`). Live verification against
a scratch graph (`workout-test`), never `vault`.
