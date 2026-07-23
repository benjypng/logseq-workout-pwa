import { useOutbox } from '../hooks/use-outbox'
import type { Session } from '../types'

interface Props {
  session: Session
  onClose: () => void
}

export function CompleteView({ session, onClose }: Props) {
  const { pending, flush } = useOutbox()
  const isPending = pending.some((op) => op.id === session.id)

  const totalSets = session.exercises.reduce(
    (n, e) => n + e.logs.filter((l) => l.done).length,
    0,
  )

  return (
    <div className="mx-auto flex min-h-dvh max-w-md flex-col gap-5 px-5 py-6">
      <header className="text-center">
        <div className="text-4xl">💪</div>
        <h1 className="mt-2 text-2xl font-bold">Session complete</h1>
        <p className="mt-1 text-sm text-muted">
          {session.dayTitle} · {totalSets} sets logged
        </p>
      </header>

      <ul className="flex flex-col gap-2">
        {session.exercises.map((e) => {
          const done = e.logs.filter((l) => l.done)
          return (
            <li
              key={e.name}
              className="rounded-lg border border-border bg-surface px-4 py-3"
            >
              <div className="text-sm font-medium">{e.name}</div>
              <div className="text-xs text-muted">
                {done.length === 0
                  ? 'Skipped'
                  : done
                      .map((l) =>
                        l.weight ? `${l.weight}kg × ${l.reps || '?'}` : l.reps,
                      )
                      .join(' · ')}
              </div>
            </li>
          )
        })}
      </ul>

      <div
        className={`rounded-lg border px-4 py-3 text-sm ${
          isPending
            ? 'border-border bg-surface text-muted'
            : 'border-positive/40 bg-surface text-positive'
        }`}
      >
        {isPending ? (
          <div className="flex items-center justify-between">
            <span>Waiting to sync to Logseq…</span>
            <button
              type="button"
              onClick={() => void flush()}
              className="font-semibold text-accent underline"
            >
              Retry
            </button>
          </div>
        ) : (
          <span>Synced to today's journal in Logseq ✓</span>
        )}
      </div>

      <button
        type="button"
        onClick={onClose}
        className="mt-auto h-14 rounded-lg bg-accent text-lg font-bold text-accent-foreground active:opacity-80"
      >
        Done
      </button>
    </div>
  )
}
