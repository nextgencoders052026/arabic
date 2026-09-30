// A small decorative gold divider — echoes the diamond motif from the app's
// background pattern. Used below the greeting on Home and About; both
// screens' app bars already show "Lisan" as their own line now, so this
// stays purely decorative rather than repeating the name a second time.
function AppNameHeading() {
  return (
    <div className="app-name-heading">
      <svg className="app-name-heading__rule" viewBox="0 0 56 12" aria-hidden="true">
        <line x1="0" y1="6" x2="20" y2="6" stroke="currentColor" strokeWidth="1.5" />
        <polygon points="28,2 32,6 28,10 24,6" fill="currentColor" />
        <line x1="36" y1="6" x2="56" y2="6" stroke="currentColor" strokeWidth="1.5" />
      </svg>
    </div>
  )
}

export default AppNameHeading
