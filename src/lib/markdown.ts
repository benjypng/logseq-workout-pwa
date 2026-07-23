import type { Session, SetLog } from '../types'

function formatWeight(raw: string): string {
  const trimmed = raw.trim()
  if (trimmed === '') return ''
  return /^\d+(\.\d+)?$/.test(trimmed) ? `${trimmed}kg` : trimmed
}

function weightCell(logs: SetLog[]): string {
  const weights = logs.filter((l) => l.done).map((l) => formatWeight(l.weight))
  if (weights.length === 0) return ''
  const unique = [...new Set(weights)]
  return unique.length === 1 ? unique[0] : weights.join(', ')
}

function repsDoneCell(logs: SetLog[]): string {
  return logs
    .filter((l) => l.done)
    .map((l) => l.reps.trim())
    .filter((r) => r !== '')
    .join(', ')
}

export function buildWorkoutBlock(session: Session): string {
  const lines = [
    `**${session.dayTitle}**`,
    '| Exercise | Reps | Sets | Rest | Weight | Reps done |',
    '|----------|------|------|------|--------|-----------|',
  ]
  for (const e of session.exercises) {
    lines.push(
      `| ${e.name} | ${e.reps} | ${e.sets} | ${e.restSec}s | ${weightCell(e.logs)} | ${repsDoneCell(e.logs)} |`,
    )
  }
  return lines.join('\n')
}
