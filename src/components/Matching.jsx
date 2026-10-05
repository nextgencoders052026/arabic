import { useEffect, useRef, useState } from 'react'
import {
  DndContext,
  DragOverlay,
  PointerSensor,
  useDraggable,
  useDroppable,
  useSensor,
  useSensors,
} from '@dnd-kit/core'
import { shuffle } from '../utils/shuffle'
import InstructionsOverlay, { hasSeenInstructions } from './InstructionsOverlay'
import { playCorrect, playIncorrect } from '../utils/sound'
import { useSessionRecorder } from '../utils/useSessionRecorder'
import { formatMoves, getMovesBand } from '../utils/matchingResult'
import AppBar from './AppBar'
import GameplayHeader from './GameplayHeader'
import WordIcon from './WordIcon'

const MAX_ROUND_WORDS = 12
const INCORRECT_FLASH_MS = 500
const INSTRUCTIONS_KEY = 'arabic-vocab-game:matching-drag-instructions-seen'
const INSTRUCTIONS_MESSAGE = 'Drag each word onto its matching picture.'

function buildRound(words) {
  const roundWords = shuffle(words).slice(0, Math.min(words.length, MAX_ROUND_WORDS))
  const targetOrder = shuffle(roundWords.map((_, i) => i))
  const chipOrder = shuffle(roundWords.map((_, i) => i))
  return { roundWords, targetOrder, chipOrder }
}

function formatTime(totalSeconds) {
  const m = Math.floor(totalSeconds / 60)
  const s = totalSeconds % 60
  return `${m}:${String(s).padStart(2, '0')}`
}

function WordChip({ wordIndex, word }) {
  const { attributes, listeners, setNodeRef, isDragging } = useDraggable({
    id: `chip-${wordIndex}`,
  })

  return (
    <button
      ref={setNodeRef}
      {...listeners}
      {...attributes}
      className="chip"
      style={{ opacity: isDragging ? 0.35 : 1 }}
    >
      <span className="arabic-text arabic-text--compact">{word.ar}</span>
    </button>
  )
}

function IconTarget({ wordIndex, word, isMatched, isIncorrectFlash }) {
  const { setNodeRef, isOver } = useDroppable({
    id: `target-${wordIndex}`,
    disabled: isMatched,
  })

  let className = 'matching-card matching-card--flipped'
  if (isOver) className += ' matching-card--over'
  if (isMatched) className += ' matching-card--matched'
  if (isIncorrectFlash) className += ' matching-card--incorrect-flash'

  return (
    <div ref={setNodeRef} className={className}>
      <WordIcon word={word} size={56} />
      <span className="matching-card__label">{word.en}</span>
      {isMatched && <span className="arabic-text arabic-text--compact">{word.ar}</span>}
    </div>
  )
}

function Matching({ words, mode, modeLabel, lesson, onExit, onOpenMenu }) {
  const [round, setRound] = useState(() => buildRound(words))
  const [matchedIndexes, setMatchedIndexes] = useState(() => new Set())
  const [mistakes, setMistakes] = useState(0)
  const [missedIndexes, setMissedIndexes] = useState(() => new Set())
  const [wordAttempts, setWordAttempts] = useState([])
  const [activeChipIndex, setActiveChipIndex] = useState(null)
  const [incorrectFlash, setIncorrectFlash] = useState(null)
  const [startTime, setStartTime] = useState(null)
  const [elapsed, setElapsed] = useState(0)
  const [finished, setFinished] = useState(false)
  const [showInstructions, setShowInstructions] = useState(
    () => !hasSeenInstructions(INSTRUCTIONS_KEY),
  )
  const flashTimeoutRef = useRef(null)

  const totalPairs = round.roundWords.length
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 8 } }),
  )

  useEffect(() => {
    if (!startTime || finished) return
    const interval = setInterval(() => {
      setElapsed(Math.floor((Date.now() - startTime) / 1000))
    }, 1000)
    return () => clearInterval(interval)
  }, [startTime, finished])

  useEffect(() => () => clearTimeout(flashTimeoutRef.current), [])

  useSessionRecorder({
    finished,
    mode,
    lesson,
    score: totalPairs - missedIndexes.size,
    totalQuestions: totalPairs,
    durationSeconds: elapsed,
    wordAttempts,
    mistakes,
  })

  function handleDragStart(event) {
    if (!startTime) setStartTime(Date.now())
    setActiveChipIndex(Number(event.active.id.replace('chip-', '')))
  }

  function handleDragEnd(event) {
    const { active, over } = event
    setActiveChipIndex(null)
    if (!over) return

    const chipWordIndex = Number(active.id.replace('chip-', ''))
    const targetWordIndex = Number(over.id.replace('target-', ''))
    const draggedWord = round.roundWords[chipWordIndex]

    if (chipWordIndex === targetWordIndex) {
      playCorrect()
      setWordAttempts((a) => [...a, { ar: draggedWord.ar, en: draggedWord.en, correct: true }])
      const next = new Set(matchedIndexes)
      next.add(chipWordIndex)
      setMatchedIndexes(next)
      if (next.size === totalPairs) setFinished(true)
    } else {
      playIncorrect()
      setMistakes((m) => m + 1)
      setWordAttempts((a) => [...a, { ar: draggedWord.ar, en: draggedWord.en, correct: false }])
      setMissedIndexes((prev) => {
        const next = new Set(prev)
        next.add(chipWordIndex)
        next.add(targetWordIndex)
        return next
      })
      setIncorrectFlash(targetWordIndex)
      clearTimeout(flashTimeoutRef.current)
      flashTimeoutRef.current = setTimeout(() => setIncorrectFlash(null), INCORRECT_FLASH_MS)
    }
  }

  function newRound() {
    clearTimeout(flashTimeoutRef.current)
    setRound(buildRound(words))
    setMatchedIndexes(new Set())
    setMistakes(0)
    setMissedIndexes(new Set())
    setWordAttempts([])
    setActiveChipIndex(null)
    setIncorrectFlash(null)
    setStartTime(null)
    setElapsed(0)
    setFinished(false)
  }

  if (finished) {
    const moves = totalPairs + mistakes
    const movesBand = getMovesBand(totalPairs, moves)

    return (
      <div className="screen">
        <AppBar title={modeLabel} onMenuClick={onOpenMenu} />
        <h1>Round complete</h1>
        <p className="screen__lede">
          <span className={`result-value--${movesBand}`}>{formatMoves(totalPairs, moves)}</span> ·{' '}
          {formatTime(elapsed)}
        </p>
        <div className="flashcard-actions">
          <button className="btn btn-primary" onClick={newRound}>
            New round
          </button>
          <button className="btn btn-secondary" onClick={onExit}>
            ← Back to lessons
          </button>
        </div>
      </div>
    )
  }

  const activeWord = activeChipIndex !== null ? round.roundWords[activeChipIndex] : null

  return (
    <div className="screen screen--wide">
      {showInstructions && (
        <InstructionsOverlay
          storageKey={INSTRUCTIONS_KEY}
          message={INSTRUCTIONS_MESSAGE}
          onDismiss={() => setShowInstructions(false)}
        />
      )}
      <GameplayHeader onExit={onExit}>
        <p className="screen__lede">
          {mistakes} mistake{mistakes === 1 ? '' : 's'} · Time {formatTime(elapsed)}
        </p>
      </GameplayHeader>

      <DndContext sensors={sensors} onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
        <div className="matching-grid">
          {round.targetOrder.map((wordIndex) => (
            <IconTarget
              key={wordIndex}
              wordIndex={wordIndex}
              word={round.roundWords[wordIndex]}
              isMatched={matchedIndexes.has(wordIndex)}
              isIncorrectFlash={incorrectFlash === wordIndex}
            />
          ))}
        </div>

        <div className="chip-pool">
          {round.chipOrder
            .filter((wordIndex) => !matchedIndexes.has(wordIndex))
            .map((wordIndex) => (
              <WordChip key={wordIndex} wordIndex={wordIndex} word={round.roundWords[wordIndex]} />
            ))}
        </div>

        <DragOverlay>
          {activeWord ? (
            <div className="chip chip--overlay">
              <span className="arabic-text arabic-text--compact">{activeWord.ar}</span>
            </div>
          ) : null}
        </DragOverlay>
      </DndContext>
    </div>
  )
}

export default Matching
