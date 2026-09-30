import { VOCABULARY } from '../data/vocabulary'
import { shuffle } from './shuffle'

function pickDistractors(word, pool, count) {
  const seenEnglish = new Set([word.en])
  const distractors = []

  for (const candidate of shuffle(pool)) {
    if (distractors.length >= count) break
    if (seenEnglish.has(candidate.en)) continue
    seenEnglish.add(candidate.en)
    distractors.push(candidate)
  }

  if (distractors.length < count) {
    for (const candidate of shuffle(VOCABULARY)) {
      if (distractors.length >= count) break
      if (seenEnglish.has(candidate.en)) continue
      seenEnglish.add(candidate.en)
      distractors.push(candidate)
    }
  }

  return distractors
}

export function buildQuestions(words) {
  return shuffle(words).map((word) => {
    const distractors = pickDistractors(word, words, 3)
    const options = shuffle([word.en, ...distractors.map((d) => d.en)])
    return { word, options }
  })
}
