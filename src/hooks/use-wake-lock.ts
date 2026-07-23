import { useEffect, useRef } from 'react'

export function useWakeLock(active: boolean): void {
  const sentinel = useRef<WakeLockSentinel | null>(null)

  useEffect(() => {
    if (!active || !('wakeLock' in navigator)) return

    let cancelled = false

    const acquire = async () => {
      try {
        const lock = await navigator.wakeLock.request('screen')
        if (cancelled) {
          await lock.release()
          return
        }
        sentinel.current = lock
      } catch {
        sentinel.current = null
      }
    }

    const onVisibility = () => {
      if (document.visibilityState === 'visible') void acquire()
    }

    void acquire()
    document.addEventListener('visibilitychange', onVisibility)

    return () => {
      cancelled = true
      document.removeEventListener('visibilitychange', onVisibility)
      void sentinel.current?.release().catch(() => undefined)
      sentinel.current = null
    }
  }, [active])
}
