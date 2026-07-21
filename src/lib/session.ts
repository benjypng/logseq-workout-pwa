import type { DayPlan, Session, SessionExercise } from '../types'

export type SessionAction =
  | { type: 'input'; field: 'weight' | 'reps'; value: string }
  | { type: 'start-set' }
  | { type: 'complete-set'; now: number }
  | { type: 'extend-rest'; seconds: number }
  | { type: 'skip-rest' }
  | { type: 'rest-elapsed' }
  | { type: 'jump-to-exercise'; exercise: number }
  | { type: 'finish-early' }

export function createSession(
  plan: DayPlan,
  dateISO: string,
  startExercise: number,
  now: number,
  prefillWeights: Record<string, string> = {},
): Session {
  const exercises: SessionExercise[] = plan.exercises.map((e) => ({
    ...e,
    logs: Array.from({ length: e.sets }, (_, i) => ({
      weight: i === 0 ? (prefillWeights[e.name] ?? '') : '',
      reps: '',
      done: false,
    })),
  }))
  return {
    id: crypto.randomUUID(),
    startedAt: now,
    dateISO,
    dayTitle: plan.title,
    exercises,
    activeExercise: Math.min(Math.max(startExercise, 0), exercises.length - 1),
    activeSet: 0,
    phase: 'set',
    setStarted: false,
    restEndsAt: null,
    restTotalSec: 0,
  }
}

interface Target {
  exercise: number
  set: number
}

export function nextTarget(s: Session): Target | null {
  const order = s.exercises.map((_, i) => i)
  const rotated = order
    .slice(s.activeExercise)
    .concat(order.slice(0, s.activeExercise))
  for (const exercise of rotated) {
    const set = s.exercises[exercise].logs.findIndex((l) => !l.done)
    if (set !== -1) return { exercise, set }
  }
  return null
}

export function isSessionDone(s: Session): boolean {
  return s.exercises.every((e) => e.logs.every((l) => l.done))
}

function withActiveLog(
  s: Session,
  update: (
    log: Session['exercises'][number]['logs'][number],
  ) => Session['exercises'][number]['logs'][number],
): Session {
  const exercises = s.exercises.map((e, ei) =>
    ei === s.activeExercise
      ? {
          ...e,
          logs: e.logs.map((l, li) => (li === s.activeSet ? update(l) : l)),
        }
      : e,
  )
  return { ...s, exercises }
}

function advance(s: Session): Session {
  const target = nextTarget(s)
  if (!target) {
    return {
      ...s,
      phase: 'complete',
      restEndsAt: null,
      setStarted: false,
    }
  }
  const moved: Session = {
    ...s,
    activeExercise: target.exercise,
    activeSet: target.set,
    phase: 'set',
    setStarted: false,
    restEndsAt: null,
  }
  const log = moved.exercises[target.exercise].logs[target.set]
  if (log.weight === '') {
    const prev = moved.exercises[target.exercise].logs
      .slice(0, target.set)
      .reverse()
      .find((l) => l.weight !== '')
    if (prev)
      return withActiveLog(moved, (l) => ({ ...l, weight: prev.weight }))
  }
  return moved
}

export function sessionReducer(s: Session, action: SessionAction): Session {
  switch (action.type) {
    case 'input':
      if (s.phase !== 'set') return s
      return withActiveLog(s, (l) => ({ ...l, [action.field]: action.value }))
    case 'start-set':
      if (s.phase !== 'set') return s
      return { ...s, setStarted: true }
    case 'complete-set': {
      if (s.phase !== 'set') return s
      const logged = withActiveLog(s, (l) => ({ ...l, done: true }))
      const restSec = logged.exercises[logged.activeExercise].restSec
      return {
        ...logged,
        phase: 'resting',
        setStarted: false,
        restEndsAt: action.now + restSec * 1000,
        restTotalSec: restSec,
      }
    }
    case 'extend-rest':
      if (s.phase !== 'resting' || s.restEndsAt === null) return s
      return {
        ...s,
        restEndsAt: s.restEndsAt + action.seconds * 1000,
        restTotalSec: s.restTotalSec + action.seconds,
      }
    case 'skip-rest':
    case 'rest-elapsed':
      if (s.phase !== 'resting') return s
      return advance(s)
    case 'jump-to-exercise': {
      if (s.phase === 'complete') return s
      if (action.exercise < 0 || action.exercise >= s.exercises.length) return s
      const set = s.exercises[action.exercise].logs.findIndex((l) => !l.done)
      if (set === -1) return s
      return advance({
        ...s,
        activeExercise: action.exercise,
        activeSet: set,
        phase: 'set',
        setStarted: false,
        restEndsAt: null,
      })
    }
    case 'finish-early':
      return { ...s, phase: 'complete', restEndsAt: null, setStarted: false }
  }
}
