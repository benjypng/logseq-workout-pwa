import type { WorkoutOp } from './types'

const BASE = '/logseq-cli'

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
    ...init,
  })
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
