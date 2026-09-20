import { mkdir, readFile, writeFile } from 'node:fs/promises'
import { join } from 'node:path'

import type { ReadJournal, WriteJournal } from './core'

export function requireVault(): string {
  const vault = process.env.OBSIDIAN_VAULT
  if (!vault) {
    console.error(
      'OBSIDIAN_VAULT env var is required (set it in .env or your shell)',
    )
    process.exit(1)
  }
  return vault
}

function journalsDir(vault: string): string {
  return join(vault, '02 areas', 'Workouts')
}

function journalPath(vault: string, page: string): string {
  return join(journalsDir(vault), `${page}.md`)
}

export function makeReadJournal(vault: string): ReadJournal {
  return async function readJournal(page: string): Promise<string | null> {
    try {
      return await readFile(journalPath(vault, page), 'utf8')
    } catch (err) {
      if ((err as NodeJS.ErrnoException).code === 'ENOENT') return null
      throw err
    }
  }
}

export function makeWriteJournal(vault: string): WriteJournal {
  return async function writeJournal(
    page: string,
    content: string,
  ): Promise<void> {
    await mkdir(journalsDir(vault), { recursive: true })
    await writeFile(journalPath(vault, page), content, 'utf8')
  }
}
