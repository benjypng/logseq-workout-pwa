export interface PlannedExercise {
  name: string
  reps: string
  sets: number
  restSec: number
}

export interface ExerciseGroup {
  muscles?: string
  exercises: PlannedExercise[]
}

export interface DayPlan {
  title: string
  groups: ExerciseGroup[]
}

export function isSuperset(group: ExerciseGroup): boolean {
  return group.exercises.length > 1
}

export interface SetLog {
  weight: string
  reps: string
  done: boolean
}

export interface SessionExercise extends PlannedExercise {
  group: number
  logs: SetLog[]
}

export type SessionPhase = 'set' | 'resting' | 'complete'

export interface Session {
  id: string
  startedAt: number
  dateISO: string
  dayTitle: string
  exercises: SessionExercise[]
  activeExercise: number
  activeSet: number
  phase: SessionPhase
  setStarted: boolean
  restEndsAt: number | null
  restTotalSec: number
}

export interface CompletedSession {
  id: string
  finishedAt: number
  dateISO: string
  dayTitle: string
  content: string
  synced: boolean
}

export interface WorkoutOp {
  id: string
  ts: number
  page: string
  content: string
}
