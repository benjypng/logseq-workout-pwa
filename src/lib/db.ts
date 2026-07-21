import { type IDBPDatabase, openDB } from 'idb'

import type { CompletedSession, Session, WorkoutOp } from '../types'

export type WorkoutDB = IDBPDatabase

const ACTIVE = 'active'
const SESSIONS = 'sessions'
const OPS = 'ops'
const ACTIVE_KEY = 'current'

export function openWorkoutDB(name = 'workout'): Promise<WorkoutDB> {
  return openDB(name, 1, {
    upgrade(db) {
      db.createObjectStore(ACTIVE)
      db.createObjectStore(SESSIONS, { keyPath: 'id' })
      const ops = db.createObjectStore(OPS, { keyPath: 'id' })
      ops.createIndex('by-ts', 'ts')
    },
  })
}

export async function saveActiveSession(
  db: WorkoutDB,
  session: Session,
): Promise<void> {
  await db.put(ACTIVE, session, ACTIVE_KEY)
}

export async function loadActiveSession(
  db: WorkoutDB,
): Promise<Session | undefined> {
  return (await db.get(ACTIVE, ACTIVE_KEY)) as Session | undefined
}

export async function clearActiveSession(db: WorkoutDB): Promise<void> {
  await db.delete(ACTIVE, ACTIVE_KEY)
}

export async function saveCompletedSession(
  db: WorkoutDB,
  session: CompletedSession,
): Promise<void> {
  await db.put(SESSIONS, session)
}

export async function markSessionSynced(
  db: WorkoutDB,
  id: string,
): Promise<void> {
  const existing = (await db.get(SESSIONS, id)) as CompletedSession | undefined
  if (existing) await db.put(SESSIONS, { ...existing, synced: true })
}

export async function getCompletedSession(
  db: WorkoutDB,
  id: string,
): Promise<CompletedSession | undefined> {
  return (await db.get(SESSIONS, id)) as CompletedSession | undefined
}

export async function enqueueOp(db: WorkoutDB, op: WorkoutOp): Promise<void> {
  await db.put(OPS, op)
}

export async function listOps(db: WorkoutDB): Promise<WorkoutOp[]> {
  return (await db.getAllFromIndex(OPS, 'by-ts')) as WorkoutOp[]
}

export async function deleteOp(db: WorkoutDB, id: string): Promise<void> {
  await db.delete(OPS, id)
}
