export type RunLogseq = (args: string[]) => Promise<unknown>

export interface HandlerDeps {
  graph: string
  runLogseq: RunLogseq
}

const WORKOUT_TAG = 'Workout'

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

interface PageBlock {
  'block/title'?: string
  'block/tags'?: { 'block/title'?: string }[]
}

async function hasDuplicateOnPage(
  runLogseq: RunLogseq,
  page: string,
  content: string,
): Promise<boolean> {
  const edn = `[:find (pull ?b [:block/title {:block/tags [:block/title]}]) :in $ ?page :where [?p :block/name ?page] [?b :block/page ?p]]`
  try {
    const raw = (await runLogseq([
      'query',
      '--query',
      edn,
      '--inputs',
      JSON.stringify([page.toLowerCase()]),
    ])) as { data?: { result?: unknown[] } } | null
    const blocks = (raw?.data?.result ?? []).flat() as PageBlock[]
    return blocks.some(
      (b) =>
        b['block/title'] === content &&
        (b['block/tags'] ?? []).some((t) => t['block/title'] === WORKOUT_TAG),
    )
  } catch {
    return false
  }
}

function journalPageName(dateISO: string): string {
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

export function createHandler({ graph, runLogseq }: HandlerDeps) {
  let tagEnsured: Promise<void> | null = null
  const ensureWorkoutTag = () => {
    tagEnsured ??= runLogseq(['upsert', 'tag', '--name', WORKOUT_TAG]).then(
      () => undefined,
      (err) => {
        tagEnsured = null
        throw err
      },
    )
    return tagEnsured
  }

  return async function handle(req: Request): Promise<Response> {
    const url = new URL(req.url)
    try {
      if (req.method === 'GET' && url.pathname === '/graph') {
        return ok({ name: graph })
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
        await ensureWorkoutTag()
        if (
          await hasDuplicateOnPage(runLogseq, journalPageName(page), content)
        ) {
          return ok({ deduped: true })
        }
        const created = (await runLogseq([
          'upsert',
          'block',
          '--content',
          content,
          '--target-page',
          page,
          '--update-tags',
          `["${WORKOUT_TAG}"]`,
        ])) as { data?: { result?: unknown[] } } | null
        const id = created?.data?.result?.[0] as number | undefined
        return ok({ id: id ?? null })
      }

      return fail(404, 'not found')
    } catch (err) {
      const message = err instanceof Error ? err.message : String(err)
      console.error(message)
      return fail(500, message)
    }
  }
}
