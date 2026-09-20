import type { DayPlan, Session } from '../types'
import {
  createSession,
  isSessionDone,
  nextTarget,
  sessionReducer,
} from './session'
import { describe, expect, test } from 'bun:test'

const NOW = 1_000_000

export const TEST_PLAN: DayPlan = {
  title: 'Monday — chest and triceps',
  groups: [
    {
      exercises: [
        { name: 'Smith incline press', reps: '8–12', sets: 4, restSec: 90 },
      ],
    },
    {
      exercises: [
        { name: 'Flat dumbbell press', reps: '8–12', sets: 4, restSec: 90 },
      ],
    },
    {
      exercises: [
        { name: 'Tricep pushdown', reps: '10–15', sets: 3, restSec: 75 },
      ],
    },
  ],
}

const SUPERSET_PLAN: DayPlan = {
  title: 'Monday — priority',
  groups: [
    {
      exercises: [
        { name: 'Incline press', reps: '8–12', sets: 2, restSec: 0 },
        { name: 'Dumbbell row', reps: '8–12', sets: 2, restSec: 90 },
      ],
    },
    {
      exercises: [
        { name: 'Tricep pushdown', reps: '10–15', sets: 2, restSec: 75 },
      ],
    },
  ],
}

function newSession(startExercise = 0): Session {
  return createSession(TEST_PLAN, '2026-07-21', startExercise, NOW)
}

function logAndRest(s: Session, weight = '8', reps = '10'): Session {
  let next = sessionReducer(s, {
    type: 'input',
    field: 'weight',
    value: weight,
  })
  next = sessionReducer(next, { type: 'input', field: 'reps', value: reps })
  next = sessionReducer(next, { type: 'start-set' })
  return sessionReducer(next, { type: 'complete-set', now: NOW })
}

describe('createSession', () => {
  test('builds empty logs per planned set and starts at the chosen exercise', () => {
    const s = newSession(1)
    expect(s.exercises).toHaveLength(3)
    expect(s.exercises[0].logs).toHaveLength(4)
    expect(s.exercises[2].logs).toHaveLength(3)
    expect(s.activeExercise).toBe(1)
    expect(s.activeSet).toBe(0)
    expect(s.phase).toBe('set')
  })

  test('prefills first-set weight from stored weights', () => {
    const s = createSession(TEST_PLAN, '2026-07-21', 0, NOW, {
      'Smith incline press': '40',
    })
    expect(s.exercises[0].logs[0].weight).toBe('40')
    expect(s.exercises[1].logs[0].weight).toBe('')
  })
})

describe('set flow', () => {
  test('complete-set marks the log done and starts rest with the prescribed seconds', () => {
    const s = logAndRest(newSession())
    expect(s.exercises[0].logs[0]).toEqual({
      weight: '8',
      reps: '10',
      done: true,
    })
    expect(s.phase).toBe('resting')
    expect(s.restEndsAt).toBe(NOW + 90_000)
    expect(s.restTotalSec).toBe(90)
  })

  test('rest-elapsed advances to the next set of the same exercise and prefills weight', () => {
    let s = logAndRest(newSession())
    s = sessionReducer(s, { type: 'rest-elapsed' })
    expect(s.phase).toBe('set')
    expect(s.activeExercise).toBe(0)
    expect(s.activeSet).toBe(1)
    expect(s.exercises[0].logs[1].weight).toBe('8')
    expect(s.exercises[0].logs[1].done).toBe(false)
  })

  test('after the final set of an exercise, advances to the next exercise', () => {
    let s = newSession()
    for (let i = 0; i < 4; i++) {
      s = logAndRest(s)
      s = sessionReducer(s, { type: 'rest-elapsed' })
    }
    expect(s.activeExercise).toBe(1)
    expect(s.activeSet).toBe(0)
  })

  test('extend-rest adds seconds, skip-rest advances immediately', () => {
    let s = logAndRest(newSession())
    s = sessionReducer(s, { type: 'extend-rest', seconds: 30 })
    expect(s.restEndsAt).toBe(NOW + 120_000)
    expect(s.restTotalSec).toBe(120)
    s = sessionReducer(s, { type: 'skip-rest' })
    expect(s.phase).toBe('set')
    expect(s.activeSet).toBe(1)
  })
})

describe('completion', () => {
  test('session completes after the final rest of the final set', () => {
    let s = newSession()
    let guard = 0
    while (!isSessionDone(s) && guard++ < 50) {
      s = logAndRest(s)
      if (s.phase === 'resting') s = sessionReducer(s, { type: 'rest-elapsed' })
    }
    expect(isSessionDone(s)).toBe(true)
    expect(s.phase).toBe('complete')
  })

  test('finish-early completes with partial logs', () => {
    let s = logAndRest(newSession())
    s = sessionReducer(s, { type: 'skip-rest' })
    s = sessionReducer(s, { type: 'finish-early' })
    expect(s.phase).toBe('complete')
    expect(s.exercises[0].logs[0].done).toBe(true)
  })
})

describe('supersets', () => {
  test('a zero-rest member hands off to its partner with no resting phase', () => {
    let s = createSession(SUPERSET_PLAN, '2026-07-21', 0, NOW)
    s = sessionReducer(s, { type: 'complete-set', now: NOW })
    expect(s.phase).toBe('set')
    expect(s.activeExercise).toBe(1)
    expect(s.activeSet).toBe(0)
    expect(s.exercises[0].logs[0].done).toBe(true)
  })

  test('after the partner rests, the next round returns to the first member', () => {
    let s = createSession(SUPERSET_PLAN, '2026-07-21', 0, NOW)
    s = sessionReducer(s, { type: 'complete-set', now: NOW })
    s = sessionReducer(s, { type: 'complete-set', now: NOW })
    expect(s.phase).toBe('resting')
    expect(s.restTotalSec).toBe(90)
    s = sessionReducer(s, { type: 'rest-elapsed' })
    expect(s.activeExercise).toBe(0)
    expect(s.activeSet).toBe(1)
  })

  test('finishing the superset moves on to the next group', () => {
    let s = createSession(SUPERSET_PLAN, '2026-07-21', 0, NOW)
    for (let round = 0; round < 2; round++) {
      s = sessionReducer(s, { type: 'complete-set', now: NOW })
      s = sessionReducer(s, { type: 'complete-set', now: NOW })
      s = sessionReducer(s, { type: 'rest-elapsed' })
    }
    expect(s.activeExercise).toBe(2)
    expect(s.activeSet).toBe(0)
  })

  test('starting from the partner still round-robins through the pair', () => {
    let s = createSession(SUPERSET_PLAN, '2026-07-21', 1, NOW)
    s = sessionReducer(s, { type: 'complete-set', now: NOW })
    expect(s.phase).toBe('resting')
    s = sessionReducer(s, { type: 'rest-elapsed' })
    expect(s.activeExercise).toBe(0)
    expect(s.activeSet).toBe(0)
  })

  test('nextTarget during a superset rest points at the first member of the next round', () => {
    let s = createSession(SUPERSET_PLAN, '2026-07-21', 0, NOW)
    s = sessionReducer(s, { type: 'complete-set', now: NOW })
    s = sessionReducer(s, { type: 'complete-set', now: NOW })
    expect(nextTarget(s)).toEqual({ exercise: 0, set: 1 })
  })
})

describe('flexible ordering', () => {
  test('starting mid-plan wraps around to earlier exercises', () => {
    let s = newSession(2)
    for (let i = 0; i < 3; i++) {
      s = logAndRest(s)
      s = sessionReducer(s, { type: 'rest-elapsed' })
    }
    expect(s.activeExercise).toBe(0)
  })

  test('jump-to-exercise moves to the first undone set there', () => {
    let s = logAndRest(newSession())
    s = sessionReducer(s, { type: 'skip-rest' })
    s = sessionReducer(s, { type: 'jump-to-exercise', exercise: 2 })
    expect(s.activeExercise).toBe(2)
    expect(s.activeSet).toBe(0)
    expect(s.phase).toBe('set')
  })

  test('jump-to-exercise ignores finished exercises', () => {
    let s = newSession()
    for (let i = 0; i < 4; i++) {
      s = logAndRest(s)
      s = sessionReducer(s, { type: 'rest-elapsed' })
    }
    const jumped = sessionReducer(s, { type: 'jump-to-exercise', exercise: 0 })
    expect(jumped).toBe(s)
  })

  test('nextTarget during rest points at the following set', () => {
    const s = logAndRest(newSession())
    expect(nextTarget(s)).toEqual({ exercise: 0, set: 1 })
  })
})
