import { Preferences } from '@capacitor/preferences'
import { requestAppReview } from './rateApp'

const COUNT_KEY = 'arabic-vocab-game:completed-session-count'
const SHOWN_KEY = 'arabic-vocab-game:review-prompt-shown'
const TRIGGER_AT_SESSION = 5
const PROMPT_DELAY_MS = 800

// Called once per completed game session (any mode). Auto-triggers the
// native review prompt exactly once, the first time the session count
// reaches 5 — never again after that, regardless of how many more
// sessions get played. The user can still open it manually from Settings
// any time.
export async function maybePromptForReview() {
  try {
    const { value: alreadyShown } = await Preferences.get({ key: SHOWN_KEY })
    if (alreadyShown === 'true') return

    const { value: storedCount } = await Preferences.get({ key: COUNT_KEY })
    const nextCount = (Number(storedCount) || 0) + 1
    await Preferences.set({ key: COUNT_KEY, value: String(nextCount) })

    if (nextCount === TRIGGER_AT_SESSION) {
      await Preferences.set({ key: SHOWN_KEY, value: 'true' })
      setTimeout(() => {
        requestAppReview()
      }, PROMPT_DELAY_MS)
    }
  } catch (err) {
    console.error('Failed to update review-prompt session counter', err)
  }
}
