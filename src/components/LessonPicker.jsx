import { useEffect, useState } from 'react'
import { LESSONS, TOTAL_WORDS } from '../utils/lessons'
import { formatSpeedRoundResult, getLastResultsByMode, getScoreBand } from '../utils/lastResults'
import { formatMoves, getMovesBand } from '../utils/matchingResult'

const ALL_KEY = 'all'

function formatDuration(seconds) {
  const total = Math.max(0, Math.round(seconds ?? 0))
  if (total < 60) return `${total}s`
  const m = Math.floor(total / 60)
  const s = total % 60
  return `${m}:${String(s).padStart(2, '0')}`
}

function LessonResult({ mode, result }) {
  if (!result) {
    return (
      <div className="lesson-card__result">
        <p className="lesson-card__result-text lesson-card__result-text--muted">
          Not yet practiced
        </p>
      </div>
    )
  }

  if (mode === 'matching') {
    const moves = result.total + (result.mistakes ?? 0)
    const band = getMovesBand(result.total, moves)
    return (
      <div className="lesson-card__result">
        <p className="lesson-card__result-text">
          Last:{' '}
          <span className={`result-value--${band}`}>
            {formatMoves(result.total, moves)}
          </span>{' '}
          · {formatDuration(result.durationSeconds)}
        </p>
      </div>
    )
  }

  const band = getScoreBand(result.score, result.total)
  const pct = result.total ? Math.round((result.score / result.total) * 100) : 0

  return (
    <div className="lesson-card__result">
      <div className="lesson-progress-track">
        <div
          className={`lesson-progress-fill lesson-progress-fill--${band}`}
          style={{ width: `${pct}%` }}
        />
      </div>
      <p className="lesson-card__result-text">
        {mode === 'speed-round'
          ? `Last time: ${formatSpeedRoundResult(result.score, result.total)}`
          : `${result.score}/${result.total} last time`}
      </p>
    </div>
  )
}

function LessonPicker({ mode, modeLabel, onSelectLesson, onSelectAll, onBack }) {
  const [results, setResults] = useState(null)

  useEffect(() => {
    let cancelled = false
    setResults(null)
    getLastResultsByMode(mode).then((r) => {
      if (!cancelled) setResults(r)
    })
    return () => {
      cancelled = true
    }
  }, [mode])

  return (
    <div className="screen screen--wide">
      <button className="btn btn-secondary screen__back" onClick={onBack}>
        ← Back to modes
      </button>
      <h1>{modeLabel}</h1>
      <p className="screen__lede">
        Choose a lesson to practice, or go through everything at once.
      </p>

      <button className="card card-button" onClick={onSelectAll}>
        <h2>Practice all lessons together</h2>
        <p>{TOTAL_WORDS} words across all {LESSONS.length} lessons</p>
        {results && <LessonResult mode={mode} result={results[ALL_KEY]} />}
      </button>

      <div className="card-grid card-grid--lessons">
        {LESSONS.map(({ lesson, count }) => (
          <button
            key={lesson}
            className="card card-button"
            onClick={() => onSelectLesson(lesson)}
          >
            <h2>Lesson {lesson}</h2>
            <p>{count} word{count === 1 ? '' : 's'}</p>
            {results && <LessonResult mode={mode} result={results[lesson]} />}
          </button>
        ))}
      </div>
    </div>
  )
}

export default LessonPicker
