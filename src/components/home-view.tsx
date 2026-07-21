import { useState } from 'react'

import { planForWeekday, WEEKLY_PLAN } from '../plan'
import type { DayPlan } from '../types'
import { unlockAudio } from '../utils/cues'

const DAY_LABELS = ['M', 'T', 'W', 'T', 'F']

interface Props {
  onStart: (plan: DayPlan, startExercise: number) => void
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

          <ul className="flex flex-col gap-2">
            {plan.exercises.map((e, i) => (
              <li key={e.name}>
                <button
                  type="button"
                  onClick={() => start(i)}
                  className="flex w-full items-center justify-between rounded-lg border border-border bg-surface px-4 py-3 text-left active:bg-surface-raised"
                >
                  <div>
                    <div className="font-medium">{e.name}</div>
                    <div className="text-xs text-muted">
                      {e.sets} × {e.reps} reps · rest {e.restSec}s
                    </div>
                  </div>
                  <span className="text-xs font-semibold text-accent">
                    Start here
                  </span>
                </button>
              </li>
            ))}
          </ul>

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
