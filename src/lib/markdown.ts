import type { Session, SetLog } from '../types'

function formatWeight(raw: string): string {
  const trimmed = raw.trim()
  if (trimmed === '') return ''
  return /^\d+(\.\d+)?$/.test(trimmed) ? `${trimmed}kg` : trimmed
}

function setPairs(logs: SetLog[]): string {
  return logs
    .filter((l) => l.done && l.reps.trim() !== '')
    .map((l) => {
      const weight = formatWeight(l.weight)
      const reps = l.reps.trim()
      return weight ? `${weight}/${reps}` : reps
    })
    .join(', ')
}

export function buildWorkoutBlock(session: Session): string {
  const lines = [`**${session.dayTitle}**`, '']
  for (const e of session.exercises) {
    const pairs = setPairs(e.logs)
    if (pairs === '') continue
    lines.push(`${e.name}:: ${pairs}`)
  }
  return lines.join('\n')
}
