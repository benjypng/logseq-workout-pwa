const KEY = 'workout-last-weights'

export function loadLastWeights(): Record<string, string> {
  try {
    const raw = localStorage.getItem(KEY)
    return raw ? (JSON.parse(raw) as Record<string, string>) : {}
  } catch {
    return {}
  }
}

export function saveLastWeights(update: Record<string, string>): void {
  try {
    const merged = { ...loadLastWeights(), ...update }
    localStorage.setItem(KEY, JSON.stringify(merged))
  } catch {
    return
  }
}
