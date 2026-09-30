import { useEffect, useMemo, useRef, useState } from 'react'
import { CheckCircle, Download, Layers, Loader2, Shuffle, TriangleAlert, X, Zap } from 'lucide-react'
import AppBar from './AppBar'
import AppNameHeading from './AppNameHeading'
import Greeting from './Greeting'
import LessonChartCard from './LessonChartCard'
import ExportReportView from './ExportReportView'
import { StatsSummary, MissedWordsCard } from './HistoryStats'
import { computeCurrentMissedWords, computeStats, getAllSessions } from '../utils/history'
import { getHistoryBackup } from '../utils/historyBackup'
import { getThemeColors } from '../utils/chartColors'
import {
  groupSessionsByModeAndLesson,
  groupSessionsForCharts,
  sortByLessonNumber,
} from '../utils/historyCharts'
import { SPEED_ROUND_NOTE, formatLesson, modeLabel, formatSessionResult } from '../utils/historyDisplay'
import { getStoredHistoryView, setStoredHistoryView } from '../utils/historyView'
import { formatDateTime } from '../utils/dateFormat'
import { exportHistoryReport, waitForCaptureReady } from '../utils/exportReport'
import { dismissHistoryDisclaimer, getHistoryDisclaimerDismissed } from '../utils/historyDisclaimer'
import { MODES } from '../data/modes'

const LESSON_GROUP_VISIBLE_CAP = 5

const MODE_TABS = [
  { id: 'matching', label: 'Matching Game', icon: Shuffle },
  { id: 'multiple-choice', label: 'Multiple Choice', icon: CheckCircle },
  { id: 'flashcards', label: 'Flashcards', icon: Layers },
  { id: 'speed-round', label: 'Speed Round', icon: Zap },
]

const DEFAULT_MODE = 'flashcards'

const VIEW_TABS = [
  { id: 'trends', label: 'Trends' },
  { id: 'all-sessions', label: 'All Sessions' },
]

function History({ onOpenMenu }) {
  const [sessions, setSessions] = useState(null)
  const [backupStats, setBackupStats] = useState(null)
  const [selectedMode, setSelectedMode] = useState(DEFAULT_MODE)
  const [selectedView, setSelectedView] = useState(getStoredHistoryView)
  const [colors] = useState(getThemeColors)
  const [exporting, setExporting] = useState(false)
  const [exportError, setExportError] = useState(false)
  const [showDisclaimer, setShowDisclaimer] = useState(false)
  const trendsExportRef = useRef(null)
  const allSessionsExportRef = useRef(null)

  useEffect(() => {
    let cancelled = false
    getHistoryDisclaimerDismissed().then((dismissed) => {
      if (!cancelled && !dismissed) setShowDisclaimer(true)
    })
    return () => {
      cancelled = true
    }
  }, [])

  function handleDismissDisclaimer() {
    setShowDisclaimer(false)
    dismissHistoryDisclaimer()
  }

  useEffect(() => {
    if (!exporting) return
    let cancelled = false

    async function run() {
      try {
        await waitForCaptureReady(trendsExportRef.current, allSessionsExportRef.current)
        if (cancelled) return
        await exportHistoryReport({
          trendsEl: trendsExportRef.current,
          allSessionsEl: allSessionsExportRef.current,
          filename: `lisan-progress-${Date.now()}.pdf`,
        })
      } catch (err) {
        console.error('Failed to export history report', err)
        if (!cancelled) setExportError(true)
      } finally {
        if (!cancelled) setExporting(false)
      }
    }
    run()

    return () => {
      cancelled = true
    }
  }, [exporting])

  useEffect(() => {
    if (!exportError) return
    const timer = setTimeout(() => setExportError(false), 4000)
    return () => clearTimeout(timer)
  }, [exportError])

  function startExport() {
    setExportError(false)
    setExporting(true)
  }

  useEffect(() => {
    let cancelled = false
    getAllSessions().then(async (result) => {
      if (cancelled) return
      setSessions(result)
      // Sessions are newest-first, so the first one's mode is whichever mode
      // was played most recently overall — that's the default tab.
      setSelectedMode(result[0]?.mode ?? DEFAULT_MODE)
      if (result.length === 0) {
        const backup = await getHistoryBackup()
        if (!cancelled) setBackupStats(backup)
      }
    })
    return () => {
      cancelled = true
    }
  }, [])

  function selectView(view) {
    setSelectedView(view)
    setStoredHistoryView(view)
  }

  return (
    <div className="screen screen--wide">
      <AppBar
        brand
        title="Progress"
        onMenuClick={onOpenMenu}
        rightAction={
          <button
            className="app-bar__menu-btn"
            onClick={startExport}
            disabled={exporting || !sessions?.length}
            aria-label={exporting ? 'Exporting report…' : 'Download report'}
          >
            {exporting ? (
              <Loader2 size={20} strokeWidth={2} className="app-bar__spinner" aria-hidden="true" />
            ) : (
              <Download size={20} strokeWidth={2} aria-hidden="true" />
            )}
          </button>
        }
      />
      <Greeting />
      <AppNameHeading />

      {showDisclaimer && (
        <div className="history-disclaimer">
          <TriangleAlert size={16} strokeWidth={2} className="history-disclaimer__icon" aria-hidden="true" />
          <p>Progress lives only on this device — export a PDF to keep a permanent copy.</p>
          <button
            className="history-disclaimer__dismiss"
            onClick={handleDismissDisclaimer}
            aria-label="Dismiss"
          >
            <X size={14} strokeWidth={2} aria-hidden="true" />
          </button>
        </div>
      )}

      {exportError && (
        <p className="export-error-note">Couldn't export the report — please try again.</p>
      )}

      {sessions && sessions.length > 0 && (
        <div aria-hidden="true" className="export-report-offscreen">
          {exporting && (
            <ExportReportView
              sessions={sessions}
              trendsRef={trendsExportRef}
              allSessionsRef={allSessionsExportRef}
            />
          )}
        </div>
      )}

      {sessions === null ? (
        <p className="screen__lede">Loading…</p>
      ) : sessions.length > 0 ? (
        <>
          <ViewTabs selectedView={selectedView} onSelectView={selectView} />
          {selectedView === 'trends' ? (
            <TrendsView
              sessions={sessions}
              selectedMode={selectedMode}
              onSelectMode={setSelectedMode}
              colors={colors}
            />
          ) : (
            <AllSessionsView sessions={sessions} />
          )}
        </>
      ) : backupStats ? (
        <>
          <p className="history-recovered-note">
            Detailed session history was lost, but your overall stats were recovered.
          </p>
          <MissedWordsCard topMissedWords={backupStats.topMissedWords} />
          <StatsSummary stats={backupStats} />
        </>
      ) : (
        <p className="screen__lede">No sessions yet — play a round to see your progress here.</p>
      )}
    </div>
  )
}

function ViewTabs({ selectedView, onSelectView }) {
  return (
    <div className="history-view-tabs" role="tablist">
      {VIEW_TABS.map((tab) => (
        <button
          key={tab.id}
          role="tab"
          aria-selected={selectedView === tab.id}
          className={`history-view-tabs__tab${
            selectedView === tab.id ? ' history-view-tabs__tab--active' : ''
          }`}
          onClick={() => onSelectView(tab.id)}
        >
          {tab.label}
        </button>
      ))}
    </div>
  )
}

function ModeFilterTabs({ selectedMode, onSelectMode }) {
  return (
    <div className="mode-filter" role="tablist">
      {MODE_TABS.map((tab) => {
        const Icon = tab.icon
        return (
          <button
            key={tab.id}
            role="tab"
            aria-selected={selectedMode === tab.id}
            className={`mode-filter__tab${
              selectedMode === tab.id ? ' mode-filter__tab--active' : ''
            }`}
            onClick={() => onSelectMode(tab.id)}
          >
            <Icon size={16} strokeWidth={2} aria-hidden="true" />
            <span>{tab.label}</span>
          </button>
        )
      })}
    </div>
  )
}

function LessonRowGroup({ lessonGroup }) {
  const [expanded, setExpanded] = useState(false)
  const { lesson, sessions } = lessonGroup
  const visibleSessions = expanded ? sessions : sessions.slice(0, LESSON_GROUP_VISIBLE_CAP)
  const hiddenCount = sessions.length - visibleSessions.length

  return (
    <div className="history-lesson-group">
      <h3 className="history-lesson-group__header">{formatLesson(lesson)}</h3>
      <div className="history-group-card__rows">
        {visibleSessions.map((session) => {
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
      {hiddenCount > 0 && (
        <button className="history-lesson-group__expand" onClick={() => setExpanded(true)}>
          +{hiddenCount} earlier
        </button>
      )}
    </div>
  )
}

function GroupedSessionCard({ mode, lessonGroups }) {
  return (
    <div className="card history-group-card">
      <h2 className="history-group-card__header">{modeLabel(mode)}</h2>
      {lessonGroups.map((lessonGroup) => (
        <LessonRowGroup key={lessonGroup.lesson} lessonGroup={lessonGroup} />
      ))}
    </div>
  )
}

function TrendsView({ sessions, selectedMode, onSelectMode, colors }) {
  const filteredSessions = sessions.filter((s) => s.mode === selectedMode)
  const stats = computeStats(filteredSessions)
  // Aggregated across every mode, not just the selected one — shown above
  // the mode-selector so it reads as an overall insight, not something
  // scoped to whichever mode is currently selected below it.
  const topMissedWords = computeCurrentMissedWords(sessions)

  const chartGroups = useMemo(() => {
    const groups = groupSessionsForCharts(sessions, selectedMode)
    return sortByLessonNumber(groups)
  }, [sessions, selectedMode])

  return (
    <>
      <MissedWordsCard topMissedWords={topMissedWords} />

      <ModeFilterTabs selectedMode={selectedMode} onSelectMode={onSelectMode} />

      {selectedMode === 'speed-round' && (
        <p className="history-mode-note">{SPEED_ROUND_NOTE}</p>
      )}

      <StatsSummary stats={stats} />

      {chartGroups.length > 0 ? (
        <div className="history-chart-list">
          {chartGroups.map((group) => (
            <LessonChartCard key={`${group.mode}::${group.lesson}`} group={group} colors={colors} />
          ))}
        </div>
      ) : (
        <p className="screen__lede">No sessions played in this mode yet.</p>
      )}
    </>
  )
}

function AllSessionsView({ sessions }) {
  const modeGroupedSessions = useMemo(() => {
    return MODES.map((m) => ({
      mode: m.id,
      lessonGroups: sortByLessonNumber(groupSessionsByModeAndLesson(sessions, m.id)),
    })).filter((group) => group.lessonGroups.length > 0)
  }, [sessions])

  return (
    <div className="history-group-list">
      {modeGroupedSessions.map(({ mode, lessonGroups }) => (
        <GroupedSessionCard key={mode} mode={mode} lessonGroups={lessonGroups} />
      ))}
    </div>
  )
}

export default History
