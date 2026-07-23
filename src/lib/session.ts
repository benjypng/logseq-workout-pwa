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
  const exercises: SessionExercise[] = plan.groups.flatMap((group, g) =>
    group.map((e) => ({
      ...e,
      group: g,
      logs: Array.from({ length: e.sets }, (_, i) => ({
        weight: i === 0 ? (prefillWeights[e.name] ?? '') : '',
        reps: '',
        done: false,
      })),
    })),
  )
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

function firstUndoneInGroup(s: Session, group: number): Target | null {
  const members = s.exercises
    .map((e, i) => ({ e, i }))
    .filter(({ e }) => e.group === group)
  const maxSets = Math.max(...members.map(({ e }) => e.sets), 0)
  for (let round = 0; round < maxSets; round++) {
    for (const { e, i } of members) {
      if (round < e.sets && !e.logs[round].done) {
        return { exercise: i, set: round }
      }
    }
  }
  return null
}

export function nextTarget(s: Session): Target | null {
  const groupIds: number[] = []
  for (const e of s.exercises) {
    if (!groupIds.includes(e.group)) groupIds.push(e.group)
  }
  const activeGroup = s.exercises[s.activeExercise].group
  const startAt = groupIds.indexOf(activeGroup)
  const rotated = groupIds.slice(startAt).concat(groupIds.slice(0, startAt))
  for (const group of rotated) {
    const target = firstUndoneInGroup(s, group)
    if (target) return target
  }
  return null
}

export function isSessionDone(s: Session): boolean {
  return s.exercises.every((e) => e.logs.every((l) => l.done))
}

function withLogAt(
  s: Session,
  target: Target,
  update: (
    log: SessionExercise['logs'][number],
  ) => SessionExercise['logs'][number],
): Session {
  const exercises = s.exercises.map((e, ei) =>
    ei === target.exercise
      ? {
          ...e,
          logs: e.logs.map((l, li) => (li === target.set ? update(l) : l)),
        }
      : e,
  )
  return { ...s, exercises }
}

function moveTo(s: Session, target: Target): Session {
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
      return withLogAt(moved, target, (l) => ({ ...l, weight: prev.weight }))
  }
  return moved
}

function advance(s: Session): Session {
  const target = nextTarget(s)
  if (!target) {
    return { ...s, phase: 'complete', restEndsAt: null, setStarted: false }
  }
  return moveTo(s, target)
}

export function sessionReducer(s: Session, action: SessionAction): Session {
  const active: Target = { exercise: s.activeExercise, set: s.activeSet }
  switch (action.type) {
    case 'input':
      if (s.phase !== 'set') return s
      return withLogAt(s, active, (l) => ({
        ...l,
        [action.field]: action.value,
      }))
    case 'start-set':
      if (s.phase !== 'set') return s
      return { ...s, setStarted: true }
    case 'complete-set': {
      if (s.phase !== 'set') return s
      const logged = withLogAt(s, active, (l) => ({ ...l, done: true }))
      const restSec = logged.exercises[logged.activeExercise].restSec
      if (restSec <= 0) return advance(logged)
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
      return moveTo(s, { exercise: action.exercise, set })
    }
    case 'finish-early':
      return { ...s, phase: 'complete', restEndsAt: null, setStarted: false }
  }
}
