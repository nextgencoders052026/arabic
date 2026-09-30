function ConfirmDialog({ message, confirmLabel, cancelLabel, onConfirm, onCancel }) {
  return (
    <div className="overlay-backdrop" onClick={onCancel}>
      <div className="card overlay-card" onClick={(e) => e.stopPropagation()}>
        <p>{message}</p>
        <div className="flashcard-actions">
          <button className="btn btn-secondary" onClick={onCancel}>
            {cancelLabel}
          </button>
          <button className="btn btn-primary" onClick={onConfirm}>
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  )
}

export default ConfirmDialog
