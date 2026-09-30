import { Bar, BarChart, CartesianGrid, Cell, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import { getScoreBand } from '../utils/lastResults'
import { formatMoves, getMovesBand } from '../utils/matchingResult'
import { formatDateTime } from '../utils/dateFormat'
import { LESSONS, TOTAL_WORDS } from '../utils/lessons'

function formatLesson(lesson) {
  return lesson === 'all' ? 'All lessons' : `Lesson ${lesson}`
}

function wordCountFor(lesson) {
  if (lesson === 'all') return TOTAL_WORDS
  return LESSONS.find((l) => l.lesson === lesson)?.count ?? 0
}

function buildChartData(mode, sessions) {
  const isMatching = mode === 'matching'

  return sessions.map((session, i) => {
    if (isMatching) {
      const moves = session.totalQuestions + (session.mistakes ?? 0)
      const band = getMovesBand(session.totalQuestions, moves)
      return {
        index: i + 1,
        value: moves,
        band,
        timestamp: session.timestamp,
        tooltipLabel: formatMoves(session.totalQuestions, moves),
      }
    }

    const band = getScoreBand(session.score, session.totalQuestions)
    const pct = session.totalQuestions
      ? Math.round((session.score / session.totalQuestions) * 100)
      : 0
    return {
      index: i + 1,
      value: pct,
      band,
      score: session.score,
      total: session.totalQuestions,
      timestamp: session.timestamp,
      tooltipLabel: `${session.score}/${session.totalQuestions}`,
    }
  })
}

function buildCaption(sessionCount) {
  return sessionCount === 1 ? 'Last session' : `Last ${sessionCount} sessions`
}

// margin.left(4) + yAxisWidth(36) + 6px gap = line starts just after the tick labels
const LEADER_LINE_X2 = 46

function BarWithLeaderLine({ x, y, width, height, fill }) {
  if (!height || height <= 0) return null
  return (
    <g>
      <rect x={x} y={y} width={width} height={height} fill={fill} rx={4} ry={4} />
      <line x1={x} y1={y} x2={LEADER_LINE_X2} y2={y} stroke={fill} strokeWidth={1} strokeDasharray="4 3" opacity={0.6} />
    </g>
  )
}

function ChartTooltip({ active, payload, label, colors, mode }) {
  if (!active || !payload?.length) return null
  const point = payload[0].payload
  const isMatching = mode === 'matching'
  const isSpeedRound = mode === 'speed-round'

  return (
    <div
      style={{
        background: colors.parchmentShade,
        border: `1px solid ${colors.border}`,
        borderRadius: 8,
        padding: '8px 12px',
        fontSize: 12,
        color: colors.ink,
      }}
    >
      <p style={{ margin: 0, fontWeight: 600 }}>Session {label}</p>
      <p style={{ margin: '2px 0 0', color: colors.inkSoft }}>{formatDateTime(point.timestamp)}</p>
      {isSpeedRound ? (
        <>
          <p style={{ margin: '4px 0 0' }}>Score: {point.value}%</p>
          <p style={{ margin: '2px 0 0', color: colors.inkSoft }}>
            {point.score} correct out of {point.total} questions asked
          </p>
        </>
      ) : (
        <p style={{ margin: '4px 0 0' }}>
          {isMatching ? 'Moves' : 'Score'}: {point.tooltipLabel}
        </p>
      )}
    </div>
  )
}

function LessonChartCard({ group, colors }) {
  const { mode, lesson, sessions } = group
  const isMatching = mode === 'matching'
  const data = buildChartData(mode, sessions)

  return (
    <div className="card history-chart-card">
      <div className="history-chart-card__header">
        <h2>{formatLesson(lesson)}</h2>
        <p>{wordCountFor(lesson)} words</p>
      </div>

      <p className="history-chart-card__caption">{buildCaption(sessions.length)}</p>

      <div className="history-chart-card__chart">
        <ResponsiveContainer width="100%" height={150}>
          <BarChart data={data} margin={{ top: 8, right: 8, left: 4, bottom: 20 }}>
            <XAxis
              dataKey="index"
              tick={{ fill: colors.inkSoft, fontSize: 11 }}
              axisLine={false}
              tickLine={false}
              label={{
                value: 'Session #',
                position: 'insideBottom',
                offset: -6,
                fill: colors.inkSoft,
                fontSize: 11,
              }}
            />
            <YAxis
              domain={isMatching ? [0, (max) => Math.ceil((max + 1) / 5) * 5] : [0, 100]}
              ticks={isMatching ? undefined : [0, 25, 50, 75, 100]}
              tickCount={isMatching ? 6 : undefined}
              tick={{ fill: colors.inkSoft, fontSize: 11 }}
              axisLine={false}
              tickLine={false}
              width={36}
              allowDecimals={false}
              label={{
                value: isMatching ? 'Moves' : 'Score %',
                angle: -90,
                position: 'insideLeft',
                style: { textAnchor: 'middle' },
                fill: colors.inkSoft,
                fontSize: 11,
              }}
            />
            <CartesianGrid vertical={false} stroke={colors.border} strokeDasharray="3 3" />
            <Tooltip
              cursor={{ fill: colors.border }}
              content={(props) => <ChartTooltip {...props} colors={colors} mode={mode} />}
            />
            <Bar dataKey="value" maxBarSize={28} isAnimationActive={false} shape={BarWithLeaderLine}>
              {data.map((point, i) => (
                <Cell key={i} fill={colors[point.band]} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}

export default LessonChartCard
