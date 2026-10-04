import type { WorkoutOp } from '../types'
import { deleteOp, listOps, type WorkoutDB } from './db'

function isDroppable(err: unknown): boolean {
  const status = (err as { status?: unknown })?.status
  return typeof status === 'number' && status >= 400 && status < 500
}

export interface FlushResult {
  sent: string[]
  dropped: string[]
  error: string | null
}

export async function flushOutbox(
  db: WorkoutDB,
  send: (op: WorkoutOp) => Promise<void>,
): Promise<FlushResult> {
  const pending = await listOps(db)
  const sent: string[] = []
  const dropped: string[] = []
  let error: string | null = null
  for (const op of pending) {
    try {
      await send(op)
    } catch (err) {
      if (isDroppable(err)) {
        await deleteOp(db, op.id)
        dropped.push(op.id)
        continue
      }
      error = err instanceof Error ? err.message : String(err)
      break
    }
    await deleteOp(db, op.id)
    sent.push(op.id)
  }
  return { sent, dropped, error }
}
