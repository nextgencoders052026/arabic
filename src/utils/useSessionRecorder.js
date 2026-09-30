import { useEffect } from 'react'
import { recordSession } from './history'
import { playFanfare } from './sound'
import { maybePromptForReview } from './reviewPrompt'

export function useSessionRecorder({
  finished,
  mode,
  lesson,
  score,
  totalQuestions,
  durationSeconds,
  wordAttempts,
  mistakes = null,
}) {
  useEffect(() => {
    if (!finished) return
    playFanfare()
    recordSession({ mode, lesson, score, totalQuestions, durationSeconds, wordAttempts, mistakes })
    maybePromptForReview()
    // Only re-fire when a session actually completes, not on every score/word change.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [finished])
}
