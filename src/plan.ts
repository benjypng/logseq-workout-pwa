import type { DayPlan } from './types'

export const WEEKLY_PLAN: DayPlan[] = [
  {
    weekday: 1,
    title: 'Monday — priority (upper chest, back, arms)',
    groups: [
      [
        {
          name: 'Incline dumbbell press (30 degrees)',
          reps: '8–12',
          sets: 4,
          restSec: 0,
        },
        { name: 'One-arm dumbbell row', reps: '8–12', sets: 4, restSec: 90 },
      ],
      [
        { name: 'Preacher curl', reps: '10–12', sets: 3, restSec: 0 },
        { name: 'Close-grip bench press', reps: '8–12', sets: 3, restSec: 75 },
      ],
      [
        {
          name: 'Standing cable pullover',
          reps: '10–15',
          sets: 3,
          restSec: 60,
        },
      ],
    ],
  },
  {
    weekday: 2,
    title: 'Tuesday — legs and shoulders (only leg session)',
    groups: [
      [{ name: 'Leg press', reps: '8–12', sets: 3, restSec: 120 }],
      [{ name: 'Romanian deadlift', reps: '8–12', sets: 3, restSec: 120 }],
      [
        {
          name: 'Dumbbell shoulder press',
          reps: '8–12',
          sets: 3,
          restSec: 0,
        },
        { name: 'Lateral raise', reps: '12–20', sets: 3, restSec: 75 },
      ],
      [{ name: 'Standing calf raise', reps: '10–15', sets: 4, restSec: 60 }],
    ],
  },
  {
    weekday: 3,
    title: 'Wednesday — priority (upper chest, lats, arms)',
    groups: [
      [
        {
          name: 'Incline barbell press (30 degrees)',
          reps: '8–12',
          sets: 4,
          restSec: 0,
        },
        {
          name: 'Wide-grip overhand lat pulldown',
          reps: '8–12',
          sets: 4,
          restSec: 90,
        },
      ],
      [
        { name: 'Incline dumbbell curl', reps: '10–12', sets: 3, restSec: 0 },
        {
          name: 'Overhead EZ-bar extension',
          reps: '10–15',
          sets: 3,
          restSec: 75,
        },
      ],
      [
        {
          name: 'Incline dumbbell flye (30 degrees)',
          reps: '10–15',
          sets: 3,
          restSec: 0,
        },
        { name: 'Face pull', reps: '12–20', sets: 3, restSec: 60 },
      ],
    ],
  },
  {
    weekday: 4,
    title: 'Thursday — shoulders and accessory',
    groups: [
      [
        {
          name: 'Dumbbell shoulder press',
          reps: '8–12',
          sets: 3,
          restSec: 0,
        },
        { name: 'Lateral raise', reps: '12–20', sets: 3, restSec: 75 },
      ],
      [
        { name: 'Hammer curl', reps: '10–15', sets: 3, restSec: 0 },
        { name: 'Rear delt flye', reps: '12–20', sets: 3, restSec: 75 },
      ],
      [{ name: 'Lat pull-in', reps: '12–15', sets: 3, restSec: 60 }],
    ],
  },
  {
    weekday: 5,
    title: 'Friday — priority (upper chest, lats, arms)',
    groups: [
      [
        {
          name: 'Smith incline press (30 degrees)',
          reps: '8–12',
          sets: 4,
          restSec: 0,
        },
        {
          name: 'V-bar close-grip pulldown',
          reps: '8–12',
          sets: 4,
          restSec: 90,
        },
      ],
      [
        {
          name: 'Facing-away cable curl',
          reps: '10–12',
          sets: 3,
          restSec: 0,
        },
        {
          name: 'Overhead dumbbell extension',
          reps: '10–15',
          sets: 3,
          restSec: 75,
        },
      ],
      [{ name: 'Tricep pushdown', reps: '10–15', sets: 3, restSec: 60 }],
    ],
  },
]

export function planForWeekday(weekday: number): DayPlan | null {
  return WEEKLY_PLAN.find((p) => p.weekday === weekday) ?? null
}
