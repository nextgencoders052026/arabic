import { useState } from 'react'
import { setStoredName } from '../utils/profile'

function Welcome({ onDone }) {
  const [name, setName] = useState('')

  function handleSubmit(e) {
    e.preventDefault()
    const trimmed = name.trim()
    if (!trimmed) return
    setStoredName(trimmed)
    onDone(trimmed)
  }

  return (
    <div className="screen welcome">
      <h1>What should we call you?</h1>
      <form className="welcome__form" onSubmit={handleSubmit}>
        <input
          type="text"
          className="text-input"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Your name"
          autoFocus
          maxLength={40}
        />
        <button type="submit" className="btn btn-primary" disabled={!name.trim()}>
          Let's go
        </button>
      </form>
    </div>
  )
}

export default Welcome
