import { openDB } from 'idb'
import { saveHistoryBackup } from './historyBackup'

const DB_NAME = 'arabic-vocab-game'
const DB_VERSION = 1
const STORE = 'sessions'
const TOP_MISSED_WORDS_COUNT = 10

let dbPromise = null

function getDB() {
  if (!dbPromise) {
    dbPromise = openDB(DB_NAME, DB_VERSION, {
      upgrade(db) {
        const store = db.createObjectStore(STORE, { keyPath: 'id' })
        store.createIndex('timestamp', 'timestamp')
      },
    })
  }
  return dbPromise
}

export async function recordSession(session) {
  try {
    const db = await getDB()
    await db.put(STORE, {
      id: crypto.randomUUID(),
      timestamp: Date.now(),
      ...session,
    })
    // Keep the lightweight Preferences backup in sync with every write —
    // aggregate stats only, never the individual session records.
    const allSessions = await db.getAll(STORE)
    await saveHistoryBackup(computeStats(allSessions))
  } catch (err) {
    console.error('Failed to record session', err)
  }
}

export async function getAllSessions() {
  try {
    const db = await getDB()
    const sessions = await db.getAll(STORE)
    return sessions.sort((a, b) => b.timestamp - a.timestamp)
  } catch (err) {
    console.error('Failed to load session history', err)
    return []
  }
}

function isSameDay(a, b) {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  )
}

function computeStreakDays(sessions) {
  if (sessions.length === 0) return 0

  const playedDays = sessions.map((s) => new Date(s.timestamp))
  const today = new Date()
  const cursor = new Date()

  const playedToday = playedDays.some((d) => isSameDay(d, today))
  if (!playedToday) {
    cursor.setDate(cursor.getDate() - 1)
  }

  let streak = 0
  // eslint-disable-next-line no-constant-condition
  while (true) {
    const playedThatDay = playedDays.some((d) => isSameDay(d, cursor))
    if (!playedThatDay) break
    streak += 1
    cursor.setDate(cursor.getDate() - 1)
  }

  return streak
}

// "Words you miss most" reflects CURRENT standing, not a lifetime tally: a
// word only appears if its single most recent attempt (across every mode
// and session) was wrong, and its badge is the current consecutive-miss
// streak — the count of wrong attempts in a row working back from now,
// which resets to 0 (and drops the word from the list) the moment a
// correct attempt happens.
export function computeCurrentMissedWords(sessions, limit = TOP_MISSED_WORDS_COUNT) {
  // Flatten every attempt from every session, each tagged with its
  // session's timestamp plus its position within that session — needed to
  // order same-word repeats correctly within one session (e.g. Speed Round
  // can re-ask the same word), since sessions only carry one timestamp.
  const byWord = new Map()
  for (const session of sessions) {
    const wordAttempts = session.wordAttempts ?? []
    wordAttempts.forEach((attempt, order) => {
      const entry = { ar: attempt.ar, en: attempt.en, correct: attempt.correct, timestamp: session.timestamp, order }
      const list = byWord.get(attempt.ar)
      if (list) {
        list.push(entry)
      } else {
        byWord.set(attempt.ar, [entry])
      }
    })
  }

  const results = []
  for (const attempts of byWord.values()) {
    attempts.sort((a, b) => a.timestamp - b.timestamp || a.order - b.order)

    let streak = 0
    for (let i = attempts.length - 1; i >= 0; i--) {
      if (attempts[i].correct) break
      streak += 1
    }

    if (streak > 0) {
      const mostRecent = attempts[attempts.length - 1]
      results.push({ ar: mostRecent.ar, en: mostRecent.en, count: streak, lastTimestamp: mostRecent.timestamp })
    }
  }

  results.sort((a, b) => b.count - a.count || b.lastTimestamp - a.lastTimestamp)
  return results.slice(0, limit).map(({ ar, en, count }) => ({ ar, en, count }))
}

export function computeStats(sessions) {
  const totalSessions = sessions.length
  const totalScore = sessions.reduce((sum, s) => sum + s.score, 0)
  const totalQuestions = sessions.reduce((sum, s) => sum + s.totalQuestions, 0)
  const overallAccuracy = totalQuestions === 0 ? 0 : Math.round((totalScore / totalQuestions) * 100)

  return {
    totalSessions,
    overallAccuracy,
    currentStreakDays: computeStreakDays(sessions),
    topMissedWords: computeCurrentMissedWords(sessions),
  }
}
