export type ReadJournal = (page: string) => Promise<string | null>
export type WriteJournal = (page: string, content: string) => Promise<void>

export interface HandlerDeps {
  vault: string
  readJournal: ReadJournal
  writeJournal: WriteJournal
}

const TABLE_ROW = /^\s*\|.*\|\s*$/
const TABLE_DELIM = /^\s*\|?[\s:|-]*-[\s:|-]*\|[\s:|-]*$/

function ok(body: unknown): Response {
  return new Response(JSON.stringify(body), {
    headers: { 'Content-Type': 'application/json' },
  })
}

function fail(status: number, message: string): Response {
  return new Response(JSON.stringify({ error: message }), {
    status,
    headers: { 'Content-Type': 'application/json' },
  })
}

export function vaultName(vault: string): string {
  const parts = vault.replace(/\/+$/, '').split('/')
  return parts[parts.length - 1] || vault
}

export function journalTitle(dateISO: string): string {
  const [y, m, d] = dateISO.split('-').map(Number)
  const date = new Date(y, m - 1, d)
  const month = date.toLocaleString('en-US', { month: 'short' })
  const suffix =
    d % 10 === 1 && d !== 11
      ? 'st'
      : d % 10 === 2 && d !== 12
        ? 'nd'
        : d % 10 === 3 && d !== 13
          ? 'rd'
          : 'th'
  return `${month} ${d}${suffix}, ${y}`
}

export function spaceTables(text: string): string {
  const lines = text.split('\n')
  const out: string[] = []
  let fence = false
  let inTable = false

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i]
    const trimmed = line.trimStart()

    if (trimmed.startsWith('```') || trimmed.startsWith('~~~')) {
      fence = !fence
      inTable = false
      out.push(line)
      continue
    }
    if (fence) {
      out.push(line)
      continue
    }

    const row = TABLE_ROW.test(line)
    const next = i + 1 < lines.length ? lines[i + 1] : ''

    if (!inTable && row && TABLE_DELIM.test(next)) {
      if (out.length > 0 && out[out.length - 1].trim() !== '') out.push('')
      inTable = true
    } else if (inTable && !row) {
      if (line.trim() !== '') out.push('')
      inTable = false
    }

    out.push(line)
  }

  return out.join('\n')
}

export function buildEntry(content: string): string {
  return spaceTables(content.trim())
}

export function newJournalPage(dateISO: string, entry: string): string {
  return `${[
    '---',
    `title: "${journalTitle(dateISO)}"`,
    `created: "${dateISO}"`,
    `updated: "${dateISO}"`,
    '---',
    '',
    entry,
  ].join('\n')}\n`
}

export function appendEntry(existing: string, entry: string): string {
  return `${existing.replace(/\s+$/, '')}\n\n${entry}\n`
}

export function createHandler({
  vault,
  readJournal,
  writeJournal,
}: HandlerDeps) {
  return async function handle(req: Request): Promise<Response> {
    const url = new URL(req.url)
    try {
      if (req.method === 'GET' && url.pathname === '/graph') {
        return ok({ name: vaultName(vault) })
      }

      if (req.method === 'POST' && url.pathname === '/workout') {
        const { page, content } = (await req.json()) as {
          page?: string
          content?: string
        }
        if (!page || !/^\d{4}-\d{2}-\d{2}$/.test(page)) {
          return fail(400, 'page must be a YYYY-MM-DD date')
        }
        if (!content || content.trim() === '') {
          return fail(400, 'missing content')
        }

        const entry = buildEntry(content)
        const existing = await readJournal(page)
        if (existing !== null && existing.includes(entry)) {
          return ok({ deduped: true })
        }

        const next =
          existing === null
            ? newJournalPage(page, entry)
            : appendEntry(existing, entry)
        await writeJournal(page, next)
        return ok({ page, created: existing === null })
      }

      return fail(404, 'not found')
    } catch (err) {
      const message = err instanceof Error ? err.message : String(err)
      console.error(message)
      return fail(500, message)
    }
  }
}
