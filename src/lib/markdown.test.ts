import type { Session } from '../types'
import { buildWorkoutBlock } from './markdown'
import { createSession } from './session'
import { TEST_PLAN } from './session.test'
import { describe, expect, test } from 'bun:test'

function sessionWithLogs(): Session {
  const s = createSession(TEST_PLAN, '2026-07-21', 0, 0)
  s.exercises[0].logs = [
    { weight: '40', reps: '12', done: true },
    { weight: '40', reps: '11', done: true },
    { weight: '40', reps: '10', done: true },
    { weight: '40', reps: '8', done: true },
  ]
  s.exercises[1].logs = [
    { weight: '8', reps: '12', done: true },
    { weight: '10', reps: '9', done: true },
    { weight: '', reps: '', done: false },
    { weight: '', reps: '', done: false },
  ]
  return s
}

describe('buildWorkoutBlock', () => {
  test('renders title and one table row per exercise', () => {
    const block = buildWorkoutBlock(sessionWithLogs())
    const lines = block.split('\n')
    expect(lines[0]).toBe('**Monday — chest and triceps**')
    expect(lines[1]).toBe(
      '| Exercise | Reps | Sets | Rest | Weight | Reps done |',
    )
    expect(lines).toHaveLength(3 + 3)
  })

  test('collapses uniform weights and joins reps', () => {
    const block = buildWorkoutBlock(sessionWithLogs())
    expect(block).toContain(
      '| Smith incline press | 8–12 | 4 | 90s | 40kg | 12, 11, 10, 8 |',
    )
  })

  test('lists varying weights per set and ignores undone sets', () => {
    const block = buildWorkoutBlock(sessionWithLogs())
    expect(block).toContain(
      '| Flat dumbbell press | 8–12 | 4 | 90s | 8kg, 10kg | 12, 9 |',
    )
  })

  test('leaves cells empty for untouched exercises', () => {
    const block = buildWorkoutBlock(sessionWithLogs())
    expect(block).toContain('| Tricep pushdown | 10–15 | 3 | 75s |  |  |')
  })

  test('keeps non-numeric weight text as typed', () => {
    const s = sessionWithLogs()
    s.exercises[0].logs = [{ weight: 'band', reps: '15', done: true }]
    const block = buildWorkoutBlock(s)
    expect(block).toContain(
      '| Smith incline press | 8–12 | 4 | 90s | band | 15 |',
    )
  })
})
