import { useRef, useState } from 'react'
import { getIconPath } from '../utils/icons'
import { shuffle } from '../utils/shuffle'
import { playCorrect, playFlip, playIncorrect } from '../utils/sound'
import { useSessionRecorder } from '../utils/useSessionRecorder'
import AppBar from './AppBar'
import GameplayHeader from './GameplayHeader'

function Flashcards({ words, mode, modeLabel, lesson, onExit, onOpenMenu }) {
  const [deck, setDeck] = useState(() => shuffle(words))
  const [index, setIndex] = useState(0)
  const [revealed, setRevealed] = useState(false)
  const [score, setScore] = useState(0)
  const [wordAttempts, setWordAttempts] = useState([])
  const [finished, setFinished] = useState(false)
  const startTimeRef = useRef(Date.now())

  const total = deck.length
  const word = deck[index]

  useSessionRecorder({
    finished,
    mode,
    lesson,
    score,
    totalQuestions: total,
    durationSeconds: Math.round((Date.now() - startTimeRef.current) / 1000),
    wordAttempts,
  })

  function grade(isCorrect) {
    if (isCorrect) {
      playCorrect()
      setScore((s) => s + 1)
    } else {
      playIncorrect()
    }
    setWordAttempts((a) => [...a, { ar: word.ar, en: word.en, correct: isCorrect }])
    const next = index + 1
    if (next >= total) {
      setFinished(true)
    } else {
      setIndex(next)
      setRevealed(false)
    }
  }

  function practiceAgain() {
    setDeck(shuffle(words))
    setIndex(0)
    setRevealed(false)
    setScore(0)
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
          You got {score} out of {total} correct.
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
          Card {index + 1} of {total} · Score {score}
        </p>
      </GameplayHeader>

      <button
        className="card flashcard"
        onClick={() => {
          playFlip()
          setRevealed((r) => !r)
        }}
      >
        <img
          src={getIconPath(word)}
          alt={revealed ? word.en : ''}
          width={120}
          height={120}
        />
        <p className="arabic-text">{word.ar}</p>
        {revealed ? (
          <p className="flashcard__answer">{word.en}</p>
        ) : (
          <p className="screen__lede">Tap to reveal</p>
        )}
      </button>

      {revealed && (
        <div className="flashcard-actions">
          <button className="btn btn-secondary" onClick={() => grade(false)}>
            ✗ Incorrect
          </button>
          <button className="btn btn-primary" onClick={() => grade(true)}>
            ✓ Correct
          </button>
        </div>
      )}
    </div>
  )
}

export default Flashcards
