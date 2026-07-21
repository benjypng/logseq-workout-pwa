import { useCallback, useEffect, useRef, useState } from 'react'

import {
  clearActiveSession,
  loadActiveSession,
  saveActiveSession,
  saveCompletedSession,
} from '../lib/db'
import { buildWorkoutBlock } from '../lib/markdown'
import {
  createSession,
  type SessionAction,
  sessionReducer,
} from '../lib/session'
import type { DayPlan, Session } from '../types'
import { loadLastWeights, saveLastWeights } from '../utils/weights'
import { useOutbox } from './use-outbox'

function todayISO(): string {
  const d = new Date()
  const pad = (n: number) => String(n).padStart(2, '0')
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`
}

interface SessionApi {
  session: Session | null
  restoring: boolean
  start: (plan: DayPlan, startExercise: number) => void
  dispatch: (action: SessionAction) => void
  discard: () => Promise<void>
}

export function useSession(): SessionApi {
  const { enqueue, getDb } = useOutbox()
  const [session, setSession] = useState<Session | null>(null)
  const [restoring, setRestoring] = useState(true)
  const sessionRef = useRef<Session | null>(null)
  sessionRef.current = session

  useEffect(() => {
    let cancelled = false
    void (async () => {
      const stored = await loadActiveSession(await getDb())
      if (!cancelled) {
        if (stored && stored.phase !== 'complete') setSession(stored)
        setRestoring(false)
      }
    })()
    return () => {
      cancelled = true
    }
  }, [getDb])

  const persist = useCallback(
    (next: Session) => {
      void (async () => {
        const db = await getDb()
        await saveActiveSession(db, next)
      })()
    },
    [getDb],
  )

  const complete = useCallback(
    (finished: Session) => {
      void (async () => {
        const db = await getDb()
        const content = buildWorkoutBlock(finished)
        await saveCompletedSession(db, {
          id: finished.id,
          finishedAt: Date.now(),
          dateISO: finished.dateISO,
          dayTitle: finished.dayTitle,
          content,
          synced: false,
        })
        await clearActiveSession(db)
        await enqueue({
          id: finished.id,
          ts: Date.now(),
          page: finished.dateISO,
          content,
        })
      })()
    },
    [getDb, enqueue],
  )

  const dispatch = useCallback(
    (action: SessionAction) => {
      const current = sessionRef.current
      if (!current) return
      const next = sessionReducer(current, action)
      if (next === current) return
      sessionRef.current = next
      setSession(next)
      if (action.type === 'complete-set') {
        const log =
          current.exercises[current.activeExercise].logs[current.activeSet]
        if (log.weight.trim() !== '') {
          saveLastWeights({
            [current.exercises[current.activeExercise].name]: log.weight,
          })
        }
      }
      if (next.phase === 'complete' && current.phase !== 'complete') {
        complete(next)
      } else {
        persist(next)
      }
    },
    [persist, complete],
  )

  const start = useCallback(
    (plan: DayPlan, startExercise: number) => {
      const s = createSession(
        plan,
        todayISO(),
        startExercise,
        Date.now(),
        loadLastWeights(),
      )
      sessionRef.current = s
      setSession(s)
      persist(s)
    },
    [persist],
  )

  const discard = useCallback(async () => {
    sessionRef.current = null
    setSession(null)
    await clearActiveSession(await getDb())
  }, [getDb])

  return { session, restoring, start, dispatch, discard }
}
