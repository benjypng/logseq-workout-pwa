import { useState } from 'react'

import { PLANS, type WorkoutKind } from '../plan'
import { type DayPlan, isSuperset, type PlannedExercise } from '../types'
import { unlockAudio } from '../utils/cues'

interface Props {
  onStart: (plan: DayPlan, startExercise: number) => void
}

function ExerciseRow({
  exercise,
  onStart,
}: {
  exercise: PlannedExercise
  onStart: () => void
}) {
  return (
    <button
      type="button"
      onClick={onStart}
      className="flex w-full items-center justify-between rounded-lg border border-border bg-surface px-4 py-3 text-left active:bg-surface-raised"
    >
      <div>
        <div className="font-medium">{exercise.name}</div>
        <div className="text-xs text-muted">
          {exercise.sets} × {exercise.reps} reps
          {exercise.restSec > 0 ? ` · rest ${exercise.restSec}s` : ''}
        </div>
      </div>
      <span className="text-xs font-semibold text-accent">Start here</span>
    </button>
  )
}

export function HomeView({ onStart }: Props) {
  const [kind, setKind] = useState<WorkoutKind | null>(null)
  const plan = kind ? PLANS[kind] : null

  const start = (exercise: number) => {
    if (!plan) return
    unlockAudio()
    onStart(plan, exercise)
  }

  const flatIndexOf = (group: number, member: number): number =>
    plan
      ? plan.groups
          .slice(0, group)
          .reduce((n, g) => n + g.exercises.length, 0) + member
      : 0

  return (
    <div className="mx-auto flex min-h-dvh max-w-md flex-col gap-5 px-5 py-6">
      <header className="flex items-baseline justify-between">
        <h1 className="text-2xl font-bold">Workout</h1>
        <span className="text-sm text-muted">
          {new Date().toLocaleDateString(undefined, {
            weekday: 'short',
            day: 'numeric',
            month: 'short',
          })}
        </span>
      </header>

      <div className="flex gap-2">
        {(Object.keys(PLANS) as WorkoutKind[]).map((k) => (
          <button
            key={k}
            type="button"
            onClick={() => setKind(k)}
            className={`h-14 flex-1 rounded-lg text-base font-semibold capitalize ${
              k === kind
                ? 'bg-accent text-accent-foreground'
                : 'bg-surface text-muted'
            }`}
          >
            {PLANS[k].title}
          </button>
        ))}
      </div>

      {plan && (
        <>
          <div className="flex flex-col gap-3">
            {plan.groups.map((group, g) =>
              isSuperset(group) ? (
                <div
                  key={group.exercises[0].name}
                  className="flex flex-col gap-2 rounded-xl border border-accent/40 p-2"
                >
                  <div className="px-2 text-xs font-semibold uppercase tracking-wide text-accent">
                    Superset · rest{' '}
                    {group.exercises[group.exercises.length - 1].restSec}s after
                    each round
                  </div>
                  {group.exercises.map((e, m) => (
                    <ExerciseRow
                      key={e.name}
                      exercise={e}
                      onStart={() => start(flatIndexOf(g, m))}
                    />
                  ))}
                </div>
              ) : (
                <ExerciseRow
                  key={group.exercises[0].name}
                  exercise={group.exercises[0]}
                  onStart={() => start(flatIndexOf(g, 0))}
                />
              ),
            )}
          </div>

          <button
            type="button"
            onClick={() => start(0)}
            className="mt-auto h-14 rounded-lg bg-accent text-lg font-bold text-accent-foreground active:opacity-80"
          >
            Start workout
          </button>
        </>
      )}
    </div>
  )
}
