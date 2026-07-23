import type { SessionAction } from '../lib/session'
import type { Session } from '../types'
import { unlockAudio } from '../utils/cues'

interface Props {
  session: Session
  dispatch: (action: SessionAction) => void
}

export function SetCard({ session, dispatch }: Props) {
  const exercise = session.exercises[session.activeExercise]
  const log = exercise.logs[session.activeSet]

  const logSet = () => {
    unlockAudio()
    dispatch({ type: 'complete-set', now: Date.now() })
  }

  return (
    <div className="flex flex-col gap-4 rounded-lg border border-border bg-surface p-5">
      <div>
        <div className="text-xl font-bold">{exercise.name}</div>
        <div className="mt-1 text-sm text-muted">
          Set {session.activeSet + 1} of {exercise.sets} · target{' '}
          {exercise.reps} reps ·{' '}
          {exercise.restSec > 0
            ? `rest ${exercise.restSec}s`
            : 'straight into next'}
        </div>
      </div>

      <div className="flex flex-col gap-3">
        <label className="flex flex-col gap-1">
          <span className="text-xs font-semibold uppercase tracking-wide text-muted">
            Weight (kg)
          </span>
          <input
            type="number"
            inputMode="decimal"
            min="0"
            step="0.5"
            value={log.weight}
            onChange={(e) =>
              dispatch({
                type: 'input',
                field: 'weight',
                value: e.target.value,
              })
            }
            className="h-14 rounded-md border border-border bg-surface-raised px-3 text-center text-2xl font-bold outline-none focus:border-accent"
          />
        </label>
        <label className="flex flex-col gap-1">
          <span className="text-xs font-semibold uppercase tracking-wide text-muted">
            Reps done
          </span>
          <input
            type="number"
            inputMode="numeric"
            min="0"
            step="1"
            value={log.reps}
            onChange={(e) =>
              dispatch({ type: 'input', field: 'reps', value: e.target.value })
            }
            className="h-14 rounded-md border border-border bg-surface-raised px-3 text-center text-2xl font-bold outline-none focus:border-accent"
          />
        </label>
      </div>

      {session.setStarted ? (
        <button
          type="button"
          onClick={logSet}
          className="h-14 rounded-lg bg-accent text-lg font-bold text-accent-foreground active:opacity-80"
        >
          {exercise.restSec > 0
            ? `Log set · rest ${exercise.restSec}s`
            : 'Log set · next exercise'}
        </button>
      ) : (
        <div className="flex gap-3">
          <button
            type="button"
            onClick={() => {
              unlockAudio()
              dispatch({ type: 'start-set' })
            }}
            className="h-14 flex-1 rounded-lg bg-positive text-lg font-bold text-background active:opacity-80"
          >
            Start set
          </button>
          <button
            type="button"
            onClick={logSet}
            className="h-14 flex-1 rounded-lg border border-border bg-surface-raised text-lg font-semibold active:opacity-80"
          >
            Log &amp; rest
          </button>
        </div>
      )}
    </div>
  )
}
