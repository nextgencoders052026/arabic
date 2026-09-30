import { getAudioContext } from './audioContext'

function tone(audioCtx, { frequency, endFrequency, start, duration, type = 'sine', peakGain = 0.2 }) {
  const osc = audioCtx.createOscillator()
  const gain = audioCtx.createGain()

  osc.type = type
  osc.frequency.setValueAtTime(frequency, start)
  if (endFrequency) {
    osc.frequency.exponentialRampToValueAtTime(endFrequency, start + duration)
  }

  gain.gain.setValueAtTime(0.0001, start)
  gain.gain.exponentialRampToValueAtTime(peakGain, start + 0.015)
  gain.gain.exponentialRampToValueAtTime(0.0001, start + duration)

  osc.connect(gain)
  gain.connect(audioCtx.destination)
  osc.start(start)
  osc.stop(start + duration + 0.03)
}

export function playFlip() {
  const audioCtx = getAudioContext()
  if (!audioCtx) return
  const now = audioCtx.currentTime
  tone(audioCtx, { frequency: 950, endFrequency: 650, start: now, duration: 0.05, type: 'square', peakGain: 0.05 })
}

export function playCorrect() {
  const audioCtx = getAudioContext()
  if (!audioCtx) return
  const now = audioCtx.currentTime
  tone(audioCtx, { frequency: 587.33, start: now, duration: 0.12, type: 'sine', peakGain: 0.22 })
  tone(audioCtx, { frequency: 880, start: now + 0.09, duration: 0.2, type: 'sine', peakGain: 0.22 })
}

export function playIncorrect() {
  const audioCtx = getAudioContext()
  if (!audioCtx) return
  const now = audioCtx.currentTime
  tone(audioCtx, { frequency: 180, endFrequency: 110, start: now, duration: 0.32, type: 'sawtooth', peakGain: 0.13 })
}

export function playFanfare() {
  const audioCtx = getAudioContext()
  if (!audioCtx) return
  const now = audioCtx.currentTime
  const notes = [523.25, 659.25, 783.99, 1046.5]
  notes.forEach((frequency, i) => {
    tone(audioCtx, { frequency, start: now + i * 0.11, duration: 0.24, type: 'triangle', peakGain: 0.2 })
  })
}
