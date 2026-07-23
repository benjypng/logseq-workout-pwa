import type { DayPlan } from './types'
export const WEEKLY_PLAN: DayPlan[] = [
  {
    weekday: 1,
    title: 'Monday — priority (chest/back, arms)',
    groups: [
      [
        { name: 'Smith incline press', reps: '8–12', sets: 4, restSec: 0 },
        { name: 'Dumbbell row', reps: '8–12', sets: 4, restSec: 90 },
      ],
      [
        { name: 'Preacher curl', reps: '10–12', sets: 3, restSec: 0 },
        { name: 'Tricep pushdown', reps: '10–15', sets: 3, restSec: 75 },
      ],
      [
        { name: 'Hammer curl', reps: '10–15', sets: 3, restSec: 0 },
        {
          name: 'Overhead dumbbell extension',
          reps: '10–15',
          sets: 3,
          restSec: 75,
        },
      ],
    ],
  },
  {
    weekday: 2,
    title: 'Tuesday — legs and shoulders',
    groups: [
      [
        { name: 'Goblet squat', reps: '8–12', sets: 3, restSec: 0 },
        { name: 'Romanian deadlift', reps: '8–12', sets: 3, restSec: 90 },
      ],
      [
        { name: 'Dumbbell shoulder press', reps: '8–12', sets: 3, restSec: 0 },
        { name: 'Rear delt flye', reps: '12–20', sets: 3, restSec: 75 },
      ],
      [{ name: 'Standing calf raise', reps: '10–15', sets: 4, restSec: 60 }],
    ],
  },
  {
    weekday: 3,
    title: 'Wednesday — priority (chest/back, arms)',
    groups: [
      [
        { name: 'Flat dumbbell press', reps: '8–12', sets: 4, restSec: 0 },
        { name: 'Lat pulldown', reps: '8–12', sets: 4, restSec: 90 },
      ],
      [
        { name: 'Incline dumbbell curl', reps: '10–12', sets: 3, restSec: 0 },
        {
          name: 'Overhead cable extension',
          reps: '10–15',
          sets: 3,
          restSec: 75,
        },
      ],
      [
        { name: 'Cable flye', reps: '10–15', sets: 3, restSec: 0 },
        { name: 'Lateral raise', reps: '12–20', sets: 3, restSec: 75 },
      ],
    ],
  },
  {
    weekday: 4,
    title: 'Thursday — legs and shoulders',
    groups: [
      [
        { name: 'Romanian deadlift', reps: '8–12', sets: 3, restSec: 0 },
        { name: 'Goblet squat', reps: '8–12', sets: 3, restSec: 90 },
      ],
      [
        { name: 'Dumbbell shoulder press', reps: '8–12', sets: 3, restSec: 0 },
        { name: 'Lateral raise', reps: '12–20', sets: 3, restSec: 75 },
      ],
      [{ name: 'Seated calf raise', reps: '12–20', sets: 4, restSec: 60 }],
    ],
  },
  {
    weekday: 5,
    title: 'Friday — priority (chest/back, arms)',
    groups: [
      [
        { name: 'Incline dumbbell press', reps: '8–12', sets: 4, restSec: 0 },
        {
          name: 'Lat pulldown (close, palms facing you)',
          reps: '8–12',
          sets: 4,
          restSec: 90,
        },
      ],
      [
        { name: 'Hammer curl', reps: '10–15', sets: 3, restSec: 0 },
        {
          name: 'Overhead EZ-bar extension',
          reps: '10–15',
          sets: 3,
          restSec: 75,
        },
      ],
      [
        { name: 'Dumbbell curl', reps: '10–12', sets: 3, restSec: 0 },
        { name: 'Tricep pushdown', reps: '10–15', sets: 3, restSec: 75 },
      ],
    ],
  },
]
export function planForWeekday(weekday: number): DayPlan | null {
  return WEEKLY_PLAN.find((p) => p.weekday === weekday) ?? null
}
