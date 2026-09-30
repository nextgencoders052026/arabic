export function hasSeenInstructions(storageKey) {
  try {
    return localStorage.getItem(storageKey) === 'true'
  } catch {
    return false
  }
}

function InstructionsOverlay({ storageKey, message, onDismiss }) {
  function handleDismiss() {
    try {
      localStorage.setItem(storageKey, 'true')
    } catch {
      // localStorage unavailable — the overlay will just show again next time
    }
    onDismiss()
  }

  return (
    <div className="overlay-backdrop">
      <div className="card overlay-card">
        <p>{message}</p>
        <button className="btn btn-primary" onClick={handleDismiss}>
          Got it
        </button>
      </div>
    </div>
  )
}

export default InstructionsOverlay
