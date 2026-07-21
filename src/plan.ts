import type { DayPlan } from './types'

export const WEEKLY_PLAN: DayPlan[] = [
  {
    weekday: 1,
    title: 'Monday — chest and triceps',
    exercises: [
      { name: 'Smith incline press', reps: '8–12', sets: 4, restSec: 90 },
      { name: 'Flat dumbbell press', reps: '8–12', sets: 4, restSec: 90 },
      { name: 'Tricep pushdown', reps: '10–15', sets: 3, restSec: 75 },
    ],
  },
  {
    weekday: 2,
    title: 'Tuesday — back and biceps',
    exercises: [
      {
        name: 'Lat pulldown (close, palms facing you)',
        reps: '8–12',
        sets: 4,
        restSec: 90,
      },
      { name: 'Dumbbell or Smith row', reps: '8–12', sets: 4, restSec: 90 },
      { name: 'Dumbbell curl', reps: '8–12', sets: 3, restSec: 75 },
    ],
  },
  {
    weekday: 3,
    title: 'Wednesday — legs and shoulders',
    exercises: [
      {
        name: 'Goblet squat or Romanian deadlift',
        reps: '8–12',
        sets: 3,
        restSec: 90,
      },
      { name: 'Dumbbell shoulder press', reps: '8–12', sets: 3, restSec: 90 },
      { name: 'Lateral raise', reps: '12–20', sets: 3, restSec: 60 },
    ],
  },
  {
    weekday: 4,
    title: 'Thursday — chest and triceps',
    exercises: [
      { name: 'Smith flat press', reps: '8–12', sets: 4, restSec: 90 },
      { name: 'Incline dumbbell press', reps: '10–15', sets: 4, restSec: 90 },
      {
        name: 'Overhead dumbbell extension',
        reps: '10–15',
        sets: 3,
        restSec: 75,
      },
    ],
  },
  {
    weekday: 5,
    title: 'Friday — back and biceps',
    exercises: [
      { name: 'Lat pulldown', reps: '8–12', sets: 4, restSec: 90 },
      { name: 'Dumbbell or Smith row', reps: '8–12', sets: 4, restSec: 90 },
      { name: 'Hammer curl', reps: '10–15', sets: 3, restSec: 75 },
    ],
  },
]

export function planForWeekday(weekday: number): DayPlan | null {
  return WEEKLY_PLAN.find((p) => p.weekday === weekday) ?? null
}
