import type { DayPlan } from './types'

export type WorkoutKind = 'gym' | 'bodyweight'

export const PLANS: Record<WorkoutKind, DayPlan> = {
  gym: {
    title: 'Gym',
    groups: [
      {
        exercises: [
          { name: 'bench press', reps: '8–12', sets: 3, restSec: 150 },
          { name: 'pulldown', reps: '8–12', sets: 3, restSec: 150 },
        ],
      },
      {
        exercises: [
          { name: 'shoulder press', reps: '8–12', sets: 3, restSec: 150 },
          { name: 'rows', reps: '8–12', sets: 3, restSec: 150 },
        ],
      },
      {
        exercises: [
          { name: 'bicep curls', reps: '10–12', sets: 2, restSec: 90 },
          { name: 'tricep extensions', reps: '10–12', sets: 2, restSec: 90 },
        ],
      },
    ],
  },
  bodyweight: {
    title: 'Bodyweight',
    groups: [
      {
        exercises: [
          { name: 'pull ups', reps: '5–8', sets: 3, restSec: 90 },
          { name: 'squats', reps: '5–8', sets: 3, restSec: 90 },
        ],
      },
      {
        exercises: [
          { name: 'dips', reps: '5–8', sets: 3, restSec: 90 },
          { name: 'splits', reps: '8–12 per leg', sets: 3, restSec: 90 },
        ],
      },
      {
        exercises: [
          { name: 'rows', reps: '5–8', sets: 3, restSec: 90 },
          { name: 'push ups', reps: '5–8', sets: 3, restSec: 90 },
        ],
      },
    ],
  },
}
