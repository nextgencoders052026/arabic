import { CHANGELOG } from '../data/changelog'

function ChangelogModal({ onClose }) {
  return (
    <div className="overlay-backdrop" onClick={onClose}>
      <div className="card overlay-card changelog-card" onClick={(e) => e.stopPropagation()}>
        <h2>Version history</h2>
        <div className="changelog-list">
          {CHANGELOG.map((entry) => (
            <div key={entry.version} className="changelog-entry">
              <p className="changelog-entry__version">
                v{entry.version} — {entry.date}
              </p>
              <ul>
                {entry.notes.map((note) => (
                  <li key={note}>{note}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <button className="btn btn-primary" onClick={onClose}>
          Close
        </button>
      </div>
    </div>
  )
}

export default ChangelogModal
