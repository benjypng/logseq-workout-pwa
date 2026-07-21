import type { SessionAction } from '../lib/session'
import type { Session } from '../types'

interface Props {
  session: Session
  dispatch: (action: SessionAction) => void
}

export function ExerciseList({ session, dispatch }: Props) {
  return (
    <ul className="flex flex-col gap-2">
      {session.exercises.map((e, i) => {
        const doneCount = e.logs.filter((l) => l.done).length
        const finished = doneCount === e.sets
        const active = i === session.activeExercise
        return (
          <li key={e.name}>
            <button
              type="button"
              disabled={finished}
              onClick={() =>
                dispatch({ type: 'jump-to-exercise', exercise: i })
              }
              className={`flex w-full items-center justify-between rounded-lg border px-4 py-2.5 text-left ${
                active
                  ? 'border-accent bg-surface'
                  : 'border-border bg-surface active:bg-surface-raised'
              } ${finished ? 'opacity-50' : ''}`}
            >
              <div>
                <div className="text-sm font-medium">{e.name}</div>
                <div className="text-xs text-muted">
                  {e.reps} reps · rest {e.restSec}s
                </div>
              </div>
              <div className="flex items-center gap-1">
                {e.logs.map((l, li) => (
                  <span
                    key={`${e.name}-${String(li)}`}
                    className={`h-2 w-2 rounded-full ${
                      l.done
                        ? 'bg-positive'
                        : active && li === session.activeSet
                          ? 'bg-accent'
                          : 'bg-faint'
                    }`}
                  />
                ))}
              </div>
            </button>
          </li>
        )
      })}
    </ul>
  )
}
