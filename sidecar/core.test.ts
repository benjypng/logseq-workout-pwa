import {
  buildEntry,
  createHandler,
  journalTitle,
  type ReadJournal,
  spaceTables,
  type WriteJournal,
} from './core'
import { describe, expect, test } from 'bun:test'

const CONTENT = '**Gym**\n\nbench press:: 35/10, 35/8, 35/8'

function makeVault(initial: Record<string, string> = {}) {
  const files: Record<string, string> = { ...initial }
  const readJournal: ReadJournal = async (page) => files[page] ?? null
  const writeJournal: WriteJournal = async (page, content) => {
    files[page] = content
  }
  return { files, readJournal, writeJournal }
}

function post(body: unknown): Request {
  return new Request('http://sidecar/workout', {
    method: 'POST',
    body: JSON.stringify(body),
  })
}

describe('sidecar handler', () => {
  test('GET /graph returns the vault name', async () => {
    const { readJournal, writeJournal } = makeVault()
    const handle = createHandler({
      vault: '/home/unraid/obsidian/vault',
      readJournal,
      writeJournal,
    })
    const res = await handle(new Request('http://sidecar/graph'))
    expect(await res.json()).toEqual({ name: 'vault' })
  })

  test('POST /workout creates the journal page with frontmatter', async () => {
    const { files, readJournal, writeJournal } = makeVault()
    const handle = createHandler({ vault: '/v', readJournal, writeJournal })
    const res = await handle(post({ page: '2026-07-21', content: CONTENT }))
    expect(await res.json()).toEqual({ page: '2026-07-21', created: true })

    const written = files['2026-07-21']
    expect(written).toContain('title: "Jul 21st, 2026"')
    expect(written).toContain('created: "2026-07-21"')
    expect(written).toContain('**Gym**')
    expect(written).toContain('bench press:: 35/10, 35/8, 35/8')
  })

  test('POST /workout appends to an existing journal page', async () => {
    const existing = '---\ntitle: "Jul 21st, 2026"\n---\n\nEarlier note.\n'
    const { files, readJournal, writeJournal } = makeVault({
      '2026-07-21': existing,
    })
    const handle = createHandler({ vault: '/v', readJournal, writeJournal })
    await handle(post({ page: '2026-07-21', content: CONTENT }))

    const written = files['2026-07-21']
    expect(written).toContain('Earlier note.')
    expect(written.indexOf('Earlier note.')).toBeLessThan(
      written.indexOf('**Gym**'),
    )
  })

  test('POST /workout is idempotent for the same session', async () => {
    const { files, readJournal, writeJournal } = makeVault()
    const handle = createHandler({ vault: '/v', readJournal, writeJournal })
    await handle(post({ page: '2026-07-21', content: CONTENT }))
    const res = await handle(post({ page: '2026-07-21', content: CONTENT }))

    expect(await res.json()).toEqual({ deduped: true })
    const occurrences = files['2026-07-21'].split('**Gym**').length - 1
    expect(occurrences).toBe(1)
  })

  test('POST /workout rejects a bad page or empty content', async () => {
    const { readJournal, writeJournal } = makeVault()
    const handle = createHandler({ vault: '/v', readJournal, writeJournal })
    expect(
      (await handle(post({ page: 'nope', content: CONTENT }))).status,
    ).toBe(400)
    expect(
      (await handle(post({ page: '2026-07-21', content: '  ' }))).status,
    ).toBe(400)
  })
})

describe('markdown shaping', () => {
  test('spaceTables inserts a blank line before a table header', () => {
    const spaced = spaceTables('**Title**\n| A | B |\n|---|---|\n| 1 | 2 |')
    expect(spaced).toBe('**Title**\n\n| A | B |\n|---|---|\n| 1 | 2 |')
  })

  test('spaceTables leaves an already-spaced table alone', () => {
    const input = '**Title**\n\n| A | B |\n|---|---|\n| 1 | 2 |'
    expect(spaceTables(input)).toBe(input)
  })

  test('spaceTables ignores pipes inside code fences', () => {
    const input = '```\n| not | a table |\n|---|---|\n```'
    expect(spaceTables(input)).toBe(input)
  })

  test('buildEntry trims and spaces tables without adding a tag', () => {
    expect(buildEntry(`  ${CONTENT}  `)).toBe(CONTENT)
  })

  test('journalTitle uses Logseq-style ordinals', () => {
    expect(journalTitle('2026-07-21')).toBe('Jul 21st, 2026')
    expect(journalTitle('2026-07-11')).toBe('Jul 11th, 2026')
    expect(journalTitle('2026-07-03')).toBe('Jul 3rd, 2026')
  })
})
