import { CheckCircle, Layers, Shuffle, Zap } from 'lucide-react'
import AppBar from './AppBar'
import AppNameHeading from './AppNameHeading'
import Greeting from './Greeting'
import { MODES } from '../data/modes'

const MODE_ICONS = {
  flashcards: Layers,
  'multiple-choice': CheckCircle,
  matching: Shuffle,
  'speed-round': Zap,
}

function ModePicker({ onSelect, onOpenMenu }) {
  return (
    <div className="mode-picker">
      <AppBar brand title="Home" onMenuClick={onOpenMenu} />
      <div className="mode-picker__body">
        <Greeting />
        <AppNameHeading />
        <p className="screen__lede mode-picker__lede">Choose how you'd like to practice.</p>
        <div className="mode-picker__cards">
          {MODES.map((mode) => {
            const Icon = MODE_ICONS[mode.id]
            return (
              <button
                key={mode.id}
                className="card card-button mode-card"
                onClick={() => onSelect(mode.id)}
              >
                <span className="mode-card__icon">
                  <Icon size={22} strokeWidth={2} aria-hidden="true" />
                </span>
                <span className="mode-card__text">
                  <h2>{mode.label}</h2>
                  <p>{mode.description}</p>
                  <p className="mode-card__detail">{mode.howItsPlayed}</p>
                </span>
              </button>
            )
          })}
        </div>
      </div>
    </div>
  )
}

export default ModePicker
