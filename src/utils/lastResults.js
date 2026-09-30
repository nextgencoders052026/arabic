import { getAllSessions } from './history'

// Returns { [lessonNumber | 'all']: { score, total, durationSeconds, mistakes, timestamp } }
// for the given mode, keeping only the most recent session per lesson.
export async function getLastResultsByMode(mode) {
  const sessions = await getAllSessions() // already sorted newest-first
  const results = {}

  for (const session of sessions) {
    if (session.mode !== mode) continue
    const key = session.lesson
    if (key in results) continue

    results[key] = {
      score: session.score,
      total: session.totalQuestions,
      durationSeconds: session.durationSeconds,
      mistakes: session.mistakes ?? null,
      timestamp: session.timestamp,
    }
  }

  return results
}

export function getScoreBand(score, total) {
  if (!total) return 'needs-work'
  const pct = (score / total) * 100
  if (pct >= 80) return 'success'
  if (pct >= 50) return 'warning'
  return 'needs-work'
}

export function getScorePercent(score, total) {
  return total ? Math.round((score / total) * 100) : 0
}

// Speed Round asks repeated questions from a lesson's word pool until time
// runs out, so its "total" is a question count, not the lesson's word count
// like the other score-based modes — a bare fraction reads as broken once
// it exceeds the word count. Lead with the percentage everywhere instead.
export function formatSpeedRoundResult(score, total) {
  return `${getScorePercent(score, total)}% (${score}/${total} asked)`
}
