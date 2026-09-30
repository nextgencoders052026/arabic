import { useEffect, useState } from 'react'
import { CheckCircle, Layers, Shuffle, Sparkles, TriangleAlert, Zap } from 'lucide-react'
import AppBar from './AppBar'
import AppNameHeading from './AppNameHeading'
import Greeting from './Greeting'
import ChangelogModal from './ChangelogModal'
import { getAppVersion } from '../utils/appInfo'

const ABOUT_MODES = [
  {
    id: 'matching',
    label: 'Matching Game',
    icon: Shuffle,
    description:
      'Drag each Arabic word onto the picture it matches. Great for building quick visual recognition.',
  },
  {
    id: 'multiple-choice',
    label: 'Multiple Choice',
    icon: CheckCircle,
    description: 'See a word, pick its meaning from four options. A steady, no-pressure way to test yourself.',
  },
  {
    id: 'flashcards',
    label: 'Flashcards',
    icon: Layers,
    description:
      'Flip through words at your own pace and grade yourself honestly. Best for focused, unhurried review.',
  },
  {
    id: 'speed-round',
    label: 'Speed Round',
    icon: Zap,
    description: 'Race the clock and answer as many as you can in 60 seconds. Good for a quick daily habit.',
  },
]

function About({ onOpenMenu }) {
  const [version, setVersion] = useState('unknown')
  const [showChangelog, setShowChangelog] = useState(false)

  useEffect(() => {
    getAppVersion().then(setVersion)
  }, [])

  return (
    <div className="screen">
      <AppBar brand title="About" onMenuClick={onOpenMenu} />
      <Greeting />

      <AppNameHeading />

      <div className="about-content">
        <section className="about-section">
          <h2>What Lisan is</h2>
          <p>
            Lisan helps you build real Arabic vocabulary through active practice, not passive
            memorization. Right now, the app focuses entirely on vocabulary — 289 words drawn from a
            structured 23-lesson course, covering everyday objects, people, places, numbers, colors,
            and more.
          </p>
        </section>

        <section className="about-section">
          <h2>Four ways to practice</h2>
          <ul className="about-mode-list">
            {ABOUT_MODES.map((mode) => {
              const Icon = mode.icon
              return (
                <li key={mode.id} className="about-mode-list__item">
                  <Icon size={20} strokeWidth={2} className="about-mode-list__icon" aria-hidden="true" />
                  <p>
                    <strong>{mode.label}</strong> — {mode.description}
                  </p>
                </li>
              )
            })}
          </ul>
        </section>

        <section className="about-section">
          <h2>Track your progress</h2>
          <p>
            Your progress is tracked automatically. Head to Progress anytime to see your accuracy over
            time, your day streak, and — most usefully — the specific words you keep missing, so you
            always know exactly what to review next. You can also export your full history as a PDF
            whenever you'd like a copy.
          </p>
        </section>

        <section className="about-section">
          <h2>Make it yours</h2>
          <p>
            Switch between Manuscript, Night, and Green themes in Settings — whatever's easiest on
            your eyes.
          </p>
        </section>

        <div className="about-teaser">
          <div className="about-teaser__header">
            <Sparkles size={20} strokeWidth={2} className="about-teaser__icon" aria-hidden="true" />
            <h2>Coming next: grammar</h2>
            <span className="about-teaser__badge">Coming soon</span>
          </div>
          <p>
            Grammar is coming next. Future updates will build on this same foundation with
            lesson-by-lesson grammar practice — the kind of sentence structure and exercises that turn
            "I know these words" into "I can actually read and understand Arabic." Vocabulary first,
            grammar next — each update adds a new layer.
          </p>
        </div>

        <div className="about-callout">
          <TriangleAlert size={20} strokeWidth={2} className="about-callout__icon" aria-hidden="true" />
          <p>
            One important thing to know: all of your history and progress is stored only on this
            device — there's no account, and nothing is backed up to a server. If you uninstall the
            app (or, on some phones, if it's cleared to free up storage), that history is gone for
            good. Exporting a PDF from time to time is a good way to keep a permanent copy of your
            progress if that matters to you.
          </p>
        </div>
      </div>

      <div className="card settings-section about-card">
        <p className="about-version">Version {version}</p>
        <button
          className="btn btn-secondary settings-action-btn"
          onClick={() => setShowChangelog(true)}
        >
          Version history
        </button>
      </div>

      {showChangelog && <ChangelogModal onClose={() => setShowChangelog(false)} />}
    </div>
  )
}

export default About
