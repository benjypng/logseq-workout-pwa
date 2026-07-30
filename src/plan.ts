import type { DayPlan } from './types'

export const WEEKLY_PLAN: DayPlan[] = [
  {
    weekday: 1,
    title: 'Monday — priority (upper chest, lats, arms)',
    groups: [
      {
        exercises: [
          {
            name: 'Incline dumbbell press (30 degrees)',
            reps: '8–12',
            sets: 4,
            restSec: 0,
          },
          {
            name: 'Single-arm cable row (pull to hip)',
            reps: '8–12',
            sets: 4,
            restSec: 90,
          },
        ],
      },
      {
        exercises: [
          { name: 'Preacher curl', reps: '10–12', sets: 3, restSec: 0 },
          {
            name: 'Overhead cable extension',
            reps: '10–15',
            sets: 3,
            restSec: 75,
          },
        ],
      },
      {
        exercises: [
          {
            name: 'Standing cable pullover',
            reps: '10–15',
            sets: 3,
            restSec: 0,
          },
          { name: 'Rear delt flye', reps: '12–20', sets: 3, restSec: 60 },
        ],
      },
    ],
  },
  {
    weekday: 2,
    title: 'Tuesday — legs, lats and side delts (only leg session)',
    groups: [
      {
        exercises: [{ name: 'Leg press', reps: '8–12', sets: 3, restSec: 120 }],
      },
      {
        exercises: [
          { name: 'Romanian deadlift', reps: '8–12', sets: 3, restSec: 120 },
        ],
      },
      {
        exercises: [
          {
            name: 'Chin-up (underhand)',
            reps: '6–10',
            sets: 3,
            restSec: 0,
          },
          { name: 'Lateral raise', reps: '12–20', sets: 3, restSec: 75 },
        ],
      },
      {
        exercises: [
          { name: 'Standing calf raise', reps: '10–15', sets: 4, restSec: 60 },
        ],
      },
    ],
  },
  {
    weekday: 3,
    title: 'Wednesday — priority (upper chest, lats, arms)',
    groups: [
      {
        exercises: [
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
      },
      {
        exercises: [
          {
            name: 'Incline dumbbell curl',
            reps: '10–12',
            sets: 3,
            restSec: 0,
          },
          {
            name: 'Overhead EZ-bar extension',
            reps: '10–15',
            sets: 3,
            restSec: 75,
          },
        ],
      },
      {
        exercises: [
          {
            name: 'Incline dumbbell flye (30 degrees)',
            reps: '10–15',
            sets: 3,
            restSec: 0,
          },
          { name: 'Face pull', reps: '12–20', sets: 3, restSec: 60 },
        ],
      },
    ],
  },
  {
    weekday: 4,
    title: 'Thursday — arms, delts and accessory',
    groups: [
      {
        exercises: [
          {
            name: 'Single-arm overhead cable extension',
            reps: '10–15',
            sets: 3,
            restSec: 0,
          },
          { name: 'Lateral raise', reps: '12–20', sets: 3, restSec: 75 },
        ],
      },
      {
        exercises: [
          { name: 'Bayesian cable curl', reps: '10–12', sets: 3, restSec: 0 },
          { name: 'Rear delt flye', reps: '12–20', sets: 3, restSec: 75 },
        ],
      },
      {
        exercises: [
          { name: 'Lat pull-in', reps: '12–15', sets: 3, restSec: 0 },
          { name: 'Face pull', reps: '12–20', sets: 3, restSec: 60 },
        ],
      },
    ],
  },
  {
    weekday: 5,
    title: 'Friday — priority (upper chest, lats, arms)',
    groups: [
      {
        exercises: [
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
      },
      {
        exercises: [
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
      },
      {
        exercises: [
          {
            name: 'Cross-body cable extension',
            reps: '10–15',
            sets: 3,
            restSec: 0,
          },
          { name: 'Lateral raise', reps: '12–20', sets: 3, restSec: 60 },
        ],
      },
    ],
  },
]

export function planForWeekday(weekday: number): DayPlan | null {
  return WEEKLY_PLAN.find((p) => p.weekday === weekday) ?? null
}
