import { Menu } from 'lucide-react'

// `brand`: the 4 top-level nav screens (Home/Progress/Settings/About) opt into
// the two-line "Lisan" + screen-name structure. Gameplay screens (Flashcards,
// Matching, etc.) keep the older single-line title — they're mid-round, not a
// nav destination, so the extra "Lisan" line would just be clutter there.
function AppBar({ title, onMenuClick, rightAction, brand = false }) {
  return (
    <header className="app-bar">
      <button className="app-bar__menu-btn" onClick={onMenuClick} aria-label="Open menu">
        <Menu size={22} strokeWidth={2} aria-hidden="true" />
      </button>
      <div className="app-bar__text">
        {brand ? (
          <>
            <p className="app-bar__brand">Lisan</p>
            <p className="app-bar__subtitle app-bar__subtitle--accent">{title}</p>
          </>
        ) : (
          title && <p className="app-bar__subtitle">{title}</p>
        )}
      </div>
      {rightAction ?? <span aria-hidden="true" />}
    </header>
  )
}

export default AppBar
