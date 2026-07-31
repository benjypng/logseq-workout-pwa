import type { DayPlan } from './types'

export const WEEKLY_PLAN: DayPlan[] = [
  {
    weekday: 1,
    title: 'Monday — priority day A (upper chest, lats, arms, side delts)',
    groups: [
      {
        exercises: [
          {
            name: 'Incline dumbbell press (30 degrees)',
            reps: '8–12',
            sets: 2,
            restSec: 150,
          },
        ],
      },
      {
        exercises: [
          {
            name: 'V-bar pulldown',
            reps: '8–12',
            sets: 2,
            restSec: 150,
          },
        ],
      },
      {
        exercises: [
          {
            name: 'Facing-away cable curl',
            reps: '10–12',
            sets: 2,
            restSec: 90,
          },
        ],
      },
      {
        exercises: [
          {
            name: 'Overhead cable extension (horizontal bar)',
            reps: '10–15',
            sets: 2,
            restSec: 90,
          },
        ],
      },
      {
        exercises: [
          {
            name: 'Lateral raise',
            reps: '12–20',
            sets: 2,
            restSec: 90,
          },
        ],
      },
    ],
  },
  {
    weekday: 2,
    title: 'Tuesday — legs plus lat stimulus (only leg session)',
    groups: [
      {
        exercises: [
          {
            name: 'Leg press',
            reps: '8–12',
            sets: 2,
            restSec: 150,
          },
        ],
      },
      {
        exercises: [
          {
            name: 'Romanian deadlift',
            reps: '8–12',
            sets: 2,
            restSec: 150,
          },
        ],
      },
      {
        exercises: [
          {
            name: 'Wide-grip overhand lat pulldown',
            reps: '8–12',
            sets: 2,
            restSec: 150,
          },
        ],
      },
      {
        exercises: [
          {
            name: 'Standing calf raise',
            reps: '10–15',
            sets: 2,
            restSec: 90,
          },
        ],
      },
    ],
  },
  {
    weekday: 3,
    title: 'Wednesday — priority day B (upper chest, lats, arms, delts)',
    groups: [
      {
        exercises: [
          {
            name: 'Smith incline press (30 degrees)',
            reps: '8–12',
            sets: 2,
            restSec: 150,
          },
        ],
      },
      {
        exercises: [
          {
            name: 'Horizontal V-bar row',
            reps: '8–12',
            sets: 2,
            restSec: 150,
          },
        ],
      },
      {
        exercises: [
          {
            name: 'Incline dumbbell curl',
            reps: '10–12',
            sets: 2,
            restSec: 90,
          },
        ],
      },
      {
        exercises: [
          {
            name: 'Overhead dumbbell extension',
            reps: '10–15',
            sets: 2,
            restSec: 90,
          },
        ],
      },
      {
        exercises: [
          {
            name: 'Lateral raise',
            reps: '12–20',
            sets: 2,
            restSec: 90,
          },
        ],
      },
      {
        exercises: [
          {
            name: 'Face pull',
            reps: '12–20',
            sets: 2,
            restSec: 90,
          },
        ],
      },
    ],
  },
  {
    weekday: 4,
    title: 'Thursday — arms, delts and detail',
    groups: [
      {
        exercises: [
          {
            name: 'Cable pushdown',
            reps: '10–15',
            sets: 2,
            restSec: 90,
          },
        ],
      },
      {
        exercises: [
          {
            name: 'Isolated hammer curl',
            reps: '10–12',
            sets: 2,
            restSec: 90,
          },
        ],
      },
      {
        exercises: [
          {
            name: 'Low-to-high cable flye',
            reps: '10–15',
            sets: 2,
            restSec: 90,
          },
        ],
      },
      {
        exercises: [
          {
            name: 'Lateral raise',
            reps: '12–20',
            sets: 2,
            restSec: 90,
          },
        ],
      },
      {
        exercises: [
          {
            name: 'Rear delt flye',
            reps: '12–20',
            sets: 2,
            restSec: 90,
          },
        ],
      },
    ],
  },
  {
    weekday: 5,
    title: 'Friday — priority day C (upper chest, lats, arms, side delts)',
    groups: [
      {
        exercises: [
          {
            name: 'Incline dumbbell press (30 degrees)',
            reps: '8–12',
            sets: 2,
            restSec: 150,
          },
        ],
      },
      {
        exercises: [
          {
            name: 'V-bar pulldown',
            reps: '8–12',
            sets: 2,
            restSec: 150,
          },
        ],
      },
      {
        exercises: [
          {
            name: 'Hammer curl',
            reps: '10–12',
            sets: 2,
            restSec: 90,
          },
        ],
      },
      {
        exercises: [
          {
            name: 'Overhead cable extension (horizontal bar)',
            reps: '10–15',
            sets: 2,
            restSec: 90,
          },
        ],
      },
      {
        exercises: [
          {
            name: 'Lateral raise',
            reps: '12–20',
            sets: 2,
            restSec: 90,
          },
        ],
      },
    ],
  },
]

export function planForWeekday(weekday: number): DayPlan | null {
  return WEEKLY_PLAN.find((plan) => plan.weekday === weekday) ?? null
}
