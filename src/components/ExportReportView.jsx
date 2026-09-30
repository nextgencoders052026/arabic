import LessonChartCard from './LessonChartCard'
import { StatsSummary, MissedWordsCard } from './HistoryStats'
import { SPEED_ROUND_NOTE, formatLesson, modeLabel, formatSessionResult } from '../utils/historyDisplay'
import { computeCurrentMissedWords, computeStats } from '../utils/history'
import { groupSessionsByModeAndLesson, groupSessionsForCharts, sortByLessonNumber } from '../utils/historyCharts'
import { formatDateTime } from '../utils/dateFormat'
import { getExportThemeVars } from '../utils/exportReport'
import { getThemeColors } from '../utils/chartColors'
import { getStoredName } from '../utils/profile'
import { MODES } from '../data/modes'

function ExportReportView({ sessions, trendsRef, allSessionsRef }) {
  const name = getStoredName()
  const topMissedWords = computeCurrentMissedWords(sessions)
  // Read fresh on every mount (right as an export starts) so the report
  // always matches whichever theme is actually active on screen, rather
  // than a fixed palette.
  const themeVars = getExportThemeVars()
  const chartColors = getThemeColors()

  const modeGroupedSessions = MODES.map((m) => ({
    mode: m.id,
    lessonGroups: sortByLessonNumber(groupSessionsByModeAndLesson(sessions, m.id)),
  })).filter((g) => g.lessonGroups.length > 0)

  return (
    <div className="export-report" style={themeVars}>
      <div ref={trendsRef} className="export-report__page">
        <div className="export-report__header">
          <img src="/icon.png" width={48} height={48} alt="" />
          <h1>Lisan</h1>
          {name && <p>{name}</p>}
          <p className="screen__lede">Exported {formatDateTime(Date.now())}</p>
        </div>

        <h1 className="export-report__section-title">Trends</h1>
        <MissedWordsCard topMissedWords={topMissedWords} />

        {MODES.map((m) => {
          const filtered = sessions.filter((s) => s.mode === m.id)
          const stats = computeStats(filtered)
          const chartGroups = sortByLessonNumber(groupSessionsForCharts(sessions, m.id))
          return (
            <div key={m.id} className="export-report__mode-block">
              <h2>{m.label}</h2>
              {m.id === 'speed-round' && <p className="history-mode-note">{SPEED_ROUND_NOTE}</p>}
              <StatsSummary stats={stats} />
              {chartGroups.length > 0 ? (
                <div className="history-chart-list">
                  {chartGroups.map((group) => (
                    <LessonChartCard
                      key={`${group.mode}::${group.lesson}`}
                      group={group}
                      colors={chartColors}
                    />
                  ))}
                </div>
              ) : (
                <p className="screen__lede">No sessions played in this mode yet.</p>
              )}
            </div>
          )
        })}
      </div>

      <div ref={allSessionsRef} className="export-report__page">
        <h1 className="export-report__section-title">All Sessions</h1>
        <div className="history-group-list">
          {modeGroupedSessions.map(({ mode, lessonGroups }) => (
            <div key={mode} className="card history-group-card">
              <h2 className="history-group-card__header">{modeLabel(mode)}</h2>
              {lessonGroups.map((lessonGroup) => (
                <div key={lessonGroup.lesson} className="history-lesson-group">
                  <h3 className="history-lesson-group__header">{formatLesson(lessonGroup.lesson)}</h3>
                  <div className="history-group-card__rows">
                    {lessonGroup.sessions.map((session) => {
                      const result = formatSessionResult(session)
                      return (
                        <div key={session.id} className="history-group-card__row">
                          <span className="screen__lede history-group-card__timestamp">
                            {formatDateTime(session.timestamp)}
                          </span>
                          <span className={result.band ? `result-value--${result.band}` : undefined}>
                            {result.text}
                          </span>
                        </div>
                      )
                    })}
                  </div>
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default ExportReportView
