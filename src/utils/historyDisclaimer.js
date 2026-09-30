import { Preferences } from '@capacitor/preferences'

const DISMISSED_KEY = 'arabic-vocab-game:history-disclaimer-dismissed'

export async function getHistoryDisclaimerDismissed() {
  try {
    const { value } = await Preferences.get({ key: DISMISSED_KEY })
    return value === 'true'
  } catch {
    return false
  }
}

export async function dismissHistoryDisclaimer() {
  try {
    await Preferences.set({ key: DISMISSED_KEY, value: 'true' })
  } catch {
    // best effort — worst case the note reappears next visit
  }
}
