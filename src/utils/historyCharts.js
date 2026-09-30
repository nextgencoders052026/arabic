import { MODES } from '../data/modes'

const CHART_SESSION_LIMIT = 5

// Groups sessions by (mode, lesson) — optionally restricted to one mode.
// Each group's `sessions` is capped to the most recent CHART_SESSION_LIMIT and
// ordered oldest-to-newest for charting; `totalCount` is the true count before
// capping, so callers can show a "+N earlier sessions" note. Groups are
// returned unsorted — sort with sortByLessonNumber or sortByRecency below.
export function groupSessionsForCharts(sessions, mode) {
  const filtered = mode ? sessions.filter((s) => s.mode === mode) : sessions
  const byKey = new Map()

  // `sessions` is already newest-first (see getAllSessions), so the first
  // CHART_SESSION_LIMIT entries seen per key are exactly the most recent ones.
  for (const session of filtered) {
    const key = `${session.mode}::${session.lesson}`
    let group = byKey.get(key)
    if (!group) {
      group = { mode: session.mode, lesson: session.lesson, sessions: [], totalCount: 0 }
      byKey.set(key, group)
    }
    group.totalCount += 1
    if (group.sessions.length < CHART_SESSION_LIMIT) {
      group.sessions.push(session)
    }
  }

  return [...byKey.values()].map((group) => ({
    ...group,
    mostRecentTimestamp: group.sessions[0].timestamp,
    sessions: [...group.sessions].reverse(),
  }))
}

function lessonSortValue(lesson) {
  return lesson === 'all' ? -1 : lesson
}

// Lesson 1, 2, 3… with "all lessons" first; ties (same lesson, different
// mode, only possible when groups aren't restricted to one mode) broken by
// the modes' own display order.
export function sortByLessonNumber(groups) {
  const modeOrder = MODES.map((m) => m.id)
  return [...groups].sort((a, b) => {
    const lessonDiff = lessonSortValue(a.lesson) - lessonSortValue(b.lesson)
    if (lessonDiff !== 0) return lessonDiff
    return modeOrder.indexOf(a.mode) - modeOrder.indexOf(b.mode)
  })
}

// For one mode's "view all sessions" card: groups that mode's sessions by
// lesson (each lesson's own sessions newest-first, uncapped — capping to a
// handful of visible rows with a "+N earlier" expander is a display concern,
// left to the caller). Groups are returned unsorted — sort with
// sortByLessonNumber above (sessions within a group stay newest-first either way).
export function groupSessionsByModeAndLesson(sessions, mode) {
  const byLesson = new Map()

  for (const session of sessions) {
    if (session.mode !== mode) continue
    let group = byLesson.get(session.lesson)
    if (!group) {
      group = { lesson: session.lesson, sessions: [] }
      byLesson.set(session.lesson, group)
    }
    group.sessions.push(session)
  }

  return [...byLesson.values()].map((group) => ({
    ...group,
    mostRecentTimestamp: group.sessions[0].timestamp,
  }))
}
