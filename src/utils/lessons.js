import { VOCABULARY } from '../data/vocabulary'

export const TOTAL_LESSONS = 23

export const TOTAL_WORDS = VOCABULARY.length

export const LESSONS = Array.from({ length: TOTAL_LESSONS }, (_, i) => {
  const lesson = i + 1
  const count = VOCABULARY.filter((word) => word.lesson === lesson).length
  return { lesson, count }
})
