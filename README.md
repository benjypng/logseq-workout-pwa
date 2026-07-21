# logseq-workout-pwa

Mobile-first PWA that guides a fixed Mon–Fri gym plan set by set — weight and
reps inputs, rest timer with sound/vibration, screen wake lock — and appends
each finished session as a `#Workout`-tagged markdown table to the today
journal page of a Logseq DB graph.

Built on the sidecar pattern from `logseq-todo-pwa` (see its
`SIDECAR_ARCHITECTURE.md`): a small Bun HTTP server shells out to the `logseq`
CLI; the browser only ever talks HTTP to it.

## Run (development)

```bash
bun install
LOGSEQ_GRAPH=vault bun run start   # sidecar (:12316) + Vite dev server (:5173)
```

Or set `LOGSEQ_GRAPH` in `.env.development` (see `.env.example`).
`ALLOWED_HOSTS=my-host.tailnet` exposes the dev server over LAN/VPN.

## Run (production / install on phone)

```bash
bun run build
LOGSEQ_GRAPH=vault bun run serve   # serves dist/ + API on :5175
```

Open the served URL on your phone and "Add to Home Screen". The logging flow
works fully offline; network is only needed when a finished session syncs.

## How it works

- `src/plan.ts` — the hard-coded weekly plan (edit here to change exercises).
- `src/lib/session.ts` — pure session state machine (start anywhere, per-set
  logging, rest, jump between exercises, finish early).
- Every state change mirrors to IndexedDB, so refresh/backgrounding resumes
  mid-session.
- On completion the markdown block is queued in an IndexedDB outbox and
  flushed on foreground/online/every 20s. The sidecar dedupes retries by exact
  content match, so the journal never gets double entries.
- `sidecar/` — `GET /graph`, `POST /workout { page: "YYYY-MM-DD", content }` →
  `logseq upsert block --target-page <date> --update-tags '["Workout"]'`.

## Checks

```bash
bun test    # session reducer, markdown builder, outbox, sidecar handler
bun run lint
bun run build
```
