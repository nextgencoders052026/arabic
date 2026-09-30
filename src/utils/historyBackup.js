import { Preferences } from '@capacitor/preferences'

const BACKUP_KEY = 'arabic-vocab-game:history-backup'

// A lightweight aggregate-only safety net against IndexedDB being evicted
// by the OS (Capacitor's own docs warn this can happen, especially on iOS,
// without the app being uninstalled). Preferences is for small data, so we
// only ever store the computed summary here — never individual sessions.
export async function saveHistoryBackup(stats) {
  try {
    await Preferences.set({ key: BACKUP_KEY, value: JSON.stringify(stats) })
  } catch (err) {
    console.error('Failed to save history backup', err)
  }
}

export async function getHistoryBackup() {
  try {
    const { value } = await Preferences.get({ key: BACKUP_KEY })
    return value ? JSON.parse(value) : null
  } catch (err) {
    console.error('Failed to read history backup', err)
    return null
  }
}
