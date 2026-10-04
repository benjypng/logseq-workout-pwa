import type { WorkoutOp } from './types'

const BASE = '/logseq-cli'
const TIMEOUT_MS = 15_000

export const REAUTH_URL = `${BASE}/reauth`

export class AuthRequiredError extends Error {
  constructor() {
    super('Cloudflare sign-in has expired')
  }
}

class ApiError extends Error {
  status: number

  constructor(status: number, message: string) {
    super(message)
    this.status = status
  }
}

async function request(path: string, init?: RequestInit): Promise<Response> {
  const res = await fetch(`${BASE}${path}`, {
    headers: { 'Content-Type': 'application/json' },
    signal: AbortSignal.timeout(TIMEOUT_MS),
    redirect: 'manual',
    ...init,
  })
  if (res.type === 'opaqueredirect') throw new AuthRequiredError()
  if (!res.ok) throw new ApiError(res.status, await res.text())
  return res
}

export async function getGraphName(): Promise<string> {
  const res = await request('/graph')
  const { name } = (await res.json()) as { name: string }
  return name
}

export async function sendWorkoutOp(op: WorkoutOp): Promise<void> {
  await request('/workout', {
    method: 'POST',
    body: JSON.stringify({ page: op.page, content: op.content }),
  })
}
