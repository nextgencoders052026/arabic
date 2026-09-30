import { useState } from 'react'
import ConfirmDialog from './ConfirmDialog'

function GameplayHeader({ onExit, children }) {
  const [confirming, setConfirming] = useState(false)

  return (
    <>
      {confirming && (
        <ConfirmDialog
          message="Exit this round? Your progress won't be saved."
          confirmLabel="Exit"
          cancelLabel="Keep playing"
          onConfirm={onExit}
          onCancel={() => setConfirming(false)}
        />
      )}
      <div className="gameplay-header">
        <button className="btn btn-secondary" onClick={() => setConfirming(true)}>
          ← Back to lessons
        </button>
        <span className="gameplay-header__greeting arabic-text" dir="rtl" lang="ar">
          السلام عليكم
        </span>
      </div>
      {children}
    </>
  )
}

export default GameplayHeader
