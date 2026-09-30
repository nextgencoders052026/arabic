// Shared "moves" formatting/coloring for the Matching game, used everywhere
// a result shows up: lesson-picker cards, Progress, and the round-end screen.
// wordCount (the pair count) is the minimum possible moves — a flawless run
// takes exactly wordCount drags, so the ratio moves/wordCount is how far off
// that flawless run the player was.
export function getMovesBand(wordCount, moves) {
  if (!wordCount) return 'needs-work'
  const ratio = moves / wordCount
  if (ratio <= 1) return 'success'
  if (ratio <= 1.5) return 'warning'
  return 'needs-work'
}

export function formatMoves(wordCount, moves) {
  if (moves === wordCount) return `${wordCount} moves — perfect!`
  return `${moves} moves (best: ${wordCount})`
}
