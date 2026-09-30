import { formatMoves, getMovesBand } from './matchingResult'
import { formatSpeedRoundResult } from './lastResults'
import { MODES } from '../data/modes'

export const SPEED_ROUND_NOTE =
  "Speed Round asks repeated questions from this lesson's word pool until time runs out — so questions asked can exceed the lesson's word count."

export function formatLesson(lesson) {
  return lesson === 'all' ? 'All lessons' : `Lesson ${lesson}`
}

export function modeLabel(modeId) {
  return MODES.find((m) => m.id === modeId)?.label ?? modeId
}

export function formatSessionResult(session) {
  if (session.mode === 'matching') {
    const moves = session.totalQuestions + (session.mistakes ?? 0)
    return { text: formatMoves(session.totalQuestions, moves), band: getMovesBand(session.totalQuestions, moves) }
  }
  if (session.mode === 'speed-round') {
    return { text: formatSpeedRoundResult(session.score, session.totalQuestions), band: null }
  }
  return { text: `${session.score}/${session.totalQuestions}`, band: null }
}
