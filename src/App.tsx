import { CompleteView } from './components/complete-view'
import { HomeView } from './components/home-view'
import { SessionView } from './components/session-view'
import { useSession } from './hooks/use-session'
import { useWakeLock } from './hooks/use-wake-lock'

export default function App() {
  const { session, restoring, start, dispatch, discard } = useSession()

  useWakeLock(session !== null && session.phase !== 'complete')

  if (restoring) {
    return (
      <div className="flex min-h-dvh items-center justify-center text-muted">
        Loading…
      </div>
    )
  }

  if (session && session.phase === 'complete') {
    return <CompleteView session={session} onClose={() => void discard()} />
  }

  if (session) {
    return (
      <SessionView
        session={session}
        dispatch={dispatch}
        onDiscard={() => void discard()}
      />
    )
  }

  return <HomeView onStart={start} />
}
