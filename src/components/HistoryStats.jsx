export function StatsSummary({ stats }) {
  return (
    <div className="history-stats">
      <div className="history-stat">
        <span className="history-stat__value">{stats.totalSessions}</span>
        <span className="history-stat__label">Sessions played</span>
      </div>
      <div className="history-stat">
        <span className="history-stat__value">{stats.overallAccuracy}%</span>
        <span className="history-stat__label">Overall score</span>
      </div>
      <div className="history-stat">
        <span className="history-stat__value">{stats.currentStreakDays}</span>
        <span className="history-stat__label">Day streak</span>
      </div>
    </div>
  )
}

export function MissedWordsCard({ topMissedWords }) {
  if (topMissedWords.length === 0) return null

  return (
    <div className="card history-missed">
      <h2>Words you miss most (across all games)</h2>
      <ul className="history-missed__list">
        {topMissedWords.map((word) => (
          <li key={word.ar}>
            <span className="arabic-text arabic-text--compact">{word.ar}</span>
            <span className="history-missed__en">{word.en}</span>
            <span className="badge-incorrect">{word.count}×</span>
          </li>
        ))}
      </ul>
    </div>
  )
}
