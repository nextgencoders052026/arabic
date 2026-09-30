import { useEffect, useRef, useState } from 'react'
import { getIconPath } from '../utils/icons'
import { buildQuestions } from '../utils/quiz'
import { playCorrect, playIncorrect } from '../utils/sound'
import { useSessionRecorder } from '../utils/useSessionRecorder'
import AppBar from './AppBar'
import GameplayHeader from './GameplayHeader'

const FEEDBACK_DELAY_MS = 900

function MultipleChoice({ words, mode, modeLabel, lesson, onExit, onOpenMenu }) {
  const [questions, setQuestions] = useState(() => buildQuestions(words))
  const [index, setIndex] = useState(0)
  const [selected, setSelected] = useState(null)
  const [score, setScore] = useState(0)
  const [streak, setStreak] = useState(0)
  const [bestStreak, setBestStreak] = useState(0)
  const [wordAttempts, setWordAttempts] = useState([])
  const [finished, setFinished] = useState(false)
  const timeoutRef = useRef(null)
  const startTimeRef = useRef(Date.now())

  useEffect(() => () => clearTimeout(timeoutRef.current), [])

  const total = questions.length
  const question = questions[index]
  const answered = selected !== null

  useSessionRecorder({
    finished,
    mode,
    lesson,
    score,
    totalQuestions: total,
    durationSeconds: Math.round((Date.now() - startTimeRef.current) / 1000),
    wordAttempts,
  })

  function selectOption(option) {
    if (answered) return
    setSelected(option)

    const isCorrect = option === question.word.en
    if (isCorrect) {
      playCorrect()
      setScore((s) => s + 1)
      setStreak((s) => {
        const next = s + 1
        setBestStreak((b) => Math.max(b, next))
        return next
      })
    } else {
      playIncorrect()
      setStreak(0)
    }
    setWordAttempts((a) => [...a, { ar: question.word.ar, en: question.word.en, correct: isCorrect }])

    timeoutRef.current = setTimeout(() => {
      const next = index + 1
      if (next >= total) {
        setFinished(true)
      } else {
        setIndex(next)
        setSelected(null)
      }
    }, FEEDBACK_DELAY_MS)
  }

  function practiceAgain() {
    clearTimeout(timeoutRef.current)
    setQuestions(buildQuestions(words))
    setIndex(0)
    setSelected(null)
    setScore(0)
    setStreak(0)
    setBestStreak(0)
    setWordAttempts([])
    startTimeRef.current = Date.now()
    setFinished(false)
  }

  if (finished) {
    return (
      <div className="screen">
        <AppBar title={modeLabel} onMenuClick={onOpenMenu} />
        <h1>Session complete</h1>
        <p className="screen__lede">
          You got {score} out of {total} correct. Best streak: {bestStreak}.
        </p>
        <div className="flashcard-actions">
          <button className="btn btn-primary" onClick={practiceAgain}>
            Practice again
          </button>
          <button className="btn btn-secondary" onClick={onExit}>
            ← Back to lessons
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="screen">
      <GameplayHeader onExit={onExit}>
        <p className="screen__lede">
          Question {index + 1} of {total} · Score {score} · Streak {streak}
        </p>
      </GameplayHeader>

      <div className="quiz-icon">
        <img
          src={getIconPath(question.word)}
          alt={question.word.ar}
          width={120}
          height={120}
        />
      </div>
      <p className="arabic-text">{question.word.ar}</p>

      <div className="quiz-options">
        {question.options.map((option) => {
          const isCorrectOption = option === question.word.en
          let className = 'quiz-option'
          if (answered) {
            if (isCorrectOption) {
              className += ' quiz-option--correct'
            } else if (option === selected) {
              className += ' quiz-option--incorrect'
            } else {
              className += ' quiz-option--dimmed'
            }
          }
          return (
            <button
              key={option}
              className={className}
              onClick={() => selectOption(option)}
              disabled={answered}
            >
              {option}
            </button>
          )
        })}
      </div>
    </div>
  )
}

export default MultipleChoice
