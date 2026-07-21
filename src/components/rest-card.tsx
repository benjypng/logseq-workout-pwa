import { nextTarget, type SessionAction } from '../lib/session'
import type { Session } from '../types'

interface Props {
  session: Session
  remainingMs: number
  dispatch: (action: SessionAction) => void
}

function formatTime(ms: number): string {
  const total = Math.ceil(ms / 1000)
  const m = Math.floor(total / 60)
  const s = total % 60
  return `${m}:${String(s).padStart(2, '0')}`
}

export function RestCard({ session, remainingMs, dispatch }: Props) {
  const target = nextTarget(session)
  const progress =
    session.restTotalSec > 0
      ? Math.min(1, 1 - remainingMs / (session.restTotalSec * 1000))
      : 1

  return (
    <div className="flex flex-col gap-5 rounded-lg border border-border bg-surface p-5">
      <div className="text-center">
        <div className="text-xs font-semibold uppercase tracking-wide text-muted">
          Resting
        </div>
        <div className="mt-1 font-mono text-6xl font-bold tabular-nums">
          {formatTime(remainingMs)}
        </div>
      </div>

      <div className="h-2 overflow-hidden rounded-full bg-surface-raised">
        <div
          className="h-full rounded-full bg-accent transition-[width] duration-200 ease-linear"
          style={{ width: `${progress * 100}%` }}
        />
      </div>

      {target && (
        <div className="rounded-md bg-surface-raised px-4 py-3 text-center">
          <div className="text-xs font-semibold uppercase tracking-wide text-muted">
            Next up
          </div>
          <div className="mt-1 text-lg font-bold">
            {session.exercises[target.exercise].name}
          </div>
          <div className="text-sm text-muted">
            Set {target.set + 1} of {session.exercises[target.exercise].sets} ·
            target {session.exercises[target.exercise].reps} reps
          </div>
        </div>
      )}
      {!target && (
        <div className="rounded-md bg-surface-raised px-4 py-3 text-center">
          <div className="text-lg font-bold">Last set done 🎉</div>
          <div className="text-sm text-muted">
            Session completes when the rest ends.
          </div>
        </div>
      )}

      <div className="flex gap-3">
        <button
          type="button"
          onClick={() => dispatch({ type: 'extend-rest', seconds: 30 })}
          className="h-12 flex-1 rounded-lg border border-border bg-surface-raised font-semibold active:opacity-80"
        >
          +30s
        </button>
        <button
          type="button"
          onClick={() => dispatch({ type: 'skip-rest' })}
          className="h-12 flex-1 rounded-lg bg-accent font-bold text-accent-foreground active:opacity-80"
        >
          Skip rest
        </button>
      </div>
    </div>
  )
}
