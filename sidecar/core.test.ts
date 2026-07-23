import { createHandler, type RunLogseq } from './core'
import { describe, expect, test } from 'bun:test'

const CONTENT = '**Monday — chest and triceps**\n| Exercise | Reps |'

function makeRun(calls: string[][], queryResult: unknown[] = []): RunLogseq {
  return async (args) => {
    calls.push(args)
    if (args[0] === 'query') return { data: { result: queryResult } }
    if (args[0] === 'upsert' && args[1] === 'tag')
      return { data: { result: [1] } }
    return { data: { result: [42] } }
  }
}

function post(body: unknown): Request {
  return new Request('http://sidecar/workout', {
    method: 'POST',
    body: JSON.stringify(body),
  })
}

describe('sidecar handler', () => {
  test('GET /graph returns the graph name', async () => {
    const handle = createHandler({ graph: 'g', runLogseq: makeRun([]) })
    const res = await handle(new Request('http://sidecar/graph'))
    expect(await res.json()).toEqual({ name: 'g' })
  })

  test('POST /workout ensures the tag, then upserts a tagged block', async () => {
    const calls: string[][] = []
    const handle = createHandler({ graph: 'g', runLogseq: makeRun(calls) })
    const res = await handle(post({ page: '2026-07-21', content: CONTENT }))
    expect(await res.json()).toEqual({ id: 42 })
    expect(calls[0]).toEqual(['upsert', 'tag', '--name', 'Workout'])
    expect(calls[1][0]).toBe('query')
    expect(calls[2]).toEqual([
      'upsert',
      'block',
      '--content',
      CONTENT,
      '--target-page',
      '2026-07-21',
      '--update-tags',
      '["Workout"]',
    ])
  })

  test('ensures the tag only once per process', async () => {
    const calls: string[][] = []
    const handle = createHandler({ graph: 'g', runLogseq: makeRun(calls) })
    await handle(post({ page: '2026-07-21', content: CONTENT }))
    await handle(post({ page: '2026-07-22', content: CONTENT }))
    const tagCalls = calls.filter((c) => c[1] === 'tag')
    expect(tagCalls).toHaveLength(1)
  })

  test('dedupes an identical block already on the page', async () => {
    const calls: string[][] = []
    const existing = [
      [
        {
          'block/title': CONTENT,
          'block/tags': [{ 'block/title': 'Workout' }],
        },
      ],
    ]
    const handle = createHandler({
      graph: 'g',
      runLogseq: makeRun(calls, existing),
    })
    const res = await handle(post({ page: '2026-07-21', content: CONTENT }))
    expect(await res.json()).toEqual({ deduped: true })
    expect(calls.some((c) => c[1] === 'block')).toBe(false)
  })

  test('dedupe queries the journal page by its display name', async () => {
    const calls: string[][] = []
    const handle = createHandler({ graph: 'g', runLogseq: makeRun(calls) })
    await handle(post({ page: '2026-07-21', content: CONTENT }))
    const query = calls.find((c) => c[0] === 'query')
    expect(query?.[4]).toBe('["jul 21st, 2026"]')
  })

  test('rejects a non-date page and empty content with 400', async () => {
    const handle = createHandler({ graph: 'g', runLogseq: makeRun([]) })
    const bad = await handle(post({ page: 'not-a-date', content: CONTENT }))
    expect(bad.status).toBe(400)
    const empty = await handle(post({ page: '2026-07-21', content: ' ' }))
    expect(empty.status).toBe(400)
  })

  test('a CLI failure returns 500', async () => {
    const handle = createHandler({
      graph: 'g',
      runLogseq: async () => {
        throw new Error('boom')
      },
    })
    const res = await handle(post({ page: '2026-07-21', content: CONTENT }))
    expect(res.status).toBe(500)
  })
})
