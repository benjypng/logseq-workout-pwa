import type { WorkoutOp } from '../types'
import { enqueueOp, listOps, openWorkoutDB } from './db'
import { flushOutbox } from './outbox'
import { describe, expect, test } from 'bun:test'

let counter = 0

function op(id: string): WorkoutOp {
  return { id, ts: ++counter, page: '2026-07-21', content: `session ${id}` }
}

async function freshDb() {
  return openWorkoutDB(`test-${crypto.randomUUID()}`)
}

describe('flushOutbox', () => {
  test('sends pending ops oldest-first and clears them', async () => {
    const db = await freshDb()
    await enqueueOp(db, op('a'))
    await enqueueOp(db, op('b'))
    const sent: string[] = []
    const result = await flushOutbox(db, async (o) => {
      sent.push(o.id)
    })
    expect(sent).toEqual(['a', 'b'])
    expect(result.sent).toEqual(['a', 'b'])
    expect(await listOps(db)).toHaveLength(0)
  })

  test('re-enqueueing the same id is idempotent', async () => {
    const db = await freshDb()
    await enqueueOp(db, op('a'))
    await enqueueOp(db, op('a'))
    expect(await listOps(db)).toHaveLength(1)
  })

  test('a network failure halts the queue for retry', async () => {
    const db = await freshDb()
    await enqueueOp(db, op('a'))
    await enqueueOp(db, op('b'))
    const result = await flushOutbox(db, async () => {
      throw new Error('offline')
    })
    expect(result.sent).toEqual([])
    expect(await listOps(db)).toHaveLength(2)
  })

  test('a 4xx drops the op and continues', async () => {
    const db = await freshDb()
    await enqueueOp(db, op('bad'))
    await enqueueOp(db, op('good'))
    const result = await flushOutbox(db, async (o) => {
      if (o.id === 'bad') {
        const err = new Error('bad request') as Error & { status: number }
        err.status = 400
        throw err
      }
    })
    expect(result.dropped).toEqual(['bad'])
    expect(result.sent).toEqual(['good'])
    expect(await listOps(db)).toHaveLength(0)
  })
})
