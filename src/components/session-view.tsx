import { useRestTimer } from '../hooks/use-rest-timer'
import type { SessionAction } from '../lib/session'
import type { Session } from '../types'
import { ExerciseList } from './exercise-list'
import { RestCard } from './rest-card'
import { SetCard } from './set-card'

interface Props {
  session: Session
  dispatch: (action: SessionAction) => void
  onDiscard: () => void
}

export function SessionView({ session, dispatch, onDiscard }: Props) {
  const remainingMs = useRestTimer(session, dispatch)

  const discard = () => {
    if (window.confirm('Discard this session? Logged sets will be lost.')) {
      onDiscard()
    }
  }

  const finishEarly = () => {
    if (window.confirm('Finish the session now and log what you have done?')) {
      dispatch({ type: 'finish-early' })
    }
  }

  return (
    <div className="mx-auto flex min-h-dvh max-w-md flex-col gap-4 px-5 py-6">
      <header className="flex items-center justify-between">
        <h1 className="text-base font-semibold">{session.dayTitle}</h1>
        <button
          type="button"
          onClick={discard}
          className="text-xs text-faint underline"
        >
          Discard
        </button>
      </header>

      {session.phase === 'resting' ? (
        <RestCard
          session={session}
          remainingMs={remainingMs}
          dispatch={dispatch}
        />
      ) : (
        <SetCard session={session} dispatch={dispatch} />
      )}

      <ExerciseList session={session} dispatch={dispatch} />

      <button
        type="button"
        onClick={finishEarly}
        className="mt-auto py-2 text-center text-xs text-faint underline"
      >
        Finish session early
      </button>
    </div>
  )
}
