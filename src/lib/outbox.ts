import type { WorkoutOp } from '../types'
import { deleteOp, listOps, type WorkoutDB } from './db'

function isDroppable(err: unknown): boolean {
  const status = (err as { status?: unknown })?.status
  return typeof status === 'number' && status >= 400 && status < 500
}

export interface FlushResult {
  sent: string[]
  dropped: string[]
}

export async function flushOutbox(
  db: WorkoutDB,
  send: (op: WorkoutOp) => Promise<void>,
): Promise<FlushResult> {
  const pending = await listOps(db)
  const sent: string[] = []
  const dropped: string[] = []
  for (const op of pending) {
    try {
      await send(op)
    } catch (err) {
      if (isDroppable(err)) {
        await deleteOp(db, op.id)
        dropped.push(op.id)
        continue
      }
      break
    }
    await deleteOp(db, op.id)
    sent.push(op.id)
  }
  return { sent, dropped }
}
