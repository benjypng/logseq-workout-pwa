import type { SessionAction } from '../lib/session'
import type { Session, SessionExercise } from '../types'

interface Props {
  session: Session
  dispatch: (action: SessionAction) => void
}

function ExerciseItem({
  exercise,
  index,
  session,
  dispatch,
}: {
  exercise: SessionExercise
  index: number
  session: Session
  dispatch: (action: SessionAction) => void
}) {
  const doneCount = exercise.logs.filter((l) => l.done).length
  const finished = doneCount === exercise.sets
  const active = index === session.activeExercise
  return (
    <button
      type="button"
      disabled={finished}
      onClick={() => dispatch({ type: 'jump-to-exercise', exercise: index })}
      className={`flex w-full items-center justify-between rounded-lg border px-4 py-2.5 text-left ${
        active
          ? 'border-accent bg-surface'
          : 'border-border bg-surface active:bg-surface-raised'
      } ${finished ? 'opacity-50' : ''}`}
    >
      <div>
        <div className="text-sm font-medium">{exercise.name}</div>
        <div className="text-xs text-muted">
          {exercise.reps} reps
          {exercise.restSec > 0 ? ` · rest ${exercise.restSec}s` : ''}
        </div>
      </div>
      <div className="flex items-center gap-1">
        {exercise.logs.map((l, li) => (
          <span
            key={`${exercise.name}-${String(li)}`}
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
  )
}

export function ExerciseList({ session, dispatch }: Props) {
  const groupIds: number[] = []
  for (const e of session.exercises) {
    if (!groupIds.includes(e.group)) groupIds.push(e.group)
  }

  return (
    <div className="flex flex-col gap-2">
      {groupIds.map((g) => {
        const members = session.exercises
          .map((e, i) => ({ e, i }))
          .filter(({ e }) => e.group === g)
        if (members.length === 1) {
          const { e, i } = members[0]
          return (
            <ExerciseItem
              key={e.name}
              exercise={e}
              index={i}
              session={session}
              dispatch={dispatch}
            />
          )
        }
        return (
          <div
            key={`group-${String(g)}`}
            className="flex flex-col gap-2 rounded-xl border border-accent/40 p-1.5"
          >
            <div className="px-2.5 pt-1 text-[10px] font-semibold uppercase tracking-wide text-accent">
              Superset
            </div>
            {members.map(({ e, i }) => (
              <ExerciseItem
                key={e.name}
                exercise={e}
                index={i}
                session={session}
                dispatch={dispatch}
              />
            ))}
          </div>
        )
      })}
    </div>
  )
}
