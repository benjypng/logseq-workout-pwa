import {
  createContext,
  type ReactNode,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react'

import { sendWorkoutOp } from '../api'
import {
  enqueueOp,
  listOps,
  markSessionSynced,
  openWorkoutDB,
  type WorkoutDB,
} from '../lib/db'
import { flushOutbox } from '../lib/outbox'
import type { WorkoutOp } from '../types'

interface OutboxValue {
  pending: WorkoutOp[]
  enqueue: (op: WorkoutOp) => Promise<void>
  flush: () => Promise<void>
  getDb: () => Promise<WorkoutDB>
}

const OutboxContext = createContext<OutboxValue | null>(null)

const FLUSH_INTERVAL_MS = 20_000

export function OutboxProvider({ children }: { children: ReactNode }) {
  const dbRef = useRef<Promise<WorkoutDB> | null>(null)
  const getDb = useCallback(() => {
    dbRef.current ??= openWorkoutDB()
    return dbRef.current
  }, [])
  const [pending, setPending] = useState<WorkoutOp[]>([])
  const flushing = useRef(false)

  const refresh = useCallback(async () => {
    setPending(await listOps(await getDb()))
  }, [getDb])

  const flush = useCallback(async () => {
    if (flushing.current) return
    flushing.current = true
    try {
      const db = await getDb()
      const { sent } = await flushOutbox(db, sendWorkoutOp)
      for (const id of sent) {
        await markSessionSynced(db, id)
      }
    } finally {
      flushing.current = false
      await refresh()
    }
  }, [getDb, refresh])

  useEffect(() => {
    void refresh()
    void flush()
    const timer = setInterval(flush, FLUSH_INTERVAL_MS)
    const onVisibility = () => {
      if (document.visibilityState === 'visible') void flush()
    }
    window.addEventListener('online', flush)
    document.addEventListener('visibilitychange', onVisibility)
    return () => {
      clearInterval(timer)
      window.removeEventListener('online', flush)
      document.removeEventListener('visibilitychange', onVisibility)
    }
  }, [flush, refresh])

  const enqueue = useCallback(
    async (op: WorkoutOp) => {
      await enqueueOp(await getDb(), op)
      await refresh()
      void flush()
    },
    [getDb, refresh, flush],
  )

  const value = useMemo(
    () => ({ pending, enqueue, flush, getDb }),
    [pending, enqueue, flush, getDb],
  )

  return (
    <OutboxContext.Provider value={value}>{children}</OutboxContext.Provider>
  )
}

export function useOutbox(): OutboxValue {
  const ctx = useContext(OutboxContext)
  if (!ctx) throw new Error('useOutbox must be used within OutboxProvider')
  return ctx
}
