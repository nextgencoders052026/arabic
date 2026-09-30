import { useState } from 'react'
import AppBar from './AppBar'
import AppNameHeading from './AppNameHeading'
import Greeting from './Greeting'
import { applyTheme, getStoredTheme, setStoredTheme, THEMES } from '../utils/theme'
import { getStoredName, setStoredName } from '../utils/profile'

function Settings({ onOpenMenu }) {
  const [selected, setSelected] = useState(getStoredTheme)
  const [name, setName] = useState(getStoredName)

  function chooseTheme(themeId) {
    setSelected(themeId)
    applyTheme(themeId)
    setStoredTheme(themeId)
  }

  function saveName() {
    const trimmed = name.trim()
    if (trimmed) {
      setStoredName(trimmed)
    } else {
      // Don't let an accidental blank save wipe out the stored name —
      // that would bring back the first-launch welcome prompt.
      setName(getStoredName())
    }
  }

  return (
    <div className="screen">
      <AppBar brand title="Settings" onMenuClick={onOpenMenu} />
      <Greeting />
      <AppNameHeading />
      <p className="screen__lede">Choose a theme.</p>

      <div className="theme-grid">
        {THEMES.map((theme) => {
          const isSelected = selected === theme.id
          return (
            <button
              key={theme.id}
              className={`theme-swatch${isSelected ? ' theme-swatch--selected' : ''}`}
              onClick={() => chooseTheme(theme.id)}
              aria-pressed={isSelected}
            >
              <span
                className="theme-swatch__preview"
                style={{ background: theme.swatch.background }}
              >
                <span className="theme-swatch__dot" style={{ background: theme.swatch.primary }} />
                <span
                  className="theme-swatch__dot"
                  style={{ background: theme.swatch.secondary }}
                />
                <span className="theme-swatch__dot" style={{ background: theme.swatch.ink }} />
              </span>
              <span className="theme-swatch__label">{theme.label}</span>
            </button>
          )
        })}
      </div>

      <div className="card settings-section">
        <h2>Your name</h2>
        <input
          type="text"
          className="text-input"
          value={name}
          onChange={(e) => setName(e.target.value)}
          onBlur={saveName}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              saveName()
              e.target.blur()
            }
          }}
          placeholder="Your name"
          maxLength={40}
        />
      </div>
    </div>
  )
}

export default Settings
