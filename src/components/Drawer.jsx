import { Home, Info, Mail, Settings as SettingsIcon, Star, TrendingUp, X } from 'lucide-react'

const NAV_ITEMS = [
  { id: 'home', label: 'Home', icon: Home },
  { id: 'history', label: 'Progress', icon: TrendingUp },
  { id: 'settings', label: 'Settings', icon: SettingsIcon },
]

function Drawer({ open, onClose, onNavigate, activeScreen, onSendFeedback, onRateApp }) {
  function handleAction(action) {
    onClose()
    action()
  }

  return (
    <>
      <div
        className={`drawer-backdrop${open ? ' drawer-backdrop--visible' : ''}`}
        onClick={onClose}
        aria-hidden={!open}
      />
      <nav className={`drawer${open ? ' drawer--open' : ''}`} aria-hidden={!open}>
        <div className="drawer__header">
          <span className="drawer__title">Menu</span>
          <button className="drawer__close" onClick={onClose} aria-label="Close menu">
            <X size={20} strokeWidth={2} aria-hidden="true" />
          </button>
        </div>
        <ul className="drawer__list">
          {NAV_ITEMS.map((item) => {
            const Icon = item.icon
            const isActive = activeScreen === item.id
            return (
              <li key={item.id}>
                <button
                  className={`drawer__item${isActive ? ' drawer__item--active' : ''}`}
                  onClick={() => onNavigate(item.id)}
                >
                  <Icon size={20} strokeWidth={2} aria-hidden="true" />
                  <span>{item.label}</span>
                </button>
              </li>
            )
          })}
          <li>
            <button className="drawer__item" onClick={() => handleAction(onSendFeedback)}>
              <Mail size={20} strokeWidth={2} aria-hidden="true" />
              <span>Send Feedback</span>
            </button>
          </li>
          <li>
            <button className="drawer__item" onClick={() => handleAction(onRateApp)}>
              <Star size={20} strokeWidth={2} aria-hidden="true" />
              <span>Rate this app</span>
            </button>
          </li>
          <li>
            <button
              className={`drawer__item${activeScreen === 'about' ? ' drawer__item--active' : ''}`}
              onClick={() => onNavigate('about')}
            >
              <Info size={20} strokeWidth={2} aria-hidden="true" />
              <span>About</span>
            </button>
          </li>
        </ul>
      </nav>
    </>
  )
}

export default Drawer
