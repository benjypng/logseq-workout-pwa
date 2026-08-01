import type { DayPlan } from './types'

export const WEEKLY_PLAN: DayPlan[] = [
  {
    weekday: 1,
    title: 'Monday — gym, upper body',
    groups: [
      {
        exercises: [
          {
            name: 'Incline bench press (smith or dumbbell)',
            reps: '8–12',
            sets: 3,
            restSec: 150,
          },
        ],
      },
      {
        exercises: [
          {
            name: 'Lat pulldown (wide grip)',
            reps: '8–12',
            sets: 3,
            restSec: 150,
          },
        ],
      },
      {
        exercises: [
          {
            name: 'Shoulder press',
            reps: '8–12',
            sets: 3,
            restSec: 150,
          },
        ],
      },
      {
        exercises: [
          {
            name: 'Horizontal lat row (v-bar)',
            reps: '8–12',
            sets: 3,
            restSec: 150,
          },
        ],
      },
      {
        exercises: [
          {
            name: 'Face-away bicep curl',
            reps: '10–12',
            sets: 2,
            restSec: 90,
          },
          {
            name: 'Overhead cable tricep extension',
            reps: '10–12',
            sets: 2,
            restSec: 90,
          },
        ],
      },
    ],
  },
  {
    weekday: 2,
    title: 'Tuesday — home, upper body',
    groups: [
      {
        exercises: [
          {
            name: 'Scapular pull-ups',
            reps: '5–8',
            sets: 2,
            restSec: 90,
          },
        ],
      },
      {
        exercises: [
          {
            name: 'Rows (inverted, harder angle as you progress)',
            reps: '8–12',
            sets: 3,
            restSec: 150,
          },
        ],
      },
      {
        exercises: [
          {
            name: 'Dips',
            reps: '8–12',
            sets: 3,
            restSec: 150,
          },
        ],
      },
      {
        exercises: [
          {
            name: 'Push-ups',
            reps: '8–15',
            sets: 2,
            restSec: 90,
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
          {
            name: 'Overhead dumbbell tricep extension',
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
    title: 'Wednesday — gym, legs and back',
    groups: [
      {
        exercises: [
          {
            name: 'Squat (smith or goblet)',
            reps: '8–12',
            sets: 3,
            restSec: 150,
          },
        ],
      },
      {
        exercises: [
          {
            name: 'Bulgarian split squat (long stride, torso forward)',
            reps: '8–12 per leg',
            sets: 3,
            restSec: 150,
          },
        ],
      },
      {
        exercises: [
          {
            name: 'Leg extension',
            reps: '10–15',
            sets: 2,
            restSec: 90,
          },
        ],
      },
      {
        exercises: [
          {
            name: 'Straight-arm cable pulldown',
            reps: '10–15',
            sets: 2,
            restSec: 90,
          },
        ],
      },
      {
        exercises: [
          {
            name: 'Cable lateral raise',
            reps: '12–20',
            sets: 2,
            restSec: 90,
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
    weekday: 4,
    title: 'Thursday — gym, upper body',
    groups: [
      {
        exercises: [
          {
            name: 'Incline bench press (smith or dumbbell)',
            reps: '8–12',
            sets: 3,
            restSec: 150,
          },
        ],
      },
      {
        exercises: [
          {
            name: 'Lat pulldown (wide grip)',
            reps: '8–12',
            sets: 3,
            restSec: 150,
          },
        ],
      },
      {
        exercises: [
          {
            name: 'Shoulder press',
            reps: '8–12',
            sets: 3,
            restSec: 150,
          },
        ],
      },
      {
        exercises: [
          {
            name: 'Horizontal lat row (v-bar)',
            reps: '8–12',
            sets: 3,
            restSec: 150,
          },
        ],
      },
      {
        exercises: [
          {
            name: 'Face-away bicep curl',
            reps: '10–12',
            sets: 2,
            restSec: 90,
          },
          {
            name: 'Overhead cable tricep extension',
            reps: '10–12',
            sets: 2,
            restSec: 90,
          },
        ],
      },
    ],
  },
  {
    weekday: 5,
    title: 'Friday — home, upper body',
    groups: [
      {
        exercises: [
          {
            name: 'Scapular pull-ups',
            reps: '5–8',
            sets: 2,
            restSec: 90,
          },
        ],
      },
      {
        exercises: [
          {
            name: 'Rows (inverted, harder angle as you progress)',
            reps: '8–12',
            sets: 3,
            restSec: 150,
          },
        ],
      },
      {
        exercises: [
          {
            name: 'Dips',
            reps: '8–12',
            sets: 3,
            restSec: 150,
          },
        ],
      },
      {
        exercises: [
          {
            name: 'Push-ups',
            reps: '8–15',
            sets: 2,
            restSec: 90,
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
          {
            name: 'Overhead dumbbell tricep extension',
            reps: '10–15',
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
