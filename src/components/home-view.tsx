import { useState } from 'react'

import { planForWeekday, WEEKLY_PLAN } from '../plan'
import { type DayPlan, isSuperset, type PlannedExercise } from '../types'
import { unlockAudio } from '../utils/cues'

const DAY_LABELS = ['M', 'T', 'W', 'T', 'F']

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
  const todayWeekday = new Date().getDay()
  const isRestDay = planForWeekday(todayWeekday) === null
  const [weekday, setWeekday] = useState(isRestDay ? 1 : todayWeekday)
  const plan = planForWeekday(weekday)

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

      {isRestDay && (
        <div className="rounded-lg border border-border bg-surface px-4 py-3 text-sm text-muted">
          Rest day today. Pick a day below to preview or log anyway.
        </div>
      )}

      <div className="flex gap-2">
        {WEEKLY_PLAN.map((p, i) => (
          <button
            key={p.weekday}
            type="button"
            onClick={() => setWeekday(p.weekday)}
            className={`flex h-11 flex-1 items-center justify-center rounded-md text-sm font-semibold ${
              p.weekday === weekday
                ? 'bg-accent text-accent-foreground'
                : 'bg-surface text-muted'
            }`}
          >
            {DAY_LABELS[i]}
          </button>
        ))}
      </div>

      {plan && (
        <>
          <div>
            <h2 className="text-lg font-semibold">{plan.title}</h2>
            {plan.weekday !== todayWeekday && (
              <p className="text-xs text-muted">
                Not today's plan — logs will still go to today's journal.
              </p>
            )}
          </div>

          <div className="flex flex-col gap-3">
            {plan.groups.map((group, g) =>
              isSuperset(group) ? (
                <div
                  key={group.exercises[0].name}
                  className="flex flex-col gap-2 rounded-xl border border-accent/40 p-2"
                >
                  <div className="px-2 text-xs font-semibold uppercase tracking-wide text-accent">
                    Superset
                    {group.muscles ? ` · ${group.muscles}` : ''} · rest{' '}
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
                <div
                  key={group.exercises[0].name}
                  className="flex flex-col gap-1"
                >
                  {group.muscles && (
                    <div className="px-2 text-xs font-semibold uppercase tracking-wide text-muted">
                      {group.muscles}
                    </div>
                  )}
                  <ExerciseRow
                    exercise={group.exercises[0]}
                    onStart={() => start(flatIndexOf(g, 0))}
                  />
                </div>
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
