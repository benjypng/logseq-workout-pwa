import { useEffect, useState } from 'react'

import type { SessionAction } from '../lib/session'
import type { Session } from '../types'
import { playRestDoneCue } from '../utils/cues'

export function useRestTimer(
  session: Session | null,
  dispatch: (action: SessionAction) => void,
): number {
  const resting = session?.phase === 'resting'
  const endsAt = session?.restEndsAt ?? null
  const [, setTick] = useState(0)

  useEffect(() => {
    if (!resting || endsAt === null) return
    let fired = false
    const tick = () => {
      setTick((t) => t + 1)
      if (endsAt - Date.now() <= 0 && !fired) {
        fired = true
        playRestDoneCue()
        dispatch({ type: 'rest-elapsed' })
      }
    }
    const timer = setInterval(tick, 200)
    return () => clearInterval(timer)
  }, [resting, endsAt, dispatch])

  return resting && endsAt !== null ? Math.max(0, endsAt - Date.now()) : 0
}
