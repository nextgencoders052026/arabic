import { useEffect, useRef, useState } from 'react'
import { getIconPath } from '../utils/icons'
import { buildQuestions } from '../utils/quiz'
import { playCorrect, playIncorrect } from '../utils/sound'
import { useSessionRecorder } from '../utils/useSessionRecorder'
import AppBar from './AppBar'
import GameplayHeader from './GameplayHeader'

const ROUND_SECONDS = 60

function takeNext(queueRef, words, lastWord) {
  if (queueRef.current.length === 0) {
    queueRef.current = buildQuestions(words)
    if (queueRef.current.length > 1 && queueRef.current[0].word.en === lastWord?.en) {
      const [first, ...rest] = queueRef.current
      queueRef.current = [...rest, first]
    }
  }
  return queueRef.current.shift()
}

function SpeedRound({ words, mode, modeLabel, lesson, onExit, onOpenMenu }) {
  const queueRef = useRef(null)
  if (queueRef.current === null) {
    queueRef.current = buildQuestions(words)
  }

  const [question, setQuestion] = useState(() => takeNext(queueRef, words, null))
  const [timeLeft, setTimeLeft] = useState(ROUND_SECONDS)
  const [score, setScore] = useState(0)
  const [answered, setAnswered] = useState(0)
  const [wordAttempts, setWordAttempts] = useState([])
  const [finished, setFinished] = useState(false)

  useEffect(() => {
    if (finished) return
    if (timeLeft <= 0) {
      setFinished(true)
      return
    }
    const timeout = setTimeout(() => setTimeLeft((t) => t - 1), 1000)
    return () => clearTimeout(timeout)
  }, [timeLeft, finished])

  useSessionRecorder({
    finished,
    mode,
    lesson,
    score,
    totalQuestions: answered,
    durationSeconds: ROUND_SECONDS - timeLeft,
    wordAttempts,
  })

  function selectOption(option) {
    if (finished) return
    const isCorrect = option === question.word.en
    if (isCorrect) {
      playCorrect()
      setScore((s) => s + 1)
    } else {
      playIncorrect()
    }
    setWordAttempts((a) => [...a, { ar: question.word.ar, en: question.word.en, correct: isCorrect }])
    setAnswered((a) => a + 1)
    setQuestion(takeNext(queueRef, words, question.word))
  }

  function practiceAgain() {
    queueRef.current = buildQuestions(words)
    setQuestion(takeNext(queueRef, words, null))
    setScore(0)
    setAnswered(0)
    setWordAttempts([])
    setTimeLeft(ROUND_SECONDS)
    setFinished(false)
  }

  if (finished) {
    return (
      <div className="screen">
        <AppBar title={modeLabel} onMenuClick={onOpenMenu} />
        <h1>Time's up!</h1>
        <p className="screen__lede">
          Final score: {score} correct ({answered} answered).
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
        <p className={`screen__lede${timeLeft <= 10 ? ' state-incorrect' : ''}`}>
          ⏱ {timeLeft}s left · Score {score}
        </p>
      </GameplayHeader>

      <div className="quiz-icon">
        <img src={getIconPath(question.word)} alt={question.word.ar} width={120} height={120} />
      </div>
      <p className="arabic-text">{question.word.ar}</p>

      <div className="quiz-options">
        {question.options.map((option) => (
          <button
            key={option}
            className="quiz-option"
            onClick={() => selectOption(option)}
          >
            {option}
          </button>
        ))}
      </div>
    </div>
  )
}

export default SpeedRound
