import { REAUTH_URL } from '../api'
import { useOutbox } from '../hooks/use-outbox'

export function SignInBanner() {
  const { authRequired, pending } = useOutbox()
  if (!authRequired) return null

  return (
    <div className="mx-auto flex max-w-md items-center justify-between gap-3 px-5 pt-4 text-sm">
      <span className="text-muted">
        Sign-in expired · {pending.length} workout
        {pending.length === 1 ? '' : 's'} waiting to save
      </span>
      <a
        href={REAUTH_URL}
        className="shrink-0 font-semibold text-accent underline"
      >
        Sign in again
      </a>
    </div>
  )
}
